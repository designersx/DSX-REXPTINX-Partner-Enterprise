// 'use client';
// // material-ui
// import Avatar from '@mui/material/Avatar';
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Tooltip from '@mui/material/Tooltip';
// import Typography from '@mui/material/Typography';
// import IconButton from 'components/@extended/IconButton';
// import MainCard from 'components/MainCard';
// import ChatModal from './chatModl';
// import { useRouter } from "next/router";
// import { Eye } from '@wandersonalwes/iconsax-react';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { getAgentCallById } from '../../../Services/auth';
// // import { TablePaginationActions } from '@mui/material';
// import { TablePagination } from '@mui/material';

// // Sample Transcription (use actual transcription data)
// const sampleTranscription = [
//   { id: 1, sender: 'Agent', message: 'Hello! How can I help you today?', timestamp: '2025-09-19 10:00 AM' },
//   { id: 2, sender: 'Customer', message: 'Hi! I have an issue with my last order.', timestamp: '2025-09-19 10:01 AM' },
//   { id: 3, sender: 'Agent', message: 'I’m sorry to hear that. Could you share your order ID?', timestamp: '2025-09-19 10:02 AM' },
// ];
// export default function TransactionHistoryCard({ agentId }) {
//   console.log(agentId, "agentId")
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [calldata, setCallData] = useState([]);
//   const [Transcription, setTranscription] = useState([]);
//   const [currentAudio, setCurrentAudio] = useState(null);
// const [playingCallId, setPlayingCallId] = useState(null);
// const [page, setPage] = useState(0);
// const [rowsPerPage, setRowsPerPage] = useState(50);
//  const [agent, setAgent] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const month = '9';
//         const year = '2025';
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/callHistory/agent/${agentId}/calls-by-month`, {
//           params: { month, year },
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         console.log(response?.data, "response?.data?.status")
//         if (response) {
//           setCallData(response?.data?.calls);
//         }


//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [agentId]);
//   // Convert milliseconds to minutes
//  const formatDuration = (duration_ms) => {
//   const totalSeconds = Math.floor(duration_ms / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;

//   // Pad single digit seconds with a 0 (e.g., 1:05 instead of 1:5)
//   const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   return formatted;
// };

   
  
//   const handleViewCallHistory = async (call) => {
//     setOpen(true)
//     // console.log(call, "HELLO")
//     const agentId = call.agent_id
//     const callId = call.call_id
//     const start_timestamp= call.start_timestamp
//     // const agentId=agent_id
//     //  const  callId=callId
//      const res = await getAgentCallById(agentId, callId, start_timestamp)
//      console.log(res,"res")
//      setTranscription(res?.call?.transcript_object ||[])
//   }

//  const handlePlayPauseRecording = (url, callId) => {
//   if (!url) return;

//   // If the same audio is already playing, toggle pause/play
//   if (playingCallId === callId) {
//     currentAudio.pause();
//     setPlayingCallId(null);
//     return;
//   }

//   // Stop previous audio if playing
//   if (currentAudio) {
//     currentAudio.pause();
//     currentAudio.currentTime = 0;
//   }

//   const audio = new Audio(url);
//   audio.play().catch((err) => console.error("Playback failed", err));

//   setCurrentAudio(audio);
//   setPlayingCallId(callId);

//   // When audio ends
//   audio.onended = () => {
//     setPlayingCallId(null);
//   };
// };
// // console.log(calldata[0]?.duration_ms)
// useEffect(() => {
//   const fetchAgent = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/getAgent/${agentId}`, { 
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust token storage as needed
//         }
//       });

//       if (!res.ok) {
//         throw new Error('Failed to fetch agent');
//       }

//       const data = await res.json(); 
//       console.log(data, "data"); // Fixed this line
//       setAgent(data);
//     } catch (err) {
//       console.log(err.message); 
//     } 
//   };

//   fetchAgent();
// }, [agentId]);

// const getColor = (sentiment?: string) => {
//   if (!sentiment) return "default";

//   switch (sentiment.toLowerCase()) {
//     case "positive":
//       return "success"; // green
//     case "negative":
//       return "error"; // red
//     case "neutral":
//       return "warning"; // yellow/orange
//     default:
//       return "default"; // grey
//   }
// };
// const handleChangePage = (event, newPage) => {
//   setPage(newPage);
// };

// const handleChangeRowsPerPage = (event) => {
//   setRowsPerPage(parseInt(event.target.value, 10));
//   setPage(0);
// };

//   return (
//     <>
//       <MainCard title={<Typography variant="h5">Call Details</Typography>} content={false}>
//         <TableContainer>
//           <Table sx={{ minWidth: 560 }}>
//             <TableHead>
//               <TableRow>
//                  <TableCell>Date/Time</TableCell>
//                  <TableCell align="center">Call duration</TableCell>
               
//                 <TableCell>Reason</TableCell>
               
                
//                 <TableCell align="center">Lead Type</TableCell>
//                  <TableCell>Sentiment</TableCell>
//                 <TableCell align="center">Call Type</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {calldata?.length > 0 ?
//                 calldata
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row, index) => (
//                   <TableRow hover key={index}>
//                     <TableCell>
//                       <Stack>
//                         <Typography>{new Date(row.start_timestamp).toLocaleString()}</Typography>
//                          {/* <Typography>{new Date(row.end_timestamp).toLocaleString()}</Typography> */}
//                       </Stack>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Typography>{formatDuration(row?.duration_ms)} min</Typography>
//                     </TableCell>
                  
//                     <TableCell>
//                    <Tooltip title={row?.custom_analysis_data?.reason || 'No reason'}>
//   <Typography>
//     {(row?.custom_analysis_data?.reason || 'No reason').length > 40
//       ? `${row.custom_analysis_data.reason.slice(0, 40)}...`
//       : row.custom_analysis_data.reason || 'No reason'}
//   </Typography>
// </Tooltip>

//                     </TableCell>
                    
                    
//                     <TableCell align="center">
//                       <Chip size="small" color="info" label={row?.custom_analysis_data?.lead_type || 'N/A'} />
//                     </TableCell>
//                       <TableCell align="center">
//                       <Typography>
//                            {/* <Chip size="small" color={getColor(row?.user_sentiment)} label={row?.user_sentiment}/> */}
//                            <Chip
//                             size="small"
//                             color={getColor(row?.user_sentiment)}
//                             label={row?.user_sentiment || "N/A"}
//                           />
//                         </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       <Chip size="small" color="primary" label={row?.call_type || 'N/A'} />
//                     </TableCell>
//                     <TableCell>
//                       <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
//                         <Tooltip title="View Transcription">
//                           <IconButton color="secondary" onClick={() => handleViewCallHistory(row)}>
//                             <Eye />
//                           </IconButton>
//                         </Tooltip>
//                     <Stack direction="row" spacing={1}>
//   {/* Play/Pause Button */}
//   <Tooltip title={playingCallId === row.call_id ? "Pause Recording" : "Play Recording"}>
//     <IconButton
//       color="primary"
//       onClick={() => handlePlayPauseRecording(row.recording_url, row.call_id)}
//     >
//       {
//         playingCallId === row.call_id ? (
//           // Pause Icon
//           <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" style={{ fill: 'currentColor' }}>
//             <path d="M0 0h24v24H0z" fill="none" />
//             <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
//           </svg>
//         ) : (
//           // Play Icon
//           <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" style={{ fill: 'currentColor' }}>
//             <path d="M0 0h24v24H0z" fill="none" />
//             <path d="M8 5v14l11-7z" />
//           </svg>
//         )
//       }
//     </IconButton>
//   </Tooltip>

//   {/* Open in New Tab */}
//   <Tooltip title="Play in New Tab">
//     <a href={row.recording_url} target="_blank" rel="noopener noreferrer">
//       <IconButton color="secondary">
//         <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" style={{ fill: 'currentColor' }}>
//           <path d="M0 0h24v24H0z" fill="none" />
//           <path d="M14 2v2h3.59L10 11.59 11.41 13 19 5.41V9h2V2zM5 5v14h14v-6h-2v4H7V7h4V5H5z" />
//         </svg>
//       </IconButton>
//     </a>
//   </Tooltip>
// </Stack>

//                       </Stack>
//                     </TableCell>
//                   </TableRow>
//                 )) : <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Typography variant="body1" color="text.secondary">
//                       No data available
//                     </Typography>
//                   </TableCell>
//                 </TableRow>}
//             </TableBody>
//           </Table>
//         </TableContainer>
//                <TablePagination
//                   component="div"
//                   count={calldata?.length||0}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   rowsPerPage={rowsPerPage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   rowsPerPageOptions={[2,5, 10, 25, 50]}
//                 />
//       </MainCard>

//       {/* Chat Modal for Transcription */}
//       <ChatModal open={open} onClose={() => setOpen(false)} transcription={Transcription} />
//     </>
//   );
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
import ChatModal from './chatModl';
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

export default function TransactionHistoryCard({ agentId }) {
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
    audio.play().catch(() => {});
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

  if (!agentId) {
    return (
      <MainCard title={<Typography variant="h5">Agent Details</Typography>} content={false}>
        <Typography variant="body1" color="text.secondary">
          No agent ID provided
        </Typography>
      </MainCard>
    );
  }
  return (
    <>
      <MainCard title={<Typography variant="h5">Call Details</Typography>} content={false}>
        {agent && (
          <Box sx={{ 
            mb: 3, 
            p: { xs: 2, sm: 3 }, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            {/* Header Section */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2, 
              mb: 3 
            }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
                <Avatar
                  src={agent.avatar}
                  alt={agent.agentName}
                  sx={{ 
                    width: { xs: 50, sm: 60 }, 
                    height: { xs: 50, sm: 60 },
                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                  }}
                >
                  {!agent.agentName ? 'A' : agent.agentName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'primary.main',
                      mb: { xs: 0.5, sm: 0 },
                      lineHeight: 1.2
                    }}
                  >
                    {agent.agentName || 'Unknown Agent'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                  >
                    {agent.agentRole || 'Agent'}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Action Buttons - Only on larger screens */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                ml: 'auto', 
                gap: 1 
              }}>
                <Chip 
                  size="small" 
                  label={`Code: ${agent.agentCode || 'N/A'}`} 
                  color="warning" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
                
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Main Info Grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Language and Accent */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <LanguageIcon fontSize="small" color="primary" />
                        Language & Accent
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                      <Chip 
                        size="small" 
                        label={agent.agentLanguage || 'N/A'} 
                        color="primary" 
                        variant="filled"
                        sx={{ 
                          fontWeight: 500,
                          minWidth: 80,
                          justifyContent: 'center'
                        }}
                      />
                      <Chip 
                        size="small" 
                        label={agent.agentAccent || 'N/A'} 
                        color="secondary" 
                        variant="filled"
                        sx={{ 
                          fontWeight: 500,
                          minWidth: 80,
                          justifyContent: 'center'
                        }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              {/* Plan and Usage */}
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <MonetizationOnIcon fontSize="small" color="primary" />
                        Plan & Usage
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',gap:'5px' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Plan Type
                        </Typography>
                        <Chip 
                          size="small" 
                          label={(agent.agentPlan || 'N/A').toUpperCase()} 
                          color="info" 
                          variant="outlined"
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            px: 1
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',gap:'5px' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Minutes Left
                        </Typography>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: (agent.mins_left < 100 && agent.mins_left !== null) ? 'error.main' : 'success.main',
                              lineHeight: 1
                            }}
                          >
                            {formatMinutes(agent.mins_left)}
                          </Typography>
                          {agent.planMinutes && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                fontSize: '0.7rem'
                              }}
                            >
                              of {formatMinutes(agent.planMinutes)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              {/* Status and Activity */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <ToggleOnIcon fontSize="small" color="primary" />
                        Status & Activity
                      </Typography>
                    </Box>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap:'5px', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Agent Status
                        </Typography>
                        <Chip 
                          size="medium" 
                          label={agent.agentStatus ? 'Active' : 'Inactive'} 
                          color={getStatusColor(agent.agentStatus)}
                          sx={{ 
                            fontWeight: 600,
                            px: 1.5,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Total Calls
                        </Typography>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            color: 'primary.main',
                            lineHeight: 1
                          }}
                        >
                          {agent.callCount || 0}
                        </Typography>
                      </Box>
                      {agent.isDeactivated && (
                        <Alert severity="warning" sx={{ mt: 1, fontSize: '0.8rem' }}>
                          Agent is deactivated
                        </Alert>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              {/* Technical Details */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <SettingsIcon fontSize="small" color="primary" />
                        Technical Details
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: 'block',
                            fontSize: '0.75rem',
                            mb: 0.5
                          }}
                        >
                          Voice Model
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: '0.85rem'
                          }}
                        >
                          {agent.agentVoice.split('-')[1] || 'Default'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: 'block',
                            fontSize: '0.75rem',
                            mb: 0.5
                          }}
                        >
                          Gender
                        </Typography>
                        <Chip 
                          size="small" 
                          label={agent.agentGender || 'N/A'} 
                          color={agent.agentGender === 'female' ? 'secondary' : 'primary'} 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: 'block',
                            fontSize: '0.75rem',
                            mb: 0.5
                          }}
                        >
                          Created
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: '0.85rem'
                          }}
                        >
                          {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Grid>
                     
                    </Grid>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* Mobile Action Row */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mt: 2, 
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Chip 
                size="small" 
                label={`Code: ${agent.agentCode || 'N/A'}`} 
                color="warning" 
                variant="outlined"
              />
              <Chip 
                size="small" 
                label={agent.knowledgeBaseStatus ? 'KB Active' : 'No KB'} 
                color={agent.knowledgeBaseStatus ? 'success' : 'default'} 
                variant="outlined"
              />
            </Box>
          </Box>
        )}

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
                              ? <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                              : <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8 5v14l11-7z"/></svg>
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
          rowsPerPageOptions={[2,5,10,25,50]}
        />

   {((page + 1) * rowsPerPage >= calldata.length && loadMoreAvailable) && (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
    {loadMoreError && (
      <Typography color="error" sx={{ mr: 2 }}>
        {loadMoreError}
      </Typography>
    )}
    <Button variant="contained" onClick={loadMore} disabled={loading}>
      {loading ? <CircularProgress size={20} sx={{ color: 'white' }}/> : "Load More"}
    </Button>
  </Box>
)}
      </MainCard>

      <ChatModal open={open} onClose={() => setOpen(false)} transcription={Transcription} />
    </>
  );
}
