import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import AuctionTable from './AuctionTable';
import Timer from './Timer';
import { Link } from "react-router-dom";

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
    const [showTable, setShowTable] = useState(0);

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
      const currentBid = parseInt(auction?.Current_Bid);
      const incrementalBid = bid;
      const bidDetails = {user: username, type: "Auction", bid: ( currentBid + incrementalBid ).toString(), time: moment().format("HH:mm:ss"), date: moment().format("YYYY-MM-DD")}
      const newBid = auction?.Bids;
      newBid.push(bidDetails)
      const response = await fetch(`${process.env.REACT_APP_API}/edit/auction/${auction._id}`, {
                                    method: 'PUT',
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify({
                                      Current_Bid: ( currentBid + incrementalBid ).toString(),
                                      Allow_Auto_Bidding: (autoBidding).toString(),
                                      Bids: newBid
                                    })
                                });
      const data = await response.json();
      if (data.status === "200") {
        console.log()
        if (JSON.parse(data?.response?.Allow_Auction_Sniping) && minutes === 0 && seconds > 0)
        {
          let newStartingTime = moment(data?.response?.Auction_Start_Date).format("YYYY-MM-DD")+" "+data?.response?.Auction_Start_Time+":00"
          let newEndTime = new Date(newStartingTime).getTime() + 60000 * (parseInt(data?.response.Total_Bidding_Duration || 10) + parseInt(auction?.Incremental_Time)); 
          setEndTime(newEndTime);
        }
        setAuction(data.response);
      } else if (data.status === '500') {
        console.log(data.error)
      }
    };

    const getAuction = async () => {
      fetch(`${process.env.REACT_APP_API}/auction/${props?.data?._id}`)
        .then(response => {
          return response.json()
        })
        .then(data => {
          setAuction(data.response)
        })
    }

    useEffect(() => {
/*       if (parseInt(auction?.Current_Bid) < parseInt(auction[auction?.Stop_Auto_Bidding_Condition]||"100000000") 
      && autoBidding === true) {
        setTimeout(function(){handleBid(parseInt(props?.data?.Set_Incremental_Price), "auto");}, 10000);
      } else {
        setAutoBidding(false);
      } */
     
      
/*       
      if (new Date(moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+" "+auction?.Auction_Start_Time+":00").getTime() + 60000 * parseInt(auction.Total_Bidding_Duration) <= new Date().getTime()){
      
        setStatus(0); 
        return;
      };
 */
      setTimeout(getAuction, 10000);

    }, [auction]);

    const iconStyle = {
      cursor: "pointer"
    }

    const startingTime = moment(auction?.Auction_Start_Date).format("YYYY-MM-DD")+"T"+auction?.Auction_Start_Time+":00"
    const endTime = new Date(startingTime).getTime() + 60000 * parseInt(auction.Total_Bidding_Duration || 10); 
    const [timeLeft, setEndTime] = Timer(endTime, auction);
    const minutes = Math.floor(timeLeft / 60000) % 60;
    const seconds = Math.floor(timeLeft / 1000) % 60;

    const linkStyle = {
      color: "white",
      textDecoration: "none",
    }
  
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
            { parseInt(minutes) === 0 && parseInt(seconds) === 0 ? 
                <Grid item xs={12} lg={2} md={2}>
                <Stack direction="row" justifyContent="center">
                  <Typography variant="h4" color="red">Auction Completed</Typography>
                </Stack>
                <Button variant="contained">
                  Delete
                </Button>
                <Stack mt={2} direction="row" justifyContent="center">
                  <DoneOutlineIcon />
                </Stack>
              </Grid>
                :        
              <Grid item xs={12} lg={2} md={2}>
              <Stack direction="row" justifyContent="center">
                <Typography variant="h4">Remaining Time</Typography>
              </Stack>
              <Stack mt={2} direction="row" justifyContent="center">
                <AccessTimeFilledIcon />
                <Typography ml={1} variant="h4">{`${minutes}:${seconds}`}</Typography>
              </Stack>
            </Grid> }
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
                      { parseInt(minutes) === 0 && parseInt(seconds) === 0 ? <></> :
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
                        <Grid>
                          <Link style={linkStyle} underline="none" to={`/auction/edit/${auction?._id}`}><Typography>Edit</Typography></Link>
                        </Grid>
                      </Form>}
                    </Formik>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" component="div">
                  {moment(auction?.Auction_Start_Date).format("LL")}
                </Typography>
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
            <AuctionTable rows={auction?.Bids} auctionId={auction?._id}/>
          </> : 
          <></>}
         
        </Paper>
      ) :
    (<></>)
}
