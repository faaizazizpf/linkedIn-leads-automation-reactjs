import React from "react";
import { Button, MenuItem, Menu } from "@mui/material";
import { useRouter } from "next/router";

export default function CampaignMenuOptions({
  id,
  setSelectedCampaign,
  setDeleteModalOpen,
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="primary"
        sx={{
          lineHeight: "0px",
          p: "15px",
          minWidth: "10px",
          display: "flex",
          ml: "auto",
          fontSize: "19px",
        }}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        ...
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={(e) => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            router.push({
              pathname: "/prospects",
              query: { campaign: id },
            });
            setAnchorEl(null);
          }}
        >
          Check Prospects
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedCampaign(id);
            setAnchorEl(null);
            setDeleteModalOpen(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
