import Head from 'next/head';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { DashboardLayout } from '../components/dashboard-layout';
import { useState, useMemo } from 'react';
import { useMutation } from 'react-query'
import { Box, Button, Card, CardContent, CardHeader, Divider, TextField, Container, Alert, Modal, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useFormik } from 'formik';
import { userLinkedinAccountConnectUrl, googleOAuthUrl, userProfileInfoUrl } from '../config';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfile, setProfile } from '../features/profile/profileSlice';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EmailIntegration = () => {
    const [alert, setAlert] = useState("")
    const [smtpAlert, setSmtpAlert] = useState("")
    const [modalAlert, setModalAlert] = useState("")
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectProfile);
    const [open, setOpen] = useState(false);
    const formik = useFormik({
        initialValues: {
            smtp_username: '',
            smtp_password: '',
            smtp_server: '',
            smtp_ssl: true,
        },
        validationSchema: Yup.object({
            smtp_username: Yup
                .string()
                .max(1200)
                .required(
                    'Username is required'),
            smtp_password: Yup
                .string()
                .max(1200)
                .required(
                    'Password is required'),
            smtp_server: Yup
                .string()
                .max(1200)
                .required(
                    'Smtp Server is required'),
            smtp_port: Yup
                .number()
                .required(
                    'Smtp Port is required'),
            smtp_ssl: Yup
                .boolean()
                .required(
                    'Smtp Port is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.smtp_account_connected = true
                await updateResource.mutateAsync({
                    values,
                    url: userProfileInfoUrl,
                })
                dispatch(setProfile({ token: user.token, details: { ...user.details, smtp_account_connected: true, smtp_server: values.smtp_server } }))
                router.push("/")
            } catch (err) {
                console.log(err)
                console.log(err.response)

                console.log(err.response.data.connected)
                console.log(err.response.data.msg)

                if (err.response.data.smtp) {
                    setSmtpAlert(err.response.data.smtp)
                    setTimeout(() => setSmtpAlert(""), 3000)
                } else {
                    setSmtpAlert("Sorry Something Went Wrong.")
                    setTimeout(() => setSmtpAlert(""), 3000)
                }
            } finally {
                setSubmitting(false);
            }
        }
    });

    const config = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }),
        [user.token]
    );

    const createResource = useMutation(({ url, values }) =>
        axios.post(url, values, config)
    );

    const updateResource = useMutation(({ url, values }) =>
        axios.patch(url, values, config)
    );

    return (
        <>
            <Head>
                <title>
                    Email Integration | Newson
                </title>
            </Head>
            <Box
                // component="main"
                sx={{
                    py: 2,
                }}
            >
                <Container>
                    <Box>
                        <form onSubmit={formik.handleSubmit}>
                            <Card>
                                <CardHeader
                                    subheader="Connect my smtp server for email integration"
                                    title="Smtp Server"
                                    sx={{ pb: "0px" }}
                                />

                                <CardContent >

                                    {smtpAlert ? (
                                        <Alert sx={{ my: "10px" }} severity="error">{smtpAlert}</Alert>
                                    ) : null}
                                    {!user.details.smtp_account_connected ? (
                                        <>
                                            <TextField
                                                error={Boolean(formik.touched.username && formik.errors.smtp_username)}
                                                fullWidth
                                                helperText={formik.touched.smtp_username && formik.errors.smtp_username}
                                                label="Username"
                                                placeholder="JohnDoe"
                                                margin="normal"
                                                name="smtp_username"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                type="smtp_username"
                                                value={formik.values.smtp_username}
                                                variant="outlined"
                                            />
                                            <TextField
                                                error={Boolean(formik.touched.smtp_password && formik.errors.smtp_password)}
                                                fullWidth
                                                helperText={formik.touched.smtp_password && formik.errors.smtp_password}
                                                label="Password"
                                                placeholder="**************"
                                                margin="normal"
                                                name="smtp_password"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                type="password"
                                                value={formik.values.smtp_password}
                                                variant="outlined"
                                            />
                                            <TextField
                                                error={Boolean(formik.touched.smtp_server && formik.errors.smtp_server)}
                                                fullWidth
                                                helperText={formik.touched.smtp_server && formik.errors.smtp_server}
                                                label="Smtp Server"
                                                placeholder="smtp.example.com"
                                                margin="normal"
                                                name="smtp_server"
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                type="smtp_server"
                                                value={formik.values.smtp_server}
                                                variant="outlined"
                                            />
                                            <TextField
                                                error={Boolean(formik.touched.smtp_port && formik.errors.smtp_port)}
                                                fullWidth
                                                helperText={formik.touched.smtp_port && formik.errors.smtp_port}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                                value={formik.values.smtp_port}
                                                label="Smtp Port"
                                                placeholder="465"
                                                type="number"
                                                name="smtp_port"
                                            />
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={formik.values.smtp_ssl} />} label="SSL/TLS" onChange={() => formik.setFieldValue('smtp_ssl', !formik.values.smtp_ssl)} />
                                            </FormGroup>
                                        </>
                                    ) : null}

                                    <Box>
                                        {!user.details.smtp_account_connected ? (
                                            <Button
                                                color="primary"
                                                disabled={formik.isSubmitting}
                                                sx={{
                                                    mt: "15px"
                                                }}
                                                type="submit"
                                                variant="contained"
                                            >
                                                Connect My Smtp Account
                                            </Button>
                                        ) : (
                                            <Button
                                                color="primary"
                                                onClick={async () => {
                                                    await axios.patch(userProfileInfoUrl, {
                                                        smtp_username: "",
                                                        smtp_server: "",
                                                        smtp_port: null,
                                                        smtp_ssl: false,
                                                        smtp_account_connected: false,
                                                    }, config)
                                                    dispatch(setProfile({ token: user.token, details: { ...user.details, smtp_account_connected: false } }));
                                                }}
                                                type="submit"
                                                variant="contained"
                                            >
                                                {`Disconnect My Smtp Account (${user.details.smtp_server})`}
                                            </Button>
                                        )}

                                    </Box>
                                </CardContent>
                            </Card>
                        </form>
                    </Box>
                    <Box>
                        <Card>
                            <CardHeader
                                subheader="Connect my google account for email integration"
                                title="Google Account"
                                sx={{ pb: "0px" }}
                            />

                            <CardContent sx={{ pt: "15px" }}>
                                {alert ? (
                                    <Alert sx={{ my: "10px" }} severity="error">{alert}</Alert>
                                ) : null}
                                <Box>
                                    <Button
                                        color="primary"
                                        onClick={async () => {
                                            if (user.details.google_account_connected) {
                                                await axios.patch(userProfileInfoUrl, {
                                                    google_account_connected: false
                                                }, config)
                                                dispatch(setProfile({ token: user.token, details: { ...user.details, google_account_connected: false } }));
                                            } else {
                                                await googleOAuthUrl()
                                            }
                                        }}
                                        variant="contained"
                                    >
                                        {user.details.google_account_connected ? `Disconnect My Google Account (${user.details.google_name})` : `Connect My Google Account`}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
            {/* <ConnectModal something={"somethign"} /> */}
        </>
    )
};

EmailIntegration.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default EmailIntegration;
