// // 'use client';
// // import { useState } from 'react';
// // import { Theme } from '@mui/material/styles';
// // import Button from '@mui/material/Button';
// // import CardMedia from '@mui/material/CardMedia';
// // import Grid from '@mui/material/Grid';
// // import Stack from '@mui/material/Stack';
// // import Typography from '@mui/material/Typography';
// // import Box from '@mui/material/Box';
// // import MainCard from 'components/MainCard';

// // const cardBack = '/assets/images/widget/img-dropbox-bg.svg';
// // const WelcomeImage = '/assets/images/avatrs/Male-01.png';

// // export default function MyownAgent() {
// //   const [isActive, setIsActive] = useState(false);

// //   const handleButtonClick = () => {
// //     setIsActive((prev) => !prev); // toggle state
// //   };

// //   return (
// //     <MainCard
// //       border={false}
// //       sx={(theme: Theme) => ({
// //         color: '#FFFFFF',
// //         bgcolor: '#5B21B6',
// //         position: 'relative',
// //         overflow: 'hidden',
// //         ...theme.applyStyles('dark', { color: 'text.primary', bgcolor: 'primary.400' }),
// //         '&:after': {
// //           content: '""',
// //           background: `url("${cardBack}") 100% 100% / cover no-repeat`,
// //           position: 'absolute',
// //           top: 0,
// //           left: 0,
// //           right: 0,
// //           bottom: 0,
// //           zIndex: 1,
// //           opacity: 0.2
// //         }
// //       })}
// //     >
// //       <Grid container>
// //         {/* Left Grid */}
// //         <Grid size={{ md: 6, sm: 6, xs: 12 }}>
// //           <Stack sx={{ gap: 2, padding: 1 }}>
// //             <Typography variant="h4" sx={{ minHeight: '10px' }}>
// //               Test Agent from Rexpt
// //             </Typography>
// //             <Typography variant="h6">Name: Suraj</Typography>
// //             <Typography variant="h6">Mins Left: 100 Mins</Typography>
// //             <Typography variant="h6">Test agent for you and your growth.</Typography>

// //             <Box sx={{ pt: 1.5 }}>
// //               <Button
// //                 variant={isActive ? 'contained' : 'outlined'}
// //                 color={isActive ? 'error' : 'secondary'}
// //                 onClick={handleButtonClick}
// //                 sx={(theme) => ({
// //                   color: 'background.paper',
// //                   borderColor: 'background.paper',
// //                   ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
// //                   zIndex: 2,
// //                   '&:hover': {
// //                     bgcolor: isActive ? 'error.main' : 'indigo',

// //                     color: 'white',
// //                     borderColor: 'background.paper'
// //                   }
// //                 })}
// //               >
// //                 {isActive ? 'End Call' : 'Test Agent'}
// //               </Button>
// //             </Box>
// //           </Stack>
// //         </Grid>

// //         {/* Right Grid */}
// //         <Grid
// //           item
// //           xs={8}
// //           md={4}
// //           sx={{
// //             display: { xs: 'none', sm: 'flex' }, // changed 'initial' to 'flex' to apply flex properties
// //             alignItems: 'center',
// //             justifyContent: 'flex-end'
// //           }}
// //         >
// //           <Stack
// //             sx={{
// //               justifyContent: 'center',
// //               alignItems: 'flex-end',
// //               position: 'relative',
// //               pr: { sm: 2, md: 6 },
// //               zIndex: 2
// //             }}
// //           >
// //             {/* Animated background circle */}
// //             {isActive && (
// //               <Box
// //                 sx={{
// //                   position: 'absolute',
// //                   width: 250,
// //                   height: 250,
// //                   borderRadius: '50%',
// //                   bgcolor: 'rgba(255,255,255,0.2)',
// //                   animation: 'pulse 1.5s infinite',
// //                   zIndex: 0,
// //                   top: '50%',
// //                   left: '50%',
// //                   transform: 'translate(-50%, -50%)'
// //                 }}
// //               />
// //             )}

