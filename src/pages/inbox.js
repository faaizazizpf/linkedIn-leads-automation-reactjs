import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { DashboardLayout } from "../components/dashboard-layout";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMutation } from "react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Container,
  IconButton,
  Modal,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid,
  InputAdornment,
  ListItemButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  ButtonGroup,
  Grow,
  Paper,
  Popper,
  MenuList,
  Alert,
  Autocomplete,
  Menu,
  ListItemIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import CheckIcon from "@mui/icons-material/Check";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EmailIcon from "@mui/icons-material/Email";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useFormik } from "formik";
import {
  userLinkedinAccountConnectUrl,
  googleOAuthUrl,
  userProfileInfoUrl,
  campaignListCreateUrl,
  labelsListCreateUrl,
  messagesListUrl,
  roomsListUrl,
  apiHost,
  roomReadedUrl,
  assignLabelViewUrl,
  assignsLabelViewUrl,
} from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { selectProfile, setProfile } from "../features/profile/profileSlice";

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

const EmailIntegration = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectProfile);
  const [campaigns, setCampaigns] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [selectedMessageType, setSelectedMessageType] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [labels, setLabels] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [labelCreateModalOpen, setLabelCreateModalOpen] = useState(false);
  const [labelCreateModalAlert, setLabelCreateModalAlert] = useState("");
  const [labelAssignModalOpen, setLabelAssignModalOpen] = useState(false);
  const [
    labelAssignModalPrimaryBtnDisabled,
    setLabelAssignModalPrimaryBtnDisabled,
  ] = useState(false);
  const anchorRef = useRef(null);
  const filterMenuAnchorRef = useRef(null);
  const filterMenuprevOpen = useRef(filterMenuOpen);
  const prevOpen = useRef(open);

  // multiple filterations
  const [debouncedIncludeCampaigns, setDebouncedIncludeCampaigns] = useState([]);
  const [includeCampaigns, setIncludeCampaigns] = useState([]);
  const [debouncedIncludePlatforms, setDebouncedIncludePlatforms] = useState([]);
  const [includePlatforms, setIncludePlatforms] = useState([]);
  const [debouncedIncludeMessageTypes, setDebouncedIncludeMessageTypes] = useState([]);
  const [includeMessageTypes, setIncludeMessageTypes] = useState([]);
  const [debouncedIncludeLabels, setDebouncedIncludeLabels] = useState([]);
  const [includeLabels, setIncludeLabels] = useState([]);
  const [includeWithoutLabels, setIncludeWithoutLabels] = useState(null);

  const handleFilterMenuToggle = () => {
    setFilterMenuOpen((filterMenuprevOpen) => !filterMenuprevOpen);
  };

  const handleFilterMenuClose = (event) => {
    if (filterMenuAnchorRef.current && filterMenuAnchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

    function handleFilterMenuListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setFilterMenuOpen(false);
    } else if (event.key === "Escape") {
      setFilterMenuOpen(false);
    }
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (filterMenuprevOpen.current === true && filterMenuOpen === false) {
      filterMenuAnchorRef.current.focus();
    }

    filterMenuprevOpen.current = filterMenuOpen;
  }, [filterMenuprevOpen]);


  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(500).required("Name is required"),
      description: Yup.string().max(2000),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const resp = await createResource.mutateAsync({
          values,
          url: labelsListCreateUrl,
        });

        resetForm();
        labelsRefetch();
        setLabelCreateModalOpen(false);
      } catch (err) {
        console.log(err);
        setLabelCreateModalAlert(
          err.response.data.name || "Sorry Something Went Wrong."
        );
        setTimeout(() => setLabelCreateModalAlert(""), 5000);
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
    campaignsisFetching,
    campaignsrefetch,
    campaignsisError,
    data: campaignsList,
} = useQuery(
    ['campaigns'],
    () =>
        axios.get(
            `${campaignListCreateUrl}?page_size=100`, config)
            .then((res) => res.data),
    { enabled: !!user.token }
)

  const {
    isFetching,
    refetch,
    isError,
    data: roomsList,
  } = useQuery(
    ["rooms", searchTerm, includeCampaigns, includePlatforms, includeMessageTypes, includeLabels, includeWithoutLabels],
    () =>
      axios
        .get(
          `${roomsListUrl}?search=${searchTerm}&include_campaigns=${includeCampaigns}&include_labels=${includeLabels}&include_platforms=${includePlatforms}&include_message_types=${includeMessageTypes}&include_without_labels=${includeWithoutLabels}`,
          config
        )
        .then((res) => res.data),
    { enabled: !!user.token }
  );

  const { refetch: refetchMessages, data: messagesList } = useQuery(
    ["messages", selectedRoom],
    () =>
      axios
        .get(
          `${messagesListUrl}?room=${selectedRoom ? selectedRoom.id : ""}`,
          config
        )
        .then((res) => res.data),
    { enabled: !!user.token, refetchInterval: 10000 }
  );

  const {
    isFetching: labelsIsFetching,
    refetch: labelsRefetch,
    isError: labelsIsError,
    data: labelsList,
  } = useQuery(
    ["labels"],
    () =>
      axios
        .get(`${labelsListCreateUrl}?page_size=100`, config)
        .then((res) => res.data),
    { enabled: !!user.token }
  );

  useEffect(() => {
    if (!roomsList) return;
    setRooms(roomsList);
  }, [roomsList]);

  useEffect(() => {
    if (!messagesList || !selectedRoom) return;
    setMessages(messagesList);
  }, [messagesList]);

  useEffect(() => {
    if (!labelsList) return;
    setLabels(labelsList);
  }, [labelsList]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {

      if (debouncedIncludeCampaigns !== includeCampaigns) setIncludeCampaigns(debouncedIncludeCampaigns);
      if (debouncedIncludePlatforms !== includePlatforms) setIncludePlatforms(debouncedIncludePlatforms);
      if (debouncedIncludeMessageTypes !== includeMessageTypes) setIncludeMessageTypes(debouncedIncludeMessageTypes);
      if (debouncedIncludeLabels !== includeLabels) setIncludeLabels(debouncedIncludeLabels);

    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [debouncedIncludeCampaigns, debouncedIncludePlatforms, debouncedIncludeMessageTypes, debouncedIncludeLabels]);

  useEffect(() => {
    if (!campaignsList) return;
    setCampaigns(campaignsList);
}, [campaignsList]);

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values, config)
  );

  const overwriteResource = useMutation(({ url, values }) =>
    axios.put(url, values, config)
  );

  return (
    <>
      <Head>
        <title>Inbox | Newson</title>
      </Head>
      <Box
        // component="main"
        sx={{
          py: 2,
        }}
      >
        <Box>
          <Grid
            container
            spacing={2}
            sx={{ height: "calc(95vh - 64px)", overflow: "hidden" }}
          >
            <Grid item lg={3}>
              <Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    p: "15px",
                    borderRadius: "10px",
                  }}
                >
                  <Box sx={{}}>
                    <Box sx={{ display: "flex" }}>
                      <TextField
                        id="outlined-search"
                        label="Search Prospect"
                        type="search"
                        fullWidth
                        sx={{
                          // mb: "20px",
                          backgroundColor: "rgb(244, 245, 247)",
                        }}
                        size="small"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.currentTarget.value)}
                      />
                      <Box
                        sx={{
                          background: "#f4f5f7",
                          borderRadius: "6px",
                          ml: "2px",
                          height: "41px",
                        }}
                      >
                        <IconButton
                          ref={filterMenuAnchorRef}
                          aria-label="filter"
                          id="filter-button"
                          aria-controls={
                            filterMenuOpen ? "filter-menu" : undefined
                          }
                          aria-expanded={filterMenuOpen ? "true" : undefined}
                          aria-haspopup="true"
                          // sx={{ p: 0 }}
                          onClick={handleFilterMenuToggle}
                        >
                          <FilterAltIcon />
                        </IconButton>
                        <Popper
                          open={filterMenuOpen}
                          anchorEl={filterMenuAnchorRef.current}
                          role={undefined}
                          placement="bottom-start"
                          transition
                          disablePortal
                          style={{ zIndex: 10 }}
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                transformOrigin:
                                  placement === "bottom-start"
                                    ? "left top"
                                    : "left bottom",
                              }}
                            >
                              <Paper sx={{ boxShadow: 20 }}>
                                <ClickAwayListener
                                  onClickAway={handleFilterMenuClose}
                                >
                                  <MenuList
                                    autoFocusItem={filterMenuOpen}
                                    id="filter-menu"
                                    aria-labelledby="filter-button"
                                    onKeyDown={handleFilterMenuListKeyDown}
                                    sx={{ minWidth: 250, height: "350px", overflow: "auto" }}
                                    dense
                                  >
                                    <Box>
                                      <Typography
                                        variant="p"
                                        sx={{
                                          fontSize: "12px",
                                          px: 2,
                                          fontWeight: "500",
                                        }}
                                      >
                                        By Campaigns
                                      </Typography>
                                      {campaigns.map((campaign, idx) => (
                                      <MenuItem
                                        key={`filter-by-campaigns-${campaign.id}-${idx}`}
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => {
                                                      !e.target.checked ? (
                                                        setDebouncedIncludeCampaigns(debouncedIncludeCampaigns.filter((campaignId) => campaignId !== campaign.id))
                                                      ) : (
                                                        setDebouncedIncludeCampaigns([...debouncedIncludeCampaigns, campaign.id])
                                                      )
                                                    }}
                                                    checked={debouncedIncludeCampaigns.includes(campaign.id)}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>{campaign.name}</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                      ))}
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                      <Typography
                                        variant="p"
                                        sx={{
                                          fontSize: "12px",
                                          px: 2,
                                          fontWeight: "500",
                                        }}
                                      >
                                        By Message Type
                                      </Typography>
                                      <MenuItem
                                        key="filter-by-message-type-Readed"
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => {
                                                      !e.target.checked ? (
                                                        setDebouncedIncludeMessageTypes(debouncedIncludeMessageTypes.filter((messageType) => messageType !== "Readed"))
                                                      ) : (
                                                        setDebouncedIncludeMessageTypes([...debouncedIncludeMessageTypes, "Readed"])                                                      )
                                                    }}
                                                    checked={debouncedIncludeMessageTypes.includes("Readed")}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>Read</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                      <MenuItem
                                        key="filter-by-message-type-Unreaded"
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => {
                                                      !e.target.checked ? (
                                                        setDebouncedIncludeMessageTypes(debouncedIncludeMessageTypes.filter((messageType) => messageType !== "Unreaded"))
                                                      ) : (
                                                        setDebouncedIncludeMessageTypes([...debouncedIncludeMessageTypes, "Unreaded"])                                                      )
                                                    }}
                                                    checked={debouncedIncludeMessageTypes.includes("Unreaded")}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>Unread</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                      <Typography
                                        variant="p"
                                        sx={{
                                          fontSize: "12px",
                                          px: 2,
                                          fontWeight: "500",
                                        }}
                                      >
                                        By Platform
                                      </Typography>
                                      <MenuItem
                                        key="filter-by-platform-linkedin"
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => {
                                                      !e.target.checked ? (
                                                        setDebouncedIncludePlatforms(debouncedIncludePlatforms.filter((platform) => platform !== "Linkedin"))
                                                      ) : (
                                                        setDebouncedIncludePlatforms([...debouncedIncludePlatforms, "Linkedin"])                                                      )
                                                    }}
                                                    checked={debouncedIncludePlatforms.includes("Linkedin")}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>Linkedin</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                      <MenuItem
                                        key="filter-by-platform-linkedin-sales"
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => {
                                                      !e.target.checked ? (
                                                        setDebouncedIncludePlatforms(debouncedIncludePlatforms.filter((platform) => platform !== "Linkedin Sales"))
                                                      ) : (
                                                        setDebouncedIncludePlatforms([...debouncedIncludePlatforms, "Linkedin Sales"])
                                                      )
                                                    }}
                                                    checked={debouncedIncludePlatforms.includes("Linkedin Sales")}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>Linkedin Sales Navigator</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                      <Typography
                                        variant="p"
                                        sx={{
                                          fontSize: "12px",
                                          px: 2,
                                          fontWeight: "500",
                                        }}
                                      >
                                        By Labels
                                      </Typography>
                                      <MenuItem
                                        key={`filter-by-labels-WithoutLabel`}
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => setIncludeWithoutLabels(!includeWithoutLabels)}
                                                    checked={includeWithoutLabels}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>Without Labels</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                      {labels.map((label, idx) => (
                                      <MenuItem
                                        key={`filter-by-labels-${label.id}-${idx}`}
                                        sx={{ height: "35px" }}
                                      >
                                        <Box sx={{ mt: "5px" }}>
                                          <Box sx={{ display: "flex" }}>
                                            <FormGroup>
                                              <FormControlLabel
                                                size="small"
                                                control={
                                                  <Checkbox
                                                    size="small"
                                                    onChange={(e) => {
                                                      !e.target.checked ? (
                                                        setDebouncedIncludeLabels(debouncedIncludeLabels.filter((labelId) => labelId !== label.id))
                                                      ) : (
                                                        setDebouncedIncludeLabels([...debouncedIncludeLabels, label.id])                                                      )
                                                    }}
                                                    checked={debouncedIncludeLabels.includes(label.id)}
                                                  />
                                                }
                                                label={<Typography variant="body2" sx={{ fontSize: "13px", fontWeight: "400" }}>{label.name}</Typography>}
                                              />
                                            </FormGroup>
                                          </Box>
                                        </Box>
                                      </MenuItem>
                                      ))}
                                    </Box>
                                  </MenuList>
                                </ClickAwayListener>
                              </Paper>
                            </Grow>
                          )}
                        </Popper>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box
                  sx={{
                    backgroundColor: "white",
                    overflow: "auto",
                    height: "calc(84vh - 71px)",
                    // height: "74vh",
                  }}
                >
                  <List>
                    {rooms.map((room, idx) => (
                      <>
                        <ListItem
                          key={room.id}
                          selected={
                            selectedRoom && selectedRoom.id === room.id
                              ? true
                              : false
                          }
                          onClick={async () => {
                            setSelectedRoom(room);

                            if ((!room.customer_message_readed && room.last_message.message_count) || (room.customer_message_readed && room.total_customer_messages - room.customer_message_readed > 0)) {
                              await createResource.mutateAsync({
                                url: `${roomReadedUrl}${room.id}/`,
                              });
                              refetch();
                            }

                          }}
                          disablePadding
                        >
                          <ListItemButton
                            sx={{ px: "10px", py: "13px", boxShadow: 3 }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={room.prospect_details.name}
                                src={
                                  room.prospect_details &&
                                  room.prospect_details.linkedin_avatar &&
                                  room.prospect_details.linkedin_avatar.length
                                    ? `${apiHost}/api/media/${room.prospect_details.linkedin_avatar}`
                                    : ""
                                }
                              />
                            </ListItemAvatar>
                            <Box sx={{ width: "100%" }}>
                              <Typography variant="p" gutterBottom>
                                <Box>
                                  <Box sx={{ display: "flex" }}>
                                    {room.prospect_details.name
                                      ? room.prospect_details.name
                                          .split(" ")[0]
                                          .substring(0, 9)
                                      : null}
                                    {room.prospect_details.name &&
                                    room.prospect_details.name.split(" ")[0] > 9
                                      ? "..."
                                      : null}
                                    <Box sx={{ ml: "auto" }}>
                                      <ListItemText
                                        secondary={`${room.last_message.time}`}
                                        sx={{ py: "0px", my: "0px" }}
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                                <Box sx={{ display: "flex" }}>
                                  <ListItemText
                                    secondary={`${room.last_message.message.substring(
                                      0,
                                      20
                                    )}..`}
                                    sx={{ py: "0px", my: "0px" }}
                                  />
                                  {!room.customer_message_readed &&
                                  room.last_message.message_count ? (
                                    <Box
                                      sx={{
                                        fontSize: "12px",
                                        backgroundColor: "#20c997",
                                        color: "white",
                                        borderRadius: "10px",
                                        px: 1,
                                        display: "inline-block",
                                        ml: "auto",
                                        textAlign: "right",
                                        height: "20px",
                                        fontWieght: "500",
                                      }}
                                    >
                                      {room.last_message.message_count}
                                    </Box>
                                  ) : null}
                                  {room.customer_message_readed &&
                                  room.total_customer_messages -
                                    room.customer_message_readed >
                                    0 ? (
                                    <Box
                                      sx={{
                                        fontSize: "12px",
                                        backgroundColor: "#20c997",
                                        color: "white",
                                        borderRadius: "10px",
                                        px: 1,
                                        display: "inline-block",
                                        ml: "auto",
                                        textAlign: "right",
                                        height: "20px",
                                        fontWieght: "500",
                                      }}
                                    >
                                      {room.total_customer_messages -
                                        room.customer_message_readed}
                                    </Box>
                                  ) : null}
                                </Box>
                              </Typography>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      </>
                    ))}
                  </List>
                </Box>
              </Box>
            </Grid>
            {selectedRoom ? (
              <>
                <Grid item lg={5} sx={{ height: "100%" }}>
                  <Box sx={{ height: "100%" }}>
                    <Box
                      sx={{
                        mx: "auto",
                        background: "white",
                        borderRadius: "10px",
                        height: "100%",
                        display: "flex",
                        flexFlow: "column",
                      }}
                    >
                      <Box sx={{ p: "15px", boxShadow: 4, height: "89px" }}>
                        <Box sx={{ pt: "0px" }}>
                          <Typography
                            variant="p"
                            gutterBottom
                            sx={{ fontWeight: "500" }}
                          >
                            <Box sx={{ display: "flex" }}>
                              <Box>{selectedRoom.prospect_details.name}</Box>
                              <Box
                                sx={{
                                  fontSize: "12px",
                                  backgroundColor: `${user.client.primary_color}`,
                                  color: "white",
                                  borderRadius: "10px",
                                  px: 1,
                                  display: "inline-block",
                                  ml: "auto",
                                  mt: "12px",
                                  textAlign: "center",
                                }}
                              >
                                {selectedRoom.platform}
                              </Box>
                            </Box>
                            <ListItemText
                              secondary={selectedRoom.linkedin_account_name}
                            />
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ p: "20px", flex: "1 1 auto", overflow: "auto" }}
                      >
                        {messages.map((message) => (
                          <Box
                            sx={{
                              mb: "25px",
                              display: "grid",
                              justifyContent: `${
                                message.message_from === "Prospect"
                                  ? "flex-start"
                                  : "flex-end"
                              }`,
                            }}
                            key={message.id}
                          >
                            <Box sx={{ display: "flex" }}>
                              <Avatar
                                alt={
                                  message.message_from === "Prospect"
                                    ? selectedRoom.prospect_details.name
                                    : user.details.username
                                }
                                src={
                                  message.message_from === "Prospect"
                                    ? selectedRoom.prospect_details &&
                                      `${apiHost}/api/media/${selectedRoom.prospect_details.linkedin_avatar}`
                                    : selectedRoom.linkedin_account.avatar
                                }
                                sx={{ mt: "7px" }}
                              />
                              <Box
                                sx={{
                                  ml: "10px",
                                  backgroundColor: `${
                                    message.message_from === "Prospect"
                                      ? "rgb(95, 99, 242)"
                                      : "rgb(239, 240, 243)"
                                  }`,
                                  pt: "10px",
                                  px: "10px",
                                  borderRadius: "17px",
                                  pb: "7px",
                                  color: `${
                                    message.message_from === "Prospect"
                                      ? "rgb(255, 255, 255)"
                                      : "rgb(90, 95, 125)"
                                  }`,
                                }}
                              >
                                <ListItemText
                                  primary={message.message}
                                  primaryTypographyProps={{ fontSize: "14px" }}
                                  sx={{
                                    pb: "7px",
                                    m: "0px",
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ px: "52px" }}>
                              <Typography
                                variant="p"
                                gutterBottom
                                sx={{ fontWeight: "500" }}
                              >
                                <ListItemText secondary={`${message.time}`} />
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ height: "56px" }}>
                        <Box sx={{ display: "flex" }}>
                          <TextField
                            label="Message"
                            fullWidth
                            sx={{ mr: "10px" }}
                            // helperText="Press CTRL + ENTER To Send Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <Fab
                            color="primary"
                            aria-label="send"
                            sx={{
                              fontSize: "20px",
                              marginRight: "5px",
                              px: "27px",
                            }}
                            onClick={async () => {
                              if (!message.length) return;

                              const values = {
                                time: new Date().toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }),
                                message: message,
                                platform: selectedPlatform,
                                room: selectedRoom.id,
                              };

                              await createResource.mutateAsync({
                                values,
                                url: messagesListUrl,
                              });
                              setMessage("");
                              refetchMessages();
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              icon={faPaperPlane}
                            ></FontAwesomeIcon>
                          </Fab>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item lg={4}>
                  <Box
                    sx={{
                      background: "white",
                      borderRadius: "10px",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        height: "83vh",
                        p: 2,
                        overflow: "auto",
                      }}
                    >
                      <Box sx={{ display: "flex", px: 1 }}>
                        <Box sx={{ mt: "20px", mr: "auto" }}>
                          <Avatar
                            sx={{ width: 50, height: 50 }}
                            alt={user["details"]["username"]}
                            src={
                              selectedRoom.prospect_details &&
                              selectedRoom.prospect_details.linkedin_avatar &&
                              selectedRoom.prospect_details.linkedin_avatar
                                .length
                                ? `${apiHost}/api/media/${selectedRoom.prospect_details.linkedin_avatar}`
                                : ""
                            }
                          />
                        </Box>
                        <Box sx={{ mt: 4, mr: "auto", width: "100%" }}>
                          <Box sx={{ display: "flex", ml: "12px" }}>
                            <Box sx={{ mr: "auto", mt: "3px" }}>
                              <Typography
                                variant="h6"
                                sx={{ fontSize: "15px" }}
                              >
                                {selectedRoom.prospect_details.name}
                              </Typography>
                            </Box>
                            <Box sx={{ ml: "auto", }}>
                              <IconButton
                                ref={anchorRef}
                                aria-label="options"
                                id="options-button"
                                aria-controls={
                                  open ? "options-menu" : undefined
                                }
                                aria-expanded={open ? "true" : undefined}
                                aria-haspopup="true"
                                sx={{ p: 0 }}
                                onClick={handleToggle}
                              >
                                <ReorderIcon />
                              </IconButton>
                              <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                placement="bottom-start"
                                transition
                                disablePortal
                              >
                                {({ TransitionProps, placement }) => (
                                  <Grow
                                    {...TransitionProps}
                                    style={{
                                      transformOrigin:
                                        placement === "bottom-start"
                                          ? "left top"
                                          : "left bottom",
                                    }}
                                  >
                                    <Paper>
                                      <ClickAwayListener
                                        onClickAway={handleClose}
                                      >
                                        <MenuList
                                          autoFocusItem={open}
                                          id="options-menu"
                                          aria-labelledby="options-button"
                                          onKeyDown={handleListKeyDown}
                                          sx={{ width: 230 }}
                                        >
                                          <MenuItem
                                            key="add-new-label"
                                            onClick={() => {
                                              setOpen(false);
                                              setLabelCreateModalOpen(true);
                                            }}
                                          >
                                            <ListItemIcon
                                              sx={{
                                                wdith: "26px",
                                                minWidth: "26px",
                                              }}
                                            >
                                              <AddBoxIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>
                                              Add New Label
                                            </ListItemText>
                                          </MenuItem>
                                          <MenuItem
                                            key="select-assign-labels"
                                            onClick={() => {
                                              setSelectedLabels(
                                                selectedRoom.prospect_labels
                                                  .filter(
                                                    (label) =>
                                                      label.label__name !==
                                                        "Lead" &&
                                                      label.label__name !==
                                                        "Customer"
                                                  )
                                                  .map((label) => ({
                                                    id: label.label_id,
                                                    name: label.label__name,
                                                  }))
                                              );
                                              setOpen(false);
                                              setLabelAssignModalOpen(true);
                                            }}
                                          >
                                            <ListItemIcon
                                              sx={{
                                                wdith: "26px",
                                                minWidth: "26px",
                                              }}
                                            >
                                              <BookmarksIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>
                                              Assign Labels
                                            </ListItemText>
                                          </MenuItem>
                                          <MenuItem
                                            key="mark-as-lead-label"
                                            onClick={async (e) => {
                                              if (
                                                e.target.innerText
                                                  .toLowerCase()
                                                  .includes("unmark")
                                              ) {
                                                const resp =
                                                  await createResource.mutateAsync(
                                                    {
                                                      url: `${assignLabelViewUrl}unmark/${selectedRoom.prospect_details.id}/Lead/`,
                                                    }
                                                  );
                                                setSelectedRoom({
                                                  ...selectedRoom,
                                                  prospect_labels: [
                                                    ...selectedRoom.prospect_labels.filter(
                                                      (label) =>
                                                        label.id !==
                                                        resp.data.id
                                                    ),
                                                  ],
                                                });
                                              } else {
                                                const resp =
                                                  await createResource.mutateAsync(
                                                    {
                                                      url: `${assignLabelViewUrl}mark/${selectedRoom.prospect_details.id}/Lead/`,
                                                    }
                                                  );
                                                setSelectedRoom({
                                                  ...selectedRoom,
                                                  prospect_labels: [
                                                    ...selectedRoom.prospect_labels.filter(
                                                      (label) =>
                                                        label.id !==
                                                        resp.data.id
                                                    ),
                                                    resp.data,
                                                  ],
                                                });
                                              }

                                              setOpen(false);
                                              refetch();
                                            }}
                                          >
                                            {selectedRoom.prospect_labels.find(
                                              (label) =>
                                                label.label__name === "Lead"
                                            ) ? (
                                              <>
                                                <ListItemIcon
                                                  sx={{
                                                    wdith: "26px",
                                                    minWidth: "26px",
                                                  }}
                                                >
                                                  <IndeterminateCheckBoxIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText>
                                                  Unmark As Lead
                                                </ListItemText>
                                              </>
                                            ) : (
                                              <>
                                                <ListItemIcon
                                                  sx={{
                                                    wdith: "26px",
                                                    minWidth: "26px",
                                                  }}
                                                >
                                                  <CheckBoxIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText>
                                                  Mark As Lead
                                                </ListItemText>
                                              </>
                                            )}
                                          </MenuItem>
                                          <MenuItem
                                            key="mark-as-customer-label"
                                            onClick={async (e) => {
                                              if (
                                                e.target.innerText
                                                  .toLowerCase()
                                                  .includes("unmark")
                                              ) {
                                                const resp =
                                                  await createResource.mutateAsync(
                                                    {
                                                      url: `${assignLabelViewUrl}unmark/${selectedRoom.prospect_details.id}/Customer/`,
                                                    }
                                                  );
                                                setSelectedRoom({
                                                  ...selectedRoom,
                                                  prospect_labels: [
                                                    ...selectedRoom.prospect_labels.filter(
                                                      (label) =>
                                                        label.id !==
                                                        resp.data.id
                                                    ),
                                                  ],
                                                });
                                              } else {
                                                const resp =
                                                  await createResource.mutateAsync(
                                                    {
                                                      url: `${assignLabelViewUrl}mark/${selectedRoom.prospect_details.id}/Customer/`,
                                                    }
                                                  );
                                                setSelectedRoom({
                                                  ...selectedRoom,
                                                  prospect_labels: [
                                                    ...selectedRoom.prospect_labels.filter(
                                                      (label) =>
                                                        label.id !==
                                                        resp.data.id
                                                    ),
                                                    resp.data,
                                                  ],
                                                });
                                              }

                                              setOpen(false);
                                              refetch();
                                            }}
                                          >
                                            {selectedRoom.prospect_labels.find(
                                              (label) =>
                                                label.label__name === "Customer"
                                            ) ? (
                                              <>
                                                <ListItemIcon
                                                  sx={{
                                                    wdith: "26px",
                                                    minWidth: "26px",
                                                  }}
                                                >
                                                  <GroupRemoveIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText>
                                                  Unmark As Customer
                                                </ListItemText>
                                              </>
                                            ) : (
                                              <>
                                                <ListItemIcon
                                                  sx={{
                                                    wdith: "26px",
                                                    minWidth: "26px",
                                                  }}
                                                >
                                                  <GroupAddIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText>
                                                  Mark As Customer
                                                </ListItemText>
                                              </>
                                            )}
                                          </MenuItem>
                                          <MenuItem
                                            key="mark-as-customer-label"
                                            onClick={(e) => {
                                              setOpen(false);
                                            }}
                                          >
                                            <ListItemIcon
                                              sx={{
                                                wdith: "26px",
                                                minWidth: "26px",
                                              }}
                                            >
                                              <ForwardToInboxIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>
                                              Forward To Email
                                            </ListItemText>
                                          </MenuItem>
                                        </MenuList>
                                      </ClickAwayListener>
                                    </Paper>
                                  </Grow>
                                )}
                              </Popper>
                            </Box>
                          </Box>
                          <Box sx={{ mt: "1px", ml: "12px" }}>
                            {selectedRoom.prospect_labels.map((label, idx) => (
                              <Box
                                key={`${label}-${idx}-${selectedRoom.prospect_details.id}`}
                                data-key={`${label}-${idx}-${selectedRoom.prospect_details.id}`}
                                sx={{
                                  fontSize: "12px",
                                  backgroundColor: `${user.client.primary_color}`,
                                  color: "white",
                                  borderRadius: "10px",
                                  px: 1,
                                  display: "inline-block",
                                  ml: "3px",
                                  textAlign: "center",
                                }}
                              >
                                {label.label__name}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          mx: "auto",
                          border: "1px solid rgba(0,16,61,0.12)",
                          borderRadius: "8px",
                          p: 1,
                          mt: "20px",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex" }}>
                          <BusinessIcon color="primary" />
                          <Typography
                            variant="p"
                            component="span"
                            sx={{
                              ml: "7px",
                              fontSize: "14px",
                            }}
                          >
                            {`${
                              selectedRoom.prospect_details.occupation ||
                              selectedRoom.prospect_details.headline
                            }`}
                          </Typography>
                        </Box>
                        {selectedRoom.prospect_details.occupation &&
                        selectedRoom.prospect_details.current_company ? (
                          <Box sx={{ ml: "31px", display: "flex" }}>
                            <Box
                              sx={{
                                color: `${user.client.primary_color}`,
                                mt: "2px",
                              }}
                            >
                              <FontAwesomeIcon
                                size="md"
                                icon={faAngleRight}
                              ></FontAwesomeIcon>
                            </Box>
                            <Box>
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                  fontSize: "12px",
                                }}
                              >
                                {selectedRoom.prospect_details.current_company}
                              </Typography>
                            </Box>
                          </Box>
                        ) : null}
                        <Box sx={{ display: "flex", mt: "4px" }}>
                          <LocationOnIcon color="primary" />
                          <Typography
                            variant="p"
                            component="span"
                            sx={{
                              ml: "7px",
                              fontSize: "14px",
                            }}
                          >
                            {`${selectedRoom.prospect_details.location}`}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          mx: "auto",
                          border: "1px solid rgba(0,16,61,0.12)",
                          borderRadius: "8px",
                          p: 1,
                          mt: "20px",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex", mt: "4px" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: "15px",
                              fontWeight: "500",
                              mr: "auto",
                            }}
                          >
                            Campaign
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "15px",
                            fontWeight: "400",
                            mr: "auto",
                          }}
                        >
                          {`${selectedRoom.campaign_details.name}`}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          mx: "auto",
                          border: "1px solid rgba(0,16,61,0.12)",
                          borderRadius: "8px",
                          p: 1,
                          mt: "20px",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ mt: "5px" }}>
                          <Box sx={{ display: "flex", mt: "4px" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "15px",
                                fontWeight: "500",
                                mr: "auto",
                              }}
                            >
                              Sequences
                            </Typography>
                            <ExpandCircleDownIcon color="primary" />
                          </Box>

                          <Box>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              <BusinessIcon color="primary" />
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                }}
                              >
                                Connect
                              </Typography>
                              <Box sx={{ ml: "auto" }}>
                                <CheckIcon color="primary" />
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              <MapsUgcIcon color="primary" />
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                }}
                              >
                                Send Message
                              </Typography>
                              <Box sx={{ ml: "auto" }}>
                                <CheckIcon color="primary" />
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              <ForwardToInboxIcon color="primary" />
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                }}
                              >
                                Send Inmail
                              </Typography>
                              <Box sx={{ ml: "auto" }}>
                                <CheckIcon color="primary" />
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              <ThumbUpIcon color="primary" />
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                }}
                              >
                                Like 3 Posts
                              </Typography>
                              <Box sx={{ ml: "auto" }}>
                                <CheckIcon color="primary" />
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              <ThumbUpIcon color="primary" />
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                }}
                              >
                                Send Email
                              </Typography>
                              <Box sx={{ ml: "auto" }}>
                                <PauseIcon color="primary" />
                              </Box>
                            </Box>
                          </Box>

                          <Button
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            fullWidth
                            sx={{ mt: "10px" }}
                          >
                            Run Campaign For Avi
                          </Button>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          mx: "auto",
                          border: "1px solid rgba(0,16,61,0.12)",
                          borderRadius: "8px",
                          p: 1,
                          mt: "20px",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ mt: "5px", pb: 1 }}>
                          <Box sx={{ display: "flex", mt: "4px" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: "15px",
                                fontWeight: "500",
                                mr: "auto",
                              }}
                            >
                              Contacts
                            </Typography>
                            <ModeEditIcon color="primary" sx={{ mr: "4px" }} />
                            <ExpandCircleDownIcon color="primary" />
                          </Box>

                          <Box>
                            <Box sx={{ display: "flex", mt: "5px" }}>
                              <EmailIcon color="primary" />
                              <Typography
                                variant="p"
                                component="span"
                                sx={{
                                  ml: "7px",
                                }}
                              >
                                {`${
                                  selectedRoom.prospect_details.email ||
                                  "No Email"
                                }`}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Button
                        variant="outlined"
                        endIcon={<LinkedInIcon />}
                        fullWidth
                        onClick={() =>
                          window.open(
                            selectedRoom.prospect_details.linkedin_profile_url,
                            "_blank"
                          )
                        }
                        sx={{ mt: "10px" }}
                      >
                        Open With Linkedin
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </>
            ) : null}
          </Grid>
        </Box>
        <Modal open={labelCreateModalOpen} aria-labelledby="add-label">
          <Box sx={style}>
            <Typography variant="h5" component="h2">
              Add Label
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <FormControl fullWidth sx={{ my: 3 }}>
                {labelCreateModalAlert ? (
                  <Alert sx={{ my: "10px" }} severity="error">
                    {labelCreateModalAlert}
                  </Alert>
                ) : null}
                <TextField
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  placeholder="Developer"
                  label="Name"
                  name="name"
                  size="small"
                />
                <TextField
                  sx={{ mt: 2 }}
                  error={Boolean(
                    formik.touched.description && formik.errors.description
                  )}
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  placeholder="Description..."
                  label="Description"
                  name="description"
                  size="small"
                  multiline
                  rows={3}
                />
              </FormControl>

              <Box sx={{ mt: 1, textAlign: "right" }}>
                <Button
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setLabelCreateModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                  sx={{ mr: 1 }}
                >
                  Add
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
        <Modal open={labelAssignModalOpen} aria-labelledby="assign-label">
          <Box sx={style}>
            <Typography variant="h5" component="h2">
              Assign Labels
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <FormControl fullWidth sx={{ my: 3 }}>
                <Autocomplete
                  multiple
                  required
                  fullWidth
                  options={labels.filter(
                    (label) =>
                      label.name !== "Lead" && label.name !== "Customer"
                  )}
                  value={selectedLabels}
                  onChange={(event, newValue) => {
                    setSelectedLabels(newValue);
                  }}
                  getOptionLabel={(option) => option.name}
                  variant="contained"
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Labels"
                      placeholder="Select Your Labels"
                    />
                  )}
                />
              </FormControl>

              <Box sx={{ mt: 1, textAlign: "right" }}>
                <Button
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  onClick={() => {
                    setLabelAssignModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={async () => {
                    setLabelAssignModalPrimaryBtnDisabled(true);
                    const values = {
                      labels: selectedLabels.map((label) => label.id),
                    };

                    const resp = await overwriteResource.mutateAsync({
                      values,
                      url: `${assignsLabelViewUrl}${selectedRoom.prospect_details.id}/`,
                    });

                    refetch();
                    setSelectedRoom({
                      ...selectedRoom,
                      prospect_labels: resp.data,
                    });

                    setLabelAssignModalPrimaryBtnDisabled(false);
                    setLabelAssignModalOpen(false);
                  }}
                  disabled={labelAssignModalPrimaryBtnDisabled}
                  sx={{ mr: 1 }}
                >
                  Assign Labels
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

EmailIntegration.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default EmailIntegration;
