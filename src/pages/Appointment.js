import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Button from '@mui/material/Button';
import {Navigate, useNavigate} from 'react-router-dom'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from 'react';
import EvaluationTable from '../components/EvaluationTable';

function Appointments() {
    const navigate = useNavigate();
    const navigateToForm = () => {
    navigate('/evaluation/add');
};

const [evaluations, setEvaluations] = useState([])

const fetchData = () => {
    fetch(`${process.env.REACT_APP_API}/evaluations`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setEvaluations(data.data)
        console.log(data.data)
    })
  }


useEffect(() => {
    fetchData()
}, [])


    return (     
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={8} lg={15} style={{fontSize: '25px'}}>
                    Appointments
                    <Button className='formbutton' variant="outlined" startIcon={<AddCircleOutlineIcon/>} onClick={navigateToForm}>
                Create New
              </Button>
              </Grid>
              
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
              
              </Grid>
              <Grid item xs={12}>
              {evaluations.length > 0 ? <EvaluationTable rows={evaluations} /> : <></>}
              </Grid>
            </Grid>
          </Container>
    );
  }

  export default Appointments;