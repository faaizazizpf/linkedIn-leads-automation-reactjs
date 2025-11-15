import * as React from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Alert,
  FormHelperText,
} from "@mui/material";

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
  pb: 2,
};

export default function ReconnectLinkedinModal({
  modalOpen,
  setModalOpen,
  selectedLinkedinAccount,
  setSelectedLinkedinAccount,
  alert,
  formik,
  reconnectChoice,
  setReconnectChoice
}) {

  return (
    <div>
      <Modal
        open={modalOpen}
        aria-labelledby="reconnect-linkedin"
        aria-describedby="reconnect-linkedin"
      >
        <Box sx={style}>
          <Typography id="reconnect-linkedin" variant="h6" component="h2">
            Reconnect ({selectedLinkedinAccount.name}) Linkedin Account
          </Typography>
          <Box sx={{ my: 2 }}>
            {alert ? (
              <Alert sx={{ my: "10px" }} severity="error">
                {alert}
              </Alert>
            ) : null}
            <FormControl fullWidth>
              <InputLabel id="credentials-label">Credentials</InputLabel>
              <Select
                labelId="credentials-label"
                id="credentials"
                value={reconnectChoice}
                label="Credentials"
                onChange={(e) => setReconnectChoice(e.target.value)}
              >
                <MenuItem value={"use_already_saved_credentials"}>
                  Use Already Saved Credentials (
                  {selectedLinkedinAccount.username})
                </MenuItem>
                <MenuItem value={"use_brand_new_credentials"}>
                  Use Brand New Credentials
                </MenuItem>
              </Select>
            </FormControl>
            <form onSubmit={formik.handleSubmit}>
              {reconnectChoice === "use_brand_new_credentials" ? (
                <>
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
                </>
              ) : null}
              <Box sx={{ display: "flex", mt: 3 }}>
                <Box sx={{ ml: "auto" }}>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      formik.resetForm()
                      setModalOpen(false);
                      setReconnectChoice("");
                      setSelectedLinkedinAccount({});
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                <Box>
                  <Button
                    color="primary"
                    onClick={() => {
                      formik.handleSubmit()
                    }}
                    disabled={formik.isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    Reconnect My Linkedin Account
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
