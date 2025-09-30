'use client';
// material-ui
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import CallIcon from '@mui/icons-material/Call';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import BusinessIcon from '@mui/icons-material/Business';
import AlertCustomerDelete from './AlertCustomerDelete';
import { FormControl, InputLabel, Select } from "@mui/material";
// project-imports
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import AgentGeneralInfoModal from './AgentgeneralinfoModal';
import StoreIcon from '@mui/icons-material/Store';
import Fade from '@mui/material/Fade';
import LanguageIcon from '@mui/icons-material/Language';
import { Link2, Sms } from '@wandersonalwes/iconsax-react';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import AbcIcon from '@mui/icons-material/Abc';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// assets
import { Add, Edit, Eye, Trash, UserEdit } from '@wandersonalwes/iconsax-react';

import { useEffect, useRef, useState } from 'react';
import CallDialog from 'components/CallDialog';
import { RetellWebClient } from 'retell-client-js-sdk';

import { useRouter } from 'next/navigation';
import { fetchAgent } from '../../../Services/auth';
import { TablePagination } from '@mui/material';
import Loader from 'components/Loader';
import Grid from '@mui/material/Grid';

import Search from 'layout/DashboardLayout/Header/HeaderContent/Search';
const Avatar1 = '/assets/images/avatrs/Female-01.png';
const Avatar2 = '/assets/images/avatrs/male-01.png';
const Avatar3 = '/assets/images/avatrs/Female-02.png';
const Avatar4 = '/assets/images/avatrs/male-02.png';
const Avatar5 = '/assets/images/avatrs/male-03.png';

// table data
function createData(
  name: string,
  avatar: string,
  position: string,
  date: string,
  time: string,
  Amount: number,
  status: string,
  color: string
) {
  return { name, avatar, position, date, time, Amount, status, color };
}

type ChipColor = 'default' | 'success' | 'warning' | 'error' | 'secondary' | 'primary' | 'info';

const getValidColor = (color: string): ChipColor => {
  const validColors: ChipColor[] = ['default', 'success', 'warning', 'error', 'secondary', 'primary', 'info'];
  return validColors.includes(color as ChipColor) ? (color as ChipColor) : 'default';
};

const rows = [
  createData('Airi Satou', Avatar1, 'Samsung', '2023/02/07', '09:05 PM', 950, 'Active', 'success'),
  createData('Ashton Cox', Avatar2, 'Microsoft', '2023/02/01', '02:14 PM', 520, 'Active', 'success'),
  createData('Bradley Greer', Avatar3, 'You Tube ', '2023/01/22', '10:32 AM', 100, 'Active', 'success'),
  createData('Brielle Williamson', Avatar4, 'Amazon', '2023/02/07', '09:05 PM', 760, 'Inactive', 'error'),
  createData('Airi Satou', Avatar5, 'Spotify', '2023/02/07', '09:05 PM', 60, 'Inactive', 'error')
];

