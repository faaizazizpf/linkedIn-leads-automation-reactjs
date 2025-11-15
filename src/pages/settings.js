import Head from 'next/head';
import { Box, Container, Typography,Button, Card, CardContent, CardHeader, Divider, Slider, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsPassword } from '../components/settings/settings-password';

const Settings = () => (
  <>
    <Head>
      <title>
        Settings | Newson
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3
      }}
    >
      <Container>
        <Typography
          sx={{ mb: 2 }}
          variant="h4"
        >
          Settings
        </Typography>
        <Box sx={{ pt: 0 }}>
        <Card>
        <CardHeader
          subheader="Linkedin Global Steps Limits"
          title="Limits"
        />
        <Divider />
        <CardContent>
        <Grid
              container
              spacing={20}
              // sx={{ justifyContent: 'space-between' }}
          >
              <Grid item>
              <Typography id="non-linear-slider" gutterBottom>
          Connection Requests (Per Day): 50
        </Typography>
          <Slider
            value={50}
            min={50}
            max={100}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
              </Grid>
              <Grid item>
              <Typography id="non-linear-slider" gutterBottom>
          Emails (Per Day): 50
        </Typography>
          <Slider
            value={50}
            min={50}
            max={100}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
              </Grid>
              <Grid item>
              <Typography id="non-linear-slider" gutterBottom>
          Inmails (Per Day): 50
        </Typography>
          <Slider
            value={50}
            min={50}
            max={100}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
              </Grid>
          </Grid>
        </CardContent>
      </Card>
        </Box>
      </Container>
    </Box>
  </>
);

Settings.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Settings;
