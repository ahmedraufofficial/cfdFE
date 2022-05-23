import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom"
const images = require.context('../../public/uploads', true);

export default function VehicleCard(props) {  
  const linkStyle = {
    color: "white",
    textDecoration: "none",
  }
  return props?.data ?
   (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="200px"
        width="100%"
        image={images(`./${props?.data?.Images[0] || "1653179697686-main.jpg"}`)} 
        alt="Car Image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props?.data?.Vehicle_Manufacturer}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props?.data?.Model}  
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props?.data?.Manufacturing_Year}  
        </Typography>
      </CardContent>
      <CardActions> 
        <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                <Link style={linkStyle} underline="none" to={`/vehicle/edit/${props?.data?._id}`}><Typography textAlign="center">Edit</Typography></Link>
        </Button>
      </CardActions>
    </Card>
  ) :
  (<></>)
}
