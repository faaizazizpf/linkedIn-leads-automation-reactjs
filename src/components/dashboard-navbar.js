import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  AppBar,
  Avatar,
  MenuItem,
  ListItemIcon,
  Menu,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import * as React from "react";
import NextLink from "next/link";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectProfile } from "../features/profile/profileSlice";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectProfile);
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);

  return (
    <>
      <DashboardNavbarRoot sx={{ zIndex: 1300 }} {...other}>
        <Toolbar
          disableGutters
          sx={{
            maxHeight: "56px",
            left: 0,
            px: 2,
          }}
        >
          <div>
            <Box>
              <NextLink href="/campaigns" passHref>
                <Box sx={{ ml: "17px" }}>
                  <img
                    src={`${user.client.logo}`}
                    alt={user.client.name}
                    height={35}
                    loading="lazy"
                  />
                </Box>
              </NextLink>
            </Box>
          </div>

          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* <Autocomplete
              id="workflow"
              sx={{ width: 300 }}
              open={workspaceOpen}
              onOpen={() => {
                setWorkspaceOpen(true);
              }}
              onClose={() => {
                setWorkspaceOpen(false);
              }}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              options={options}
              loading={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Workspace"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {true ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            /> */}

            <Tooltip title="Account settings">
              <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user["details"]["username"][0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={() => setAnchorEl(null)}
            onClick={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push("/logout");
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