// //             {/* Avatar image */}
// //             <CardMedia
// //               component="img"
// //               sx={{
// //                 maxWidth: 115,
// //                 // maxHeight: 150,
// //                 borderRadius: '50%',
// //                 animation: isActive ? 'pop 0.6s ease-in-out infinite alternate' : 'none',
// //                 zIndex: 1
// //               }}
// //               src={WelcomeImage}
// //               alt="Avatar"
// //             />
// //           </Stack>
// //         </Grid>
// //       </Grid>

// //       <style jsx>{`
// //         @keyframes pop {
// //           0% {
// //             transform: scale(1);
// //           }
// //           50% {
// //             transform: scale(1.1);
// //           }
// //           100% {
// //             transform: scale(1);
// //           }
// //         }

// //         @keyframes pulse {
// //           0% {
// //             transform: translate(-50%, -50%) scale(1);
// //             opacity: 0.5;
// //           }
// //           50% {
// //             transform: translate(-50%, -50%) scale(1.2);
// //             opacity: 0.3;
// //           }
// //           100% {
// //             transform: translate(-50%, -50%) scale(1);
// //             opacity: 0.5;
// //           }
// //         }
// //       `}</style>
// //     </MainCard>
// //   );
// // }

// 'use client';
// import { useState, useEffect } from 'react';
// import { Theme } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import CardMedia from '@mui/material/CardMedia';
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import MainCard from 'components/MainCard';
// import axios from 'axios';
// import { getUserId } from 'utils/auth';

// const cardBack = '/assets/images/widget/img-dropbox-bg.svg';
// const WelcomeImage = '/assets/images/avatrs/Male-01.png';

// interface Agent {
//   name: string;
//   minutesLeft: number;
//   description: string;
// }

