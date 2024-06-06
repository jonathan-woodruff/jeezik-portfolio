import Layout from '../components/layout';
import {
  CssBaseline,
  Typography,
  Container
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

  const defaultTheme = createTheme();

const Generate = () => {
    return (
        <Layout>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
              <Typography component="h1" variant="h5">
                Generate
              </Typography>
          </Container>
        </ThemeProvider>
      </Layout>
    )
};

export default Generate;