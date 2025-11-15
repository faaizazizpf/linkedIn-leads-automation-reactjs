import Head from 'next/head';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { format } from 'date-fns';

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    TextField,
    InputAdornment,
    SvgIcon,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';
import { Search as SearchIcon } from '../icons/search';
import { Download as DownloadIcon } from '../icons/download';
import { getInitials } from '../utils/get-initials';
import { prospectsListUrl, campaignListCreateUrl, labelsListCreateUrl } from '../config';
import { useRouter } from "next/router";
import axios from 'axios';
import { useQuery } from 'react-query'
import { useState, useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSlice';


const Prospects = () => {
    const router = useRouter();
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);
    const [prospects, setProspects] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(0);
    const [labels, setLabels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const user = useSelector(selectProfile);


    const config = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }),
        [user.token]
    );

    const {
        isFetching,
        refetch,
        isError,
        data: prospectsList,
    } = useQuery(
        ['prospects', searchTerm, selectedCampaign, selectedLabel, router.query],
        () => 
            axios.get(
                `${prospectsListUrl}?search=${searchTerm}&campaign_linkedin_account__campaign=${selectedCampaign && selectedCampaign !== 0 ? selectedCampaign : (router && router.query && router.query.campaign) || ""}&prospect_labels__label=${selectedLabel ? selectedLabel : ''}`, config)
                .then((res) => res.data),
        { enabled: !!user.token }
    )

    const {
        campaignsisFetching,
        campaignsrefetch,
        campaignsisError,
        data: campaignsList,
    } = useQuery(
        ['campaigns'],
        () =>
            axios.get(
                `${campaignListCreateUrl}?page_size=100`, config)
                .then((res) => res.data),
        { enabled: !!user.token }
    )

    const {
        labelsisFetching,
        labelsrefetch,
        labelsisError,
        data: labelsList,
    } = useQuery(
        ['labels'],
        () =>
            axios.get(
                `${labelsListCreateUrl}?page_size=100`, config)
                .then((res) => res.data),
        { enabled: !!user.token }
    )

    const handleSelectAll = (event) => {
        let newSelectedCustomerIds;

        if (event.target.checked) {
            newSelectedCustomerIds = customers.map((customer) => customer.id);
        } else {
            newSelectedCustomerIds = [];
        }

        setSelectedCustomerIds(newSelectedCustomerIds);
    };

    const handleSelectOne = (event, id) => {
        const selectedIndex = selectedCustomerIds.indexOf(id);
        let newSelectedCustomerIds = [];

        if (selectedIndex === -1) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
        } else if (selectedIndex === 0) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
        } else if (selectedIndex === selectedCustomerIds.length - 1) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedCustomerIds = newSelectedCustomerIds.concat(
                selectedCustomerIds.slice(0, selectedIndex),
                selectedCustomerIds.slice(selectedIndex + 1)
            );
        }

        setSelectedCustomerIds(newSelectedCustomerIds);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (!prospectsList) return;
        console.log(prospectsList)
        setProspects(prospectsList);
    }, [prospectsList]);

    useEffect(() => {
        if (!campaignsList) return;
        setCampaigns(campaignsList);
    }, [campaignsList]);

    useEffect(() => {
        if (!labelsList) return;
        setLabels(labelsList);
    }, [labelsList]);

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
                <title>
                    Prospects | Newson
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
                <Container maxWidth={false}>
                    <Box>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                m: -1
                            }}
                        >
                            <Typography
                                sx={{ m: 1 }}
                                variant="h5"
                            >
                                Prospects
                            </Typography>
                            <Box sx={{ m: 1, display: "flex" }}>
                                {/* <Button
                                    startIcon={(<DownloadIcon fontSize="small" />)}
                                    sx={{ mr: 2 }}
                                >
                                    Export
                                </Button> */}

                                <FormControl fullWidth>
                                    <InputLabel id="campaign-select-label" size="small">Campaign</InputLabel>
                                    <Select
                                        labelId="campaign-select-label"
                                        id="campaign-select"
                                        value={selectedCampaign ? selectedCampaign : (router && router.query && router.query.campaign) | 0}
                                        label="Campaign"
                                        size="small"
                                        onChange={(e) => setSelectedCampaign(e.target.value)}
                                    >
                                        <MenuItem value={0}>All</MenuItem>
                                        {campaigns.map((campaign) => (
                                            <MenuItem value={campaign.id} key={`campaign-${campaign.id}`}>{campaign.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{ ml: "10px" }}>
                                    <InputLabel id="label-select-label" size="small">Label</InputLabel>
                                    <Select
                                        labelId="label-select-label"
                                        id="label-select"
                                        value={selectedLabel}
                                        label="label"
                                        size="small"
                                        onChange={(e) => setSelectedLabel(e.target.value)}
                                    >
                                        <MenuItem value={0}>All</MenuItem>
                                        {labels.map((label) => (
                                            <MenuItem value={label.id} key={`label-${label.id}`}>{label.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField fullWidth
                                    sx={{ ml: 1 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SvgIcon
                                                    color="action"
                                                    fontSize="small"
                                                >
                                                    <SearchIcon />
                                                </SvgIcon>
                                            </InputAdornment>
                                        )
                                    }}
                                    placeholder="Search Prospect"
                                    variant="outlined"
                                    size="small"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.currentTarget.value)}
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Card>
                            <PerfectScrollbar>
                                <Box>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    Name
                                                </TableCell>
                                                <TableCell>
                                                    Headline
                                                </TableCell>
                                                <TableCell>
                                                    Location
                                                </TableCell>
                                                <TableCell>
                                                    Email
                                                </TableCell>
                                                <TableCell>
                                                    Phone
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {prospects.map((prospect) => (
                                                <TableRow
                                                    hover
                                                    key={prospect.id}
                                                >
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex'
                                                            }}
                                                        >
                                                            <Avatar
                                                                src={prospect.linkedin_avatar}
                                                                sx={{ mr: 2 }}
                                                            >
                                                                {getInitials(prospect.name)}
                                                            </Avatar>
                                                            <Typography
                                                                color="textPrimary"
                                                                variant="body1"
                                                            >
                                                                {prospect.name}
                                                                <br />
                                                                {prospect.connection_request_sent && !prospect.connected ?
                                                                    (<Box sx={{
                                                                        fontSize: "12px",
                                                                        backgroundColor: "#5048E5",
                                                                        color: "white",
                                                                        borderRadius: "10px",
                                                                        px: 1,
                                                                        display: "inline-block",
                                                                        ml: "7px",
                                                                        textAlign: "center"
                                                                    }}>Request Sent</Box>
                                                                    ) : null
                                                                }

                                                                {!prospect.connection_request_sent && !prospect.connection_request_failed && !prospect.connected && !prospect.state && !prospect.state_status ?
                                                                    (<Box sx={{
                                                                        fontSize: "12px",
                                                                        backgroundColor: "#FFB020",
                                                                        color: "white",
                                                                        borderRadius: "10px",
                                                                        px: 1,
                                                                        display: "inline-block",
                                                                        ml: "7px",

                                                                        textAlign: "center"
                                                                    }}>Pending</Box>)
                                                                    : null
                                                                }

                                                                {
                                                                    prospect.connected && prospect.connection_request_sent ?
                                                                        (<Box sx={{
                                                                            fontSize: "12px",
                                                                            backgroundColor: "rgb(16, 185, 129)",
                                                                            color: "white",
                                                                            borderRadius: "10px",
                                                                            px: 1,
                                                                            display: "inline-block",
                                                                            ml: "7px",
                                                                            textAlign: "center"
                                                                        }}>Connected</Box>)
                                                                        : null
                                                                }

                                                                {prospect.statuses.map((status) => (
                                                                    <Box key={`prospect-status-${status.status}`} sx={{
                                                                        fontSize: "12px",
                                                                        backgroundColor: `${status.color}`,
                                                                        color: "white",
                                                                        borderRadius: "10px",
                                                                        px: 1,
                                                                        display: "inline-block",
                                                                        ml: "7px",
                                                                        textAlign: "center"
                                                                    }}>{status.status}</Box>
                                                                ))}

                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {prospect.headline}
                                                    </TableCell>
                                                    <TableCell>
                                                        {`${prospect.location}`}
                                                    </TableCell>
                                                    <TableCell>
                                                        {!prospect.email ? "...." : prospect.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        {!prospect.phone ? "...." : prospect.phone}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </PerfectScrollbar>
                            <TablePagination
                                component="div"
                                count={customers.length}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleLimitChange}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </Card>
                    </Box>
                </Container>
            </Box >
        </>
    );
}

Prospects.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Prospects;
