/* Login page */

import React, { useState } from 'react';
import Layout from '../components/layout';
import { onLogin } from '../api/auth';
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../redux/slices/authSlice';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Link,
  Box,
  Typography,
  Container,
  Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://jonathan-woodruff.github.io/">
        Jonathan Woodruff
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Login = () => {
    const dispatch = useDispatch();
    const [values, setValues] = useState({
      email: '',
      password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    //check if the user signed up. If so, show the snackbar and update local storage so the snackbar won't show again upon page refresh
    const justSignedUp = localStorage.getItem('justSignedUp');
    const [openSnack, setOpenSnack] = useState(justSignedUp && JSON.parse(justSignedUp) === true ? true : false);
    localStorage.removeItem('justSignedUp');

    const handleChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value});
      setEmailError('');
      setPasswordError('');
    };

    const handleClose = () => {
      setOpenSnack(false);
    };

    //helper function to make a field show it is in an error state
    const showError = errorMessage => {
      const regMessage = errorMessage.toLowerCase();
      const regEmail = /email/;
      let reArray = regEmail.exec(regMessage);
      if (reArray !== null) { //errorMessage contains email
        setEmailError(errorMessage);
        return;
      }
      const regPassword = /password/;
      reArray = regPassword.exec(regMessage);
      if (reArray !== null) { //errorMessage contains password
        setPasswordError(errorMessage);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setEmailError('');
      setPasswordError('');
      try {
        await onLogin(values); //the server sends back a token/cookie
        dispatch(authenticateUser());
        localStorage.setItem('isAuth', 'true');
      } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        showError(errorMessage);
      }
    };

    return (
      <Layout>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Log in
              </Typography>
              <Box component="form" onSubmit={ (e) => handleSubmit(e) } noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={ values.email }
                  error={ emailError ? true : false }
                  helperText={ emailError }
                  onChange={ (e) => handleChange(e) }
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={ values.password }
                  error={ passwordError ? true : false }
                  helperText={ passwordError }
                  onChange={ (e) => handleChange(e) }
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >
                  Log In
                </Button>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link href="/register" variant="body2">
                      Don't have an account? Sign Up
                    </Link>
                  </Grid>
                </Grid>
                <Snackbar
                  open={ openSnack }
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  autoHideDuration={ 5000 } //5 seconds
                  onClose={ handleClose }
                  message="sign-up successful!"
                />
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        </ThemeProvider>
      </Layout>
    )
  };
  
  export default Login;