import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Paper, Radio, Select, Step, StepLabel, Stepper } from '@mui/material';
import { Field, Form, Formik, useField } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker } from 'formik-mui-lab';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { checkFields, fieldStyle, gridStyle, Menu, paperStyle } from '../styles';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const CustomizedSelectForFormik = ({ children, form, field }) => {
    const { name, value } = field;
    const { setFieldValue } = form;

    return (
    <Select
        name={name}
        value={value}
        onChange={e => {
        setFieldValue(name, e.target.value);
        }}
    >
        {children}
    </Select>
    );
};

const CustomField = (name) => {
    return  <Grid><Field key={name.name} style={fieldStyle} margin="normal" label={name.name.replaceAll("_"," ")} name={name.name} component={TextField}></Field></Grid>
}

const CustomSubField = (name) => {
    return  <Grid><Field key={`${name.group}.${name.name}`} style={fieldStyle} margin="normal" label={name.name.replaceAll("_"," ").split(".")[0]} name={`${name.group}.${name.name}`} component={TextField}></Field></Grid>
}

const CustomRadioVariableField = (name) => {
    return  <Grid style={gridStyle}>
                <Grid>{name.name.replaceAll("_"," ")}</Grid>
                <Grid>
                    {name.label.map((value, index) => <MyRadio key={index+name.name} name={`${name.group}.${name.name}.Value`} type="radio" value={value} label={value} />)}
                </Grid>
                <Grid>
                    <Field key={`${name.group}.${name.name}`} style={fieldStyle} margin="normal" label="Custom Field" name={`${name.group}.${name.name}.Comment`} component={TextField}></Field>
                </Grid>
            </Grid>
}

const CustomCheckboxField = (name) => {
    return  <Grid style={gridStyle}>
                <Grid>{name.name.replaceAll("_"," ")}</Grid>
                <Grid > 
                    {name.label.map((value, index) => <div style={checkFields}><Field  key={index+name.name} margin="normal" name={`${name.group}.${name.name}.Value`}  type="checkbox" value={value} as={Checkbox} />{value}</div>)}
                </Grid>
                <Grid>
                    <Field key={`${name.group}.${name.name}`} style={fieldStyle} margin="normal" label="Custom Field" name={`${name.group}.${name.name}.Comment`} component={TextField}></Field>
                </Grid>
            </Grid>
}

const CustomRadioCheckboxField = (name) => {
    return  <Grid style={gridStyle}>
                <Grid>{name.name.replaceAll("_"," ")}</Grid>
                <Grid>
                    {name.condition.map((value, index) => <MyRadio key={index+name.name} name={`${name.group}.${name.name}.Condition`} type="radio" value={value} label={value} />)}
                </Grid>
                <Grid > 
                    {name.label.map((value, index) => <div style={checkFields}><Field key={index+name.name} name={`${name.group}.${name.name}.Value`}  type="checkbox" value={value} as={Checkbox} />{value}</div>)}
                </Grid>
                <Grid>
                    <Field key={`${name.group}.${name.name}rcb`} style={fieldStyle} margin="normal" label="Custom Field" name={`${name.group}.${name.name}.Comment`} component={TextField}></Field>
                </Grid>
            </Grid>

}

