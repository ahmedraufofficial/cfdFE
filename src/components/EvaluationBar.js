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

export const EvaluationBar = ({data}) => {
    const [showTable, setShowTable] = useState(0);

    return (
        <>  
            <Box component={Paper} sx={{ width: '100%', padding: '20px', marginTop: '50px' }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                    <Item>{data?.Vehicle_Manufacturer + " " + data?.Model}</Item>
                    <Item>{data?.Year}</Item>
                    <Item>{data?.Price}</Item>
                    <Button component={Paper} onClick={() => setShowTable(!showTable)}>See More</Button>
                </Stack>
            </Box>
            {
                !showTable ? <></> : <TableContainer component={Paper}>
                <Table sx={{ /* minWidth: 650 */ }} aria-label="simple table">
                <TableBody>
                {data && Object.keys(data).map((x, index)=>{
                   return index === 0 || x === "__v" ||  x === "Images" || x === "Username" || x === "Added_Date" ?  <></>:
                   (
                    <TableRow key={index+x}>
                        <TableCell>{x.replace("_", " ")}</TableCell>
                        <TableCell>{Array.isArray(data[x]) ? "" : data[x]}</TableCell>
                    </TableRow>)
                })}
                <TableRow>
                    <TableCell>
                        <Button component={Paper} onClick={() => setShowTable(!showTable)}>Close</Button>
                    </TableCell>
                </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
            }
        </>
    )
}