// export default function MyownAgent() {
//   const [isActive, setIsActive] = useState(false);
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const handleButtonClick = () => {
//     setIsActive((prev) => !prev);
//   };
//   const userId = getUserId();
//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         // Replace with your actual API endpoint
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/partneragent/${userId}`);
//         const data = response.data;

//         if (response.status === 200 && data.status && data.agents?.length > 0) {
//           setAgents(data.agents);
//         } else {
//           setAgents([]);
//         }
//       } catch (err) {
//         setError('Failed to fetch agents');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgents();
//   }, []);

//   if (loading) {
//     return (
//       <MainCard>
//         <Typography variant="h6">Loading...</Typography>
//       </MainCard>
//     );
//   }

//   if (error || agents.length === 0) {
//     return (
//       <MainCard
//         border={false}
//         sx={(theme: Theme) => ({
//           color: '#FFFFFF',
//           bgcolor: '#5B21B6',
//           position: 'relative',
//           overflow: 'hidden',
//           ...theme.applyStyles('dark', { color: 'text.primary', bgcolor: 'primary.400' }),
//           '&:after': {
//             content: '""',
//             background: `url("${cardBack}") 100% 100% / cover no-repeat`,
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             zIndex: 1,
//             opacity: 0.2
//           }
//         })}
//       >
//         <Typography variant="h4" sx={{ padding: 2 }}>
//           Test Agent Coming Soon
//         </Typography>
//       </MainCard>
//     );
//   }

//   return (
//     <MainCard
//       border={false}
//       sx={(theme: Theme) => ({
//         color: '#FFFFFF',
//         bgcolor: '#5B21B6',
//         position: 'relative',
//         overflow: 'hidden',
//         ...theme.applyStyles('dark', { color: 'text.primary', bgcolor: 'primary.400' }),
//         '&:after': {
//           content: '""',
//           background: `url("${cardBack}") 100% 100% / cover no-repeat`,
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 1,
//           opacity: 0.2
//         }
//       })}
//     >
//       {agents.map((agent, index) => (
//         <Grid container key={index}>
//           {/* Left Grid */}
//           <Grid size={{ md: 6, sm: 6, xs: 12 }}>
//             <Stack sx={{ gap: 2, padding: 1 }}>
//               <Typography variant="h4" sx={{ minHeight: '10px' }}>
//                 Test Agent from Rexpt
//               </Typography>
//               <Typography variant="h6">Name: {agent.name}</Typography>
//               <Typography variant="h6">Mins Left: {agent.minutesLeft} Mins</Typography>
//               <Typography variant="h6">{agent.description}</Typography>

//               <Box sx={{ pt: 1.5 }}>
//                 <Button
//                   variant={isActive ? 'contained' : 'outlined'}
//                   color={isActive ? 'error' : 'secondary'}
//                   onClick={handleButtonClick}
//                   sx={(theme) => ({
//                     color: 'background.paper',
//                     borderColor: 'background.paper',
//                     ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
//                     zIndex: 2,
//                     '&:hover': {
//                       bgcolor: isActive ? 'error.main' : 'indigo',
//                       color: 'white',
//                       borderColor: 'background.paper'
//                     }
//                   })}
//                 >
//                   {isActive ? 'End Call' : 'Test Agent'}
//                 </Button>
//               </Box>
//             </Stack>
//           </Grid>

//           {/* Right Grid */}
//           <Grid
//             item
//             xs={8}
//             md={4}
//             sx={{
//               display: { xs: 'none', sm: 'flex' },
//               alignItems: 'center',
//               justifyContent: 'flex-end'
//             }}
//           >
//             <Stack
//               sx={{
//                 justifyContent: 'center',
//                 alignItems: 'flex-end',
//                 position: 'relative',
//                 pr: { sm: 2, md: 6 },
//                 zIndex: 2
//               }}
//             >
//               {isActive && (
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     width: 250,
//                     height: 250,
//                     borderRadius: '50%',
//                     bgcolor: 'rgba(255,255,255,0.2)',
//                     animation: 'pulse 1.5s infinite',
//                     zIndex: 0,
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)'
//                   }}
//                 />
//               )}

//               <CardMedia
//                 component="img"
//                 sx={{
//                   maxWidth: 115,
//                   borderRadius: '50%',
//                   animation: isActive ? 'pop 0.6s ease-in-out infinite alternate' : 'none',
//                   zIndex: 1
//                 }}
//                 src={WelcomeImage}
//                 alt="Avatar"
//               />
//             </Stack>
//           </Grid>
//         </Grid>
//       ))}

//       <style jsx>{`
//         @keyframes pop {
//           0% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.1);
//           }
//           100% {
//             transform: scale(1);
//           }
//         }

//         @keyframes pulse {
//           0% {
//             transform: translate(-50%, -50%) scale(1);
//             opacity: 0.5;
//           }
//           50% {
//             transform: translate(-50%, -50%) scale(1.2);
//             opacity: 0.3;
//           }
//           100% {
//             transform: translate(-50%, -50%) scale(1);
//             opacity: 0.5;
//           }
//         }
//       `}</style>
//     </MainCard>
//   );
// }

'use client';
import { useState, useEffect, useRef } from 'react';
import { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
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

const cardBack = '/assets/images/widget/img-dropbox-bg.svg';
const WelcomeImage = '/assets/images/avatrs/Male-01.png';

interface Agent {
  agent_id: string; // Added agent_id to match handleStartCall
  name: string;
  minutesLeft: number;
  description: string;
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
  const [retellWebClient, setRetellWebClient] = useState(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'info' });
  const [callId, setCallId] = useState<string | null>(null);
  const isEndingRef = useRef(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

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

  const handleStartCall = async (agent: Agent, index: number) => {
    setCallLoading(true);
    setSelectedAgent(agent);

    let micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

    if (micPermission.state !== 'granted') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });

        if (micPermission.state !== 'granted') {
          setSnackbar({
            open: true,
            message: 'You must grant microphone access to start the call.',
            severity: 'warning'
          });
          setCallLoading(false);
          return;
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Please allow microphone permission to continue.',
          severity: 'error'
        });
        setCallLoading(false);
        return;
      }
    }

    try {
      const agentId = agent.agent_id;

      if (!agentId) throw new Error('No agent ID found');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/agent/create-web-call`,
        { agent_id: agentId },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_RETELL_API}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 403) {
        setSnackbar({
          open: true,
          message: 'Agent Plan minutes exhausted',
          severity: 'error'
        });
        setActiveAgents((prev) => ({ ...prev, [index]: false }));
        setCallLoading(false);
        return;
      }

      await retellWebClient.startCall({ accessToken: response?.data?.access_token });
      setCallId(response?.data?.call_id);
      setActiveAgents((prev) => ({ ...prev, [index]: true }));
    } catch (error: any) {
      console.error('Error starting call:', error);
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: 'Agent Plan minutes exhausted',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to start call. Please try again.',
          severity: 'error'
        });
      }
      setActiveAgents((prev) => ({ ...prev, [index]: false }));
    } finally {
      setCallLoading(false);
    }
  };

  const handleEndCall = async (index: number) => {
    isEndingRef.current = true;
    setCallLoading(true);

    try {
      await retellWebClient.stopCall();
      setActiveAgents((prev) => ({ ...prev, [index]: false }));
      setCallId(null);
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
      setActiveAgents((prev) => ({ ...prev, [index]: false }));
      setCallLoading(false);
      setSelectedAgent(null);
    }, 1000);
  };

  const handleButtonClick = (agent: Agent, index: number) => {
    if (activeAgents[index]) {
      handleEndCall(index);
    } else {
      handleStartCall(agent, index);
    }
  };
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

  if (error || agents.length === 0) {
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
          {/* Left Grid */}
          <Grid size={{ md: 6, sm: 6, xs: 12 }}>
            <Stack sx={{ gap: 2, padding: 1 }}>
              <Typography variant="h4">Suraj</Typography>
              <Typography variant="h6">Name: Suraj</Typography>
              <Typography variant="h6">Mins Left: 100 Mins</Typography>
              <Typography variant="h6">Your test agent</Typography>
              <Box sx={{ pt: 1.5 }}>
                <Button
                  //   disabled
                  aria-label="Coming Soon"
                  variant="outlined"
                  color="indigo"
                  //   onClick={() => handleButtonClick(agent, index)}
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

          {/* Right Grid */}
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
                alt={`Agent Avatar`}
              />
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    );
  }

  return (
    <>
      {agents.map((agent, index) => (
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
            {/* Left Grid */}
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <Stack sx={{ gap: 2, padding: 1 }}>
                <Typography variant="h4">{agent.name}</Typography>
                <Typography variant="h6">Name: {agent.name}</Typography>
                <Typography variant="h6">Mins Left: {agent.minutesLeft} Mins</Typography>
                <Typography variant="h6">{agent.description}</Typography>
                <Box sx={{ pt: 1.5 }}>
                  <Button
                    aria-label={activeAgents[index] ? 'End call with agent' : 'Test agent'}
                    variant={activeAgents[index] ? 'contained' : 'outlined'}
                    color={activeAgents[index] ? 'error' : 'secondary'}
                    onClick={() => handleButtonClick(agent, index)}
                    disabled={callLoading}
                    sx={(theme) => ({
                      color: 'background.paper',
                      borderColor: 'background.paper',
                      ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
                      zIndex: 2,
                      '&:hover': {
                        bgcolor: activeAgents[index] ? 'error.main' : 'indigo',
                        color: 'white',
                        borderColor: 'background.paper'
                      }
                    })}
                  >
                    {callLoading ? 'Processing...' : activeAgents[index] ? 'End Call' : 'Test Agent'}
                  </Button>
                </Box>
              </Stack>
            </Grid>

            {/* Right Grid */}
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
                {activeAgents[index] && (
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
                    animation: activeAgents[index] ? 'pop 0.6s ease-in-out infinite alternate' : 'none',
                    zIndex: 1
                  }}
                  src={WelcomeImage}
                  alt={`Avatar for ${agent.name}`}
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
