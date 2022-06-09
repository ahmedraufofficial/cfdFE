import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import AuctionTable from './AuctionTable';
import NTimer from './NTimer';

export default function NegotiationCard(props) {
    const [negotiation, setNegotiation] = useState(props?.data)
    const [showTable, setShowTable] = useState(0);

    const iconStyle = {
        cursor: "pointer"
    }

    const validationSchema = Yup.object({
        Buy_Now_Price: Yup
          .string()
          .test(
            `is greater than ${props?.data?.Current_Bid}`,
            `Should be greater than ${props?.data?.Current_Bid}`,
            (value) => {
             if (parseInt(value) < props?.data?.Current_Bid) {
              return false;
             }
             return true;
            },
           )
          .required('Value is required'),
    });

    const responseHandler = (data) => {
      if (data.status === "200") {
        setNegotiation(data.response);
      } else if (data.status === '500') {
        console.log(data.error)
      }
    }

    const startNegotiation = async (value) => {
        const negotiationDate = new Date();
        setEndTime(negotiationDate.getTime() + 60000 * parseInt(negotiation?.Negotiation_Duration));
        const response = await fetch(`${process.env.REACT_APP_API}/edit/negotiation/${negotiation._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                Buy_Now_Price: value,
                Negotiation_Start_Date: negotiationDate,
            })
        });
        const data = await response.json();
        responseHandler(data);
    };

    const buyNow = async () => {
      const bidDetails = {user: localStorage.getItem('user'), type: "Negotiation", bid: negotiation?.Buy_Now_Price, time: moment().format("HH:mm:ss"), date: moment().format("YYYY-MM-DD")}
      const newBid = negotiation?.Bids;
      newBid.push(bidDetails)
      const response = await fetch(`${process.env.REACT_APP_API}/edit/negotiation/${negotiation._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          Status: "Post-Negotiation",
          Bids: newBid
        })
      });
      const data = await response.json();
      responseHandler(data);
    }

    const getNegotiation = async () => {
      fetch(`${process.env.REACT_APP_API}/negotiation/${props?.data?._id}`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          setNegotiation(data.response)
        })
    }


    useEffect(()=>{
      setTimeout(getNegotiation, 10000);
    },[negotiation])
    //moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00"

    const startingTime =  moment(negotiation?.Negotiation_Start_Date).format("YYYY-MM-DD HH:mm:ss");
    const endTime = new Date(startingTime).getTime() + 60000 * parseInt(negotiation?.Negotiation_Duration || 10); 
    const [timeLeft, setEndTime] = NTimer(endTime);
  
    const minutes = negotiation?.Buy_Now_Price ? Math.floor(timeLeft / 60000) % 60 : "-";
    const seconds = negotiation?.Buy_Now_Price ? Math.floor(timeLeft / 1000) % 60 : "-";

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
              { negotiation?.Status === "Post-Negotiation" ?                 
                <Grid item xs={12} lg={2} md={2}>
                  <Stack direction="row" justifyContent="center">
                    <Typography variant="h4" color="lightGreen">Negotiation Completed</Typography>
                  </Stack> 
                </Grid> :
                <Grid item xs={12} lg={2} md={2}>
                  <Stack direction="row" justifyContent="center">
                    <Typography variant="h4">{negotiation?.Buy_Now_Price ? "Remaining Time" : "Set 'Buy Now Price'"}</Typography>
                  </Stack>
                  <Stack mt={2} direction="row" justifyContent="center">
                    <AccessTimeFilledIcon />
                    <Typography ml={1} variant="h4">{`${minutes}:${seconds}`}</Typography>
                  </Stack>
                </Grid> 
              }
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant="h4" component="div">
                    {negotiation?.Vehicle_Title}
                  </Typography>
                  <Stack direction="row" mt={2} spacing={2} divider={<Divider orientation="vertical" flexItem />}>                
                        <Stack direction="column" spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
                          <Typography variant="body2" gutterBottom>
                            Current Bid
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {`${negotiation?.Current_Bid} ${negotiation?.Currency}`}
                          </Typography>
                        </Stack>
                        <Stack direction="column" spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
                          <Typography variant="body2" gutterBottom>
                            Buy Now Price
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {`${negotiation?.Buy_Now_Price} ${negotiation?.Currency}`}
                          </Typography>
                        </Stack>
                  </Stack>
                </Grid>
              {negotiation?.Buy_Now_Price ? 
                negotiation?.Status === "Post-Negotiation" ? <></> :
                <Grid item>
                  <Button margin="normal" variant="contained" color="secondary" onClick={()=>{buyNow();}}>Buy Now</Button>
                </Grid> : 
                <Grid item>
                    <Formik initialValues={{Buy_Now_Price: "0"}} 
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            startNegotiation(parseInt(values?.Buy_Now_Price));                          
                            resetForm();
                      }}>                      
                      <Form>
                        <Grid>
                          <Field 
                            key={'butNowValue'} 
                            margin="normal" 
                            label={`Buy Now Price (default: ${negotiation?.Current_Bid} ${negotiation?.Currency})`} 
                            name={'Buy_Now_Price'} 
                            component={TextField}>
                          </Field>
                        </Grid>
                        <Grid>
                          <Button margin="normal" variant="contained" color="primary" type="submit">Submit</Button>
                        </Grid>
                      </Form>
                    </Formik>
                </Grid>
              }
              </Grid>
            </Grid>
          </Grid>
          
          {!showTable ? 
          <Stack direction="row" justifyContent="center">
            <ArrowDropDownIcon style={iconStyle} onClick={() => { setShowTable(1) }} />
          </Stack> : <></>}

          {showTable ? 
          <>
            <Stack mb={2} direction="row" justifyContent="center">
              <ArrowDropUpIcon style={iconStyle} onClick={() => { setShowTable(0) }} />
            </Stack>
            <AuctionTable rows={negotiation?.Bids}/>
          </> : 
          <></>}
         
        </Paper>
      ) :
    (<></>)
}