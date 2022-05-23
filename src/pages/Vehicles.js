import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import VehicleCard from '../components/VehicleCard';
import { paperStyle } from '../styles';

export default function Vehicles() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([])

    const fetchData = () => {
        fetch('http://localhost:3001/vehicles')
          .then(response => {
            return response.json()
          })
          .then(data => {
            setVehicles(data.data)
          })
      }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Grid style={paperStyle}>
                <Grid>
                    <h2>Vehicles</h2>
                </Grid>
                <Grid container spacing={24}>
                    {vehicles.length > 0 && (
                        vehicles.map((vehicle) => (
                            <Grid item>
                                <VehicleCard data={vehicle} key={vehicle._id} />
                            </Grid>
                        ))
                    )}

                </Grid>
        </Grid>
    )
}
