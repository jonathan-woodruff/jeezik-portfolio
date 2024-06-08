import Layout from '../components/layout';
import { onGenerate } from '../api/auth';
import {
  CssBaseline,
  Typography,
  Container,
  Box,
  Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const handleClick = async () => {
  const { data } = await onGenerate();
  console.log(data.results);
};

const Generate = () => {
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
                Generate Schedule
              </Typography>
              <Button
                onClick={ handleClick }
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Generate
              </Button>
            </Box>
          </Container>
        </ThemeProvider>
      </Layout>
    )
};

export default Generate;