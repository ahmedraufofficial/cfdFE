import React from 'react';
import './App.css';
import AdminRoutes from './Routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ['Ubuntu', 'sans-serif'].join(','),
      h4: {fontSize: '1.2rem'}
    },
    palette: {
      mode: "light"
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider>
        <ThemeProvider theme={theme}> 
          <CssBaseline />
          <AdminRoutes /> 
        </ThemeProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
