'use client';
// material-ui
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import axios from "axios"
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
// project-imports
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import AgentGeneralInfoModal from './AgentgeneralinfoModal';

// assets
import { Add, Edit, Eye, Trash } from '@wandersonalwes/iconsax-react';

import { useEffect, useRef, useState } from 'react';
import CallDialog from 'components/CallDialog';
import { RetellWebClient } from "retell-client-js-sdk";

import { useRouter } from 'next/navigation';
import { fetchAgent } from '../../../Services/auth';
import { TablePagination } from '@mui/material';
import Loader from 'components/Loader';
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
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<any[]>([]); // store API data
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const isEndingRef = useRef(false);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callId, setCallId] = useState("");
  const [retellWebClient, setRetellWebClient] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  // const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info',
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
        console.error("Error fetching agents:", err);
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
      setLoading(true)
      const res = await fetchAgent(); // ✅ call your API function
      // Assuming res is an array of agents
      setAgents(res?.agents || []);
    } catch (err) {
      console.error("Error fetching agents:", err);
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

    let micPermission = await navigator.permissions.query({ name: "microphone" as PermissionName });

    if (micPermission.state !== "granted") {
      try {
        // Step 2: Ask for mic access
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Step 3: Recheck permission after user action
        micPermission = await navigator.permissions.query({ name: "microphone" as PermissionName });

        if (micPermission.state !== "granted") {
          setSnackbar({
            open: true,
            message: 'You must grant microphone access to start the call.',
            severity: 'warning',
          });

          return;
        }
      } catch (err) {
        // User denied mic access
        setSnackbar({
          open: true,
          message: 'Please allow microphone permission to continue.',
          severity: 'error',
        });
        setCallLoading(false);
        // setShowCallModal(false);
        return;
      }
    }
    setCallLoading(true);
    try {
      const agentId = selectedAgent?.agent_id;

      if (!agentId) throw new Error("No agent ID found");

      // Example: Initiate a call with Retell AI
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/create-web-call`,
        {
          agent_id: agentId,
          // Add other required parameters, e.g., phone number or call settings
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCallLoading(true);

      if (response.status == 403) {
        setSnackbar({
          open: true,
          message: 'Agent Plan minutes exhausted',
          severity: 'error',
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
      console.error("Error starting call:", error);

      if (error.status == 403) {
        setSnackbar({
          open: true,
          message: 'Agent Plan minutes exhausted',
          severity: 'error',
        });
        setIsCallInProgress(false);
        // setTimeout(() => {
        //   setPopupMessage("");
        // }, 5000);
        return;
      }
      else {
        setSnackbar({
          open: true,
          message: 'Failed to start call. Please try again.',
          severity: 'error',
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
      console.error("Error ending call:", error);
      setSnackbar({
        open: true,
        message: 'Failed to end call. Please try again.',
        severity: 'error',
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
  //LOCK
  useEffect(() => {
    const client = new RetellWebClient();
    client.on("call_started", () => setIsCallActive(true));
    client.on("call_ended", () => setIsCallActive(false));
    client.on("update", (update) => {
      //  Mark the update clearly as AGENT message
      const customUpdate = {
        ...update,
        source: "agent", // Add explicit source
      };

      // Dispatch custom event for CallTest
      window.dispatchEvent(
        new CustomEvent("retellUpdate", { detail: customUpdate })
      );
    });

    setRetellWebClient(client);
  }, []);
  useEffect(() => {
    loadAgents();
  }, []);
  return (
    <>
      {isModalOpen ? <AgentGeneralInfoModal  open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAgentSubmit} /> : <MainCard
        title={<Typography variant="h5">Your Agents</Typography>}
        content={false}
        secondary={
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={handleCreateAgentClick}
          >
            <Link
              href="#"
              variant="h5"
              color="white"
              component="button"
              sx={{ textDecoration: "none" }}
            >
              Create Agent
            </Link>
          </Button>
        }
      >
        {/* <Search value={searchTerm} onChange={setSearchTerm} /> */}
        <TableContainer>
          <Table sx={{ minWidth: 560 }}>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Agent Name</TableCell>
                <TableCell>Business Name</TableCell>
                <TableCell>Business Category</TableCell>
                <TableCell>Date/Time</TableCell>
                <TableCell align="center">Mins Assigned</TableCell>
                <TableCell align="center">Mins Remaining</TableCell>
                {/* <TableCell align="center">Status</TableCell> */}
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <Loader />
              ) : agents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography>No agents found.</Typography>
                  </TableCell>
                </TableRow>
              ) : agents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={index}>
                    {/* Image */}
                    <TableCell align="center">
                      <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
                        <Avatar
                          alt={row.agentName}
                          src={row.avatar?.startsWith("/") ? row.avatar : `/${row.avatar}`}
                        />

                      </Stack>
                    </TableCell>

                    {/* Agent Name */}
                    <TableCell align="center">
                      <Typography>{row.agentName}</Typography>
                    </TableCell>

                    {/* Business Name */}
                    <TableCell>
                      <Typography>{row?.businessDetails?.name}</Typography>
                    </TableCell>

                    {/* Business Category */}
                    <TableCell>
                      <Typography>{row?.businessDetails?.BusinessType}</Typography>
                    </TableCell>

                    {/* Date/Time */}
                    <TableCell>
                      <Stack>
                        <Typography> {new Date(row.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}</Typography>

                      </Stack>
                    </TableCell>
                    {/* Mins Assigned */}
                    <TableCell align="center">
                      <Typography>{Math.floor(row.planMinutes / 60)}</Typography>
                    </TableCell>

                    {/* Mins Remaining */}
                    <TableCell align="center">
                      <Typography>{Math.floor(row.mins_left / 60)}</Typography>
                    </TableCell>

                    {/* Status */}
                    {/* <TableCell align="center">
                    <Chip size="small" color="grey" label={row?.agentAccent} />
                  </TableCell> */}

                    {/* Action */}
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "center", gap: 1 }}
                      >
                        <Tooltip title="View call history">
                          <IconButton
                            color="secondary"
                            onClick={() => router.push(`/build/agents/agentdetails/${row?.agent_id}`)}
                          >
                            <Eye />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Test Agent">
                          <Chip
                            size="small"
                            color={getValidColor("primary")}
                            label="Test Call"
                            onClick={() => handleOpenDialog(row)}
                          />
                        </Tooltip>

                        {/* <Tooltip title="View">
                      <IconButton
                        color="secondary"
                        onClick={() => router.push("/build/agents/editagent")}
                      >
                        <Eye />
                      </IconButton>
                    </Tooltip> */}

                        {/* <Tooltip title="Edit">
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton color="error">
                        <Trash />
                      </IconButton>
                    </Tooltip> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={agents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </MainCard>}

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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>

  )
}