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

const images = require.context('../../public/uploads', true);

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

export default function AuctionCard(props) {  
    const [auctions, setAuctions] = useState(1)

    const handleclick = () => {

        var test = auctions + 1;
        setAuctions(test)

    };

    //console.log(props?.data)
    const linkStyle = {
        color: "white",
        textDecoration: "none",
    }

    
    const startingTime = moment(props?.data?.Auction_Start_Date).format("YYYY-MM-DD")+" "+props?.data?.Auction_Start_Time+":00"

    const endTime = new Date(startingTime).getTime() + 60000 * 15; 
    const [timeLeft, setEndTime] = Timer(endTime);
  
    const minutes = Math.floor(timeLeft / 60000) % 60;
    const seconds = Math.floor(timeLeft / 1000) % 60;
    console.log(props?.data)


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
                    {props?.data?.Vehicle_Title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Opening price: {props?.data?.Auction_Opening_Price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {props?.data?.Product_Description}
                  </Typography>
                </Grid>
                <Grid item>
                    <Button onClick={() => {handleclick()}}>Bid</Button>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" component="div">
                  {moment(props?.data?.Auction_Start_Date).format("LL")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) :
    (<></>)
}
