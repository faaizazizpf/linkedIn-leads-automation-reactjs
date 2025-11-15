import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useMemo, useEffect } from "react";
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
} from "@mui/material";
import { Download as DownloadIcon } from "../icons/download";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Search as SearchIcon } from "../icons/search";
import { useFormik } from "formik";
import {
  userRegisterUrl,
  userRetrieveDestroyUrl,
  userLoginAsUrl,
  usersListUrl,
} from "../config";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../features/profile/profileSlice";
import UserMenuOptions from "../components/userMenuOptions";

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

const Users = () => {
  const [alert, setAlert] = useState("");
  const [modalAlert, setModalAlert] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectProfile);
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addNewForm, setAddNewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const actionMenuOpen = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().max(150).required("Username is required"),
      email: Yup.string().required("Email is required").email(),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createResource.mutateAsync({
          values,
          url: `${userRegisterUrl}?whitelabel=${user.client.id}`,
        });
        setAddNewForm(false);
        usersRefetch();
      } catch (err) {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.username
        ) {
          setAlert(err.response.data.username);
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
    isFetching: usersFetching,
    refetch: usersRefetch,
    isError: usersIsError,
    data: usersList,
  } = useQuery(
    ["users"],
    () => axios.get(`${usersListUrl}`, config).then((res) => res.data),
    { enabled: !!user.token }
  );

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values, config)
  );

  const deleteResource = useMutation(({ url }) => axios.delete(url, config));

  useEffect(() => {
    if (!usersList) return;
    setUsers(usersList);
  }, [usersList]);

  return (
    <>
      <Head>
        <title>Connect Your User | Newson</title>
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
                {!addNewForm ? "Users" : null}
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
                      Add New User
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
                      placeholder="Search User"
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
                      subheader="Create A Brand New User"
                      title="New User"
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
                          formik.touched.email && formik.errors.email
                        )}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email"
                        placeholder="john@doe.com"
                        margin="normal"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
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
                        Add New User
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
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Plan</TableCell>
                        <TableCell>Linkedin Accounts</TableCell>
                        <TableCell>Campaigns</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow hover key={`user-row-${user.id}`}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{`${user.email}`}</TableCell>
                          <TableCell>
                            {!user.plan ? "Free" : user.plan}
                          </TableCell>
                          <TableCell>{user.linkedin_accounts}</TableCell>
                          <TableCell>{user.campaigns}</TableCell>
                          <TableCell>
                            <UserMenuOptions
                              onLoginAsUserClick={async () => {
                                const resp = await createResource.mutateAsync({
                                  url: `${userLoginAsUrl}${user.id}/`,
                                });
                                sessionStorage.setItem(
                                  "jwtToken",
                                  resp.data.access
                                );
                                router.reload("/");
                              }}
                              onDeleteUserClick={() => {
                                setSelectedUser(user);
                                setDeleteModalOpen(true);
                              }}
                            />
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
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
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
                setSelectedUser(null);
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
                  url: `${userRetrieveDestroyUrl}${selectedUser.id}/`,
                });
                setSelectedUser(null);
                usersRefetch();
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

Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Users;
