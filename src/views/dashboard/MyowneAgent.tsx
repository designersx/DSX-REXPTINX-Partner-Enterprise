'use client';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
// import dynamic from 'next/dynamic';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MainCard from 'components/MainCard';
import axios from 'axios';
import { getUserId } from 'utils/auth';
import { RetellWebClient } from 'retell-client-js-sdk';
import { useRouter } from 'next/router';

const cardBack = '/assets/images/widget/img-dropbox-bg.svg';
const WelcomeImage = '/assets/images/avatrs/Male-01.png';

interface Agent {
  agent_id: string; // Added agent_id to match handleStartCall
  agentName: string;
  mins_left: number;
  description: string;
  avatar: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export default function MyownAgent() {
  const [activeAgents, setActiveAgents] = useState<{ [key: number]: boolean }>({});
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callLoading, setCallLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState();
  const [retellWebClient, setRetellWebClient] = useState<RetellWebClient | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'info' });
  const [callId, setCallId] = useState<string | null>(null);
  const [conversation, setConversation] = React.useState<any>(null);
  const isEndingRef = useRef(false);
  const isStartingRef = useRef(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const agentdataa = [
    {
      id: 'agent_4201k6vv7481e6gsc6v19ggazwzj',
      businessname: 'Zouma Consulting Services',
      agentPlan: 'partner',
      mins_left: '45000',
      avatar: '/images/Male-01.png',
      agentName: 'Himanshu (Arabic)',
      businessType: 'Software & CX Management',
      agentLanguage: 'English + Multi',
      agentGender: 'male',
      agentAccent: 'American',
      plantype: 'partner',
      description: 'Handles customer queries',
      userId: 'RXDI7Q1759578841'
    }
  ];
  // const router = useRouter();
  const userId = getUserId();

  useEffect(() => {
    const fetchAgents = async () => {
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/Enterprisepartneragent/${userId}`);
        const data = response.data;
        if (response.status === 200 && data.status && data.agents?.length > 0) {
          setAgents(data.agents);
        } else {
          setAgents([]);
        }
      } catch (err) {
        setError('Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [userId]);

  useEffect(() => {
    const client = new RetellWebClient();
    client.on('call_started', () => {
      setCallLoading(false);
    });
    client.on('call_ended', () => {
      setActiveAgents({});
      setSelectedAgent(null);
      setCallLoading(false);
    });
    client.on('update', (update) => {
      const customUpdate = {
        ...update,
        source: 'agent'
      };
      window.dispatchEvent(new CustomEvent('retellUpdate', { detail: customUpdate }));
    });

    setRetellWebClient(client);
  }, []);

  const startCalleleven = async (agent: any) => {
    setSelectedAgent(agent);
    setError(null);
    try {
      setCallLoading(true);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/regionalagents/signed-url/${agent.id}`);

      const conversationToken = response?.data.token;
      if (!conversationToken) throw new Error('No conversation token received from backend');

      const { Conversation } = await import('@elevenlabs/client');
      const conversation = await Conversation.startSession({
        conversationToken,
        connectionType: 'webrtc'
      });
      setConversation(conversation);
      console.log('Conversation started');
      setIsCallActive(true);
      // activeAgents(true)
    } catch (err: any) {
      setError(`Failed to start call: ${err.message}`);
      console.error('Error starting call:', err);
    } finally {
      setCallLoading(false);
    }
  };

  const endCalleleven = async (agent) => {
    if (conversation) {
      await conversation.endSession();
      setConversation(null);
      setSelectedAgent(null);
      setError(null);
    }
    setIsCallActive(false);
  };

  // Handle route changes to end cal
  // const handleStartCall = async (agent: Agent, index: number) => {
  //   setCallLoading(true);
  //   setSelectedAgent(agent);

  //   try {
  //     const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
  //     if (micPermission.state !== 'granted') {
  //       await navigator.mediaDevices.getUserMedia({ audio: true });
  //       const updatedMicPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

  //       if (updatedMicPermission.state !== 'granted') {
  //         setSnackbar({
  //           open: true,
  //           message: 'You must grant microphone access to start the call.',
  //           severity: 'warning'
  //         });
  //         setCallLoading(false);
  //         return;
  //       }
  //     }

  //     const agentId = agent.agent_id;
  //     if (!agentId) throw new Error('No agent ID found');

  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/agent/create-web-call`,
  //       { agent_id: agentId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     if (response.status === 403) {
  //       setSnackbar({
  //         open: true,
  //         message: 'Agent Plan minutes exhausted',
  //         severity: 'error'
  //       });
  //       setCallLoading(false);
  //       return;
  //     }

  //     isStartingRef.current = true;
  //     await retellWebClient?.startCall({ accessToken: response?.data?.access_token });
  //     setCallId(response?.data?.call_id);
  //     setActiveAgents({ [index]: true }); // Only activate the clicked agent
  //   } catch (error: any) {
  //     console.error('Error starting call:', error);
  //     setSnackbar({
  //       open: true,
  //       message: error.response?.status === 403 ? 'Agent Plan minutes exhausted' : 'Failed to start call. Please try again.',
  //       severity: 'error'
  //     });
  //     setActiveAgents({});
  //   } finally {
  //     setCallLoading(false);
  //     isStartingRef.current = false;
  //   }
  // };
  // const handleEndCall = async (index: number) => {
  //   if (isEndingRef.current) return;
  //   console.log();
  //   isEndingRef.current = true;
  //   setCallLoading(true);

  //   try {
  //     await retellWebClient.stopCall(); // Ensure this gets awaited
  //   } catch (error) {
  //     console.error('Error ending call:', error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Failed to end call. Please try again.',
  //       severity: 'error'
  //     });
  //   } finally {
  //     // Always clean up
  //     isEndingRef.current = false;
  //     setActiveAgents({});
  //     setCallId(null);
  //     setSelectedAgent(null);
  //     setCallLoading(false);
  //   }
  // };
  const handleButtonClick = (agent: Agent, index: number) => {
    if (isCallActive) {
      endCalleleven(agent);
    } else {
      startCalleleven(agent);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  if (loading) {
    return (
      <MainCard>
        <Typography variant="h6">Loading...</Typography>
      </MainCard>
    );
  }

  if (agentdataa.length === 0) {
    return (
      <MainCard
        border={false}
        sx={(theme: Theme) => ({
          color: '#FFFFFF',
          bgcolor: '#5B21B6',
          position: 'relative',
          overflow: 'hidden',
          ...theme.applyStyles('dark', { color: 'text.primary', bgcolor: 'primary.400' }),
          '&:after': {
            content: '""',
            background: `url("${cardBack}") 100% 100% / cover no-repeat`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            opacity: 0.2
          }
        })}
      >
        <Grid container>
          <Grid size={{ md: 6, sm: 6, xs: 12 }}>
            <Stack sx={{ gap: 2, padding: 1 }}>
              <Typography variant="h6">Name: Partner Agent</Typography>
              <Typography variant="h6">Mins Left: N/A</Typography>
              <Typography variant="h6">Mins Assigned: N/A</Typography>
              <Typography variant="h6">Your agent</Typography>
              <Box sx={{ pt: 1.5 }}>
                <Button
                  disabled
                  aria-label="Coming Soon"
                  variant="outlined"
                  color="indigo"
                  sx={(theme) => ({
                    color: 'background.paper',
                    borderColor: 'background.paper',
                    ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
                    zIndex: 2,
                    '&:hover': {
                      bgcolor: 'indigo',
                      color: 'white',
                      borderColor: 'background.paper'
                    }
                  })}
                >
                  Coming Soon
                </Button>
              </Box>
            </Stack>
          </Grid>
          <Grid
            item
            xs={8}
            md={4}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                position: 'relative',
                pr: { sm: 2, md: 6 },
                zIndex: 2
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 250,
                  height: 250,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  animation: 'pulse 1.5s infinite',
                  zIndex: 0,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              <CardMedia
                component="img"
                sx={{
                  maxWidth: 115,
                  borderRadius: '50%',
                  animation: 'pop 0.6s ease-in-out infinite alternate',
                  zIndex: 1
                }}
                src={WelcomeImage}
                alt="Agent Avatar"
              />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    );
  }

  return (
    <>
      {agentdataa.map((agent, index) => (
        <MainCard
          key={index}
          border={false}
          sx={(theme: Theme) => ({
            color: '#FFFFFF',
            bgcolor: '#5B21B6',
            position: 'relative',
            overflow: 'hidden',
            ...theme.applyStyles('dark', { color: 'text.primary', bgcolor: 'primary.400' }),
            '&:after': {
              content: '""',
              background: `url("${cardBack}") 100% 100% / cover no-repeat`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              opacity: 0.2
            }
          })}
        >
          <Grid container>
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <Stack sx={{ gap: 2, padding: 1 }}>
                <Typography variant="h4">{agent?.agentName}</Typography>
                <Typography variant="h6">Name: {agent?.agentName}</Typography>
                <Typography variant="h6">Mins Left: {Math.floor(agent?.mins_left / 60)} Mins</Typography>
                <Typography variant="h6">Your Partner Agent</Typography>
                <Box sx={{ pt: 1.5 }}>
                  <Button
                    aria-label={isCallActive ? 'End call with agent' : 'Test agent'}
                    variant={isCallActive ? 'contained' : 'outlined'}
                    color={isCallActive ? 'error' : 'secondary'}
                    onClick={() => handleButtonClick(agent, index)}
                    disabled={callLoading}
                    sx={(theme) => ({
                      color: 'background.paper',
                      borderColor: 'background.paper',
                      ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
                      zIndex: 2,
                      '&:hover': {
                        bgcolor: isCallActive ? 'error.main' : 'indigo',
                        color: 'white',
                        borderColor: 'background.paper'
                      }
                    })}
                  >
                    {callLoading && selectedAgent?.agent_id === agent.agent_id ? 'Connecting...' : isCallActive ? 'End Call' : 'Test Agent'}
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid
              item
              xs={8}
              md={4}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  position: 'relative',
                  pr: { sm: 2, md: 6 },
                  zIndex: 2
                }}
              >
                {isCallActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 250,
                      height: 250,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      animation: 'pulse 1.5s infinite',
                      zIndex: 0,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  sx={{
                    maxWidth: 115,
                    borderRadius: '50%',
                    animation: isCallActive ? 'pop 0.6s ease-in-out infinite alternate' : 'none',
                    zIndex: 1
                  }}
                  src={agent?.avatar?.startsWith('/') ? agent?.avatar : `/${agent?.avatar}`}
                  alt={`Avatar for ${agent?.agentName}`}
                />
              </Stack>
            </Grid>
          </Grid>
        </MainCard>
      ))}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}
