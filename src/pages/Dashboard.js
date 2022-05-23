import { React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider";
import { Button, Box } from '@mui/material';

export default function Dashboard() {
    const auth = useAuth()
    const navigate = useNavigate();
    
    const handleLogout = () => {
        auth.logout()
    }


    return (
        <Box sx={{ display: 'flex',  justifyContent: "center", alignItems: "center", flexDirection: "column",minHeight: "100vh" }}>
            <h4>Welcome {localStorage.getItem('user')}</h4>
            <Button variant="contained" color="primary" onClick={handleLogout}>Log out</Button>
        </Box>  
    )
}
