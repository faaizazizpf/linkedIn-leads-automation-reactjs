import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MenuItem, Menu, IconButton } from "@mui/material";

export default function UserMenuOptions({
  onLoginAsUserClick = () => null,
  onDeleteUserClick = () => null,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={(e) => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem
          onClick={onLoginAsUserClick}
        >
          Login AS This User
        </MenuItem>
        <MenuItem
          onClick={onDeleteUserClick}
        >
          Delete
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
