import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";


export const Campaign = (props) => (
    <Card
        {...props}
    >
        <CardContent>
            <Grid
                container
                spacing={3}
                sx={{ justifyContent: 'space-between' }}
            >
                <Grid item>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                    >
                        Total Campaigns
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="h4"
                    >
                        5
                    </Typography>
                </Grid>
                <Grid item>
                    <Avatar
                        sx={{
                            backgroundColor: 'error.main',
                            height: 56,
                            width: 56,
                        }}
                    >
                        <FontAwesomeIcon size='xs' icon={faBriefcase}></FontAwesomeIcon>
                    </Avatar>
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);
