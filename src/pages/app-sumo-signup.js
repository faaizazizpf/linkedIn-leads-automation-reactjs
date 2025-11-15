import Head from 'next/head';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useMutation, useQuery } from 'react-query';
import * as Yup from 'yup';
import axios from 'axios';
import { useState, useMemo, useEffect } from "react";
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSlice';
import { licenseListUrl, userRegisterUrl, userLoginUrl } from '../config';
import Alert from '@mui/material/Alert';
import newson from '../public/newson.jpeg';
import appsumo from '../public/as-logo-dark.png';
import Loader from '../components/loader';



const AppSumoSignUp = () => {
  const [alert, setAlert] = useState("")
  const router = useRouter();
  const user = useSelector(selectProfile);
  const {l} = router.query
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required'),
      confirmPassword: Yup
      .string()
      .max(255)
      .required(
        'Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        values.username = data.activation_email
        values.email = data.activation_email
        const resp = await createResource.mutateAsync({
          values,
          url: `${userRegisterUrl}?license_id=${l}`,
        })
        const loginResp = await createResource.mutateAsync({
          values,
          url: userLoginUrl,
        })
        sessionStorage.setItem('jwtToken', loginResp.data.access);
        router.push("/authenticate")
      } catch (err) {
        console.log(err)
        setAlert("Sorry Something Went Wrong.")
        setTimeout(() => setAlert(""), 3000)
      } finally {
        setSubmitting(false);
      }
    }
  });

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values)
  );

  const {
    refetchlicense,
    isError,
    isFetching,
    data,
  } = useQuery(
    ['license', l],
    () =>
        axios.get(`${licenseListUrl}/${l}`)
            .then((res) => res.data),
    { enabled: Boolean(l) }
  )

  if (isError || isFetching || !data) {
    return <Loader />
  }

  return (
    <>
      <Head>
        <title>Signup | Newson</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
          <Box sx={{ my: 3, display: "flex" }}>
            <NextImage alt="Newson logo" src={newson} width={50} height={50} />
            <Typography
                color="textPrimary"
                variant="p"
                sx={{ mt: "20px", mx: "5px" }}
              >
                with
              </Typography>
            <Box sx={{width: '230px', mt: "10px",}}>
              <NextImage alt="App Sumo logo" src={appsumo} />
            </Box>

          </Box>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h5"
                sx={{ textAlign: 'left' }}
              >
                Activate Your License
              </Typography>
            </Box>
            {alert ? (
              <Alert severity="error">{alert}</Alert>
            ) : null}
            <TextField
              fullWidth
              label="Username"
              placeholder="JohnDoe"
              margin="normal"
              type="username"
              value={data.activation_email}
              disabled
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="New Password"
              placeholder="**************"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
              fullWidth
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              label="Confirm Password"
              placeholder="**************"
              margin="normal"
              name="confirmPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.confirmPassword}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Set Password
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default AppSumoSignUp;
