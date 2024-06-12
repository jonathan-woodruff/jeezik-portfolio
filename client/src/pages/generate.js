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

  //helper function to find the destination node for a given decision variable
  //returns the decision variable or null if there is no decision variable matching the inputs
  const findDestination = (solutionArray, dayIndex, doctorIndex, sourceNode) => {
    solutionArray.forEach(decisionVariable => {
      const rePattern = new RegExp('x[' + dayIndex + '][' + doctorIndex + '][' + sourceNode + '][');
    })
  };

  //helper function to parse the results into the CSV body
  const parseBody = data => {
    const { days, doctors, nodes } = data;
    let destinationDummyReached;
    for (let i = 0; i < doctors.length; i++) {
      for (let j = 0; j < days.length; j++) {
        destinationDummyReached = false;
        while (!destinationDummyReached) {

        }
      }
    };
  };

  //helper function to parse the results from lp solver into a CSV-friendly format
  const parseResults = data => {
    const header = [data.days.join(',')].join('\n');
    const body = parseBody(data);
    const resultsArray = Object.keys(data.results);
    //port decision variables over to solutionArray
    const solutionArray = [];
    const rePattern = /x\[/;
    for (let i = 0; i < resultsArray.length; i++) {
      let reArray = rePattern.exec(resultsArray[i].toLowerCase());
      if (reArray !== null) { //pattern matches therefore the item in resultsArray is a decision variable
        solutionArray.push(resultsArray[i]);
      };
    };
    console.log(header);
    return solutionArray;
  };

  //helper function to download a csv of the results
  const serveCSV = results => {
    const parsedResults = parseResults(results);
    console.log(parsedResults);
    //get();
  };

  // Function to download the CSV file
const download = (data) => {
  // Create a Blob with the CSV data and type
  const blob = new Blob([data], { type: 'text/csv' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create an anchor tag for downloading
  const a = document.createElement('a');
  
  // Set the URL and download attribute of the anchor tag
  a.href = url;
  a.download = 'download.csv';
  
  // Trigger the download by clicking the anchor tag
  a.click();
}

// Function to create a CSV string from an object
const csvmaker = (data) => {
  // Get the keys (headers) of the object
  const headers = Object.keys(data);
  
  // Get the values of the object
  const values = Object.values(data);
  
  // Join the headers and values with commas and newlines to create the CSV string
  return [headers.join(','), values.join(',')].join('\n');
}

// Asynchronous function to fetch data and download the CSV file
const get = async () => {
  // Example data object
  const data = {
      id: 1,
      name: `"geeks\nnerds"`,
      profession: "developer"
  };
  
  // Create the CSV string from the data
  const csvdata = csvmaker(data);
  
  // Download the CSV file
  download(csvdata);
}

  const handleGenerate = async () => {
    const selectedDoctors = getSelectedDoctors();
    const payload = {
      selectedDoctors: selectedDoctors
    };
    try {
      const { data } = await onGenerate(payload);
      console.log(data);
      serveCSV(data);
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