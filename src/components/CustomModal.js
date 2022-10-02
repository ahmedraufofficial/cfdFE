import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';

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

export default function CustomModal({auctionId, row, rows}) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleUpdate = async (val) => {
        let all_rows = rows
        all_rows.pop()
        let last_row = row
        last_row.bid = parseInt(val);
        all_rows.push(last_row)
        await fetch(`${process.env.REACT_APP_API}/editadmin/auction/${auctionId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                x : {
                    Current_Bid: (val).toString(),
                    Bids: all_rows   
                }
            })
        });
    }


  return (
    <div>
      <Button onClick={handleOpen}>Edit</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Highest Bid: {row?.bid}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Input updated bid 
          </Typography>
          <Formik initialValues={{Current_Bid: "0"}}
                onSubmit={(values, { resetForm }) => {
                    handleUpdate(values?.Current_Bid)
                    resetForm();
                }}>
                <Form>
                <Grid>
                    <Field 
                        key={'bidValue'} 
                        margin="normal" 
                        label={`Custom Bid`} 
                        name={'Current_Bid'} 
                        component={TextField}>
                    </Field>
                </Grid>
                <Grid>
                    <Button margin="normal" variant="contained" color="primary" type="submit">Submit</Button>
                </Grid>
                </Form>
            </Formik>
        </Box>
      </Modal>
    </div>
  );
}