export default function TransactionHistoryCard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]); // store API data
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const isEndingRef = useRef(false);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callId, setCallId] = useState('');
  const [retellWebClient, setRetellWebClient] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState("all");

  // const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const res = await fetchAgent(); // ✅ call your API function
        let agentsData = res?.agents || [];
        setAgents(agentsData);
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);
  const handleCreateAgentClick = () => {
    setIsModalOpen(true);
  };

  const handleAgentSubmit = async (agentData) => {
    await loadAgents();
    // Handle successful agent creation - you might want to refresh your agents list here
    setIsModalOpen(false);
    // Optionally refresh the table data or show a success message
  };

  const handleModalClose = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setIsModalOpen(false);
  };
  const loadAgents = async () => {
    try {
      setLoading(true);
      const res = await fetchAgent(); // ✅ call your API function
      // Assuming res is an array of agents
      setAgents(res?.agents || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (agent: any) => {
    setSelectedAgent(agent);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    handleEndCall();
    if (isCallActive) {
      isEndingRef.current = true;
      setCallLoading(true);
      setTimeout(() => {
        isEndingRef.current = false;
        setIsCallActive(false);
        setCallLoading(false);
        setOpenDialog(false);
        setSelectedAgent(null);
      }, 1000); // Simulate call ending delay
    } else {
      setOpenDialog(false);
      setSelectedAgent(null);
    }
  };

  const handleStartCall = async () => {
    setCallLoading(true);

    let micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

    if (micPermission.state !== 'granted') {
      try {
        // Step 2: Ask for mic access
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Step 3: Recheck permission after user action
        micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

        if (micPermission.state !== 'granted') {
          setSnackbar({
            open: true,
            message: 'You must grant microphone access to start the call.',
            severity: 'warning'
          });

          return;
        }
      } catch (err) {
        // User denied mic access
        setSnackbar({
          open: true,
          message: 'Please allow microphone permission to continue.',
          severity: 'error'
        });
        setCallLoading(false);
        // setShowCallModal(false);
        return;
      }
    }
    setCallLoading(true);
    try {
      const agentId = selectedAgent?.agent_id;

      if (!agentId) throw new Error('No agent ID found');

      // Example: Initiate a call with Retell AI
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/create-web-call`,
        {
          agent_id: agentId
          // Add other required parameters, e.g., phone number or call settings
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCallLoading(true);

      if (response.status == 403) {
        setSnackbar({
          open: true,
          message: 'Agent Plan minutes exhausted',
          severity: 'error'
        });
        setIsCallInProgress(false);
        // setTimeout(() => {
        //   setPopupMessage("");
        // }, 5000);
        return;
      }

      await retellWebClient.startCall({ accessToken: response?.data?.access_token });
      setCallId(response?.data?.call_id);
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);

      if (error.status == 403) {
        setSnackbar({
          open: true,
          message: 'Agent Plan minutes exhausted',
          severity: 'error'
        });
        setIsCallInProgress(false);
        // setTimeout(() => {
        //   setPopupMessage("");
        // }, 5000);
        return;
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to start call. Please try again.',
          severity: 'error'
        });
      }
    } finally {
      setCallLoading(false);
    }
  };

  const handleEndCall = async () => {
    isEndingRef.current = true;
    setCallLoading(true);
    isEndingRef.current = false;
    // setRefresh((prev) => !prev);
    try {
      // Example: End the call with Retell AI
      // const callId = localStorage.getItem("currentCallId");
      // const callId = localStorage.getItem("currentCallId");
      // if (!callId) throw new Error("No call ID found");

      const response = await retellWebClient.stopCall();

      setIsCallActive(false);
      isEndingRef.current = false;
    } catch (error) {
      console.error('Error ending call:', error);
      setSnackbar({
        open: true,
        message: 'Failed to end call. Please try again.',
        severity: 'error'
      });
    }
    setTimeout(() => {
      isEndingRef.current = false;
      setIsCallActive(false);
      setCallLoading(false);
      setOpenDialog(false);
      setSelectedAgent(null);
    }, 1000); // Simulate call ending delay
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };
  const filteredAgents = agents
    .filter((agent) => {
      if (planFilter === "all") return true;
      if (planFilter === "other") {
        return agent.agentPlan !== "smb" && agent.agentPlan !== "Enterprise";
      }
      return agent.agentPlan === planFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  console.log(filteredAgents, "filteredAgents")
  //LOCK
  useEffect(() => {
    const client = new RetellWebClient();
    client.on('call_started', () => setIsCallActive(true));
    client.on('call_ended', () => setIsCallActive(false));
    client.on('update', (update) => {
      //  Mark the update clearly as AGENT message
      const customUpdate = {
        ...update,
        source: 'agent' // Add explicit source
      };

      // Dispatch custom event for CallTest
      window.dispatchEvent(new CustomEvent('retellUpdate', { detail: customUpdate }));
    });

    setRetellWebClient(client);
  }, []);
  useEffect(() => {
    loadAgents();
  }, []);
  return (
    <>
      {isModalOpen ? (
        <AgentGeneralInfoModal open={isModalOpen} onClose={handleModalClose} onSubmit={handleAgentSubmit} />
      ) : (

        <MainCard
          title={<Typography variant="h5">Your Agents</Typography>}
          content={false}
          secondary={
            <>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: 200, mb: 2 }}>
                  <InputLabel id="agent-plan-filter">Filter by Agent Type</InputLabel>
                  <Select
                    labelId="agent-plan-filter"
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="smb">SMB</MenuItem>
                    <MenuItem value="Enterprise">Enterprise</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" startIcon={<Add />} size="large" onClick={handleCreateAgentClick}>
                  <Link href="#" variant="h5" color="white" component="button" sx={{ textDecoration: 'none' }}>
                    Create Agent
                  </Link>
                </Button>
              </Stack>
            </>
          }
        >

          <Grid container spacing={5} sx={{
            alignItems: 'stretch',
            display: 'flex',
            p: 3
          }}>
            {loading ? (
              <Loader />
            ) : filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>No agents found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((agent, index) => (
                  <Grid
                    key={index}
                    size={{ xs: 12, sm: 10, lg: 4 }}
                    style={{
                      alignItems: 'stretch',
                      display: 'flex',
                      opacity: agent.agentStatus === 2 ? 0.6 : 1, // dim the card if disabled,
                      pointerEvents: agent.agentStatus === 2 ? 'none' : 'auto', // prevent clicks


                    }}
                  >

                    <Grid
                      id="print"
                      key={index}
                      container
                      spacing={2.25}
                      style={{ border: '1px solid rgb(231, 234, 238)', padding: '12px', borderRadius: '4%' }}
                    >
                      <Grid key={index} size={12}>
                        <List sx={{ width: 1, p: 0 }}>
                          <ListItem
                            disablePadding
                            secondaryAction={
                              <>
                                <Tooltip title="View call history">
                                  <IconButton color="secondary" onClick={() => router.push(`/build/agents/agentdetails/${agent?.agent_id}`)}>
                                    <Eye />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit agent">
                                  <IconButton color="secondary" onClick={() => router.push(`/build/agents/editAgent/${agent?.agent_id}`)}>
                                    <UserEdit />
                                  </IconButton>
                                </Tooltip>
                              </>
                            }
                          >
                            <ListItemAvatar>
                              <Avatar alt={agent.agentName} src={agent.avatar?.startsWith('/') ? agent.avatar : `/${agent.avatar}`} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={<Typography variant="subtitle1">{agent.agentName}</Typography>}
                              secondary={<Typography sx={{ color: 'text.secondary' }}>{agent?.businessDetails?.name}</Typography>}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid size={12}>
                        <Divider />
                      </Grid>
                      <Grid size={12}>
                        <Typography>Hello, {agent.agentName}</Typography>
                      </Grid>
                      <Grid size={12}>
                        <Grid container spacing={1} direction={{ xs: 'column', md: 'row' }}>
                          <Grid size={6}>
                            <List
                              sx={{
                                p: 0,
                                overflow: 'hidden',
                                '& .MuiListItem-root': { px: 0, py: 0.5 },
                                '& .MuiListItemIcon-root': { minWidth: 28 }
                              }}
                            >
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <Sms size={18} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.agentGender}</Typography>} />
                              </ListItem>
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <AbcIcon size={18} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.agentAccent}</Typography>} />
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid size={6}>
                            <List
                              sx={{
                                p: 0,
                                overflow: 'hidden',
                                '& .MuiListItem-root': { px: 0, py: 0.5 },
                                '& .MuiListItemIcon-root': { minWidth: 28 }
                              }}
                            >
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <LanguageIcon size={18} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent.agentLanguage}</Typography>} />
                              </ListItem>
                              <ListItem alignItems="flex-start">
                                <ListItemIcon>
                                  <Link2 size={18} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Link href="https://google.com" target="_blank" sx={{ textTransform: 'lowercase' }}>
                                      https://rxpt.us
                                    </Link>
                                  }
                                />
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid size={6}>
                            <List
                              sx={{
                                p: 0,
                                overflow: 'hidden',
                                '& .MuiListItem-root': { px: 0, py: 0.5 },
                                '& .MuiListItemIcon-root': { minWidth: 28 },
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                            >
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <BusinessIcon size={18} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.businessDetails?.BusinessType}</Typography>}
                                />
                              </ListItem>
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <Link2 size={18} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{agent?.agentPlan.toUpperCase()}</Typography>} />
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid size={6}>
                            <List
                              sx={{
                                p: 0,
                                overflow: 'hidden',
                                '& .MuiListItem-root': { px: 0, py: 0.5 },
                                '& .MuiListItemIcon-root': { minWidth: 28 }
                              }}
                            >
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <StoreIcon size={18} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={<Typography sx={{ color: 'text.secondary' }}>{agent.businessDetails?.name}</Typography>}
                                />
                              </ListItem>
                              <ListItem alignItems="flex-start">
                                <ListItemIcon style={{ marginTop: '3px' }}>
                                  <AccessTimeIcon size={18} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.mins_left}</Typography>} />
                              </ListItem>
                            </List>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={12}>
                        <Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0 }} component="ul">
                          </Box>
                        </Box>
                      </Grid>
                      <Stack
                        direction="row"
                        className="hideforPDf"
                        sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', mt: 'auto', mb: 0, pt: 2.25, width: '100%' }}
                      >
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Updated 3 days ago
                        </Typography>

                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<CallIcon />}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            boxShadow: 2
                          }}
                          onClick={() => handleOpenDialog(agent)}
                        >
                          Test Agent
                        </Button>
                      </Stack>

                    </Grid>





                  </Grid>
                ))
            )}
          </Grid>
          <TablePagination
            component="div"
            count={agents.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </MainCard>
      )}

      {/* Call Dialog */}
      {selectedAgent && (
        <CallDialog
          open={openDialog}
          onClose={handleCloseDialog}
          agent={selectedAgent}
          isCallActive={isCallActive}
          callLoading={callLoading}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          isEndingRef={isEndingRef}
        />
      )}

      {/* Agent Creation Modal */}
      {/* <AgentGeneralInfoModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAgentSubmit}
      /> */}
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>




        
      </Snackbar>
    </>
  );
}
