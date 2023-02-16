import { Button, FormControl, Checkbox, FormControlLabel, FormLabel, Grid, MenuItem, Paper, Radio, Select } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Field, Form, Formik, useField } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker, DesktopTimePicker } from 'formik-mui-lab';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fieldStyle, gridStyle, paperStyle, checkFields } from '../styles';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const MyRadio = ({ label, ...props }) => {
    const [field] = useField(props);
    return <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const CustomField = (name) => {
    return  <Grid><Field key={name.name} style={fieldStyle} margin="normal" label={name.name.replaceAll("_"," ")} name={name.name} component={TextField}></Field></Grid>
}


const CustomCheckboxField = (name) => {
    return  <Grid style={gridStyle}>
                <Grid>{name.name.replaceAll("_"," ")}</Grid>
                <Grid > 
                    {name.label.map((value, index) => <div style={checkFields}><Field  key={index} margin="normal" name={`${name.name}`}  type="checkbox" value={value} as={Checkbox} />{value}</div>)}
                </Grid>
            </Grid>
}


const AddUser = () => {
    const navigate = useNavigate();

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Formik
                    initialValues={{}}
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
                                        const response = await fetch(`${process.env.REACT_APP_API}/add/user`, {
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
                                                navigate("/users", { replace: true });
                                            } else if (data.status === '500') 
                                            {
                                                console.log(data.error)
                                            }
                                        }
                                    }
                                    const dataValues = values;
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
                    }}
                >
                    <Form>
                        <Grid><h3>Add User</h3></Grid>
                        <CustomField name="username" />
                        <CustomField name="password" />
                        <CustomCheckboxField name="roles" label={["Admin", "Evaluation", "Appointment", "Inspection", "Auction", "Listing"]} />
                        <Button style={gridStyle} margin="normal" variant="contained" color="secondary" type="submit">Submit</Button>                              
                    </Form>
                </Formik>
            </Paper>
        </Grid>  
    )
}


export default AddUser