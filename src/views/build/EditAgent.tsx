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
      const token = localStorage.getItem("authToken");
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
    return `${Math.floor(minutes / 60)} mins`;
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
      <MainCard title={<Typography variant="h5">Agent Details</Typography>} content={false}>
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
                 src={agent.avatar?.startsWith('/') ? agent.avatar : `/${agent.avatar}`}
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
