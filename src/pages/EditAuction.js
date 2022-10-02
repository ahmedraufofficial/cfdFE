import { Button, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Paper, Radio, Select } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Field, Form, Formik, useField } from 'formik';
import { TextField } from 'formik-material-ui';
import { DatePicker, DesktopTimePicker } from 'formik-mui-lab';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { fieldStyle, gridStyle, paperStyle } from '../styles';

const MyRadio = ({ label, ...props }) => {
    const [field] = useField(props);
    return <FormControlLabel {...field} control={<Radio />} label={label} />;
};

const CustomField = (name) => {
    return  <Grid><Field key={name.name} style={fieldStyle} margin="normal" label={name.name.replaceAll("_"," ")} name={name.name} component={TextField}></Field></Grid>
}

const CustomRadioField = (name) => {
    return  (<Grid style={gridStyle}>
                <Grid>{name.name.replaceAll("_"," ")}</Grid>
                <Grid > 
                    <MyRadio key={`${name.name}True`} name={`${name.name}`} type="radio" value={"true"} label={"Yes"} />
                    <MyRadio key={`${name.name}False`} name={`${name.name}`} type="radio" value={"false"} label={"No"} />
                </Grid>
            </Grid>)
}

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

function EditAuction(){    
    const location = useLocation();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(null)
    const [vehicles, setVehicles] = useState([])

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API}/vehicles`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setVehicles(data.data)
          })
      }

    const fetchEditData = (id) => {
    fetch(`${process.env.REACT_APP_API}/auction/${id}`)
        .then(response => {
        return response.json()
        })
        .then(data => {
            setEdit(data.response)
        })
    }

    useEffect(() => {
        if (location.pathname.includes("edit")) {
            fetchEditData(location.pathname.split("/")[3])
        }
        fetchData()
    }, [])

    return (
        (edit ? 
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Formik
                    initialValues={edit}
                    onSubmit={(values, { resetForm }) => {
                        try {
                            async function Add(x) {
                                const response = await fetch(`${process.env.REACT_APP_API}/editadmin/auction/${edit._id}`, {
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
                                        navigate("/auctions", { replace: true });
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
                    }}
                >
                    <Form>
                        <Grid><h3>Edit Auction</h3></Grid>
                        <FormControl style={fieldStyle} margin="normal">
                            <Field name="Vehicle_Id" component={CustomizedSelectForFormik}>
                                <MenuItem key={0} value="0">Select Vehicle</MenuItem>
                                {vehicles.length > 0 && (
                                    vehicles.map((vehicle, index) => (
                                        <MenuItem key={index+1} value={vehicle._id}>{`${vehicle.Vehicle_Manufacturer} ${vehicle.Model} (${vehicle.Manufacturing_Year})`}</MenuItem>
                                    ))
                                )}  
                            </Field>
                        </FormControl>
                        <div style={gridStyle} /> 
                        <FormLabel>Auction Type - </FormLabel>
                        <FormControl style={fieldStyle} margin="normal">
                            <Field name="Auction_Type" component={CustomizedSelectForFormik}>
                                <MenuItem key="AT1" value="Reserved">Reserved</MenuItem>
                                <MenuItem key="AT2" value="Non_Reserved">Non Reserved</MenuItem>
                            </Field>
                        </FormControl>
                        <CustomField name="Product_Description" />
                        <FormControl style={fieldStyle} margin="normal">
                            <Field name="Currency" component={CustomizedSelectForFormik}>
                                <MenuItem key="CUC1" value="AED">AED</MenuItem>
                            </Field>
                        </FormControl>
                        <CustomField name="Auction_Opening_Price" />
                        <CustomField name="Set_Reserve_Price" />
                        <CustomField name="Set_Incremental_Price" />
                        <CustomField name="First_Best_Offer" />
                        <CustomField name="Second_Best_Offer" />
                        <CustomField name="Third_Best_Offer" />                        
                        <CustomField name="Total_Bidding_Duration" />
                        <CustomRadioField name="Allow_Auto_Bidding" />
                        <FormLabel>Stop auto bidding condition - </FormLabel>
                        <FormControl style={fieldStyle} margin="normal">
                            <Field name="Stop_Auto_Bidding_Condition" component={CustomizedSelectForFormik}>
                                <MenuItem key="SABC1" value="Never">Never</MenuItem>
                                <MenuItem key="SABC2" value="Set_Reserve_Price">Reserved Price</MenuItem>
                                <MenuItem key="SABC3" value="First_Best_Offer">First Best Offer</MenuItem>
                                <MenuItem key="SABC4" value="Second_Best_Offer">Second Best Offer</MenuItem>
                                <MenuItem key="SABC5" value="Third_Best_Offer">Third Best Offer</MenuItem>
                            </Field>
                        </FormControl>
                        <CustomRadioField name="Allow_Negotiation" />  
                        <CustomField name="Negotiation_Duration" />
                        <div style={gridStyle} />  
                        <FormLabel>Negotiation mode - </FormLabel>
                        <FormControl style={fieldStyle} margin="normal">
                            <Field name="Negotiation_Mode" component={CustomizedSelectForFormik}>
                                <MenuItem key="NM1" value="automatic">Automatic</MenuItem>
                                <MenuItem key="NM2" value="manual">Manual</MenuItem>
                            </Field>
                        </FormControl>
                        <CustomRadioField name="Allow_Auction_Sniping" />    
                        <CustomField name="Incremental_Time" />
                        <CustomField name="Edit_After_Auction" />
                        <Button style={gridStyle} margin="normal" variant="contained" color="secondary" type="submit">Submit</Button>                              
                    </Form>
                </Formik>
            </Paper>
        </Grid>
        :<Box sx={{ display: 'flex',  justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <CircularProgress />
        </Box> )   
    )
}

export default EditAuction;