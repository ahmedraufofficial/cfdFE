import { React } from "react";
import { Button, Grid, Paper, Avatar, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { Formik, Form, Field } from 'formik';
import { TextField } from "formik-material-ui";
import * as yup from 'yup';
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Navigate } from 'react-router-dom';
import { paperStyle } from '../styles';

const Login = () => {

    const button = {
        marginTop: '3em'
    }
    const validationSchema = yup.object({
        username: yup
          .string('Enter your username')
          .required('Username is required'),
        password: yup
          .string('Enter your password')
          .min(8, 'Password should be of minimum 8 characters length')
          .required('Password is required'),
    });
    
    const auth = useAuth();
    const LOGIN_URL = '/auth';
    const navigate = useNavigate()
    const recursiveStorage = () => {
        if (localStorage.getItem('user')) {
            //navigate("/dashboard")
            window.location.href = "/dashboard"
        } else {
            recursiveStorage();
        }
    }

    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
            { localStorage.getItem('user') ?  <Navigate to="/dashboard" /> : <></> }
                <Grid align='center'>
                    <Avatar><LockIcon/></Avatar>
                    <Typography variant="h4">Sign In</Typography>
                </Grid>
                <Formik
                    validationSchema={validationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    initialValues={{
                        username: '',
                        password: ''
                    }} 
                    onSubmit={(e, { resetForm }) => {
                        try {
                            async function SignIn() {
                                const response = await fetch('http://localhost:3001/api'+LOGIN_URL, {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                        username: e.username, password: e.password
                                    })
                                })
                                const data = await response.json()
                                if (data.user) {
                                    auth.login(data.user)
                                    recursiveStorage()
                                }
                            }
                            
                            SignIn();
                            resetForm();
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }}>
                    <Form>
                        <Field margin="normal" name="username" component={TextField} label="Username"/>
                        <Field margin="normal" name="password" type="password" component={TextField} label="Password"/>
                        <Button style={button} key="submit" type='submit' variant="contained" color="primary" fullWidth>Sign in</Button>
                    </Form>
                </Formik>
            </Paper>
        </Grid>
    )
};

export default Login;