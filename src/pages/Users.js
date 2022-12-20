import React from 'react'
import UsersTable from '../components/UsersTable'
import { useState, useEffect } from 'react'
import { Grid, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Users = () => {
    const [users, setUsers] = useState(null)

    const getUsers = async () => {
        fetch(`${process.env.REACT_APP_API}/users`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            setUsers(data.data)
        })
    }

    useEffect(() => {
        const roles = localStorage.getItem('roles')
        if (roles.includes("Admin")) {
          console.log("Permitted")
        } else {
          navigate('/dashboard')
        }
        getUsers()
    }, []);

    const navigate = useNavigate();
    const addUser = () => {
        navigate('/add/user');
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={8} lg={15} style={{fontSize: '25px'}}>
                    Users
                <Button className='formbutton' variant="outlined" startIcon={<AddCircleOutlineIcon/>} onClick={addUser}>
                Create New
              </Button>
              </Grid>
              
              {/* Recent Deposits */}
              <Grid xs={12}>
                {
                    users?.length > 0 ? <UsersTable rows={users} /> : null
                }                
              </Grid>
            </Grid>
        </Container>
  )
}

export default Users