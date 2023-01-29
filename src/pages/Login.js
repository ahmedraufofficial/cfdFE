import LockIcon from '@mui/icons-material/Lock';
import { Avatar, Button, Grid, Paper, Typography, Stack } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from "formik-material-ui";
import { React } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from "../context/AuthProvider";
import { paperStyle } from '../styles';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const lightTheme = createTheme({ palette: { mode: 'light' } });

const Login = () => {

    const button = {
        marginTop: '3em',
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
    const LOGIN_URL = '/api/auth';
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
        <Grid sx={{
            width: 450,
            marginLeft: "33%"
        }}>
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
                                const response = await fetch(`${process.env.REACT_APP_API}`+LOGIN_URL, {
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                        username: e.username, password: e.password
                                    })
                                })
                                const data = await response.json()
                                if (data.user) {
                                    auth.login(data.user, data.roles)
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
                        <Stack>
                        <Field margin="normal" name="username" component={TextField} label="Username"/>
                        <Field margin="normal" name="password" type="password" component={TextField} label="Password"/>
                        </Stack>
                        <Button style={button} key="submit" type='submit' variant="contained" color="primary" fullWidth>Sign in</Button>
                    </Form>
                </Formik>
            </Paper>
        </Grid>
    )
};

export default Login;