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

function AddEvaluation() {
    const navigate = useNavigate();
    const [evaluations, setEvaluations] = useState([])

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
        .then(json => setEvaluations(json))
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
/*                         Vehicle_Manufacturer: "0",
                        Manufacturing_Year: new Date().getFullYear().toString(),
                        Year_Of_Registration: new Date().getFullYear().toString() */
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
                                            const response = await fetch(`${process.env.REACT_APP_API}/add/evaluation`, {
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
                                                    navigate("/evaluations", { replace: true });
                                                } else if (data.status === '500') 
                                                {
                                                    console.log(data.error)
                                                }
                                            }
                                        }
                                        var dataValues = values;
                                        console.log(dataValues)
/*                                         if (values.Other) {
                                            dataValues.Vehicle_Manufacturer = values.Other;
                                            delete dataValues['Other']
                                        }    
                                        let formattedDate = moment().format('YYYY');
                                        dataValues.Year_Of_Registration = dataValues.Year_Of_Registration ? moment(dataValues.Year_Of_Registration).format('YYYY') : formattedDate;   */
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

                        <CustomField name="Valuation_Status" />

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


export default AddEvaluation