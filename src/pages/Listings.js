import React from 'react'
import ListingsTable from '../components/ListingsTable'
import { useState, useEffect } from 'react'
import { Grid, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Listings = () => {
    const [listings, setListings] = useState(null)

    const getListings = async () => {
        fetch(`${process.env.REACT_APP_API}/listings`)
        .then(response => {
            return response.json()
        })
        .then(data => {
          setListings(data.data)
        })
    }

    useEffect(() => {
        getListings()
    }, []);

    const navigate = useNavigate();

    const navigateToForm = () => {
      navigate('/inquiries');
      };

      const roles = localStorage.getItem('roles')
        if (roles.includes("Admin") || roles.includes("Listing")) {
          console.log("Permitted")
        } else {
          navigate('/dashboard')
        }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={8} lg={15} style={{fontSize: '25px'}}>
                    Listings 
                    <Button className='formbutton' variant="outlined" onClick={navigateToForm}>
                Inquiries
              </Button>
              </Grid>
              
              {/* Recent Deposits */}
              <Grid xs={12}>
                {       
                listings?.length > 0 ? <ListingsTable rows={listings} type="listing" /> : null
                }          
              </Grid>
            </Grid>
        </Container>
  )
}

export default Listings