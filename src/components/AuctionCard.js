import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import moment from 'moment';
import Timer from './Timer';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useEffect } from 'react';

const images = require.context('../../public/uploads', true);

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

export default function AuctionCard(props) {  
    const [auction, setAuction] = useState(props?.data)
    const [autoBidding, setAutoBidding] = useState(JSON.parse(props?.data?.Allow_Auto_Bidding))
    const [stopAutoBidding, setStopAutoBidding] = useState(props?.data?.Stop_Auto_Bidding_Condition)
    const [intervalId, setIntervalId] = useState(0);

    const handleBid = async () => {
      const openingPrice = parseInt(auction.Auction_Opening_Price);
      const incrementalPrice = parseInt(auction.Set_Incremental_Price);
      const response = await fetch(`http://localhost:3001/edit/auction/${auction._id}`, {
                                    method: 'PUT',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                      Auction_Opening_Price: ( openingPrice + incrementalPrice ).toString(),
                                      Allow_Auto_Bidding: (autoBidding).toString()
                                    })
                                });
      const data = await response.json();
      if (data.status === "200") {
        setAuction(data.response);
      } else if (data.status === '500') 
      {
        console.log(data.error)
      }
    };

    //console.log(auction["Set_Reserve_Price"])

    useEffect(() => {
      if (parseInt(auction?.Auction_Opening_Price) < parseInt(auction[auction?.Stop_Auto_Bidding_Condition]) 
      && autoBidding == true) {
        setTimeout(handleBid, 10000);
      } else {
        setAutoBidding(false)
      }

    }, [auction]);

    //console.log(auction)
    const linkStyle = {
        color: "white",
        textDecoration: "none",
    }

    
    const startingTime = moment(auction.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction.Auction_Start_Time+":00"

    const endTime = new Date(startingTime).getTime() + 60000 * parseInt(auction.Total_Bidding_Duration || 10); 
    const [timeLeft, setEndTime] = Timer(endTime);
  
    const minutes = Math.floor(timeLeft / 60000) % 60;
    const seconds = Math.floor(timeLeft / 1000) % 60;



    return props?.data?
    (
        <Paper
          sx={{
            p: 2,
            margin: 'auto',
            width: 1,
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Grid sx={{ width: 128, height: 128 }}>
                  <p>{`${minutes}:${seconds}`}</p>
                  <button onClick={() => setEndTime(endTime)}>Reset</button>
              </Grid>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {auction.Vehicle_Title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Opening price: {auction.Auction_Opening_Price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {auction.Product_Description}
                  </Typography>
                </Grid>
                <Grid item>
                    <Button onClick={() => {handleBid()}}>Bid</Button>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" component="div">
                  {moment(auction.Auction_Start_Date).format("LL")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) :
    (<></>)
}
