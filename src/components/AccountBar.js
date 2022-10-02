import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


export const AccountBar = ({data}) => {
    const [status, setStatus] = useState(data?.status)
    const activate = async (x) => {
        const response = await fetch(`${process.env.REACT_APP_API}/accounts/activate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: x
            })
        })
        const data = await response.json()
        if (data) {
           setStatus('Active')
        }
    }

    return (
        <Box component={Paper} sx={{ width: '100%', padding: '20px', marginTop: '50px' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
            >
            <Item>
                {data?.email}
            </Item>
            <Item>
                {data?.username}
            </Item>
            <Item>
                {data?.number}
            </Item>
            <Item>
                {data?.status}
            </Item>
                {
                    status === 'Inactive' ? 
                    <Item>
                        <Button onClick={()=>{activate(data?._id)}}>
                            Activate
                        </Button>
                    </Item>
                    :
                    <></>
                }
            </Stack>
        </Box>
    )
}
