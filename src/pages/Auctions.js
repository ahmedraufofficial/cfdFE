import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack } from '@mui/material';
import { paperStyle } from '../styles';
import AuctionCard from '../components/AuctionCard';

function Auctions() {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([])

    const fetchData = () => {
        fetch('http://localhost:3001/auctions')
          .then(response => {
            return response.json()
          })
          .then(data => {
            setAuctions(data.data)
          })
      }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <Grid style={paperStyle}>
        <Grid>
            <h2>Auctions</h2>
        </Grid>
        
            {auctions.length > 0 && (
                auctions.map((auction) => (
                    <Stack spacing={4}>
                        <AuctionCard data={auction} key={auction._id} />
                    </Stack>
                ))
            )}
        </Grid>
    )
}

export default Auctions