import { Grid, Container, Button } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvaluationCard from '../components/EvaluationCard';
import { paperStyle } from '../styles';
import EvaluationTable from '../components/EvaluationTable';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Evaluations() {
    const navigate = useNavigate();
    const [evaluations, setEvaluations] = useState([])
    const navigateToForm = () => {
        navigate('/evaluation/add');
    };
    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API}/evaluations`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setEvaluations(data.data)
        })
      }


    useEffect(() => {
      const roles = localStorage.getItem('roles')
      if (roles.includes("Admin") || roles.includes("Evaluation")) {
        console.log("Permitted")
      } else {
        navigate('/dashboard')
      }
      fetchData()
    }, [])

    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={8} lg={15} style={{fontSize: '25px'}}>
                    Evaluations
                <Button className='formbutton' variant="outlined" startIcon={<AddCircleOutlineIcon/>} onClick={navigateToForm}>
                Create New
              </Button>
              </Grid>
              
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
              
              </Grid>
              <Grid item xs={12}>
              {evaluations.length > 0 ? <EvaluationTable rows={evaluations} section={'Evaluations'}/> : <></>}
              </Grid>
            </Grid>
        </Container>
    )
}
