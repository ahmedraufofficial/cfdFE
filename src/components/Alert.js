import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const ActionAlerts = ({msg, setAlert, alert}) => {
  return alert ? (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert onClose={() => {setAlert(0)}}>{msg}</Alert>
    </Stack>
  ) : null;
}

export default ActionAlerts;