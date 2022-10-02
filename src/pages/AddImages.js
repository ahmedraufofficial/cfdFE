import { Button, FormControl, FormLabel, Grid, MenuItem, Paper, Select } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fieldStyle, gridStyle, paperStyle } from '../styles';
import ActionAlerts from '../components/Alert';

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

function AddImages() {
    const [vehicles, setVehicles] = useState([])
    const navigate = useNavigate();
    const [alert, setAlert] = useState(0)
    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API}/vehicles`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setVehicles(data.data)
          })
      }
    
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Grid>
        <ActionAlerts msg={"Succesfully uploaded images"} setAlert={setAlert} alert={alert}/>
        <Paper elevation={10} style={paperStyle}>
            <Formik
                initialValues={{Vehicle_Id: "0"}}
                onSubmit={(values, { resetForm }) => {
                    try {
                        console.log(values)
                        const formData = new FormData();
                        const files = document.getElementById("files");
                        formData.append("id",values.Vehicle_Id);
                        for(let i=0; i < files.files.length; i++) {
                            formData.append("files", files.files[i]);
                            console.log(files.files[i])
                        }
                        
                        fetch(`${process.env.REACT_APP_API}/upload_images`, {
                            method: 'POST',
                            body: formData,
                            headers: {}
                            }).then((res) => setAlert(1))
                            .catch((err) => ("Error occured", err));

                        resetForm(); 
                    }
                    catch (err) {
                        console.log(err)
                    }
                }}
            >
                <Form>
                    <Grid><h3>Add Images</h3></Grid>
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
                    <Grid style={gridStyle}>
                        <FormLabel>Select Images: </FormLabel>
                        <input type="file" id="files" className="form-control" name="imagesArray" multiple/>   
                    </Grid>
                    <Button margin="normal" variant="contained" color="secondary" type="submit">Submit</Button>                              
                </Form>
            </Formik>
        </Paper>
    </Grid>
    )
}

export default AddImages