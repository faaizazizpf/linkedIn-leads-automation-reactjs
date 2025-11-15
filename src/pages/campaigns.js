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
  Modal,
  Switch,
  LinearProgress,
  AvatarGroup,
} from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUser,
  faInbox,
  faUsers,
  faEnvelope,
  faHeart,
  faAt,
  faHandHoldingHeart,
  faThumbsUp
} from "@fortawesome/free-solid-svg-icons";
import { DashboardLayout } from "../components/dashboard-layout";
import axios from "axios";
import { useQuery, useMutation } from "react-query";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState, useMemo, useEffect } from "react";
import {
  campaignListCreateUrl,
  triggerCampaignUrl,
  apiHost,
} from "../config";
import { useSelector } from "react-redux";
import { selectProfile } from "../features/profile/profileSlice";
import CampaignMenuOptions from "../components/campaignMenuOptions";
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
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const user = useSelector(selectProfile);

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

  const deleteResource = useMutation(({ url }) => axios.delete(url, config));

  const {
    isFetching,
    refetch,
    isError,
    data: campaignsList,
  } = useQuery(
    ["campaigns", searchTerm],
    () =>
      axios
        .get(`${campaignListCreateUrl}?search=${searchTerm}`, config)
        .then((res) => res.data),
    { enabled: !!user.token }
  );

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!campaignsList) return;
    setCampaigns(campaignsList);
  }, [campaignsList]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  return (
    <>
      <Head>
        <title>Campaigns | {user.client.name}</title>
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
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                m: -1,
              }}
            >
              <Typography sx={{ m: 1 }} variant="h5">
                Campaigns
              </Typography>
              {/* <Button
                                    startIcon={(<DownloadIcon fontSize="small" />)}
                                    sx={{ mr: 1 }}
                                >
                                    Export
                                </Button> */}
              <Button
                color="primary"
                variant="contained"
                onClick={() => router.push("/create-campaign")}
                sx={{ ml: "auto" }}
              >
                Add Campaign
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
                placeholder="Search Campaign"
                variant="outlined"
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.currentTarget.value)}
              />
            </Box>
          </Box>
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3} sx={{ p: "15px", pt: "5px" }}>
              {campaigns.map((campaign, index) => {
                return (
                  <Card
                    key={`${campaign.id} / ${index}`}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      mt: "20px",
                    }}
                  >
                    <CardContent>
                      <Box>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <IOSSwitch
                            checked={
                              campaign.status !== "Stopped" &&
                              campaign.status != "Failed"
                            }
                            onChange={async (e) => {
                              if (e.target.checked) {
                                await updateResource.mutateAsync({
                                  url: `${campaignListCreateUrl}${campaign.id}/`,
                                  values: { status: "Running" },
                                });
                                await createResource.mutateAsync({
                                  values: {},
                                  url: `${triggerCampaignUrl}${campaign.id}/`,
                                });
                                refetch();
                              } else {
                                await updateResource.mutateAsync({
                                  url: `${campaignListCreateUrl}${campaign.id}/`,
                                  values: { status: "Stopped" },
                                });
                                refetch();
                              }
                            }}
                          />
                          <Box sx={{ ml: "17px", mt: "10px" }}>
                            <NextLink href="/" passHref>
                              <Link underline="hover">
                                <Typography
                                  color="textPrimary"
                                  gutterBottom
                                  variant="h5"
                                >
                                  {campaign.name}
                                </Typography>
                              </Link>
                            </NextLink>
                          </Box>
                          <CampaignMenuOptions id={campaign.id} setSelectedCampaign={setSelectedCampaign} setDeleteModalOpen={setOpen} />
                        </Box>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Grid
                          container
                          spacing={4}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faUsers}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Prospects Crawled{" "}
                              {campaign.total_prospects_crawled}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faUser}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Connection Request Sent{" "}
                              {campaign.total_connection_request_sent}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faUserCheck}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Connection Request Accepted{" "}
                              {campaign.total_connection_request_accepted}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faInbox}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Message Sent {campaign.message_sent}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faEnvelope}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Inmail Sent {campaign.inmail_sent}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faThumbsUp}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Liked Posts {campaign.liked_posts}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faHeart}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Followed {campaign.followed}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faHandHoldingHeart}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Endorsed {campaign.endorsed}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faHeart}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Leads {campaign.total_prospects_lead}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faHeart}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Customers {campaign.total_prospects_customer}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <FontAwesomeIcon
                              size="md"
                              color="gray"
                              icon={faAt}
                            ></FontAwesomeIcon>
                            <Typography
                              color="textSecondary"
                              display="inline"
                              sx={{ pl: 1 }}
                              variant="body2"
                            >
                              Emails Sent {campaign.email_sent}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Box sx={{ mt: "15px" }}>
                          <Typography
                            // color="textSecondary"
                            // display="inline"
                            sx={{ fontWeight: "500" }}
                            variant="body2"
                          >
                            Connected (
                            {campaign.total_connection_request_accepted})
                          </Typography>
                          <AvatarGroup
                            total={campaign.total_connection_request_accepted}
                            sx={{ float: "left", mt: "7px" }}
                          >
                            {campaign.connected_prospect_avatars.map(
                              (prospect) => (
                                <Avatar
                                  alt={prospect.name}
                                  key={prospect.name}
                                  src={`${apiHost}${prospect.avatar}`}
                                />
                              )
                            )}
                          </AvatarGroup>
                        </Box>
                      </Box>
                    </CardContent>
                    <LinearProgressWithLabel
                      value={campaign.progress}
                      sx={{ m: "0px", p: "0px" }}
                    />
                  </Card>
                );
              })}
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 3,
            }}
          >
            <Pagination color="primary" count={3} size="small" />
          </Box>
        </Container>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
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
                setSelectedCampaign("");
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={async () => {
                console.log(selectedCampaign);
                console.log(`${campaignListCreateUrl}${selectedCampaign}/`);
                await deleteResource.mutateAsync({
                  url: `${campaignListCreateUrl}${selectedCampaign}/`,
                });
                setSelectedCampaign("");
                refetch();
                setOpen(false);
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

Campaigns.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Campaigns;
