import Head from 'next/head';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { useMutation } from 'react-query'
import { useSelector } from "react-redux";
import { selectProfile } from "../features/profile/profileSlice";
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { userRegisterUrl } from '../config';
import { useState } from 'react';

const Register = () => {
  const router = useRouter();
  const user = useSelector(selectProfile);
  const [alert, setAlert] = useState("");
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      policy: false
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Must be a valid email')
        .max(255)
        .required(
          'Email is required'),
      username: Yup
        .string()
        .max(150)
        .required(
          'Username is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required').min(8),
      policy: Yup
        .boolean()
        .oneOf(
          [true],
          'This field must be checked'
        )
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createResource.mutateAsync({
          values,
          url: `${userRegisterUrl}?whitelabel=${user.client.id}`,
        });
        router.push('/login');
      } catch (err) {
        console.log(err)
        setAlert("A user with that username already exists.")
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
        <title>
          Register | Newson
        </title>
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
                sx={{ textAlign: "center" }}
                variant="h4"
              >
                Create a new account
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
              value={formik.values.username}
              variant="outlined"
              size="medium"
            />
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              placeholder="john.doe@example.com"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
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
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                ml: -1
              }}
            >
              <Checkbox
                checked={formik.values.policy}
                name="policy"
                onChange={formik.handleChange}
              />
              <Typography
                color="textSecondary"
                variant="body2"
              >
                I have read the
                {' '}
                <NextLink
                  href="#"
                  passHref
                >
                  <Link
                    color="primary"
                    underline="always"
                    variant="subtitle2"
                  >
                    Terms and Conditions
                  </Link>
                </NextLink>
              </Typography>
            </Box>
            {Boolean(formik.touched.policy && formik.errors.policy) && (
              <FormHelperText error>
                {formik.errors.policy}
              </FormHelperText>
            )}
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign Up Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Have an account?
              {' '}
              <NextLink
                href="/login"
                passHref
              >
                <Link
                  variant="subtitle2"
                  underline="hover"
                >
                  Sign In
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Register;
