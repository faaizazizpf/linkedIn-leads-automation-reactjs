import Head from 'next/head';
import NextLink from 'next/link';
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../features/profile/profileSlice";
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useMutation } from 'react-query'
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { userLoginUrl } from '../config'
import Alert from '@mui/material/Alert';
import { useState } from 'react';


const Login = () => {
  const [alert, setAlert] = useState("")
  const user = useSelector(selectProfile);
  const dispatch = useDispatch();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(150)
        .required(
          'Username is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(user)
        const resp = await createResource.mutateAsync({
          values,
          url: `${userLoginUrl}?whitelabel=${user.client.id}`,
        })
        sessionStorage.setItem('jwtToken', resp.data.access);
        dispatch(setProfile({...user, loggedIn: true}));
        router.push("/")
      } catch (err) {
        console.log(err)
        setAlert("Invalid Username or Password.")
        setTimeout(() => setAlert(""), 3000)
      } finally {
        setSubmitting(false);
      }
    }
  });

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values)
  );

  return (
    <>
      <Head>
        <title>Login | Newson</title>
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
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
                sx={{ textAlign: 'center' }}
              >
                Sign In
              </Typography>
            </Box>
            {alert ? (
              <Alert severity="error">{alert}</Alert>
            ) : null}
            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="Username"
              placeholder="JohnDoe"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="username"
              value={formik.values.username}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              placeholder="**************"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
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
                Sign In Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
