import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Badge,
  TextField,
  Container,
  Alert,
  Modal,
  SvgIcon,
  InputAdornment,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Avatar,
} from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import { useFormik } from "formik";
import {
  userLinkedinAccountConnectUrl,
  countriesUrl,
  linkedinAccountsListUrl,
  userLinkedinAccountDisconnectUrl,
} from "../config";
import axios from "axios";
import ReconnectLinkedinModal from "../components/reconnectLinkedinModal";
import ImportButton from "../components/import";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../features/profile/profileSlice";
import { styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledBadge = styled(Badge)(({ theme, dotColor }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: `${
      dotColor === "primary"
        ? theme.palette.primary.main
        : theme.palette.error.main
    }`,
    color: `${
      dotColor === "primary"
        ? theme.palette.primary.main
        : theme.palette.error.main
    }`,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const LinkedinAccounts = () => {
  const [alert, setAlert] = useState("");
  const [importAlert, setImportAlert] = useState({
    content: "",
    severity: "",
  });
  const [modalAlert, setModalAlert] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectProfile);
  const [open, setOpen] = useState(false);
  const [reconnectModalOpen, setReconnectModalOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [linkedinAccount, setLinkedinAccount] = useState({});
  const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState({});
  const [verificationCodeButtonDisabled, setVerificationCodeButtonDisabled] =
    useState(false);
  const [addNewForm, setAddNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [reconnectChoice, setReconnectChoice] = useState("");
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      country: "",
      code: "",
    },
    validationSchema: Yup.object({
      username: reconnectModalOpen
        ? reconnectChoice == "use_already_saved_credentials"
          ? Yup.string()
          : Yup.string().max(700).required("Username is required")
        : Yup.string().max(700).required("Username is required"),
      password: reconnectModalOpen
        ? reconnectChoice == "use_already_saved_credentials"
          ? Yup.string()
          : Yup.string().max(700).required("Password is required")
        : Yup.string().max(700).required("Password is required"),
      country: reconnectModalOpen
        ? Yup.string()
        : Yup.string().required("Country is required"),
      code: Yup.number().max(999999),
      reconnect: Yup.boolean().default(false),
      reconnect_choice: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const url = reconnectModalOpen
          ? `${userLinkedinAccountConnectUrl}?reconnect=true`
          : userLinkedinAccountConnectUrl;

        if (reconnectModalOpen) {
          values.linkedin_account = selectedLinkedinAccount.id;
        }

        await createResource.mutateAsync({
          values,
          url,
        });
        dispatch(
          setProfile({
            token: user.token,
            details: { ...user.details, linkedin_account_connected: true },
          })
        );
        router.reload("/");
      } catch (err) {
        if (
          !err.response.data.connected &&
          err.response.data.msg === "Email Verification Code Needed!"
        ) {
          setReconnectModalOpen(false);
          setReconnectChoice("");
          setSelectedLinkedinAccount({});
          setLinkedinAccount(err.response.data.linkedin_account);
          setOpen(true);
        } else {

          setAlert(err.response.data.msg || "Invalid Username or Password.");
          setTimeout(() => setAlert(""), 5000);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }),
    [user.token]
  );

  const {
    isFetching,
    refetch,
    isError,
    data: countriesList,
  } = useQuery(
    ["countries"],
    () =>
      axios
        .get(`${countriesUrl}?page_size=300`, config)
        .then((res) => res.data),
    { enabled: !!user.token }
  );

  const {
    isFetching: linkedinAccountsFetching,
    refetch: linkedinAccountsRefetch,
    isError: linkedinAccountsIsError,
    data: linkedinAccountsList,
  } = useQuery(
    ["linkedinAccounts"],
    () =>
      axios.get(`${linkedinAccountsListUrl}`, config).then((res) => res.data),
    { enabled: !!user.token }
  );

  const handleSubmit = async (e) => {
    setVerificationCodeButtonDisabled(true);
    formik.values.linkedin_account = linkedinAccount.id;
    try {
      await createResource.mutateAsync({
        values: formik.values,
        url: `${userLinkedinAccountConnectUrl}?verification_code=true`,
      });
      dispatch(
        setProfile({
          token: user.token,
          details: { ...user.details, linkedin_account_connected: true },
        })
      );
      setOpen(false);
      router.push("/");
    } catch (err) {
      console.log(err.response);
      if (
        err.response.status === 500 ||
        (!err.response.data.connected &&
          err.response.data.msg === "Sorry, Something Went Wrong!")
      ) {
        setOpen(false);
        setAlert("Sorry, Something Went Wrong, Please Try Later!");
        setTimeout(() => setAlert(""), 5000);
      }

      console.log(err.response.data.connected);
      console.log(err.response.data.msg);

      if (
        !err.response.data.connected &&
        err.response.data.msg === "Hmm, that's not the right code"
      ) {
        console.log("not right code");
        setModalAlert("Hmm, that's not the right code");
        setTimeout(() => setModalAlert(""), 4000);
      }
    }
    setVerificationCodeButtonDisabled(false);
  };

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values, config)
  );

  useEffect(() => {
    if (!countriesList) return;
    setCountries(countriesList);
  }, [countriesList]);

  useEffect(() => {
    if (!linkedinAccountsList) return;
    setLinkedinAccounts(linkedinAccountsList);
  }, [linkedinAccountsList]);

  return (
    <>
      <Head>
        <title>Connect Your Linkedin Account | Newson</title>
      </Head>
      <Box
        // component="main"
        sx={{
          py: 2,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            {importAlert.content ? (
              <Alert sx={{ my: "10px" }} severity={importAlert.severity}>
                {importAlert.content}
              </Alert>
            ) : null}
            <Box
              sx={{
                alignItems: "center",
                display: !addNewForm ? "flex" : "block",
                justifyContent: "space-between",
                flexWrap: "wrap",
                m: -1,
              }}
            >
              <Typography sx={{ m: 1 }} variant="h5">
                {!addNewForm ? "Linkedin Accounts" : null}
              </Typography>

              {!addNewForm ? (
                <>
                  <Box sx={{ m: 1, display: "flex" }}>
                    {/* <Button
                                    startIcon={(<DownloadIcon fontSize="small" />)}
                                    sx={{ mr: 1 }}
                                >
                                    Export
                                </Button> */}

                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setAddNewForm(true)}
                    >
                      Connect Linkedin Account
                    </Button>
                    <ImportButton user={user} setAlert={setImportAlert} />
                    <TextField
                      sx={{ ml: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon color="action" fontSize="small">
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Search Linkedin Account"
                      variant="outlined"
                      size="small"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.currentTarget.value)}
                    />
                  </Box>
                </>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardHeader
                      subheader="Connect my linkedin account"
                      title="Linkedin Account"
                    />
                    <Divider />
                    <CardContent sx={{ py: "5px" }}>
                      {alert ? (
                        <Alert sx={{ my: "10px" }} severity="error">
                          {alert}
                        </Alert>
                      ) : null}
                      <TextField
                        error={Boolean(
                          formik.touched.username && formik.errors.username
                        )}
                        fullWidth
                        helperText={
                          formik.touched.username && formik.errors.username
                        }
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
                        error={Boolean(
                          formik.touched.password && formik.errors.password
                        )}
                        fullWidth
                        helperText={
                          formik.touched.password && formik.errors.password
                        }
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
                      <FormControl fullWidth sx={{ my: "10px" }}>
                        <InputLabel id="country-label">Country</InputLabel>
                        <Select
                          labelId="country-label"
                          id="country"
                          name="country"
                          value={formik.values.country}
                          label="Country"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        >
                          {countries.map((country) => (
                            <MenuItem value={country.id} key={country.id}>
                              {country.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText sx={{ color: "#D14343" }}>
                          {formik.touched.country && formik.errors.country}
                        </FormHelperText>
                      </FormControl>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                      }}
                    >
                      <Button
                        color="primary"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setAddNewForm(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        disabled={formik.isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        Connect My Linkedin Account
                      </Button>
                    </Box>
                  </Card>
                </form>
              )}
            </Box>
            <Box>
              <Grid container spacing={3} sx={{ p: "15px", pt: "5px" }}>
                {linkedinAccounts.map((linkedinAccount) => {
                  return (
                    <Grid
                      key={`Linkedin Account ${linkedinAccount.id}`}
                      item
                      lg={6}
                      md={6}
                      xs={12}
                    >
                      <Card>
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                            dotColor={
                              linkedinAccount.connected &&
                              linkedinAccount.ready_for_use
                                ? "primary"
                                : "error"
                            }
                          >
                            <Avatar
                              alt="Remy Sharp"
                              src={linkedinAccount.avatar}
                              sx={{ width: "90px", height: "90px" }}
                            />
                          </StyledBadge>
                          <Typography
                            id="non-linear-slider"
                            variant="h5"
                            component="p"
                            sx={{ mt: 1 }}
                          >
                            {linkedinAccount.name}
                          </Typography>
                          <Typography
                            id="non-linear-slider"
                            variant="p"
                            component="p"
                          >
                            {linkedinAccount.headline}
                          </Typography>
                          <Box sx={{ display: "flex", mt: "15px" }}>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={async () => {
                                if (
                                  linkedinAccount.connected &&
                                  linkedinAccount.ready_for_use
                                ) {
                                  await createResource.mutateAsync({
                                    values: {},
                                    url: `${userLinkedinAccountDisconnectUrl}${linkedinAccount.id}/`,
                                  });
                                  refetch();
                                } else {
                                  setSelectedLinkedinAccount(linkedinAccount);
                                  setReconnectModalOpen(true);
                                  setReconnectChoice(
                                    "use_already_saved_credentials"
                                  );
                                }
                              }}
                            >
                              {linkedinAccount.connected &&
                              linkedinAccount.ready_for_use
                                ? "Disconnect"
                                : "Reconnect"}
                            </Button>
                            <Button
                              sx={{ ml: "10px" }}
                              color="primary"
                              variant="contained"
                              onClick={() =>
                                window.open(
                                  linkedinAccount.profile_url,
                                  "_blank"
                                )
                              }
                            >
                              View Profile
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
          <ReconnectLinkedinModal
            modalOpen={reconnectModalOpen}
            setModalOpen={setReconnectModalOpen}
            selectedLinkedinAccount={selectedLinkedinAccount}
            setSelectedLinkedinAccount={setSelectedLinkedinAccount}
            alert={alert}
            setAlert={setAlert}
            countries={countries}
            formik={formik}
            reconnectChoice={reconnectChoice}
            setReconnectChoice={setReconnectChoice}
          />
          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {console.log("open", open)}
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Linkedin Email Verification Code
              </Typography>
              <Typography
                id="modal-modal-description"
                variant="p"
                sx={{ mt: 2, fontSize: 14 }}
              >
                Please Enter The Code That is Sent To some@gmail.com
              </Typography>
              {modalAlert ? (
                <Alert sx={{ my: "10px" }} severity="error">
                  {modalAlert}
                </Alert>
              ) : null}
              <TextField
                error={Boolean(formik.touched.code && formik.errors.code)}
                fullWidth
                helperText={formik.touched.code && formik.errors.code}
                label="Verification Code"
                placeholder="123456"
                margin="normal"
                name="code"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.code}
                variant="outlined"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  color="primary"
                  onClick={(e) => handleSubmit(e)}
                  disabled={verificationCodeButtonDisabled}
                  variant="contained"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>
        </Container>
      </Box>
    </>
  );
};

LinkedinAccounts.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default LinkedinAccounts;
