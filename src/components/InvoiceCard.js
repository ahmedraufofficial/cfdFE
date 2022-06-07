import { Grid, Paper, styled } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import moment from "moment";
import * as React from 'react';

export default function InvoiceCard(props) {
    const invoiceData = props?.data
    const timestamp = new Date(new Date(moment(invoiceData?.Negotiation_Start_Date).format("YYYY-MM-DD HH:mm:ss")).getTime() + 60000 * parseInt(invoiceData?.Negotiation_Duration))
    const finalBid = invoiceData?.Bids[invoiceData?.Bids.length - 1]
    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }));

    return (
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {invoiceData?.Vehicle_Title}
          </Typography>
          <Typography variant="h5" component="div">
            {moment(timestamp).format("YYYY-MM-DD HH:MM:ss")}
          </Typography>
          <Typography mt={2} color="text.secondary">
            External charges:
          </Typography>
          <Typography variant="body2">
            200 AED
          </Typography>
          <Typography mt={2} color="text.secondary">
            Final bid:
          </Typography>
          <Typography variant="body2">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={6}>
                <Item>{finalBid?.user}</Item>
              </Grid>
              <Grid item xs={6}>
                <Item>{finalBid?.bid} {invoiceData?.Currency}</Item>
              </Grid>
              <Grid item xs={6}>
                <Item>{finalBid?.type}</Item>
              </Grid>
              <Grid item xs={6}>
                <Item>{`${finalBid?.date} ${finalBid?.time}`}</Item>
              </Grid>
            </Grid>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Generate</Button>
        </CardActions>
      </Card>
    )
}