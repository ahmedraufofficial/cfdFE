import { Field, Formik, Form } from 'formik'
import React, {useEffect, useState} from 'react'
import { Grid, Button, Paper, MenuItem, Select, FormControl, FormLabel } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { paperStyle, fieldStyle, gridStyle } from '../styles';

function AddImages() {
    const [vehicles, setVehicles] = useState([])
    const navigate = useNavigate();
    const fetchData = () => {
        fetch('http://localhost:3001/vehicles')
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

    return (
        <Grid>
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
                        }
                        fetch("http://localhost:3001/upload_images", {
                            method: 'POST',
                            body: formData,
                            headers: {}
                            }).then((res) => console.log(res))
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