import Head from 'next/head';
import { Box, Container, Typography,Button, Card, CardContent, CardHeader, Divider, Slider, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSlice';

const Billing = () => {
  const user = useSelector(selectProfile);
  return (
  <>
    <Head>
      <title>
        Billing | Newson
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
          Billing
        </Typography>
        <Box sx={{ pt: 0 }}>
        <Card>
            <Box sx={{ p: "20px" }}>

                <Box sx={{ display: "flex"}}>
                    <Box sx={{ mt: "8px", mr: "10px" }}>
                    <Typography variant="h6">{user.details.plan.plan__name}</Typography>
                    </Box>
                    <Box>
                    <Box sx={{
                        fontSize: "12px",
                        backgroundColor: "rgb(16, 185, 129)",
                        color: "white",
                        borderRadius: "10px",
                        px: 1,
                        display: "inline-block",
                        // ml: "auto",
                        mt: "12px",
                        textAlign: "center"
                    }}>Active</Box>
                    </Box>               
                </Box>
            </Box>
        <Divider />
        <CardContent>
            <Box sx={{ display: "flex", mb: "8px" }}>
                <CheckCircleIcon color="primary" />
                <Typography variant="p" sx={{ ml: "6px" }}>Connect {user.details.plan.plan__linkedin_and_email_accounts} Linkedin Accounts</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: "8px" }}>
                <CheckCircleIcon color="primary" />
                <Typography variant="p" sx={{ ml: "6px" }}>Connect {user.details.plan.plan__linkedin_and_email_accounts} Email Accounts</Typography>
            </Box>
            <Box sx={{ display: "flex", mb: "8px" }}>
                <CheckCircleIcon color="primary" />
                <Typography variant="p" sx={{ ml: "6px" }}>Prospects Per Month {user.details.plan.plan__prospects_per_month}</Typography>
            </Box>
            {console.log(user.details.plan)}
            {user.details.plan.plan__white_label ? (
            <Box sx={{ display: "flex", mb: "8px" }}>
                <CheckCircleIcon color="primary" />
                <Typography variant="p" sx={{ ml: "6px" }}>Whitelabel</Typography>
            </Box>
            ) : null}
            
        </CardContent>
      </Card>
        </Box>
      </Container>
    </Box>
  </>
)
};

Billing.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Billing;
