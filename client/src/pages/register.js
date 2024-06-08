/* sign-up page */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import { onRegistration } from '../api/auth';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://jonathan-woodruff.github.io">
        Jonathan Woodruff
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Register = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
      email: '',
      password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value});
      setEmailError('');
      setPasswordError('');
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
        await onRegistration(values);
        localStorage.setItem('justSignedUp', 'true');
        navigate('../login');
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
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={ (e) => handleSubmit(e) } sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={ values.email }
                      autoComplete="email"
                      error={ emailError ? true : false }
                      helperText={ emailError }
                      onChange={ (e) => handleChange(e) }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={ values.password }
                      autoComplete="new-password"
                      error={ passwordError ? true : false } 
                      helperText={ passwordError }
                      onChange={ (e) => handleChange(e) }
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      Already have an account? Log in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      </Layout>
    )
  };
  
  export default Register;