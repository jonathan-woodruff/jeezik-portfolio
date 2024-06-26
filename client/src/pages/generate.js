import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from '../components/layout';
import { fetchProtectedInfo, onGenerate } from '../api/auth';
import { logout } from '../utils/index';
import { Spinner } from '../components/spinner';
import { unauthenticateUser } from '../redux/slices/authSlice';
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
import { blueGrey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: blueGrey
  },
});

const Generate = () => {
  const dispatch = useDispatch();
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState(doctorsInput);
  const [generateError, setGenerateError] = useState('');

  const checkAuthenticated = async () => {
    try {
      await fetchProtectedInfo();
      setIsAuthenticated(true);
    } catch(error) {
      logout(); //if the user isn't property authenticated using the token on the cookie or there is some other issue, this will force logout thus not allowing a user to gain unauthenticated access
      dispatch(unauthenticateUser());
    }
  };

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
    const subStr = 'x[' + dayIndex + '][' + doctorIndex + '][' + sourceNode + ']';
    let destinationNode = null;
    solutionArray.forEach(decisionVariable => {
      if (decisionVariable.includes(subStr)) { 
        let startIndex = decisionVariable.lastIndexOf('[') + 1;
        let endIndex = decisionVariable.lastIndexOf(']');
        destinationNode = decisionVariable.slice(startIndex, endIndex);
        return; //exit forEach
      }  
    });
    return destinationNode;
  };

  //helper function to parse the results into the CSV body
  const parseBody = (data, solutionArray) => {
    let body = ''; //initialize
    const { days, doctors, nodes, dummyDestinationNodes } = data;
    for (let i = 0; i < doctors.length; i++) {
      body += `\n${doctors[i]},`;
      let doctorBody = '';
      for (let j = 0; j < days.length; j++) {
        let destinationDummyReached = false;
        let sourceNode = 0;
        let count = 0;
        while (!destinationDummyReached) {
          let destinationNode = findDestination(solutionArray, j, i, sourceNode);
          if (destinationNode === null || destinationNode === dummyDestinationNodes[j]) {
            if (count === 1) {
              doctorBody = doctorBody.slice(1);
            } else if (count > 1) {
              doctorBody += `"`;
            };
            doctorBody += `,`;
            destinationDummyReached = true;
          } else {
            let { location, interval } = nodes[days[j]][destinationNode];
            if (count === 0) {
              doctorBody += `"${location}: ${interval}`;
            } else {
              doctorBody += `\n${location}: ${interval}`;
            }
            count++;
            sourceNode = destinationNode;
          }
        }
        body += doctorBody;
        doctorBody = '';
      }
      body = body.slice(0, -1); //remove last comma
    };
    return body;
  };

  //helper function to parse the results from lp solver into a CSV-friendly format
  const parseResults = data => {
    //assign the header
    const header = ' ,' + [data.days.join(',')].join('\n');
    //prepare to assign the body by putting the results from lp-solver into a solution array containing only the decision variables at play
    const resultsArray = Object.keys(data.results);
    const solutionArray = [];
    const rePattern = /x\[/;
    for (let i = 0; i < resultsArray.length; i++) {
      let reArray = rePattern.exec(resultsArray[i].toLowerCase());
      if (reArray !== null) { //pattern matches therefore the item in resultsArray is a decision variable
        solutionArray.push(resultsArray[i]);
      };
    };
    //assign the body
    const body = parseBody(data, solutionArray);
    return header.concat('', body);
  };

  // Function to download the CSV file
  const download = (parsedResults) => {
    
    // Create a Blob with the CSV data and type
    const blob = new Blob([parsedResults], { type: 'text/csv' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create an anchor tag for downloading
    const a = document.createElement('a');
    
    // Set the URL and download attribute of the anchor tag
    a.href = url;
    a.download = `jeezik-results.csv`;

    // Trigger the download by clicking the anchor tag
    a.click();
  };

  //helper function to download a csv of the results
  const serveCSV = data => {
    const parsedResults = parseResults(data);
    download(parsedResults);
  };

  const handleGenerate = async () => {
    const selectedDoctors = getSelectedDoctors();
    const payload = {
      selectedDoctors: selectedDoctors
    };
    try {
      const { data } = await onGenerate(payload);
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

  //ensure the user is authenticated to view the page
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthenticated();
    }
    initializeAuth();
  }, []);

  //load the page content
  useEffect(() => {
    if (isAuthenticated) setLoading(false);
  }, [isAuthenticated]);

  return loading ? (
    <Layout>
      <Spinner />
    </Layout>
    ) : (
      <Layout>
      <ThemeProvider theme={theme}>
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
            <Grid container spacing={1} alignItems="center" sx={{ mt: 2 }}>
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
              Download Schedule
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