const MyRadio = ({ label, ...props }) => {
    const [field] = useField(props);
    return field.value === null ? <FormControlLabel {...field} control={<Radio sx={{color: 'red','&.Mui-checked': {color: 'red',},}}/>} label={label} /> : <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const bodyVariable = [ "Sticker or Foil", "Faded", "Scratches", "Dents", "Rust", "Hailed"]

function AddVehicle() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([])

/*     const fetchData = () => {
        fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
          .then(response => {
            return response.json()
          })
          .then(data => {
            setVehicles(data.Results.slice(0,500))
          })
      }
 */
    function range(start, end) {
        /* generate a range : [start, start+1, ..., end-1, end] */
        var len = end - start + 1;
        var a = new Array(len);
        for (let i = 0; i < len; i++) a[i] = start + i;
        return a;
    }

    const url = 'https://car-data.p.rapidapi.com/cars/makes';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'bc0999e258mshcf4317dd12e51e3p170dc4jsn618b97c551a7',
        'X-RapidAPI-Host': 'car-data.p.rapidapi.com'
      }
    };
    

    const fetchData = () => {
        fetch(url, options)
        .then(res => res.json())
        .then(json => setVehicles(json))
        .catch(err => console.error('error:' + err));
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <FormikStepper
                    initialValues={{
                        Vehicle_Manufacturer: "0",
                        Manufacturing_Year: new Date().getFullYear().toString(),
                        Year_Of_Registration: new Date().getFullYear().toString()
                    }}
                    onSubmit={(values, { resetForm }) => {      
                        confirmAlert({
                            title: 'Confirm to submit',
                            message: 'Are you sure you want to submit.',
                            buttons: [
                              {
                                label: 'Yes',
                                onClick: () => {
                                    try {
                                        async function Add(x) {
                                            const response = await fetch(`${process.env.REACT_APP_API}/add/vehicle`, {
                                                method: 'POST',
                                                headers: {'Content-Type': 'application/json'},
                                                body: JSON.stringify({
                                                    x
                                                })
                                            })
                                            const data = await response.json()
                                            if (data) {
                                                if (data.status === '200')
                                                {
                                                    navigate("/vehicles", { replace: true });
                                                } else if (data.status === '500') 
                                                {
                                                    console.log(data.error)
                                                }
                                            }
                                        }
                                        var dataValues = values;
                                        if (values.Other) {
                                            dataValues.Vehicle_Manufacturer = values.Other;
                                            delete dataValues['Other']
                                        }    
                                        let formattedDate = moment().format('YYYY');
                                        dataValues.Year_Of_Registration = dataValues.Year_Of_Registration ? moment(dataValues.Year_Of_Registration).format('YYYY') : formattedDate;  
                                        Add(dataValues);
                                        resetForm();
                                    }
                                    catch (err) {
                                        console.log(err)
                                    }
                                }
                              },
                              {
                                label: 'No',
                                onClick: () => alert('Re submit')
                              }
                            ]
                          });
                        }
                    }
                    >
                
                    <FormikStep key={1} label="General Info"
                        validationSchema={Yup.object().shape({
                          Model: Yup.string().required(),

                        })}
                    >
                        <Grid><h3>General Information</h3></Grid>

                        <Grid>

                        <FormControl style={fieldStyle} margin="normal">
                            <Field key="Vehicle_Manufacturer" style={fieldStyle} margin="normal" name="Vehicle_Manufacturer" component={CustomizedSelectForFormik}>
                                <MenuItem key="New" value="0">Manufacturer</MenuItem>
                                    {vehicles.length > 0 && (
                                        vehicles.map((vehicle, index) => (
                                            <MenuItem key={index+vehicle} style={Menu} value={vehicle}>{vehicle}</MenuItem>
                                        ))
                                    )}  
                            </Field>
                            <CustomField name="Other" />
                        </FormControl>
                        </Grid>

                        <CustomField name="Model" />

                        <FormControl style={fieldStyle} margin="normal">
                        <Grid>Manufacturing Year</Grid>
                            <Field key="Manufacturing_Year" style={fieldStyle} margin="normal" name="Manufacturing_Year" component={CustomizedSelectForFormik}>
                                <MenuItem key={'MY'} value={new Date().getFullYear().toString()}>{new Date().getFullYear().toString()}</MenuItem>
                                {range(1970, (new Date().getFullYear() - 1)).map((x)=><MenuItem key={x.toString()+'MY'} value={x.toString()}>{x.toString()}</MenuItem>).reverse()}
                            </Field>
                        </FormControl>

                        <FormControl style={fieldStyle} margin="normal">
                        <Grid>Year Of Registration</Grid>
                            <Field key="Year_Of_Registration" style={fieldStyle} margin="normal" name="Year_Of_Registration" component={CustomizedSelectForFormik}>
                                <MenuItem key={'YOR'} value={new Date().getFullYear().toString()}>{new Date().getFullYear().toString()}</MenuItem>
                                {range(1970, (new Date().getFullYear() - 1)).map((x)=><MenuItem key={x.toString()+'YOR'} value={x.toString()}>{x.toString()}</MenuItem>).reverse()}
                            </Field>
                        </FormControl>

                        <CustomField name="Color" />

                        <CustomField name="Chassis_Number" />

                        <CustomField name="Registration_Number" />

                        <CustomField name="Engine_Number" />

            
                    </FormikStep>
                    
                    <FormikStep key={2} label="Vehicle Information">

                        <Grid><h3>Vehicle Information</h3></Grid>
                        
                        <CustomSubField group="Vehicle_Information" name="Trim" />
                        
                        <CustomRadioVariableField group="Vehicle_Information" name="Body_Type" label={["Coupe","Hatchback","Sedan","Station Wagon","SUV","Truck","Lemousine","Van","Pickup","Other"]} />
                
                        <CustomRadioVariableField group="Vehicle_Information" name="Options" label={["Basic","Mid","Full","Top"]} />
                        <Grid>
                            Odometer
                        </Grid>
                        <CustomSubField group="Vehicle_Information" name="Odometer" />

                        <CustomRadioVariableField group="Vehicle_Information" name="Regional_Specs" label={["GCC","European","American","Canadian","Japanese","Korean","Other"]} />
                    
                        <CustomRadioVariableField group="Vehicle_Information" name="Bank_Finance" label={["Yes", "No", "Waiting for clearance"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="User_Type" label={["Personal", "Corporate", "Taxi", "Uncertain"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Service_History" label={["Full", "Partial", "Not Available"]} />
                        
                        <CustomRadioVariableField group="Vehicle_Information" name="Service_Type" label={["Agency", "Out of Agency", "Not certain"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Number_Of_Owners" label={["Single", "Second", "Multiple", "Uncertain"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Number_Of_Keys" label={["1", "2", "3"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Number_Of_Seats" label={["1", "2", "3", "4", "5", "6", "7", "8"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Paint_Condition" label={["Original Paint", "Partial Paint", "Total Paint", "Uncertain"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Accident_History" label={["None", "Yes (Minor)", "Yes (Major)", "Uncertain"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Chassis" label={["Okay", "Repaired", "Damaged", "Dented", "Buldged", "Rusty"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Registered_In_UAE" label={["Yes", "No"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Engine_Type" label={["Petrol", "Diesel", "Gas", "Electric", "Hybrid"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Number_Of_Cylinders" label={["3", "4", "5", "6", "8", "10", "12", "16"]} />

                        <Grid>
                            Engine Capacity
                        </Grid>

                        <CustomSubField group="Vehicle_Information" name="Engine_Capacity" />

                        <CustomRadioVariableField group="Vehicle_Information" name="Transmission_Type" label={["Automatic", "Manual", "Semi Auto"]} />

                        <CustomRadioVariableField group="Vehicle_Information" name="Powertrain" label={["2WD", "4WD", "AWD"]} />

                    </FormikStep>

                    <FormikStep key={3} label="Car Exterior">

                        <Grid><h3>Left Side Body Details</h3></Grid>

                        <CustomRadioCheckboxField group="Car_Exterior.Left_Side_Body_Details" name="Front_Fender" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Left_Side_Body_Details" name="Front_Door" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Left_Side_Body_Details" name="Rear_Door" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Left_Side_Body_Details" name="Rear_Fender" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <Grid><h3>Right Side Body Details</h3></Grid>

                        <CustomRadioCheckboxField group="Car_Exterior.Right_Side_Body_Details" name="Front_Fender" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Right_Side_Body_Details" name="Front_Door" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Right_Side_Body_Details" name="Rear_Door" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Right_Side_Body_Details" name="Rear_Fender" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <Grid><h3>Middle Body Details</h3></Grid>

                        <CustomRadioCheckboxField group="Car_Exterior.Middle_Body_Details" name="Front_Bumper" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Middle_Body_Details" name="Show_Grill" condition={["Good", "Average", "Damaged", null]} label={["Dented and Painted", "Scratches", "Dents", "Rust", "Broken"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Middle_Body_Details" name="Hood" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Middle_Body_Details" name="Roof" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable.concat(["Normal", "Sunroof", "Panoramic roof", "Soft top convertible", "Hard top convertible"])} />

                        <CustomRadioCheckboxField group="Car_Exterior.Middle_Body_Details" name="Trunk_Or_Tailgate" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <CustomRadioCheckboxField group="Car_Exterior.Middle_Body_Details" name="Rear_Bumper" condition={["Original Paint", "Repainted", "Dented and Painted", null]} label={bodyVariable} />

                        <Grid><h3>Glasses</h3></Grid>

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Left_Front_Window" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Left_Rear_Window" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Right_Front_Window" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Right_Rear_Window" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Sun_Or_Moon_Roof" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Front_Windshield" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Glasses" name="Rear_Windshield" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <Grid><h3>Lights and Mirrors</h3></Grid>

                        <CustomRadioCheckboxField group="Car_Exterior.Light_And_Mirrors" name="Left_Side_View_Mirror" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Light_And_Mirrors" name="Right_Side_View_Mirror" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Light_And_Mirrors" name="Left_Front_Head_Light" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Light_And_Mirrors" name="Right_Front_Head_Light" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Light_And_Mirrors" name="Left_Tail_Light" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Light_And_Mirrors" name="Right_Tail_Light" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "May require replacement"]} />

                        <Grid><h3>Rims</h3></Grid>

                        <CustomRadioVariableField group="Car_Exterior.Rims" name="Rim_Type" label={["Alloy", "Steel"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Rims" name="Front_Left" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Scratched", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Rims" name="Front_Right" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Scratched", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Rims" name="Rear_Left" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Scratched", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Rims" name="Rear_Right" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Scracthed", "Cracked", "May require replacement"]} />

                        <Grid><h3>Tyres</h3></Grid>

                        <CustomRadioCheckboxField group="Car_Exterior.Tyres" name="Front_Left" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Tyres" name="Front_Right" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Tyres" name="Rear_Left" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cracked", "May require replacement"]} />

                        <CustomRadioCheckboxField group="Car_Exterior.Tyres" name="Rear_Right" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cracked", "May require replacement"]} />

                    </FormikStep>

                    <FormikStep label="Car Interior">

                        <Grid><h3>Car Interior</h3></Grid>

                        <CustomRadioVariableField group="Car_Interior" name="Seat_Type" label={["Leather", "Suede", "Fabric", "Faux leather", "Aftermarket", "Seat Covers"]} />
                        
                        <CustomRadioCheckboxField group="Car_Interior" name="Seats_Condition" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Faded", "Cut", "Torn", "Cracked", "Stain", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Seat_Belt" condition={["Good", "Average", "Damaged", null]} label={["Stuck", "May require maintainence"]} />
                        
                        <CustomRadioCheckboxField group="Car_Interior" name="Sun_Or_Moon_Roof" condition={["Good", "Average", "Damaged", null]} label={["Jammed", "Switch damage", "Partially Operating", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Convertible" condition={["Good", "Average", "Damaged", null]} label={["Leak", "Switch damage", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Steering_Wheel" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Torn", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Horn" condition={["Good", "Average", "Damaged", null]} label={["May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Dashboard" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Cracked", "Buldged", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="AC_Vents" condition={["Good", "Average", "Damaged", null]} label={["Broken", "Loose", "Missing", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Gear_knob" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Missing", "Button damage", "Stuck", "Not shifting", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Glovebox" condition={["Good", "Average", "Damaged", null]} label={["May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Console_Box" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cut", "Torn", "Stain", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior" name="Roof_Liner" condition={["Good", "Average", "Damaged", null]} label={["Buldged", "Loose", "Worn", "Cut", "Torn", "Stain", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior.Door_Trim_Or_Switches" name="Front_Left_Door" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cut", "Torn", "Handle damage", "Switch damage", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior.Door_Trim_Or_Switches" name="Front_Right_Door" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cut", "Torn", "Handle damage", "Switch damage", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior.Door_Trim_Or_Switches" name="Rear_Left_Door" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cut", "Torn", "Handle damage", "Switch damage", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior.Door_Trim_Or_Switches" name="Rear_Right_Door" condition={["Good", "Average", "Damaged", null]} label={["Worn", "Cut", "Torn", "Handle damage", "Switch damage", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior.Cluster_And_Warning_Lights" name="Cluster" condition={["Good", "Average", "Damaged", null]} label={["Faded", "Partially damaged", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Car_Interior.Cluster_And_Warning_Lights" name="Warning_Lights" condition={["None", "Yes ", null]} label={[ "Check engine", "ABS", "SRS", "TPS", "ESP", "Oil level", "Temperature", "Lamps", "Battery", "Wiper fluid", "Coolant level", "Brakes", "Service light", "Suspension", "Gas door", "Anti theft", "Door warning", "Seat belt warning"]} />

                    </FormikStep>

                    <FormikStep label="General Driving Condition"> 

                        <Grid><h3>General Driving Condition</h3></Grid>

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Air_Conditioning" condition={["Good", "Average", "Damaged", null]} label={["Low cooling", "Air pressure low", "Leaking", "Blower noise", "May require refridgerant", "May require maintainence"]} />
                    
                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Engine" condition={["Good", "Average", "Damaged", null]} label={["Starting normal", "May require maintainence"]} />
                        
                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Transmission" condition={["Good", "Average", "Faulty", null]} label={["4WD Engaging", "4WD Faulty", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Turbo_Or_Supercharger" condition={["Good", "Average", "Faulty", null]} label={["May require maintainence"]} />

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Steering" condition={["Good", "Average", "Damaged", null]} label={["Hard", "Noisy", "Loose", "Vibration","May require maintainence"]} />

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Braking_System" condition={["Good", "Average", "Faulty", null]} label={["Noisy", "Spongy", "Vibration", "Worn out", "ABS faulty", "Handbrake faulty", "Master cylinder faulty","May require maintainence"]} />

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Shock_Absorbers" condition={["Good", "Average", "Damaged", null]} label={["Airmatic", "Hydraulic", "Electric", "Weak", "Noisy", "Leak", "Bouncy", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Rubber_Or_Bushes" condition={["Good", "Average", "Damaged", null]} label={["Damage", "Weak", "Knocking", "Rattiling", "Squeaking", "Engine mount may require maintainence", "Transmission mount may require maintainence", "Differential mount may require maintainence", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="General_Driving_Condition" name="Drive_Axles" condition={["Good", "Average", "Damaged", null]} label={["Noisy", "Right axle may require maintainence", "Vibration", "Left Axle may require maintainence", "Propeller Shaft require maintainence", "May require maintainence", "Differential noisy", "Wheel bearing noisy"]} />

                        <Grid><h3>Drive Assist</h3></Grid>

                        <CustomRadioVariableField group="General_Driving_Condition.Drive_Assist" name="Distronic" label={["Good", "Average", "Faulty", null]} />
                        
                        <CustomRadioVariableField group="General_Driving_Condition.Drive_Assist" name="Lane_Change" label={["Good", "Average", "Faulty", null]} />
                        
                        <CustomRadioVariableField group="General_Driving_Condition.Drive_Assist" name="Blindspot" label={["Good", "Average", "Faulty", null]} />

                        <Grid><h3>Park Assist</h3></Grid>

                        <CustomRadioVariableField group="General_Driving_Condition.Park_Assist" name="Front_Sensor" label={["Good", "Average", "Faulty", null]} />

                        <CustomRadioVariableField group="General_Driving_Condition.Park_Assist" name="Rear_Sensor" label={["Good", "Average", "Faulty", null]} />

                        <CustomRadioVariableField group="General_Driving_Condition.Park_Assist" name="Front_Camera" label={["Good", "Average", "Faulty", null]} />

                        <CustomRadioVariableField group="General_Driving_Condition.Park_Assist" name="Rear_Camera" label={["Good", "Average", "Faulty", null]} />

                        <CustomRadioVariableField group="General_Driving_Condition.Park_Assist" name="Left_Camera" label={["Good", "Average", "Faulty", null]} />

                        <CustomRadioVariableField group="General_Driving_Condition.Park_Assist" name="Right_Camera" label={["Good", "Average", "Faulty", null]} />

                    </FormikStep>

                    <FormikStep key={5} label="Technical Condition" labelColor="#FFFFFF" circleColor="#003399"> 
                        
                        <Grid><h3>Technical Condition</h3></Grid>

                        <CustomRadioCheckboxField group="Technical_Condition" name="Engine_Condition" condition={["Good", "Average", "Damaged", null]} label={["Missfiring", "Engine noise", "Tappet noise", "Pulley noise", "Not cranking", "Battery dead", "Over heating", "Belt noise", "Alternator damage", "Oil sludge", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Technical_Condition" name="Transmission_Condition" condition={["Good", "Average", "Damaged", null]} label={["Rough shifting", "Shift Shock", "Delay shifting", "Jerking", "Slipping", "Not shifting", "Triptonic faulty", "Clutch faulty", "Noisy", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Technical_Condition" name="Sign_Of_Leakages" condition={["None", "Yes (Minor)", "Yes (Major)", null]} label={["Gaskit", "Head gaskit", "Valve cover gaskit", "Engine oil seals", "Engine oil sump", "Differntial leak", "Power steering oil leak", "Brake oil leak", "Axle boot leak", "Fuel leak", "Coolant leak", "May require maintainence"]} />

                        <CustomRadioCheckboxField group="Technical_Condition" name="Exhaust" condition={["Good", "Average", "Damaged", null]} label={["Leak", "Noisy", "Modified", "White smoke", "Black smoke", "May require maintainence"]} />

                    </FormikStep>   

                </FormikStepper>
            </Paper>
        </Grid>

    );
}

export function FormikStep({ children }) {
    return <>{children}</>
}

export function FormikStepper({children, ...props}) {
    const childrenArray = React.Children.toArray(children) ;
    const [step, setStep] = useState(0);
    const currentChild = childrenArray[step];
    function isLastStep() {
        return step === childrenArray.length - 1;
    }
    const btnBox = {
        marginTop: "2em",
        display: "flex",
        justifyContent: "space-between"
    }

    const stepper = {
        marginBottom: "2em",
    }

    return (
        <Formik 
            {...props}
            validationSchema={currentChild.props.validationSchema}
            onSubmit={async (values, helpers) => {
                if (isLastStep()) {
                    await props.onSubmit(values, helpers);
                } else {
                    setStep(s => s+1)
                }
        }}>
            <Form autoComplete='off'>
                <div style={stepper}>
                    <Stepper style={stepper} activeStep={step} alternativeLabel>
                        {childrenArray.map((child) => (
                        <Step key={child.props.label+'step'}>
                            <StepLabel>{child.props.label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                </div>
                <div style={btnBox}>
                <Button variant="contained" color="secondary" type="submit">{isLastStep() ? 'Submit' : 'Next'}</Button>
                {step > 0 ? <Button margin="normal" variant="contained" color="primary" onClick={() => setStep(s => s-1)}>Prev</Button> : null}
                </div>
                {currentChild}
                <div style={btnBox}>
                <Button variant="contained" color="secondary" type="submit" onClick={()=>{window.scrollTo({top: 0, left: 0, behavior: 'smooth'});}}>{isLastStep() ? 'Submit' : 'Next'}</Button>
                {step > 0 ? <Button margin="normal" variant="contained" color="primary" onClick={() => (setStep(s => s-1), window.scrollTo({top: 0, left: 0, behavior: 'smooth'}))}>Prev</Button> : null}
                </div>
            </Form>
        </Formik>)
}


export default AddVehicle