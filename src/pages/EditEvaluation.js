import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Paper, Radio, Select, Step, StepLabel, Stepper } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Field, Form, Formik, useField } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import { checkFields, fieldStyle, gridStyle, Menu, paperStyle } from '../styles';
import { DatePicker, DesktopTimePicker } from 'formik-mui-lab';
import moment from "moment";

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

const MyRadio = ({ label, ...props }) => {
    const [field] = useField(props);
    return <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const bodyVariable = ["Original Paint", "Sticker or Foil", "Repainted", "Dented and Painted", "Faded", "Scratches", "Dents", "Rust", "Hailed"]

function AddEvaluation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [evaluations, setEvaluations] = useState([])
    const [edit, setEdit] = useState(null)
    const [type, setType] = useState(null)

    const url = 'https://car-data.p.rapidapi.com/cars/makes';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'bc0999e258mshcf4317dd12e51e3p170dc4jsn618b97c551a7',
        'X-RapidAPI-Host': 'car-data.p.rapidapi.com'
      }
    };
/*     
    const fetchData = () => {
        fetch(url, options)
        .then(res => res.json())
        .then(json => setVehicles(json))
        .catch(err => console.error('error:' + err));
    } */

    const fetchEditData = (id, type) => {
        fetch(`${process.env.REACT_APP_API}/${type}/${id}`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            const x = data.data
            if (x.Appointment_Date && x.Time) {
                x.Appointment_Date = moment(x.Appointment_Date).subtract('24:00:00')
                x.Time = moment("2023-01-03T04:20:00.000Z").subtract('04:00:00')
            }
            setEdit(x)
          })
      }
      const user = localStorage.getItem('user')
    useEffect(() => {
        
         setType(location.pathname.split("/")[1])
        if (location.pathname.includes("edit")) {
            fetchEditData(location.pathname.split("/")[3],location.pathname.split("/")[1])
        }
        if (location.pathname.includes("add")) {
            fetchEditData(location.pathname.split("/")[3],"evaluation")
        }
        //fetchData()
    }, [])

    function range(start, end) {
        /* generate a range : [start, start+1, ..., end-1, end] */
        var len = end - start + 1;
        var a = new Array(len);
        for (let i = 0; i < len; i++) a[i] = start + i;
        return a;
    }

    return (
        ( edit ? 
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <FormikStepper
                    initialValues={edit}
                    onSubmit={(values) => {                  
                        try {
                            async function Edit(x) {
                                if (location.pathname.includes("add") && type == "appointment") {
                                    const response = await fetch(`${process.env.REACT_APP_API}/add/${type}`, {
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
                                            await fetch(`${process.env.REACT_APP_API}/evaluation/${location.pathname.split("/")[3]}`, {
                                                method: 'DELETE',
                                            })
                                            navigate(`/${type}s`, { replace: true });
                                        } else if (data.status === '500') 
                                        {
                                            console.log(data.error)
                                        }
                                    }
 
                                } else {
                                    const response = await fetch(`${process.env.REACT_APP_API}/edit/${type}/${edit._id}`, {
                                        method: 'PUT',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            x
                                        })
                                    })
                                    const data = await response.json()
        /*                             const response2 = await fetch(`${process.env.REACT_APP_API}/last_seen/${type}/${edit._id}`, {
                                        method: 'PUT',
                                        headers: {'Content-Type': 'application/json'},
                                        body: JSON.stringify({
                                            Last_Updated: user
                                        })
                                    })
                                    const data2 = await response2.json() */
                                    if (data) {
                                        if (data.status === '200')
                                        {
                                            navigate(`/${type}s`, { replace: true });
                                        } else if (data.status === '500') 
                                        {
                                            console.log(data.error)
                                        }
                                    }
                                }
                                
                            }
                            var dataValues = values;
                            if (type == 'appointment') {
                                let formattedDate = moment().format('LL');
                                dataValues.Appointment_Date = dataValues.Appointment_Date ? moment(dataValues.Appointment_Date).format('LL') : formattedDate;
                                dataValues.Time = moment(dataValues.Time).format("HH:mm");
                            }
                            dataValues.Last_Updated = user
                            Edit(dataValues);
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }}
                    >
                
                <FormikStep key={1} label="General Info"
                        validationSchema={Yup.object().shape({
                          //Model: Yup.string().required(),

                        })}
                    >
                        <Grid><h3>General Information</h3></Grid>

{/*                         <Grid>

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
 */}
                        <CustomField name="Website" />

                        <CustomField name="Location" />

                        <CustomField name="User" />

                        {
                            type == 'appointment' ? <>
                                <Grid style={gridStyle}><Field component={DatePicker} label="Appointment Date" name="Appointment_Date" inputFormat="MM/dd/yyyy" /></Grid>
                                <Grid style={gridStyle}><Field component={DesktopTimePicker} label="Time" name="Time" /></Grid> 
                            </>:<></>
                        }

                        <CustomField name="Heard_Us_From" />

                        <CustomField name="Valuation_Status" />

                        <CustomField name="Staff_Lead_Source" />

                        <CustomField name="Sell_Option" />

                        <CustomField name="Additional_Information" />
            
                    </FormikStep>
                    
                    <FormikStep key={2} label="Customer Information">

                        <Grid><h3>Customer Information</h3></Grid>
                        
                        <CustomSubField group="Customer_Information" name="Contact_Name" />
                
                       {/*  <CustomRadioVariableField group="Vehicle_Information" name="Options" label={["Basic","Mid","Full","Top"]} /> */}

                        <CustomSubField group="Customer_Information" name="Email" />

                        <CustomSubField group="Customer_Information" name="Contact_Number" />

                        <CustomSubField group="Customer_Information" name="Customer_Location" />

                    </FormikStep>

                    <FormikStep key={3} label="Car Valuation Details">

                        <Grid><h3>Car Valuation Details</h3></Grid>

                        <CustomSubField group="Car_Valuation_Details" name="Model_Year" />
                        <CustomSubField group="Car_Valuation_Details" name="Make" />
                        <CustomSubField group="Car_Valuation_Details" name="Global_Model_Name" />
                        <CustomSubField group="Car_Valuation_Details" name="Model_Name" />
                        <CustomSubField group="Car_Valuation_Details" name="Car_Options" />
                        <CustomSubField group="Car_Valuation_Details" name="Mileage" />
                        <CustomSubField group="Car_Valuation_Details" name="Evaluation_Option" />
                        <CustomSubField group="Car_Valuation_Details" name="Booked_by" />
                        
 
                    </FormikStep>

                </FormikStepper>
            </Paper>
        </Grid>
       :<Box sx={{ display: 'flex',  justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <CircularProgress />
        </Box> )                                     
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
                        <Step key={child.props.label}>
                            <StepLabel>{child.props.label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                </div>
                {currentChild}
                <div style={btnBox}>
                {step > 0 ? <Button variant="contained" color="primary" onClick={() => setStep(s => s-1)}>Prev</Button> : null}
                <Button margin="normal" variant="contained" color="secondary" type="submit">{isLastStep() ? 'Submit' : 'Next'}</Button>
                </div>
            </Form>
        </Formik>)
}


export default AddEvaluation