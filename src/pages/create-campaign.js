import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Pagination,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Avatar,
  Link,
  Divider,
  IconButton,
  Badge,
  CardHeader,
  Modal,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Switch,
  Slider,
  Autocomplete,
  Menu,
  Stack,
  LinearProgress,
  AvatarGroup,
} from "@mui/material";

import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { Download as DownloadIcon } from "../icons/download";
import { Search as SearchIcon } from "../icons/search";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUser,
  faInbox,
  faReplyAll,
  faUsers,
  faEnvelope,
  faHeart,
  faAt,
} from "@fortawesome/free-solid-svg-icons";
import DeleteIcon from "@mui/icons-material/Delete";
import { DashboardLayout } from "../components/dashboard-layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useQuery, useMutation } from "react-query";

import NextLink from "next/link";
import { useRouter } from "next/router";
import AddCircle from "@mui/icons-material/AddCircle";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddIcon from "@mui/icons-material/Add";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MailIcon from "@mui/icons-material/Mail";
import LinkIcon from "@mui/icons-material/Link";
import GroupIcon from "@mui/icons-material/Group";
import { useState, useMemo, useEffect } from "react";
import {
  campaignListCreateUrl,
  triggerCampaignUrl,
  campaignSequenceListCreateUrl,
  linkedinAccountsListUrl,
  campaignLinkedinAccountsCreateUrl,
  apiHost,
} from "../config";
import { useSelector } from "react-redux";
import { selectProfile } from "../features/profile/profileSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";

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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  m: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        //   backgroundColor: theme.palette.mode === 'dark' ? '#10B981' : '#10B981',
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const ProspectSlider = styled(Slider)({
  // color: '#52af77',
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Campaigns = () => {
  const router = useRouter();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sequenceModalOpen, setSequenceModalOpen] = useState(false);
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [selectedLinkedinAccounts, setSelectedLinkedinAccounts] = useState([]);
  const [sequenceListOptions, setSequenceListOptions] = useState([
    {
      key: "send_connection_request",
      title: "Send Connection Request",
      icon: <PersonAddAltIcon />,
    },
    { key: "send_message", title: "Send Message", icon: <MapsUgcIcon /> },
    { key: "send_inmail", title: "Send InMail", icon: <ForwardToInboxIcon /> },
    { key: "like_3_posts", title: "Like 3 Posts", icon: <ThumbUpIcon /> },
    { key: "follow", title: "Follow", icon: <AddIcon /> },
    {
      key: "endorse_top_5_skills",
      title: "Endorse Top 5 Skills",
      icon: <VolunteerActivismIcon />,
    },
    { key: "send_email", title: "Send Email", icon: <MailIcon /> },
  ]);
  const [sequenceList, setSequenceList] = useState([
    // { key: "crawl_total_prospects", title: "Crawl Prospects", icon: <PersonSearchIcon /> },
    // { key: "send_connection_request", title: "Send Connection Request", icon: <PersonAddAltIcon /> },
    // { key: "send_follow_up_message", title: "Send Follow Up Message", icon: <MapsUgcIcon /> },
    // { key: "send_inmail", title: "Send InMail", icon: <ForwardToInboxIcon /> },
  ]);
  const [searchList, setSearchList] = useState([
    // { search_url: "https://", crawl_total_prospects: 2000 },
  ]);
  const user = useSelector(selectProfile);
  const formik = useFormik({
    initialValues: {
      name: "",
      search_url: "",
      connection_requests_per_day: 10,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(500).required("Name is required"),
      connection_requests_per_day: Yup.number().min(1).max(100).default(10),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log(searchList, selectedLinkedinAccounts);
        if (!selectedLinkedinAccounts.length) return;
        if (!searchList.length) return;

        values.search_url = searchList[0].search_url;
        values.crawl_total_prospects = searchList[0].crawl_total_prospects;

        const resp = await createResource.mutateAsync({
          values,
          url: campaignListCreateUrl,
        });

        sequenceList.map(async (item, idx) => {
          const payload = {
            campaign: resp.data.id,
            delay_in_days: item.delay_in_days,
            delay_in_hours: item.delay_in_hours,
            step: item.key,
            order: idx,
          };

          if (item.key === "send_connection_request") {
            payload.note = `${item.note}`;
          } else if (item.key === "send_message") {
            payload.message = `${item.message}`;
          } else if (item.key === "send_inmail") {
            payload.inmail_subject = item.inmail_subject;
            payload.inmail_message = item.inmail_message;
          } else if (item.key === "send_email") {
            payload.google_account = item.google_account;
            payload.smtp_account = item.smtp_account;
            payload.from_email = item.from_email;
            payload.email_subject = item.email_subject;
            payload.email_message = item.email_message;
          }

          await createResource.mutateAsync({
            values: payload,
            url: `${campaignSequenceListCreateUrl}`,
          });
        });
  
        await Promise.all(selectedLinkedinAccounts.map(async (linkedinAccount) => {
          const payload = {
            linkedin_account: linkedinAccount.id,
            campaign: resp.data.id,
          };

          await createResource.mutateAsync({
            values: payload,
            url: `${campaignLinkedinAccountsCreateUrl}`,
          });
        }));

        await createResource.mutateAsync({
          values: {},
          url: `${triggerCampaignUrl}${resp.data.id}/`,
        });

        resetForm();
        router.push("/campaigns");
      } catch (err) {
        console.log(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const searchFormik = useFormik({
    initialValues: {
      search_url: "",
      crawl_total_prospects: 25,
    },
    validationSchema: Yup.object({
      search_url: Yup.string().url().required(),
      crawl_total_prospects: Yup.number().min(25).max(2000).default(25),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSearchList([...searchList, values]);
      setSubmitting(false);
      resetForm();
      setSearchModalOpen(false);
    },
  });

  const stepFormik = useFormik({
    initialValues: {
      step: 1,
      delay_in_days: 0,
      delay_in_hours: 1,
      connection_request_with_note: false,
      note: "",
      message: "",
      inmail_subject: "",
      inmail_message: "",
      from_email: "",
      email_subject: "",
      email_message: "",
    },
    validationSchema: Yup.object({
      step: Yup.number(),
      delay_in_days: Yup.number().required(),
      delay_in_hours: Yup.number().min(1).max(48).required(),
      connection_request_with_note: Yup.boolean().default(false),
      note: Yup.string().max(299).when("connection_request_with_note", {
        is: true,
        then: Yup.string().required(),
      }),
      message: Yup.string().max(7999).when("step", {
        is: 1,
        then: Yup.string().required(),
      }),
      inmail_subject: Yup.string().max(200).when("step", {
        is: 2,
        then: Yup.string().required(),
      }),
      inmail_message: Yup.string().max(486).when("step", {
        is: 2,
        then: Yup.string().required(),
      }),
      email_account: Yup.string().when("step", {
        is: 6,
        then: Yup.string().required(),
      }),
      email_subject: Yup.string().max(200).when("step", {
        is: 6,
        then: Yup.string().required(),
      }),
      from_email: Yup.string().email().max(200),
      email_message: Yup.string().max(700).when("step", {
        is: 6,
        then: Yup.string().required(),
      }),
    }),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const currentStep = sequenceListOptions[values.step];

      if (currentStep.key === "send_connection_request") {
        currentStep.description = `With Note: ${
          values.connection_request_with_note ? "on" : "off"
        }, ${
          values.connection_request_with_note
            ? `Note: ${values.note.slice(0, 60)}`
            : ""
        }`;
        currentStep.note = `${values.note}`;
      }

      if (currentStep.key === "send_message") {
        currentStep.description = `Message: ${values.message.slice(0, 60)}`;
        currentStep.message = `${values.message}`;
      }

      if (currentStep.key === "send_inmail") {
        currentStep.inmail_subject = values.inmail_subject;
        currentStep.inmail_message = values.inmail_message;
        currentStep.description = `Subject: ${values.inmail_subject.slice(
          0,
          60
        )}, Body: ${values.inmail_message.slice(0, 60)}`;
      }

      if (currentStep.key === "like_3_posts") {
        currentStep.description = `Description: Like The Latest 3 Posts`;
      }

      if (currentStep.key === "follow") {
        currentStep.description = `Description: Follow The User Linkedin Account`;
      }

      if (currentStep.key === "endorse_top_5_skills") {
        currentStep.description = `Description: Endorse The User 5 Top Skills`;
      }

      if (currentStep.key === "endorse_top_5_skills") {
        currentStep.description = `Description: Endorse The User 5 Top Skills`;
      }

      if (currentStep.key === "send_email") {
        if (
          values.email_account <=
          user.details.smtp_connected_accounts.length - 1
        ) {
          currentStep.smtp_account = values.email_account;
        } else {
          currentStep.google_account = values.email_account;
        }
        currentStep.from_email = values.from_email;
        currentStep.email_subject = values.email_subject;
        currentStep.email_message = values.email_message;
        currentStep.description = `Subject: ${values.email_subject.slice(
          0,
          60
        )}, Body: ${values.email_message.slice(0, 60)}`;
      }

      currentStep.delay_in_hours = values.delay_in_hours;
      currentStep.delay_in_days = values.delay_in_days;

      setSequenceModalOpen(false);
      setSequenceList([...sequenceList, currentStep]);
      setSubmitting(false);
      resetForm();
    },
  });

  const whichFieldToAddPersonalizationField = (stepFormik, key) => {
    if (
      stepFormik.values.step === 0 &&
      stepFormik.values.connection_request_with_note
    ) {
      return ["note", `${stepFormik.values.note}${key}`];
    } else if (stepFormik.values.step === 1) {
      return ["message", `${stepFormik.values.message}${key}`];
    } else if (stepFormik.values.step === 2) {
      return ["inmail_message", `${stepFormik.values.inmail_message}${key}`];
    } else if (stepFormik.values.step === 6) {
      return ["email_message", `${stepFormik.values.email_message}${key}`];
    }

    return null;
  };

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

  const { data: linkedinAccountsList } = useQuery(
    ["linkedinAccounts"],
    () =>
      axios
        .get(
          `${linkedinAccountsListUrl}?ready_for_use=true&connected=true`,
          config
        )
        .then((res) => res.data),
    { enabled: !!user.token }
  );

  useEffect(() => {
    if (!linkedinAccountsList) return;
    setLinkedinAccounts(linkedinAccountsList);
  }, [linkedinAccountsList]);

  return (
    <>
      <Head>
        <title>Create Campaign | {user.client.name}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <Box
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                m: -1,
              }}
            >
              <Typography sx={{ m: 1 }} variant="h5">
                Create A Campaign
              </Typography>
              <Box sx={{ mt: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: "flex" }}>
                        <TextField
                          error={Boolean(
                            formik.touched.name && formik.errors.name
                          )}
                          fullWidth
                          helperText={formik.touched.name && formik.errors.name}
                          label="Name"
                          placeholder="Assets Manager"
                          margin="normal"
                          name="name"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="text"
                          value={formik.values.name}
                          variant="outlined"
                          size="small"
                          sx={{ mr: "10px" }}
                        />
                        <Autocomplete
                          multiple
                          sx={{ mt: "17px" }}
                          fullWidth
                          options={linkedinAccounts}
                          value={selectedLinkedinAccounts}
                          onChange={(event, newValue) => {
                            setSelectedLinkedinAccounts(newValue);
                          }}
                          getOptionLabel={(option) => option.name}
                          variant="contained"
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Linkedin Accounts"
                              placeholder="Select Your Linkedin Accounts"
                            />
                          )}
                        />
                        {/* <TextField
                                                    sx={{ ml: "10px" }}
                                                    error={Boolean(formik.touched.search_url && formik.errors.search_url)}
                                                    fullWidth
                                                    helperText={formik.touched.search_url && formik.errors.search_url}
                                                    label="Search Url"
                                                    placeholder="https://www.linkedin.com/search/results/people/?keywords=example"
                                                    margin="normal"
                                                    name="search_url"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    type="text"
                                                    value={formik.values.search_url}
                                                    variant="outlined"
                                                /> */}
                      </Box>
                      <Box>
                        <Box sx={{ py: "10px" }}>
                          <FormGroup sx={{ mb: "7px" }}>
                            <FormControlLabel
                              sx={{ m: "0px" }}
                              control={<IOSSwitch sx={{ mr: "7px" }} />}
                              label="LinkedIn Premium accounts only"
                            />
                          </FormGroup>
                          <FormGroup sx={{ mb: "7px" }}>
                            <FormControlLabel
                              sx={{ m: "0px" }}
                              control={<IOSSwitch sx={{ mr: "7px" }} />}
                              label="Enable link tracking"
                            />
                          </FormGroup>
                          <FormGroup sx={{ mb: "7px" }}>
                            <FormControlLabel
                              sx={{ m: "0px" }}
                              control={<IOSSwitch sx={{ mr: "7px" }} />}
                              label="Include people I talked to before"
                            />
                          </FormGroup>
                          <FormGroup sx={{ mb: "7px" }}>
                            <FormControlLabel
                              sx={{ m: "0px" }}
                              control={<IOSSwitch sx={{ mr: "7px" }} />}
                              label="Email only campaign"
                            />
                          </FormGroup>
                        </Box>

                        <Typography
                          id="non-linear-slider"
                          gutterBottom
                          sx={{ ml: "8px" }}
                        >
                          Search
                          <IconButton
                            aria-label="addSequence"
                            color="primary"
                            onClick={() => setSearchModalOpen(true)}
                          >
                            <AddCircle />
                          </IconButton>
                        </Typography>
                        <Box>
                          {!searchList.length ? (
                            <Typography
                              id="non-linear-slider"
                              gutterBottom
                              sx={{ ml: "8px", fontSize: "15px" }}
                            >
                              No Search Urls...
                            </Typography>
                          ) : null}

                          {searchList.map((search, idx) => (
                            <Box
                              sx={{
                                boxShadow: 4,
                                px: 1,
                                py: 1,
                                mb: 1,
                                display: "flex",
                              }}
                              key={`${search.search_url}-${idx}`}
                              data-key={`${search.search_url}-${idx}`}
                            >
                              <Box sx={{ display: "flex" }}>
                                <LinkIcon color="primary" />
                                <Typography
                                  variant="p"
                                  component="span"
                                  sx={{
                                    ml: "7px",
                                    maxWidth: "600px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {search.search_url}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", ml: "150px" }}>
                                <GroupIcon color="primary" />
                                <Typography
                                  variant="p"
                                  component="span"
                                  sx={{
                                    ml: "7px",
                                  }}
                                >
                                  {search.crawl_total_prospects}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ mt: 5 }}>
                    <CardContent>
                      <Typography
                        id="non-linear-slider"
                        gutterBottom
                        sx={{ ml: "8px" }}
                      >
                        Sequence
                        <IconButton
                          aria-label="addSequence"
                          color="primary"
                          onClick={() => setSequenceModalOpen(true)}
                        >
                          <AddCircle />
                        </IconButton>
                      </Typography>
                      <DragDropContext
                        onDragEnd={(result) =>
                          // handleDragEnd(result, tasks, handleSaveCardDrag)
                          handleDragEnd(result)
                        }
                      >
                        <div className="relative flex flex-col flex-grow px-4 py-4 space-y-3 overflow-y-auto bg-white">
                          <div className="flex items-center w-full p-2 text-sm border rounded-md shadow-sm cursor-pointer select-none group">
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon sx={{ minWidth: "40px" }}>
                                  <PersonSearchIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Crawl Prospects"
                                  secondary={
                                    <>
                                      <Box
                                        sx={{
                                          fontSize: "12px",
                                          backgroundColor: `${user.client.primary_color}`,
                                          color: "white",
                                          borderRadius: "10px",
                                          px: 1,
                                          textAlign: "center",
                                          width: "max-content",
                                        }}
                                      >
                                        Step 1
                                      </Box>
                                      {
                                        "Crawl all the prospects from campaign search url."
                                      }
                                    </>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          </div>
                        </div>
                        {sequenceList.map((item, index) => {
                          return (
                            <Droppable droppableId={item.key} key={item.key}>
                              {(provided, snapshot) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="relative flex flex-col flex-grow px-4 py-4 space-y-3 overflow-y-auto bg-white"
                                  style={{
                                    background: snapshot.isDraggingOver
                                      ? "lightblue"
                                      : "white",
                                  }}
                                >
                                  <Draggable
                                    key={`${item.key}_item`}
                                    draggableId={`${item.key}_item`}
                                    index={index}
                                  >
                                    {(provided2, snapshot2) => (
                                      <div
                                        className="flex items-center w-full p-2 text-sm border rounded-md shadow-sm cursor-pointer select-none group"
                                        ref={provided2.innerRef}
                                        {...provided2.draggableProps}
                                        {...provided2.dragHandleProps}
                                        style={{
                                          background: snapshot2.isDraggingOver
                                            ? "lightblue"
                                            : "white",
                                          ...provided2.draggableProps.style,
                                        }}
                                      >
                                        <ListItem disablePadding>
                                          <ListItemButton>
                                            <ListItemIcon
                                              sx={{ minWidth: "40px" }}
                                            >
                                              {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={item.title}
                                              secondary={
                                                <>
                                                  <Box
                                                    sx={{
                                                      fontSize: "12px",
                                                      backgroundColor: `${user.client.primary_color}`,
                                                      color: "white",
                                                      borderRadius: "10px",
                                                      px: 1,
                                                      textAlign: "center",
                                                      width: "max-content",
                                                    }}
                                                  >
                                                    Step {index + 2}
                                                  </Box>
                                                  Delay In Hours:{" "}
                                                  {item.delay_in_hours},{" "}
                                                  {item.description}
                                                </>
                                              }
                                            />
                                            <ListItemIcon
                                              sx={{ minWidth: "40px" }}
                                              onClick={() => {
                                                const newSequenceList = [
                                                  ...sequenceList,
                                                ];
                                                newSequenceList.splice(
                                                  index,
                                                  1
                                                );
                                                setSequenceList(
                                                  newSequenceList
                                                );
                                              }}
                                            >
                                              <DeleteIcon />
                                            </ListItemIcon>
                                          </ListItemButton>
                                        </ListItem>
                                      </div>
                                    )}
                                  </Draggable>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          );
                        })}
                      </DragDropContext>
                    </CardContent>
                  </Card>
                </form>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                <Button
                  color="info"
                  variant="outlined"
                  size="large"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    router.push("/campaigns");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={formik.isSubmitting}
                  onClick={formik.handleSubmit}
                  sx={{ ml: 1 }}
                  size="large"
                >
                  Create Campaign
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Modal open={searchModalOpen} aria-labelledby="add-search">
        <Box sx={style}>
          <Typography id="add-search" variant="h5" component="h2">
            Add Search
          </Typography>
          <form onSubmit={searchFormik.handleSubmit}>
            <FormControl fullWidth sx={{ my: 3 }}>
              <TextField
                error={Boolean(
                  searchFormik.touched.search_url &&
                    searchFormik.errors.search_url
                )}
                helperText={
                  searchFormik.touched.search_url &&
                  searchFormik.errors.search_url
                }
                onBlur={searchFormik.handleBlur}
                onChange={searchFormik.handleChange}
                value={searchFormik.values.search_url}
                placeholder="https://www.linkedin.com/sales/search/people?query=...."
                label="Linkedin Search Url"
                name="search_url"
                size="small"
              />

              <Box sx={{ mt: 2 }}>
                <Typography
                  id="non-linear-slider"
                  gutterBottom
                  sx={{ ml: "2px" }}
                >
                  Prospects To Crawl
                </Typography>

                <ProspectSlider
                  valueLabelDisplay="auto"
                  aria-label="pretto slider"
                  min={25}
                  step={25}
                  max={2000}
                  sx={{ mx: "10px" }}
                  name="crawl_total_prospects"
                  onChange={searchFormik.handleChange}
                  value={searchFormik.values.crawl_total_prospects}
                />
              </Box>
            </FormControl>

            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button
                color="primary"
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => {
                  setSearchModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={searchFormik.isSubmitting}
                sx={{ mr: 1 }}
              >
                Add
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Modal
        open={sequenceModalOpen}
        aria-labelledby="add-search"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="add-search" variant="h5" component="h2">
            Add Sequence Step
          </Typography>
          <form onSubmit={stepFormik.handleSubmit}>
            <FormControl fullWidth sx={{ my: 2 }}>
              <Box sx={{ display: "flex", mt: "20px" }}>
                <InputLabel id="step-label" size="small">
                  Step
                </InputLabel>
                <Select
                  labelId="step-label"
                  name="step"
                  value={stepFormik.values.step}
                  label="Step"
                  fullWidth
                  size="small"
                  onChange={stepFormik.handleChange}
                  // onChange={(e) => { setSelectedSequenceOption({ ...sequenceListOptions[e.target.value] }); setSelectedSequenceOptionIdx(e.target.value) }}
                >
                  {sequenceListOptions.map((sequenceOption, idx) => {
                    if (sequenceOption.key === "send_connection_request") {
                      return (
                        <MenuItem
                          value={idx}
                          disabled={
                            sequenceList.filter(
                              (step) => step.key === "send_connection_request"
                            ).length
                          }
                        >
                          {sequenceOption.title}
                        </MenuItem>
                      );
                    } else if (sequenceOption.key === "send_email") {
                      return (
                        <MenuItem
                          value={idx}
                          disabled={
                            !user.details.smtp_connected_accounts.length &&
                            !user.details.google_connected_accounts.length
                          }
                        >
                          {sequenceOption.title}
                        </MenuItem>
                      );
                    }

                    return (
                      <MenuItem value={idx} key={`sequence-option-${idx}`}>
                        {sequenceOption.title}
                      </MenuItem>
                    );
                  })}
                </Select>
                <TextField
                  error={Boolean(
                    stepFormik.touched.delay_in_days &&
                      stepFormik.errors.delay_in_days
                  )}
                  helperText={
                    stepFormik.touched.delay_in_days &&
                    stepFormik.errors.delay_in_days
                  }
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  value={stepFormik.values.delay_in_days}
                  label="Delay In Days"
                  type="number"
                  name="delay_in_days"
                  size="small"
                  sx={{ mx: "5px" }}
                />
                <TextField
                  error={Boolean(
                    stepFormik.touched.delay_in_hours &&
                      stepFormik.errors.delay_in_hours
                  )}
                  helperText={
                    stepFormik.touched.delay_in_hours &&
                    stepFormik.errors.delay_in_hours
                  }
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  value={stepFormik.values.delay_in_hours}
                  label="Delay In Hours"
                  type="number"
                  name="delay_in_hours"
                  size="small"
                />
              </Box>
            </FormControl>

            {stepFormik.values.step === 0 ? (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={stepFormik.values.connection_request_with_note}
                      value={stepFormik.values.connection_request_with_note}
                      onChange={stepFormik.handleChange}
                      name="connection_request_with_note"
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Connection Request With Note"
                />

                {stepFormik.values.connection_request_with_note ? (
                  <TextField
                    error={Boolean(
                      stepFormik.touched.note && stepFormik.errors.note
                    )}
                    helperText={
                      stepFormik.touched.note && stepFormik.errors.note
                    }
                    onBlur={stepFormik.handleBlur}
                    onChange={stepFormik.handleChange}
                    value={stepFormik.values.note}
                    label="Note"
                    multiline
                    rows={3}
                    name="note"
                    placeholder="Hello, How Are You?"
                    fullWidth
                    size="small"
                    sx={{ my: "7px" }}
                  />
                ) : null}
              </>
            ) : null}

            {stepFormik.values.step === 1 ? (
              <>
                <TextField
                  error={Boolean(
                    stepFormik.touched.message && stepFormik.errors.message
                  )}
                  helperText={
                    stepFormik.touched.message && stepFormik.errors.message
                  }
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  value={stepFormik.values.message}
                  label="Message"
                  multiline
                  rows={3}
                  name="message"
                  placeholder="Hello, How Are You?"
                  fullWidth
                  size="small"
                  sx={{ my: "7px" }}
                />
              </>
            ) : null}

            {stepFormik.values.step === 2 ? (
              <>
                <TextField
                  error={Boolean(
                    stepFormik.touched.inmail_subject &&
                      stepFormik.errors.inmail_subject
                  )}
                  fullWidth
                  helperText={
                    stepFormik.touched.inmail_subject &&
                    stepFormik.errors.inmail_subject
                  }
                  label="Inmail Subject"
                  placeholder="Introduction"
                  margin="normal"
                  name="inmail_subject"
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  type="text"
                  value={stepFormik.values.inmail_subject}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  error={Boolean(
                    stepFormik.touched.inmail_message &&
                      stepFormik.errors.inmail_message
                  )}
                  helperText={
                    stepFormik.touched.inmail_message &&
                    stepFormik.errors.inmail_message
                  }
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  value={stepFormik.values.inmail_message}
                  label="InMail Message"
                  multiline
                  rows={3}
                  name="inmail_message"
                  placeholder="Hello, How Are You?"
                  fullWidth
                  size="small"
                  sx={{ my: "7px" }}
                />
              </>
            ) : null}

            {stepFormik.values.step === 6 ? (
              <>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel id="email-account-label">
                    Email Account
                  </InputLabel>
                  <Select
                    labelId="email-account-label"
                    name="email_account"
                    value={stepFormik.values.email_account}
                    // getOptionLabel={(option) => option.server}
                    label="Email Account"
                    fullWidth
                    size="small"
                    onChange={stepFormik.handleChange}
                  >
                    {user.details.smtp_connected_accounts.map(
                      (smtp_account, idx) => (
                        <MenuItem
                          key={`SMTP Account ${smtp_account.id}`}
                          value={idx}
                        >
                          {smtp_account.server} (SMTP
                          {smtp_account.ssl ? " - SSL/TLS" : ""})
                        </MenuItem>
                      )
                    )}
                    {user.details.google_connected_accounts.map(
                      (google_account, idx) => (
                        <MenuItem
                          key={`Google Account ${google_account.id}`}
                          value={
                            user.details.smtp_connected_accounts.length + idx
                          }
                        >
                          {google_account.name} ({google_account.email})
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>

                {stepFormik.values.email_account <=
                user.details.smtp_connected_accounts.length - 1 ? (
                  <TextField
                    size="small"
                    error={Boolean(
                      stepFormik.touched.from_email &&
                        stepFormik.errors.from_email
                    )}
                    fullWidth
                    helperText={
                      stepFormik.touched.from_email &&
                      stepFormik.errors.from_email
                    }
                    label="From Email"
                    placeholder="sales@example.com"
                    margin="normal"
                    name="from_email"
                    onBlur={stepFormik.handleBlur}
                    onChange={stepFormik.handleChange}
                    type="text"
                    value={stepFormik.values.from_email}
                    variant="outlined"
                    required
                  />
                ) : null}

                <TextField
                  size="small"
                  error={Boolean(
                    stepFormik.touched.email_subject &&
                      stepFormik.errors.email_subject
                  )}
                  fullWidth
                  helperText={
                    stepFormik.touched.email_subject &&
                    stepFormik.errors.email_subject
                  }
                  label="Email Subject"
                  placeholder="Introduction"
                  margin="normal"
                  name="email_subject"
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  type="text"
                  value={stepFormik.values.email_subject}
                  variant="outlined"
                />
                <TextField
                  size="small"
                  error={Boolean(
                    stepFormik.touched.email_message &&
                      stepFormik.errors.email_message
                  )}
                  helperText={
                    stepFormik.touched.email_message &&
                    stepFormik.errors.email_message
                  }
                  onBlur={stepFormik.handleBlur}
                  onChange={stepFormik.handleChange}
                  value={stepFormik.values.email_message}
                  label="Email Message"
                  multiline
                  rows={3}
                  name="email_message"
                  placeholder="Hello, How Are You?"
                  fullWidth
                  sx={{ my: "7px" }}
                />
              </>
            ) : null}

            {!whichFieldToAddPersonalizationField(stepFormik) ? null : (
              <Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[first_name]]"
                      )
                    )
                  }
                >
                  [[First Name]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[last_name]]"
                      )
                    )
                  }
                >
                  [[Last Name]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[name]]"
                      )
                    )
                  }
                >
                  [[Name]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[occupation]]"
                      )
                    )
                  }
                >
                  [[Occupation]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[current_company]]"
                      )
                    )
                  }
                >
                  [[Current Company]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[school_university]]"
                      )
                    )
                  }
                >
                  [[School University]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[bio]]"
                      )
                    )
                  }
                >
                  [[Bio]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[headline]]"
                      )
                    )
                  }
                >
                  [[Headline]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[location]]"
                      )
                    )
                  }
                >
                  [[Location]]
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    backgroundColor: `${user.client.primary_color}`,
                    color: "white",
                    borderRadius: "10px",
                    px: 1,
                    display: "inline-block",
                    ml: "7px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    stepFormik.setFieldValue(
                      ...whichFieldToAddPersonalizationField(
                        stepFormik,
                        "[[email]]"
                      )
                    )
                  }
                >
                  [[Email]]
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button
                color="primary"
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => {
                  setSequenceModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={stepFormik.isSubmitting}
                sx={{ mr: 1 }}
              >
                Add
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

Campaigns.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Campaigns;
