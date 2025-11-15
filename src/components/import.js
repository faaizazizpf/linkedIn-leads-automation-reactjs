import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  linkedinAccountsExampleImportUrl,
  importBulkLinkedinAccounts,
} from "../config";
import { useMutation } from "react-query";
import axios from "axios";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

const options = [
  "Create a merge commit",
  "Squash and merge",
  "Rebase and merge",
];

export default function ImportButton({ user, setAlert }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [importing, setImporting] = React.useState(false);

  const config = React.useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${user.token}`,
        'content-type': 'multipart/form-data'

      },
    }),
    [user.token]
  );

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const createResource = useMutation(({ url, values }) =>
    axios.post(url, values, config)
  );

  const upload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const csv = event.target.files[0];
      setImporting(true);

      const body = new FormData();
      body.append("csv_file", csv);
      try {
        await createResource.mutateAsync({
          url: importBulkLinkedinAccounts,
          values: body,
        });
        setAlert({
            content: "Linkedin Account Importing Started In Background.",
            severity: "success",
          });
          setTimeout(
            () =>
              setAlert({
                content: "",
                severity: "",
              }),
            5000
          );
      } catch (err) {
        console.log(err);
        if (err && err.response && err.response.data && err.response.data.column) {
            setAlert({
                content: err.response.data.column,
                severity: "error",
              });   
        } else {
            setAlert({
                content: "Please Upload A Valid CSV File.",
                severity: "error",
              });   
        }

        setTimeout(
          () =>
            setAlert({
              content: "",
              severity: "",
            }),
          5000
        );
      } finally {
        setImporting(false);
      }
    }
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} sx={{ ml: "10px" }}>
        <Button onClick={handleToggle}>Import</Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  <MenuItem
                    key={"import"}
                    // onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    <label htmlFor="csv_file">
                      {!importing ? "Import Linkedin Accounts" : "Importing..."}
                    </label>
                    <input
                      type="file"
                      id="csv_file"
                      name="csv_file"
                      style={{ display: "none" }}
                      accept=".csv"
                      onChange={upload}
                    />
                  </MenuItem>
                  <MenuItem key={"download-example"} onClick={(event) => {}}>
                    <a
                      href={linkedinAccountsExampleImportUrl}
                      style={{ textDecoration: "none" }}
                    >
                      Download Import Example File
                    </a>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
