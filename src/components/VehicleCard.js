import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";

export default function VehicleCard(props) {  
  const linkStyle = {
    color: "white",
    textDecoration: "none",
  }

  console.log(props?.data)
  return props?.data ?
   (
    <Card sx={{ width: "17em" }}>
      <CardMedia
        component="img"
        height="200px"
        width="100%"
        image={`${process.env.REACT_APP_API}/images/${props?.data?.Images[0]}`}
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
