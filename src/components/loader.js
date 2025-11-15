import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';


export default function Loader() {
    return (
        <Box sx={{ display: 'flex', height: "100vh", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress disableShrink />
        </Box>
    )
} 