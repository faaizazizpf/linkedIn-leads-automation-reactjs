import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "react-query";
import PerfectScrollbar from "react-perfect-scrollbar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Menu,
  Input,
  OutlinedInput,
} from "@mui/material";
import { Download as DownloadIcon } from "../icons/download";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Search as SearchIcon } from "../icons/search";
import { useFormik } from "formik";
import {
  userRegisterUrl,
  userRetrieveDestroyUrl,
  userLoginAsUrl,
  whitelabelsListUrl,
  generateSSLListUrl,
} from "../config";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../features/profile/profileSlice";
import Dropzone from 'react-dropzone';
import NextImage from 'next/image';
import domainInstructions from '../public/domain-whitelabeling.png';


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Whitelabels = () => {
  const [alert, setAlert] = useState("");
  const router = useRouter();
  const user = useSelector(selectProfile);
  const [open, setOpen] = useState(false);
  const [whitelabels, setWhitelabels] = useState([]);
  const [selectedWhitelabel, setSelectedWhitelabel] = useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const actionMenuOpen = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dnsAndSslModalOpen, setDnsAndSslModalOpen] = useState(false);
  const [dnsAndSslAlert, setDnsAndSslAlert] = useState("");
  const [dnsAndSslModalButtonDisabled, setDnsAndSslModalButtonDisabled] = useState(false);
  const [logo, setLogo] = useState({});
  const [favicon, setFavicon] = useState({});
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onLogoDrop = (acceptedFiles) => {
    if (!acceptedFiles[0].name.match(/.(jpg|jpeg|png)$/i)) return

    setLogo({
      name: acceptedFiles[0].name,
      file: acceptedFiles[0],
    })
  }
  const onFaviconDrop = (acceptedFiles) => {
    if (!acceptedFiles[0].name.match(/.(jpg|jpeg|png|ico)$/i)) return

    setFavicon({
      name: acceptedFiles[0].name,
      file: acceptedFiles[0],
    })
  }
  const formik = useFormik({
    initialValues: {
      name: "",
      domain: "",
      primary_color: "#2196F3",
      primary_dark_color: "#0B79D0",
      theme_color: "#FFFFFF",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(150).required("Name is required"),
      domain: Yup.string().required("Domain is required"),
      primary_color: Yup.string().required("Primary Color is required").max(7),
      primary_dark_color: Yup.string()
        .required("Primary Dark/Hover Color is required")
        .max(7),
      theme_color: Yup.string().required("Theme Color is required").max(7),
    }),
    onSubmit: async (values, { setSubmitting }) => {

      if (!logo || !logo.name || !favicon || !favicon.name) return

      const formData = new FormData();
      Object.keys(values).map((value) => {
        formData.append(value, values[value])
      })

      formData.append("logo", logo.file)
      formData.append("favicon", favicon.file)
      console.log(formData)
      const config2 = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        },
      }

      try {
        await createResource.mutateAsync({
          values: formData,
          url: whitelabelsListUrl,
          config2: config2,
        });
        setAddNewForm(false);
        setLogo({});
        setFavicon({});
        whitelabelsRefetch();
      } catch (err) {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.name
        ) {
          setAlert(err.response.data.name);
          setTimeout(() => setAlert(""), 5000);
        } else if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.email
        ) {
          setAlert(err.response.data.email);
          setTimeout(() => setAlert(""), 5000);
        } else if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.password
        ) {
          setAlert(err.response.data.password);
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
    isFetching: whitelabelsFetching,
    refetch: whitelabelsRefetch,
    isError: whitelabelsIsError,
    data: whitelabelsList,
  } = useQuery(
    ["whitelabels"],
    () => axios.get(`${whitelabelsListUrl}`, config).then((res) => res.data),
    { enabled: !!user.token }
  );

  const createResource = useMutation(({ url, values, config2 }) =>
    axios.post(url, values, config2 ? config2 : config)
  );

  const deleteResource = useMutation(({ url }) => axios.delete(url, config));

  useEffect(() => {
    if (!whitelabelsList) return;
    setWhitelabels(whitelabelsList);
  }, [whitelabelsList]);

  return (
    <>
      <Head>
        <title>Whitelabel | Newson</title>
      </Head>
      <Box
        // component="main"
        sx={{
          py: 2,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <Box
              sx={{
                alignItems: "center",
                display: !addNewForm ? "flex" : "block",
                justifyContent: "space-between",
                flexWrap: "wrap",
                m: -1,
              }}
            >
              <Typography sx={{ m: 1 }} variant="h4">
                {!addNewForm ? "Whitelabels" : null}
              </Typography>

              {!addNewForm ? (
                <>
                  <Box sx={{ m: 1, display: "flex" }}>
                    {/* <Button
                      startIcon={<DownloadIcon fontSize="small" />}
                      sx={{ mr: 1 }}
                    >
                      Export
                    </Button> */}

                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setAddNewForm(true)}
                    >
                      Add New Whitelabel
                    </Button>
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
                      placeholder="Search Whitelabel"
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
                      subheader="Create A New WhiteLabel"
                      title="New Whitelabel"
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
                          formik.touched.name && formik.errors.name
                        )}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        label="Name"
                        placeholder="Business Name"
                        margin="normal"
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="name"
                        value={formik.values.name}
                        variant="outlined"
                      />
                      <TextField
                        error={Boolean(
                          formik.touched.domain && formik.errors.domain
                        )}
                        fullWidth
                        helperText={
                          formik.touched.domain && formik.errors.domain
                        }
                        label="Domain"
                        placeholder="example.com"
                        margin="normal"
                        name="domain"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="domain"
                        value={formik.values.domain}
                        variant="outlined"
                      />
                      <Box sx={{ display: "flex", gap: "10px", mt: "10px" }}>
                        <FormControl sx={{ mr: "auto" }}>
                          <InputLabel htmlFor="outlined-adornment-primary-color">
                            Primary Color
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-primary-color"
                            helperText={
                              formik.touched.primary_color &&
                              formik.errors.primary_color
                            }
                            error={Boolean(
                              formik.touched.primary_color &&
                                formik.errors.primary_color
                            )}
                            value={formik.values.primary_color}
                            name="primary_color"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            startAdornment={
                              <InputAdornment
                                position="start"
                                sx={{
                                  background: `${
                                    !formik.values.primary_color ||
                                    !formik.values.primary_color.length
                                      ? "#2196F3"
                                      : formik.values.primary_color
                                  }`,
                                  py: "16px",
                                  px: "16px",
                                  borderRadius: "7px",
                                }}
                              ></InputAdornment>
                            }
                            label="Primary Color"
                          />
                        </FormControl>
                        <FormControl>
                          <InputLabel htmlFor="outlined-adornment-primary-dark-hover-color">
                            Primary Dark/Hover Color
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-primary-dark-hover-color"
                            helperText={
                              formik.touched.primary_dark_color &&
                              formik.errors.primary_dark_color
                            }
                            error={Boolean(
                              formik.touched.primary_dark_color &&
                                formik.errors.primary_dark_color
                            )}
                            value={formik.values.primary_dark_color}
                            name="primary_dark_color"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            startAdornment={
                              <InputAdornment
                                position="start"
                                sx={{
                                  background: `${
                                    !formik.values.primary_dark_color ||
                                    !formik.values.primary_dark_color.length
                                      ? "#2196F3"
                                      : formik.values.primary_dark_color
                                  }`,
                                  py: "16px",
                                  px: "16px",
                                  borderRadius: "7px",
                                }}
                              ></InputAdornment>
                            }
                            label="Primary Dark/Hover Color"
                          />
                        </FormControl>
                        <FormControl sx={{ ml: "auto" }}>
                          <InputLabel htmlFor="outlined-adornment-theme-color">
                            Theme Color
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-theme-color"
                            helperText={
                              formik.touched.theme_color &&
                              formik.errors.theme_color
                            }
                            error={Boolean(
                              formik.touched.theme_color &&
                                formik.errors.theme_color
                            )}
                            value={formik.values.theme_color}
                            name="theme_color"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            startAdornment={
                              <InputAdornment
                                position="start"
                                sx={{
                                  background: `${
                                    !formik.values.theme_color ||
                                    !formik.values.theme_color.length
                                      ? "#FFFFFF"
                                      : formik.values.theme_color
                                  }`,
                                  py: "16px",
                                  px: "16px",
                                  borderRadius: "7px",
                                }}
                              ></InputAdornment>
                            }
                            label="Theme Color"
                          />
                        </FormControl>
                      </Box>
                      <Box sx={{ display: "flex", gap: "20px", my: "15px" }}>
                      <Box
                          sx={{
                            display: "flex",
                            borderRadius: "8px",
                            alignItems: "center",
                            background: "rgb(240, 242, 245)",
                            p: "23px",
                            width: "50%",
                          }}
                        >
                          <Dropzone onDrop={onLogoDrop}>
                            {({ getRootProps, getInputProps }) => (
                              <Box sx={{ mx: "auto" }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Typography
                                  sx={{ textAlign: "center" }}
                                  variant="span"
                                >
                                  Drag and drop logo here, or click to select
                                  logo
                                  {logo && logo.name ? (
                                    <p>{logo.name}</p>
                                  ) : null}
                                </Typography>
                              </Box>
                            )}
                          </Dropzone>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            borderRadius: "8px",
                            alignItems: "center",
                            background: "rgb(240, 242, 245)",
                            p: "23px",
                            width: "50%",
                          }}
                        >
                          <Dropzone onDrop={onFaviconDrop}>
                            {({ getRootProps, getInputProps }) => (
                              <Box sx={{ mx: "auto" }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Typography
                                  sx={{ textAlign: "center" }}
                                  variant="span"
                                >
                                  Drag and drop favicon here, or click to select
                                  favicon
                                  {favicon && favicon.name ? (
                                    <p>{favicon.name}</p>
                                  ) : null}
                                </Typography>
                              </Box>
                            )}
                          </Dropzone>
                        </Box>
                      </Box>
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
                          setLogo({});
                          setFavicon({});
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
                        Add New Whitelabel
                      </Button>
                    </Box>
                  </Card>
                </form>
              )}
            </Box>
            <Box sx={{ mt: "30px" }}>
              <PerfectScrollbar>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Domain</TableCell>
                        <TableCell>SSL</TableCell>
                        <TableCell>Users</TableCell>
                        <TableCell>Linkedin Accounts</TableCell>
                        <TableCell>Campaigns</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {whitelabels.map((whitelabel) => (
                        <TableRow hover key={`whitelabel-row-${whitelabel.id}`}>
                          <TableCell>{whitelabel.name}</TableCell>
                          <TableCell>{whitelabel.domain}</TableCell>
                          <TableCell>{whitelabel.ssl_generated ? "YES" : "NO"}</TableCell>
                          <TableCell>{whitelabel.users}</TableCell>
                          <TableCell>{whitelabel.linkedin_accounts}</TableCell>
                          <TableCell>{whitelabel.campaigns}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={
                                actionMenuOpen ? "long-menu" : undefined
                              }
                              aria-expanded={
                                actionMenuOpen ? "true" : undefined
                              }
                              aria-haspopup="true"
                              onClick={handleClick}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              MenuListProps={{
                                "aria-labelledby": "long-button",
                              }}
                              anchorEl={anchorEl}
                              open={actionMenuOpen}
                              key={`whitelabel-actions-${whitelabel.id}`}
                              onClose={handleClose}
                              PaperProps={{
                                style: {
                                  maxHeight: 48 * 4.5,
                                  width: "20ch",
                                },
                              }}
                            >
                              <MenuItem
                                data-key={`preview-whitelabel-${whitelabel.id}`}
                                onClick={() =>
                                  window
                                    .open(
                                      `http://${whitelabel.domain}`,
                                      "_blank"
                                    )
                                    .focus()
                                }
                              >
                                Preview
                              </MenuItem>
                              {!whitelabel.ssl_generated ? (
                                <MenuItem
                                  data-key={`dns-and-ssl-whitelabel-${whitelabel.id}`}
                                  onClick={() => {
                                    setSelectedWhitelabel(whitelabel)
                                    setDnsAndSslModalOpen(true)
                                  }}
                                >
                                  Dns & Ssl
                                </MenuItem>
                              ) : null}
                              <MenuItem
                                data-key={`delete-whitelabel-${whitelabel.id}`}
                                onClick={() => {
                                  setSelectedWhitelabel(whitelabel);
                                  setDeleteModalOpen(true);
                                }}
                              >
                                Delete
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </PerfectScrollbar>
              <TablePagination
                component="div"
                count={1}
                onPageChange={() => null}
                onRowsPerPageChange={() => null}
                page={1}
                rowsPerPage={10}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Box>
        </Container>
      </Box>
      <Modal
        open={dnsAndSslModalOpen}
        aria-labelledby="dns-and-generating-ssl"
      >
        <Box sx={style}>
          <Typography id="dns-and-generating-ssl" variant="h5" component="h2">
            Domain & Dns
          </Typography>
          {dnsAndSslAlert ? (
            <Alert sx={{ my: "10px" }} severity="error">
              {dnsAndSslAlert}
            </Alert>
          ) : null}
          <Typography
            id="dns-and-generating-ssl"
            variant="p"
            component="p"
            sx={{ mt: "10px" }}
          >
            Please create a A record subdomain and add this ip address <strong>13.40.105.222</strong> into your subdomain A record value.
          </Typography>
          <Typography
            id="dns-and-generating-ssl"
            variant="p"
            component="p"
            sx={{ mt: "10px" }}
          >
            Here is the example screenshot of adding this in cpanel.
          </Typography>

          <NextImage alt="Domain Instruction" src={domainInstructions}/>

          <Box sx={{ mt: 1, textAlign: "right" }}>
            <Button
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => {
                setDnsAndSslModalOpen(false);
                setSelectedWhitelabel(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={dnsAndSslModalButtonDisabled}
              onClick={async () => {
                try {
                  setDnsAndSslModalButtonDisabled(true)
                  await createResource.mutateAsync({
                    url: `${generateSSLListUrl}${selectedWhitelabel.id}/`,
                  });
                  setSelectedWhitelabel(null);
                  whitelabelsRefetch();
                  setDnsAndSslModalOpen(false);
                } catch (err) {
                  console.log(err)
                  setDnsAndSslAlert("SSL Generation Failed,  Please Make Sure The Domain Is Created And Mounted To The Above IP Address.");
                  setTimeout(() => setDnsAndSslAlert(""), 5000);
                } finally {
                  setDnsAndSslModalButtonDisabled(false)
                }
                
              }}
              sx={{ mr: 1 }}
            >
              Domain Created Generate SSL
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedWhitelabel(null);
        }}
        aria-labelledby="add-search"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-search" variant="h5" component="h2">
            Are You Absolutely Sure?
          </Typography>
          <Typography
            id="add-search"
            variant="p"
            component="p"
            sx={{ mt: "10px" }}
          >
            This action cannot be undone. This will permanently delete the
            current record and data associated with it
          </Typography>
          <Box sx={{ mt: 1, textAlign: "right" }}>
            <Button
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
              onClick={() => {
                setSelectedWhitelabel(null);
                setDeleteModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                await deleteResource.mutateAsync({
                  url: `${whitelabelsListUrl}${selectedWhitelabel.id}/`,
                });
                setSelectedWhitelabel(null);
                whitelabelsRefetch();
                setDeleteModalOpen(false);
              }}
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

Whitelabels.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Whitelabels;
