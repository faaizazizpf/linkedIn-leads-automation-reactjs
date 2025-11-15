import * as React from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ConnectModal() {
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Linkedin Email Verification Code
                    </Typography>
                    <Typography id="modal-modal-description" variant="p" sx={{ mt: 2, fontSize: 14 }}>
                        Please Enter The Code That is Sent To some@gmail.com
                    </Typography>
                    <TextField
                        error={false}
                        fullWidth
                        label="Verification Code"
                        placeholder="123456"
                        margin="normal"
                        name="code"
                        type="code"
                        value={123}
                        variant="outlined"
                    />
                    <Button
                        color="primary"
                        disabled={formik.isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        Connect My Linkedin Account
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
