// // material-ui
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';


// // project-imports
// import ContactForm from 'sections/extra-pages/contact/ContactForm';
// import ContactHeader from 'sections/extra-pages/contact/ContactHeader';

// // ==============================|| CONTACT US - MAIN ||============================== //

// export default function CallHistory() {
//     return (
//         <Grid container spacing={12} sx={{ justifyContent: 'center', alignItems: 'center', mb: 12 }}>

//             CALL HISTORY
//         </Grid>
//     );
// }   

'use client';
// material-ui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
// import ChatModal from './chatModl';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAgentCallById } from '../../../Services/auth';
import { TablePagination, CircularProgress, Box, Button } from '@mui/material';
import { Eye } from '@wandersonalwes/iconsax-react';
import {
    Avatar,
    Divider,
    Grid,
    Paper,
} from '@mui/material';

// Material-UI Icons
import {
    Language as LanguageIcon,
    MonetizationOn as MonetizationOnIcon,
    ToggleOn as ToggleOnIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

export default function CallHistory({ agentId }) {
    const [open, setOpen] = useState(false);
    const [calldata, setCallData] = useState([]);
    const [Transcription, setTranscription] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingCallId, setPlayingCallId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [loadedMonths, setLoadedMonths] = useState([]);
    const [loadMoreAvailable, setLoadMoreAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState('');
    const [agent, setAgent] = useState(null);

    useEffect(() => {
        fetchCalls(currentMonth, currentYear);
    }, [agentId]);

    const fetchCalls = async (month, year, append = false) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/callHistory/agent/${agentId}/calls-by-month`,
                {
                    params: { month, year },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const newCalls = res.data?.calls || [];
            if (newCalls.length === 0) setLoadMoreAvailable(false);

            setCallData(prev => append ? [...prev, ...newCalls] : newCalls);
            setLoadedMonths(prev => [...prev, `${month}-${year}`]);
            setLoadMoreError('');
        } catch (err) {
            console.error('Error fetching calls:', err);
            setLoadMoreError('Failed to load more calls');
            setLoadMoreAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        let month = currentMonth - 1;
        let year = currentYear;
        if (month < 1) {
            month = 12;
            year -= 1;
        }
        setCurrentMonth(month);
        setCurrentYear(year);

        if (!loadedMonths.includes(`${month}-${year}`)) {
            fetchCalls(month, year, true);
        }
    };

    console.log(loadMoreAvailable)
    const formatDuration = (duration_ms) => {
        const totalSeconds = Math.floor(duration_ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleViewCallHistory = async (call) => {
        setOpen(true);
        const res = await getAgentCallById(call.agent_id, call.call_id, call.start_timestamp);
        setTranscription(res?.call?.transcript_object || []);
    };

    const handlePlayPauseRecording = (url, callId) => {
        if (!url) return;
        if (playingCallId === callId) {
            currentAudio.pause();
            setPlayingCallId(null);
            return;
        }
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        const audio = new Audio(url);
        audio.play().catch(() => { });
        setCurrentAudio(audio);
        setPlayingCallId(callId);
        audio.onended = () => setPlayingCallId(null);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getColor = (sentiment) => {
        if (!sentiment) return "default";
        switch (sentiment.toLowerCase()) {
            case "positive": return "success";
            case "negative": return "error";
            case "neutral": return "warning";
            default: return "default";
        }
    };

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/getAgent/${agentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust token storage as needed
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch agent');
                }


                const data = await res.json();
                console.log(data, "data"); // Fixed this line
                setAgent(data);
            } catch (err) {
                console.log(err.message);
            }


        }
        fetchAgent();
    }, [agentId]);

    const formatMinutes = (minutes) => {
        if (!minutes && minutes !== 0) return 'N/A';
        return `${minutes} minutes`;
    };
    const getStatusColor = (status) => {
        return status ? 'success' : 'error';
    };


    return (
        <>
            <MainCard title={<Typography variant="h5">Call Details</Typography>} content={false}>


                <Divider sx={{ my: 2 }} />

                <TableContainer>
                    <Table sx={{ minWidth: 560 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date/Time</TableCell>
                                <TableCell align="center">Call duration</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell align="center">Lead Type</TableCell>
                                <TableCell>Sentiment</TableCell>
                                <TableCell align="center">Call Type</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {calldata?.length > 0 ? calldata
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell>{new Date(row.start_timestamp).toLocaleString()}</TableCell>
                                        <TableCell align="center">{formatDuration(row?.duration_ms)} min</TableCell>
                                        <TableCell>
                                            <Tooltip title={row?.custom_analysis_data?.reason || 'No reason'}>
                                                <Typography noWrap maxWidth={200}>
                                                    {row?.custom_analysis_data?.reason || 'No reason'}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip size="small" color="info" label={row?.custom_analysis_data?.lead_type || 'N/A'} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip size="small" color={getColor(row?.user_sentiment)} label={row?.user_sentiment || "N/A"} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip size="small" color="primary" label={row?.call_type || 'N/A'} />
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                                <Tooltip title="View Transcription">
                                                    <IconButton color="secondary" onClick={() => handleViewCallHistory(row)}><Eye /></IconButton>
                                                </Tooltip>
                                                <Tooltip title={playingCallId === row.call_id ? "Pause Recording" : "Play Recording"}>
                                                    <IconButton color="primary" onClick={() => handlePlayPauseRecording(row.recording_url, row.call_id)}>
                                                        {playingCallId === row.call_id
                                                            ? <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                                            : <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8 5v14l11-7z" /></svg>
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : <TableRow>
                                    <TableCell colSpan={7} align="center">No data available</TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={calldata?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[2, 5, 10, 25, 50]}
                />

                {((page + 1) * rowsPerPage >= calldata.length && loadMoreAvailable) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        {loadMoreError && (
                            <Typography color="error" sx={{ mr: 2 }}>
                                {loadMoreError}
                            </Typography>
                        )}
                        <Button variant="contained" onClick={loadMore} disabled={loading}>
                            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Load More"}
                        </Button>
                    </Box>
                )}
            </MainCard>

            {/* <ChatModal open={open} onClose={() => setOpen(false)} transcription={Transcription} /> */}
        </>
    );
}
