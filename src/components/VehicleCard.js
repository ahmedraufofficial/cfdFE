import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/system';

import { useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';

export default function VehicleCard(props) {  
  const linkStyle = {
    color: "white",
    textDecoration: "none",
  }
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [email, setEmail] = React.useState("");

  const [images, setImages] = useState(false)

  const getImg = () => {
    setImages(!images)
  }
  const navigate = useNavigate();

  const handleDelete = async (x) => {
      const response = await fetch(`${process.env.REACT_APP_API}/edit/vehicle/${x}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              values : {
                Images: []
              }
          })
      })
      const data = await response.json()
      if (data) {
          if (data.status === '200')
          {
              navigate("/vehicles", { replace: true });
          } else if (data.status === '500') 
          {
              console.log(data.error)
          }
      }
  }; 

  const handleTextFieldChange = (e) => {
    setEmail(e.target.value);
  }

  return props?.data ?
   (
    <Card sx={{ minWidth: "17em", maxWidth: "20em" }}>
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
            <Button onClick={handleOpen}>Download</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Enter Email <TextField value={email} onChange={handleTextFieldChange} />
                </Typography>
                {
                  email.length > 0 ?  
               
                <Button
                  onClick={(e) => {
                    fetch(`${process.env.REACT_APP_API}/pdf`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        filename: `pdf${props?.data?._id}`,
                        id: props?.data?._id,
                        email: email
                      }),
                    }).then(async res => {
                      if (res.status === 200) {
                        try {
                          handleClose();
                        } catch (err) {
                          console.log(err)
                        }
      /*                   const blob = await res.blob();
                        const file = new Blob(
                          [blob], 
                          {type: 'application/pdf'}
                        );
                        const fileURL = URL.createObjectURL(file);
                        window.open(fileURL);   */
                      }
                    }) 
                  }}
                >    
                  Download
                </Button> : <></> }
              </Box>
            </Modal>

      </CardActions>
      <CardActions>
        <Button onClick={()=>{
          getImg();
        }}>
          View Images
        </Button>
      </CardActions>
      {images ? 
        <>
       <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {props?.data?.Images?.map((item) => (
          <ImageListItem key={item}>
            <img
              src={`http://142.93.231.219/images/${item}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`http://142.93.231.219/images/${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Button onClick={()=>{
        handleDelete(props?.data?._id)
      }}>Delete</Button>
      </> : <></>
      }
    </Card>
  ) :
  (<></>)
}
