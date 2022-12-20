import { Grid, Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';
import * as React from 'react';
import AuctionCard from '../components/AuctionCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Auctions(props) {
  const [auctions, setAuctions] = useState([])

  const fetchAuctions = () => {
    fetch(`${process.env.REACT_APP_API}/auctions`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data.data)
        setAuctions(data.data)
      })
}

  useEffect(()=>{
    const roles = localStorage.getItem('roles')
    if (roles.includes("Admin") || roles.includes("Auction")) {
      console.log("Permitted")
    } else {
      navigate('/dashboard')
    }
      const auctionInterval = setInterval(fetchAuctions, 4000) 
      return () => {
        clearInterval(auctionInterval);
      }
  },[])
  
  const navigate = useNavigate();
  const navigateToForm = () => {
    navigate('/auction/add');
  };
    return (     
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={8} lg={15} style={{fontSize: '25px'}}>
                    Auctions
                    <Button className='formbutton' variant="outlined" startIcon={<AddCircleOutlineIcon/>} onClick={navigateToForm}>
                Create New
              </Button>
              </Grid>
              
              {auctions?.length > 0 && (
                auctions.map((auction, index) => 
                    <Stack key={index} mt={3}>
                        <AuctionCard data={auction} key={auction._id} />
                    </Stack>
                ).reverse()
            )}
            </Grid>
          </Container>
    );
  }

  export default Auctions;