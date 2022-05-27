import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Field, Formik, Form, useField } from 'formik'
import { TextField } from 'formik-material-ui';
import moment from 'moment';
import Timer from './Timer';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import * as Yup from 'yup'; 

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
    const [intervalId, setIntervalId] = useState(0);
    const [status, setStatus] = useState(1);
    const validationSchema = Yup.object({
      Current_Bid: Yup
        .string()
        .test(
          `is greater than ${props?.data?.Set_Incremental_Price}`,
          `Should be greater than ${props?.data?.Set_Incremental_Price}`,
          (value) => {
           if (parseInt(value) < props?.data?.Set_Incremental_Price) {
            return false;
           }
           return true;
          },
         )
        .required('Value is required'),
    });

    const handleBid = async (bid, username) => {
      const currentBid = parseInt(auction.Current_Bid);
      const incrementalBid = bid;
      const bidDetails = {user: username, bid: ( currentBid + incrementalBid ).toString(), time: moment().format("HH:mm:ss"), date: moment().format("YYYY-MM-DD")}
      const duration = (JSON.parse(auction.Allow_Auction_Sniping) && minutes < 1) ? parseInt(auction.Total_Bidding_Duration) + parseInt(auction.Incremental_Time) : parseInt(auction.Total_Bidding_Duration);
      const response = await fetch(`http://localhost:3001/edit/auction/${auction._id}`, {
                                    method: 'PUT',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                      Current_Bid: ( currentBid + incrementalBid ).toString(),
                                      Allow_Auto_Bidding: (autoBidding).toString(),
                                      Total_Bidding_Duration: duration.toString(),
                                      Bids: bidDetails
                                    })
                                });
      const data = await response.json();
      if (data.status === "200") {
        if (JSON.parse(data?.response?.Allow_Auction_Sniping))
        {
          let newStartingTime = moment(data?.response?.Auction_Start_Date).format("YYYY-MM-DD")+" "+data?.response?.Auction_Start_Time+":00"
          let newEndTime = new Date(newStartingTime).getTime() + 60000 * parseInt(data?.response.Total_Bidding_Duration || 10); 
          setEndTime(newEndTime);
        }
        setAuction(data.response);
      } else if (data.status === '500') 
      {
        console.log(data.error)
      }
    };



    useEffect(() => {
      if (parseInt(auction?.Current_Bid) < parseInt(auction[auction?.Stop_Auto_Bidding_Condition]||"100000000") 
      && autoBidding == true) {
        setTimeout(function(){handleBid(parseInt(props?.data?.Set_Incremental_Price), "auto");}, 10000);
      } else {
        setAutoBidding(false);
      }
      
      const newIntervalId = setInterval(() => {
        if (new Date(moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00").getTime() + 60000 * parseInt(auction.Total_Bidding_Duration) <= new Date().getTime()){
          clearInterval(intervalId);
          setIntervalId(0);
          setStatus(0);
          return;
        };
        console.log("Test");
      }, 5000);
      setIntervalId(newIntervalId);
    }, [auction]);

    const linkStyle = {
        color: "white",
        textDecoration: "none",
    }

    
    const startingTime = moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00"

    const endTime = new Date(startingTime).getTime() + 60000 * parseInt(auction.Total_Bidding_Duration || 10); 
    const [timeLeft, setEndTime] = Timer(endTime);
  
    const minutes = Math.floor(timeLeft / 60000) % 60;
    const seconds = Math.floor(timeLeft / 1000) % 60;


    return props?.data?
    (
        <Paper
          elevation={10}
          sx={{
            p: 2,
            margin: 'auto',
            width: 1,
            flexGrow: 1,
          }}
        >
          <Grid container spacing={2}>
            { status ? 
              <Grid xs={12} lg={2} md={2}>
                <Stack mt={2} direction="row" justifyContent="center">
                  <Typography variant="h4">Remaining Time</Typography>
                </Stack>
                <Stack mt={2} direction="row" justifyContent="center">
                  <AccessTimeFilledIcon />
                  <Typography ml={1} variant="h4">{`${minutes}:${seconds}`}</Typography>
                </Stack>
              </Grid> : 
              <Grid xs={12} lg={2} md={2}>
                <Stack mt={2} direction="row" justifyContent="center">
                  <Typography variant="h4" color="red">Auction Completed</Typography>
                </Stack>
                <Stack mt={2} direction="row" justifyContent="center">
                  <DoneOutlineIcon />
                </Stack>
              </Grid>
            }
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="h4" component="div">
                    {auction.Vehicle_Title}
                  </Typography>
                  <Stack direction="row" mt={2} spacing={2} divider={<Divider orientation="vertical" flexItem />}>                
                        <Stack direction="column" spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
                          <Typography variant="body2" gutterBottom>
                            Opening Price
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {`${auction?.Auction_Opening_Price} ${auction?.Currency}`}
                          </Typography>
                        </Stack>
                        <Stack direction="column" spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
                          <Typography variant="body2" gutterBottom>
                            Reserve Price
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {`${auction?.Set_Reserve_Price} ${auction?.Currency}`}
                          </Typography>
                        </Stack>
                        <Stack direction="column" spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
                          <Typography variant="body2" gutterBottom>
                            Current Bid
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {`${auction?.Current_Bid} ${auction?.Currency}`}
                          </Typography>
                        </Stack>
                  </Stack>
                </Grid>
                <Grid item>
                    <Formik initialValues={{Current_Bid: "0"}}
                      validationSchema={validationSchema} 
                      onSubmit={(values, { resetForm }) => {
                        handleBid(parseInt(values?.Current_Bid), localStorage.getItem('user'));
                        resetForm();
                      }}>
                      { status ?   
                      <Form>
                        <Grid>
                          <Field 
                            key={'bidValue'} 
                            margin="normal" 
                            label={`Custom Bid (default: ${auction?.Set_Incremental_Price} ${auction?.Currency})`} 
                            name={'Current_Bid'} 
                            component={TextField}>
                          </Field>
                        </Grid>
                        <Grid>
                          <Button margin="normal" variant="contained" color="primary" type="submit">Submit</Button>
                        </Grid>
                      </Form> : <></>}
                    </Formik>
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
