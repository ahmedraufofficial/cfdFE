import React from 'react'
import { useState, useEffect } from 'react'
import { Grid, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListingsTable from '../components/ListingsTable';

const Inquirys = () => {
    const [inquirys, setInquirys] = useState(null)

    const getInquirys = async () => {
        fetch(`${process.env.REACT_APP_API}/inquirys`)
        .then(response => {
            return response.json()
        })
        .then(data => {
          setInquirys(data.data)
        })
    }

    useEffect(() => {
        
        getInquirys()
    }, []);

    const roles = localStorage.getItem('roles')
        if (roles.includes("Admin")) {
          console.log("Permitted")
        } else {
          navigate('/dashboard')
        }

    const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={8} lg={15} style={{fontSize: '25px'}}>
                    Inquirys
              </Grid>
              
              {/* Recent Deposits */}
              <Grid xs={12}>
                {       
                inquirys?.length > 0 ? <ListingsTable rows={inquirys} type="inquiry" /> : null
                }          
              </Grid>
            </Grid>
        </Container>
  )
}

export default Inquirys