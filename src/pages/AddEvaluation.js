import { Button, Checkbox, FormControl, FormControlLabel, Grid, MenuItem, Paper, Radio, Select, Step, StepLabel, Stepper, FormLabel } from '@mui/material';
import { Field, Form, Formik, useField } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker, DesktopTimePicker } from 'formik-mui-lab';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
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

const MyRadio = ({ label, ...props }) => {
    const [field] = useField(props);
    return field.value === null ? <FormControlLabel {...field} control={<Radio sx={{color: 'red','&.Mui-checked': {color: 'red',},}}/>} label={label} /> : <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const CustomRadioVariableField = (name) => {
    return  <Grid style={gridStyle}>
                <Grid>{name.name.replaceAll("_"," ")}</Grid>
                <Grid>
                    {name.label.map((value, index) => <MyRadio key={index} name={`${name.group}.${name.name}`} type="radio" value={value} label={value} />)}
                </Grid>
            </Grid>
}


const bodyVariable = [ "Sticker or Foil", "Faded", "Scratches", "Dents", "Rust", "Hailed"]

function AddEvaluation() {
    const navigate = useNavigate();
    const location = useLocation();
    const [evaluations, setEvaluations] = useState([])
    const [type, setType] = useState(null)

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

    const [usernames, setUsernames] = useState([])
    const fetchUsers = () => {
        fetch(`${process.env.REACT_APP_API}/usernames`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          setUsernames(data.data)
        })
      }

    useEffect(() => {
        fetchData()
        setType(location.pathname.split("/")[1])
        fetchUsers()
    }, [])

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <FormikStepper
                    initialValues={{
/*                         Vehicle_Manufacturer: "0",
                        Manufacturing_Year: new Date().getFullYear().toString(),
                        Year_Of_Registration: new Date().getFullYear().toString() */
                        User: "",
                        Car_Valuation_Details: {Booked_by: "", Regional_Specs: ""}
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
                                                    navigate(`/${type}s`, { replace: true });
                                                } else if (data.status === '500') 
                                                {
                                                    console.log(data.error)
                                                }
                                            }
                                        }
                                        var dataValues = values;
                                        if (type == 'appointment') {
                                            let formattedDate = moment().format('LL');
                                            dataValues.Appointment_Date = dataValues.Appointment_Date ? moment(dataValues.Appointment_Date).format('LL') : formattedDate;
                                            dataValues.Time = moment(dataValues.Time).format("HH:mm");
                                        } 
                                        Add(dataValues);
                                        //console.log(dataValues)
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

                        <CustomField name="Website" />

                        <CustomField name="Location" />

                        <FormControl style={fieldStyle} margin="normal">
                        <FormLabel>User - </FormLabel>
                            <Field name="User" component={CustomizedSelectForFormik}>
                                {
                                    usernames?.map((x, index) => {
                                        return <MenuItem key={index+"username"} value={x}>{x}</MenuItem>
                                    })
                                }
                            </Field>
                        </FormControl>

                        {
                            type == 'appointment' ? <>
                                <Grid style={gridStyle}><Field component={DatePicker} label="Appointment Date" name="Appointment_Date" inputFormat="MM/dd/yyyy" /></Grid>
                                <Grid style={gridStyle}><Field component={DesktopTimePicker} label="Time" name="Time" /></Grid> 
                            </>:<></>
                        }

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

                        <FormControl style={fieldStyle} margin="normal">
                        <FormLabel>Booked By - </FormLabel>
                            <Field name="Car_Valuation_Details.Booked_by" component={CustomizedSelectForFormik}>
                                {
                                    usernames?.map((x, index) => {
                                        return <MenuItem key={index+"userbooked"} value={x}>{x}</MenuItem>
                                    })
                                }
                            </Field>
                        </FormControl>

                        <CustomRadioVariableField group="Car_Valuation_Details" name="Regional_Specs" label={["GCC","European","American","Canadian","Japanese","Korean","Other"]} />
 
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