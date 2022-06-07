import { Grid } from '@mui/material';
import { React, useEffect, useState } from 'react';
import InvoiceCard from '../components/InvoiceCard';
import { paperStyle } from '../styles';

function Invoices() {

    const [invoices, setInvoices] = useState([])

    const fetchInvoices = () => {
        fetch(`${process.env.REACT_APP_API}/invoices`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            console.log(data.data)
            setInvoices(data.data)
          })
    }

    useEffect(()=>{
        fetchInvoices();
    },[])

    return (
        <Grid style={paperStyle}>
        <Grid>
            <h2>Invoices</h2>
        </Grid>
        <Grid container spacing={3}>
            {invoices.length > 0 && (
                invoices.map(invoice =>    
                    <Grid item md={3}>
                        <InvoiceCard data={invoice} key={invoice._id} />
                    </Grid>
                ).reverse()
            )}
        </Grid>
        </Grid>
    )

}


export default Invoices
