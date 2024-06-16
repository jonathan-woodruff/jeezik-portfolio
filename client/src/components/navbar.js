/* This page defines the navbar at the right-hand side of the header */

import { AppBar, Toolbar, IconButton, Typography, Stack, Button, useMediaQuery } from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { onLogout } from '../api/auth';
import { CLIENT_URL } from '../constants/index';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';

export const Navbar = () => {
    const theme = createTheme({
      palette: {
        primary: blueGrey
      }
    });
    const matches375 = useMediaQuery('(max-width: 375px)');

    const dispatch = useDispatch();
    
    const logout = async () => {
        try {
            await onLogout();
            dispatch(unauthenticateUser());
            localStorage.removeItem('isAuth');
        } catch(error) {
            console.log(error.response);
        }
    };
    
    const { isAuth } = useSelector(state => state.auth);

    return (
      <ThemeProvider theme={theme}>
        <AppBar position='static'>
            <Toolbar>
                <IconButton size='large' edge='start' color='inherit' aria-label='home icon'>
                    <RadioButtonCheckedIcon />
                </IconButton>
                
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    { matches375 ? '' : 'Jeezik' }
                </Typography>
                {isAuth ? (
                    <Stack direction='row' spacing={3}>
                        <Button color='inherit' onClick={ () => logout() } sx={{ mr: 1 }}>Log out</Button>
                    </Stack>
                ) : (
                    <Stack direction='row' spacing={3}>
                        <Button color='inherit' component={Link} to={`${CLIENT_URL}/login`}>Log in</Button>
                        <Button color='inherit' component={Link} to={`${CLIENT_URL}/register`}>Sign Up</Button>
                    </Stack>
                )}
            </Toolbar>
        </AppBar>
      </ThemeProvider>
    );
};