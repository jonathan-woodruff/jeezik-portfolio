import React, { useState } from 'react';
import Layout from '../components/layout';
import { onGenerate } from '../api/auth';
import {
  CssBaseline,
  Typography,
  Container,
  Box,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const Generate = () => {
  const matches425 = useMediaQuery('(max-width: 425px)');
  const doctorsInput = {
    '1': {
      name: 'Dr. Pepper',
      isChecked: false
    },
    '2': {
      name: 'Dr. Dre',
      isChecked: false
    },
    '3': {
      name: 'Dr. Jekyll',
      isChecked: false
    },
    '4': {
      name: 'Dr. Danger',
      isChecked: false
    },
    '5': {
      name: 'Dr. Crane',
      isChecked: false
    },
    '6': {
      name: 'Dr. Strange',
      isChecked: false
    }
  };
  const [doctors, setDoctors] = useState(doctorsInput);
  const [generateError, setGenerateError] = useState('');

  //helper function to filter doctors down to those which are selected
  const getSelectedDoctors = () => {
    const selectedDoctors = {};
    for (let doctor in doctors) {
      if (doctors[doctor].isChecked) {
        selectedDoctors[doctor] = { name: doctors[doctor].name, isChecked: doctors[doctor].isChecked };
      }
    }
    return selectedDoctors;
  };

  const handleGenerate = async () => {
    const selectedDoctors = getSelectedDoctors();
    const payload = {
      selectedDoctors: selectedDoctors
    };
    try {
      const { data } = await onGenerate(payload);
      console.log(data.results);
    } catch(error) {
      const errorMessage = error.response.data.errors[0].msg;
      setGenerateError(errorMessage);
      console.log(errorMessage);
    }
  };
  
  const handleCheck = (itemKey) => (e) => {
    setGenerateError('');
    const targetChecked = e.target.checked;
    const list = {...doctors};
    list[itemKey].isChecked = targetChecked;
    setDoctors(list);
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
              Select anesthesiologists
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid 
                item 
                xs={ matches425 ? 6 : 4 } 
                sx={{ mb: 2 }} 
              >
                <FormControlLabel control={ <Checkbox onChange={ handleCheck('1') } checked={ doctors['1'].isChecked } /> } label={ doctors['1'].name } />
              </Grid>
              <Grid 
                item 
                xs={ matches425 ? 6 : 4 } 
                sx={{ mb: 2 }} 
              >
                <FormControlLabel control={ <Checkbox onChange={ handleCheck('2') } checked={ doctors['2'].isChecked } /> } label={ doctors['2'].name } />
              </Grid>
              <Grid 
                item 
                xs={ matches425 ? 6 : 4 } 
                sx={{ mb: 2 }} 
              >
                <FormControlLabel control={ <Checkbox onChange={ handleCheck('3') } checked={ doctors['3'].isChecked } /> } label={ doctors['3'].name } />
              </Grid>
              <Grid 
                item 
                xs={ matches425 ? 6 : 4 } 
                sx={{ mb: 2 }} 
              >
                <FormControlLabel control={ <Checkbox onChange={ handleCheck('4') } checked={ doctors['4'].isChecked } /> } label={ doctors['4'].name } />
              </Grid>
              <Grid 
                item 
                xs={ matches425 ? 6 : 4 } 
                sx={{ mb: 2 }} 
              >
                <FormControlLabel control={ <Checkbox onChange={ handleCheck('5') } checked={ doctors['5'].isChecked } /> } label={ doctors['5'].name } />
              </Grid>
              <Grid 
                item 
                xs={ matches425 ? 6 : 4 } 
                sx={{ mb: 2 }} 
              >
                <FormControlLabel control={ <Checkbox onChange={ handleCheck('6') } checked={ doctors['6'].isChecked } /> } label={ doctors['6'].name } />
              </Grid>
            </Grid>
            <Button
              onClick={ handleGenerate }
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Generate Schedule
            </Button>
            <Typography sx={{ color: 'red' }}>
              { generateError }
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    </Layout>
  )
};

export default Generate;