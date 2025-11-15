import { useEffect, useMemo } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import PaymentIcon from "@mui/icons-material/Payment";
import { NavItem } from "./nav-item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faUsers,
  faInbox,
  faSignOutAlt,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { selectProfile } from "../features/profile/profileSlice";
import { useSelector } from "react-redux";
import { apiHost } from '../config';


export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });
  const user = useSelector(selectProfile);

  const items = useMemo(
    () => [
      // {
      //   href: '/',
      //   icon: (<ChartBarIcon fontSize="small" />),
      //   disabled: !user.details.linkedin_connected_account,
      //   title: 'Dashboard'
      // },
      {
        href: "/campaigns",
        icon: <FontAwesomeIcon size="xs" icon={faBriefcase}></FontAwesomeIcon>,
        disabled: !user.details.linkedin_connected_account,
        title: "Campaigns",
      },
      {
        href: "/prospects",
        icon: <FontAwesomeIcon size="xs" icon={faUsers}></FontAwesomeIcon>,
        disabled: !user.details.linkedin_connected_account,
        title: "Prospects",
      },
      {
        href: "/inbox",
        icon: <FontAwesomeIcon size="xs" icon={faInbox}></FontAwesomeIcon>,
        disabled: !user.details.linkedin_connected_account,
        title: "Inbox",
      },
    ],
    [user]
  );

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", }}>
        <Box sx={{ mx: "auto" }}>
          <Box sx={{ mt: "20px" }}>
            <Avatar
              sx={{ width: 65, height: 65 }}
              alt={user["details"]["username"]}
              src={user.details.linkedin_connected_accounts.length ? `${apiHost}/api/media/${user.details.linkedin_connected_accounts[0].avatar}` : ''}
            />
          </Box>
        </Box>
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
                variant="h6"
            >
                {user.details.username}
            </Typography>
            <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
            >
                {user.details.email}
            </Typography>
        </Box>
        </Box>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={!item.disabled ? item.href : ""}
              title={item.title}
              disabled={item.disabled}
              sx={{ color: "#3a3a3a", px: "0px", py: "5px" }}
            />
          ))}
          <Divider
            sx={{
              borderColor: "#2D3748",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
          <NavItem
            key="EmailIntegration"
            icon={<FontAwesomeIcon size="xs" icon={faPlug}></FontAwesomeIcon>}
            href={"/email-integration"}
            sx={{ px: "0px", py: "5px" }}
            // disabled={user.details.linkedin_connected_account}
            title="Email Integration"
          />
          <NavItem
            key="Connect"
            icon={<FontAwesomeIcon size="xs" icon={faPlug}></FontAwesomeIcon>}
            href={"/connect"}
            sx={{ px: "0px", py: "5px" }}
            title="Linkedin Accounts"
          />
          {Object.keys(user.details.plan).length ? (
            <NavItem
              key="Billing"
              icon={<PaymentIcon fontSize="small" />}
              sx={{ px: "0px", py: "5px" }}
              href={"/billing"}
              title="Billing"
            />
          ) : null}

          {user.details.is_superuser ? (
            <NavItem
              key="Admin"
              icon={<AdminPanelSettingsIcon fontSize="small" />}
              sx={{ px: "0px", py: "5px" }}
              href={"/admin"}
              expandable
              title="Admin"
            >
              <NavItem
                key="Users"
                sx={{ px: "25px", py: "5px" }}
                href={"/users"}
                title="Users"
              />
              <NavItem
                key="Whitelabel"
                sx={{ px: "25px", py: "5px" }}
                href={"/whitelabel"}
                title="WhiteLabel"
              />
            </NavItem>
          ) : null}

          <NavItem
            key="Settings"
            icon={<CogIcon fontSize="small" />}
            sx={{ px: "0px", py: "5px" }}
            disabled={!user.details.linkedin_connected_account}
            href={"/settings"}
            title="Settings"
          />
          <NavItem
            key="Log out"
            icon={
              <FontAwesomeIcon size="xs" icon={faSignOutAlt}></FontAwesomeIcon>
            }
            href="/logout"
            sx={{ px: "0px", py: "5px" }}
            title="Log out"
          />
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      anchor="left"
      open
      PaperProps={{
        sx: {
          // backgroundColor: '#ffffffc4',
          // color: '#000',
          width: 266,
          pt: 8,
        },
      }}
      variant="permanent"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
