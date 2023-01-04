import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AccountBar } from '../components/AccountBar';
import { paperStyle } from '../styles';
import { Container } from '@mui/system';

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);

    const fetchAccounts = () => {
        fetch(`${process.env.REACT_APP_API}/accounts`)
          .then(response => {
            return response.json()
          })
          .then(data => {
            setAccounts(data.data)
          })
    }

    useEffect(()=>{
        fetchAccounts();
    },[])


  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
    <Grid container spacing={3}>
    <Grid style={paperStyle}>
        {accounts?.length > 0 && (
            accounts?.map((account, index) => {
                return <AccountBar key={index} data={account} />
            })
        )}
    </Grid>
    </Grid>
    </Container>
  )
}
