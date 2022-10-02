import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AccountBar } from '../components/AccountBar';
import { paperStyle } from '../styles';

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
    <Grid style={paperStyle}>
        {accounts?.length > 0 && (
            accounts?.map((account, index) => {
                return <AccountBar key={index} data={account} />
            })
        )}
    </Grid>
  )
}
