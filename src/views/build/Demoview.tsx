'use client';

import Link from 'next/link';

// material imports

// material-ui

import Fade from '@mui/material/Fade';

import Menu from '@mui/material/Menu';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

// third-party
// import { PatternFormat } from 'react-number-format';
// import { PDFDownloadLink } from '@react-pdf/renderer';

// project-imports
import AlertCustomerDelete from './AlertCustomerDelete';
import CustomerModal from './CustomerModal';
import CustomerPreview from './CustomerPreview';
import ListSmallCard from './export-pdf/ListSmallCard';
import Avatar from 'components/@extended/Avatar';

import MainCard from 'components/MainCard';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CallIcon from '@mui/icons-material/Call';

// project imports
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import IconButton from 'components/@extended/IconButton';

import { APP_DEFAULT_PATH } from 'config';
import GRID_COMMON_SPACING from 'config';

// assets
import { Link2, Sms, Star1 } from '@wandersonalwes/iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { fetchAgent } from '../../../Services/auth'; // ✅ your API call
import CallDialog from 'components/CallDialog';
import { RetellWebClient } from 'retell-client-js-sdk';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import MoreIcon from 'components/@extended/MoreIcon';

const breadcrumbLinks = [{ title: 'home', to: APP_DEFAULT_PATH }, { title: 'Demo Agents view' }];

export default function DemoAgentsViewPage() {
  const [agents, setAgents] = useState<any[]>([]); // store API data
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const isEndingRef = useRef(false);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callId, setCallId] = useState('');
  const [retellWebClient, setRetellWebClient] = useState(null);
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

  // console.log('selectedAgent',selectedAgent)
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const res = await fetchAgent(); // ✅ call your API function
        console.log('API response:', res);

        // Assuming res is an array of agents
        setAgents(res?.agents || []);
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const ItemRow = ({ title, value }: { title: string; value: string }) => (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 5, py: 1 }}>
      <Typography sx={{ color: 'text.secondary' }}>{title}</Typography>
      <Typography>{value}</Typography>
    </Stack>
  );

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


  const cardStyle = {
  // Border width
  border: '1px solid rgba(230, 234, 237, 1)', // rgb(230.845, 234.2, 237.554) ≈ rgba(230, 234, 237, 1)
  
  // Border radius
  borderRadius: '12px',
  
  // Inner border radius (for card content/padding)
  '& .MuiCardContent-root': {
    borderRadius: 'calc(12px - 1px)', // 11px
  },
  
  // Box shadow (provides subtle border-like depth)
  boxShadow: '0px 8px 24px rgba(27, 46, 94, 0.08)',
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

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumbs custom heading="view" links={breadcrumbLinks} />
      </Stack>
      {loading ? (
        <Typography>Loading agents...</Typography>
      ) : (
        <Grid container spacing={5} >
          {agents.map((agent: any, index: number) => (
// <Grid key={index} size={{ xs: 12, sm: 10, lg: 4 }}>
            //   <MainCard content={false} sx={{ p: 1.25 }}>
            



            // <Grid key={index} size={{ xs: 12, sm: 10, lg: 4 }}>
            //   <MainCard content={false} sx={{ p: 1.25 }}>
            
            //     <Box sx={{ position: 'relative', width: 1 }}>
            //       <CardMedia
            //         component="img"
            //         height="auto"
            //         image={`${agent?.avatar}` || '/images/male-02.png'}
            //         alt="Agent"
            //         sx={{ width: 1, display: 'block', borderRadius: 1 }}
            //       />
            //     </Box>

            //     <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 0.5, mt: 2.5, mb: 1.25 }}>
            //       <Stack sx={{ flex: 1, minWidth: 0 }}>
            //         <Typography
            //           variant="h6"
            //           sx={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 1 }}
            //         >
            //           {agent.agentName || "Test"}
            //         </Typography>
            //         <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, color: 'warning.main' }}>
            //           <Star1 size="14" />
            //           <Typography variant="body2" sx={{ color: 'text.primary' }}>
            //             {agent.agentRole || "General Receptionist"}
            //           </Typography>
            //         </Stack>
            //       </Stack>
            //       <IconButton size="large" color="primary" sx={{ minWidth: 30 }} onClick={() => handleOpenDialog(agent)}>
            //         <CallIcon fontSize="small" />
            //       </IconButton>
            //     </Stack>

            //     <Divider />
            //     <Stack>
            //       <ItemRow title="Assigned Number" value={agent?.voip_numbers || agent?.phone || "-"} />
            //       <Divider />

            //       <ItemRow title="Business" value={agent?.businessDetails?.name || agent.company || "-"} />
            //       <Divider />
            //       <ItemRow title="Category" value={agent?.businessDetails?.BusinessType || "-"} />
            //       <Divider />
            //       <ItemRow title="Mins Left" value={agent?.mins_left || "-"} />
            //        <Divider />
            //       <ItemRow title="Language" value={agent?.agentLanguage || "-"} />

            //     </Stack>
            //   </MainCard>
            // </Grid>
            <Grid key={index} size={{ xs: 12, sm: 10, lg: 4 }}>
              {/* <MainCard content={false} sx={{ p: 1.25 }}> */}
            
            <Grid id="print" key={index} container spacing={2.25} >
              <Grid key={index} size={12} sx={{cardStyle}}>
                <List sx={{ width: 1, p: 0 }}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        color="secondary"
                        // onClick={handleMenuClick}
                        sx={{ transform: 'rotate(90deg)' }}
                      >
                        {/* <MoreIcon /> */}
                      </IconButton>
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
                {/* <Menu
              id="fade-menu"
              slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
              // anchorEl={anchorEl}
              // open={openMenu}
              onClose={handleMenuClose}
              slots={{ transition: Fade }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}>
                {/* <PDFDownloadLink document={<ListSmallCard customer={customer} />} fileName={`Customer-${customer.name}.pdf`}>
                  Export PDF
                </PDFDownloadLink> */}
                {/* </MenuItem>
              <MenuItem onClick={editCustomer}>Edit</MenuItem>
              <MenuItem onClick={handleAlertClose}>Delete</MenuItem>
            </Menu> */}
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
                        <ListItemIcon>
                          <Sms size={18} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.agentGender}</Typography>} />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>{/* <CallCalling size={18} /> */}</ListItemIcon>
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
                        {/* <ListItemIcon>
                      <Location size={18} />
                    </ListItemIcon> */}
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
                        '& .MuiListItemIcon-root': { minWidth: 28 }
                      }}
                    >
                      <ListItem alignItems="flex-start">
                        {/* <ListItemIcon>
                      <Location size={18} />
                    </ListItemIcon> */}
                        <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.BusinessType}</Typography>} />
                      </ListItem>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <Link2 size={18} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent?.agentPlan}</Typography>} />
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
                        {/* <ListItemIcon>
                      <Location size={18} />
                    </ListItemIcon> */}
                        <ListItemText primary={<Typography sx={{ color: 'text.secondary' }}>{agent.mins_left}</Typography>} />
                      </ListItem>
                      
                    </List>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0 }} component="ul">
                    {/* {customer.skills.map((skill: string, index: number) => (
                  <ListItem disablePadding key={index} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                    <Chip color="secondary" variant="outlined" size="small" label={skill} sx={{ color: 'text.secondary' }} />
                  </ListItem>
                ))} */}
                  </Box>
                </Box>
              </Grid>
              <Stack
                direction="row"
                className="hideforPDf"
                sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', mt: 'auto', mb: 0, pt: 2.25 }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Updated 3 days ago
                </Typography>
                <IconButton size="large" color="primary" sx={{ minWidth: 30 }} onClick={() => handleOpenDialog(agent)}>
                  <CallIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
            </Grid>
          ))}
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
        </Grid>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>{' '}
    </>
  );
}

// import React, { useState } from 'react';
// import { Container, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Box } from '@mui/material';
// import { Node } from 'components/Node';
// import { Edge } from 'components/Edge';

// // Full static nodes data
// const nodesData = [
//   {
//     "instruction": {
//       "type": "static_text",
//       "text": `Hello, thank you for calling Business Customer Support. My name is Galaxy. How may I assist you today?`
//     },
//     "name": "Greeting",
//     "edges": [
//       {
//         "destination_node_id": "node-1758265613171",
//         "id": "edge-1758282015602",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Listen & Identify the Intent of the caller"
//         }
//       }
//     ],
//     "start_speaker": "agent",
//     "id": "start-node-1758262860487",
//     "type": "conversation",
//     "display_position": {
//       "x": 37.68261018432662,
//       "y": 107.46431850132892
//     }
//   },
//   {
//     "instruction": {
//       "type": "static_text",
//       "text": "Listen to the Intent of the Caller"
//     },
//     "name": "Identify Node",
//     "edges": [
//       {
//         "destination_node_id": "node-1758267073816",
//         "id": "edge-1758285664274",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller is requesting technical support for a product."
//         }
//       },
//       {
//         "destination_node_id": "node-1758294251802",
//         "id": "edge-1758285711582",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller wants to ask about a product's features or price or any other information related to a Product"
//         }
//       },
//       {
//         "destination_node_id": "node-1758349266150",
//         "id": "edge-1758285672094",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller would like to check the status of their order."
//         }
//       },
//       {
//         "destination_node_id": "node-1758353873527",
//         "id": "edge-1758285729952",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller needs to schedule a repair or service appointment."
//         }
//       },
//       {
//         "destination_node_id": "node-1758362993706",
//         "id": "edge-1758285738863",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller would like to process a return or ask about a warranty."
//         }
//       },
//       {
//         "id": "edge-1758285759483",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller has a question about their billing or invoice."
//         }
//       },
//       {
//         "id": "edge-1758285774158",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller wants to speak to a human representative."
//         }
//       },
//       {
//         "id": "edge-1758285792443",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller wants to ask about a new product launch."
//         }
//       },
//       {
//         "id": "edge-1758285804114",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller is asking about a current promotion or discount."
//         }
//       },
//       {
//         "id": "edge-1758285818671",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller wants to leave a product review or feedback or submit complaints"
//         }
//       },
//       {
//         "id": "edge-1758286016184",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller has no more Questions"
//         }
//       }
//     ],
//     "start_speaker": "agent",
//     "id": "node-1758265613171",
//     "type": "conversation",
//     "display_position": {
//       "x": 492.6728914123804,
//       "y": -190.33113396636665
//     }
//   },
//   {
//     "name": "End Call",
//     "id": "node-1758266212652",
//     "type": "end",
//     "display_position": {
//       "x": 2354.1399781128625,
//       "y": -1224.334062168604
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": "Politely end the call"
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": `Your primary goal here is to identify the specific Business product the caller is asking about and the exact problem they are experiencing.\n\nAsk the caller to state both the product type and the problem.\n\nData Collection: Listen for keywords related to product categories (e.g., \"phone,\" \"fridge,\" \"tablet,\" \"TV\") and problem descriptions (e.g., \"broken,\" \"not working,\" \"error code,\" \"shuts off\"), use your knowledge to capture this info effectively.\n\nAction Logic:\n\nIdentify: Analyze the caller's response to identify the product and problem.\n\nProvide Solution: Access the knowledge base for a potential solution and clearly explain the troubleshooting steps to the caller.\n\nCheck for Resolution: After providing the steps, ask a direct question to confirm if the issue is resolved.\n\nFallback: If the caller's response is unclear, politely ask for clarification. Always be prepared to re-ask the question in a slightly different way to get the necessary information.`
//     },
//     "name": "Troubleshooting",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758267205209",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the issue is resolved"
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758290705873",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "The caller states the problem is not fixed or asks for more help. Or If the issue is too complex for the Agent"
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758290972438",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller gets frustrated or asks for a human"
//         }
//       }
//     ],
//     "global_node_setting": {
//       "condition": "If the caller needs help with fixing an issue with a product or troubleshoot it"
//     },
//     "start_speaker": "agent",
//     "id": "node-1758267073816",
//     "knowledge_base_ids": [
//       "knowledge_base_2d5d9a04acde3f66"
//     ],
//     "type": "conversation",
//     "display_position": {
//       "x": 1212.2018600302092,
//       "y": -864.2570521796247
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": "Confirm all relevant information if appropriate.\n\nAsk the caller if they have any more questions or concerns.\n\nBid a warm farewell to the Caller."
//     },
//     "name": "Farewell",
//     "edges": [
//       {
//         "destination_node_id": "node-1758266212652",
//         "id": "edge-1758289183557",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller has no more questions."
//         }
//       },
//       {
//         "destination_node_id": "node-1758265613171",
//         "id": "edge-1758289278838",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If caller asks another question."
//         }
//       }
//     ],
//     "global_node_setting": {
//       "condition": "If the caller has no more Questions"
//     },
//     "id": "node-1758289183557",
//     "type": "conversation",
//     "display_position": {
//       "x": 1976.6524317257572,
//       "y": -1426.8382652420216
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": "Inform the Caller that you will attempt to transfer the call now."
//     },
//     "name": "Call Transfer",
//     "edges": [
//       {
//         "id": "edge-1758291037905",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Describe the transition condition"
//         }
//       }
//     ],
//     "id": "node-1758291037905",
//     "type": "conversation",
//     "display_position": {
//       "x": 1868.0673420184107,
//       "y": -705.4901891545751
//     },
//     "skip_response_edge": {
//       "destination_node_id": "node-1758291152011",
//       "id": "edge-1758291169785",
//       "transition_condition": {
//         "type": "prompt",
//         "prompt": "Skip response"
//       }
//     }
//   },
//   {
//     "custom_sip_headers": {},
//     "transfer_destination": {
//       "type": "predefined",
//       "number": "+18563630453"
//     },
//     "edge": {
//       "destination_node_id": "node-1758291186549",
//       "id": "edge-1758291152011",
//       "transition_condition": {
//         "type": "prompt",
//         "prompt": "Transfer failed"
//       }
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": "Transferring your call now."
//     },
//     "name": "Transfer Call",
//     "id": "node-1758291152011",
//     "transfer_option": {
//       "type": "cold_transfer",
//       "show_transferee_as_caller": false
//     },
//     "type": "transfer_call",
//     "display_position": {
//       "x": 2463.279043538628,
//       "y": -949.1840555554305
//     }
//   },
//   {
//     "name": "Transfer Failed",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758291186549",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller does not have any question"
//         }
//       }
//     ],
//     "id": "node-1758291186549",
//     "type": "conversation",
//     "display_position": {
//       "x": 2856.8631087216054,
//       "y": -1047.4478354347984
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": "Apologize to the caller for a failed transfer. Assure them that we will notify our team and they called.\n\nAsk them if you can help them with anything else?"
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": `Your primary goal is to provide specific, accurate information about a Business product's features, price, or general specifications.\n\nBegin by asking the caller what product they are interested in. Ask the caller to be specific, For example: you can ask \"\"Are you interested in a specific model, like the Galaxy S24 phone, or a product category, like our QLED TVs?\"\n\nData Collection: Listen for product names (e.g., \"Galaxy,\" \"Neo QLED,\" \"Bespoke Refrigerator\") and keywords related to information they are seeking (e.g., \"price,\" \"specs,\" \"features,\" \"colors\").\n\nAction Logic:\n\nIdentify: Analyze the caller's response to determine the exact product and the information they need.\n\nProvide Information: Access the product knowledge base to find and clearly state the requested details.\n\nOffer More Help: After providing the information, ask if there's anything else they'd like to know about the product.\n\nFallback: If the caller's request is unclear, politely ask for more specific details.`
//     },
//     "name": "Product Info",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758294251802-ri5oxs75a",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "The caller is satisfied with the information and has no more questions"
//         }
//       },
//       {
//         "destination_node_id": "node-1758347674418",
//         "id": "edge-1758294251802-kx8cuxy1h",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller wants to purchase"
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758294251802-1t2d6h6ba",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller gets frustrated or asks for a human or has a complex sales question"
//         }
//       }
//     ],
//     "global_node_setting": {
//       "condition": "If the caller needs help with fixing an issue with a product or troubleshoot it"
//     },
//     "start_speaker": "agent",
//     "id": "node-1758294251802",
//     "knowledge_base_ids": [
//       "knowledge_base_6bb135d746241c76"
//     ],
//     "type": "conversation",
//     "display_position": {
//       "x": 1207.9725219917304,
//       "y": -160.1070231971965
//     }
//   },
//   {
//     "name": "Purchase Guidance",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758347674418",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "The caller is satisfied with the information and has no further questions."
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758349081334",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller insists on speaking to a sales agent"
//         }
//       },
//       {
//         "destination_node_id": "node-1758265613171",
//         "id": "edge-1758349117239",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If user has more questions to ask"
//         }
//       }
//     ],
//     "id": "node-1758347674418",
//     "type": "conversation",
//     "display_position": {
//       "x": 1813.6206016999156,
//       "y": -317.49002244049024
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": `Acknowledge the caller's interest in buying the product in a friendly and helpful tone.\n\nInform the caller that the best way to make a secure and convenient purchase is through the official Business website. Provide the option of visiting a nearby Business retail store for a hands-on experience.\n\n\nState the website URL clearly and concisely (e.g., \"You can visit Business-dot-com to make your purchase.\") and suggest they can use the website to find a nearby store.\n\n`
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": "Your primary goal is to find and provide the caller with the current status of their order.\n\nBegin by politely asking the caller for their order number or tracking number. \n\nExplain that this information is needed to look up the order status. The agent can suggest where the caller might find this information, such as in their confirmation email.\n\nData Collection: You must listen for a numerical sequence or a combination of letters and numbers that resembles an order or tracking number.\n\nAction Logic:\n\nLook Up: Use a backend function (check_order_status) to search for the order using the provided number.\n\nProvide Status: Once the status is found, state it clearly to the caller. For example, \"Your order is currently processing,\" \"Your order has shipped,\" or \"Your order is out for delivery.\"\n\nOffer More Help: After providing the status, ask if there is anything else they need help with regarding their order.\n\n#Fallback Logic: If the backend function fails to return a result due to a system error, the agent must be able to handle this gracefully.\n\n1. Acknowledge Issue: Politely inform the caller about the technical issue.\n\n2. Apologize: Apologize for the inconvenience.\n\n3. Offer Explaination: Provide any possible explaination to the caller"
//     },
//     "name": "Order Status",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758349266150-zcerfczvy",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "The caller is satisfied and has no more questions."
//         }
//       },
//       {
//         "destination_node_id": "node-1758350642737",
//         "id": "edge-1758350797661",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the backend function fails to return a result due to a system error, the agent must handle this gracefully."
//         }
//       },
//       {
//         "id": "edge-1758350992571",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Order status indicates a problem: The status is \"delayed,\" \"lost,\" etc."
//         }
//       }
//     ],
//     "global_node_setting": {
//       "condition": "If the caller needs help with fixing an issue with a product or troubleshoot it"
//     },
//     "start_speaker": "agent",
//     "id": "node-1758349266150",
//     "knowledge_base_ids": [],
//     "type": "conversation",
//     "display_position": {
//       "x": 1203.313992008661,
//       "y": 499.92384793993085
//     }
//   },
//   {
//     "name": "Conversation",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758350642737-nzf851kas",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "The caller is satisfied with the information and has no further questions."
//         }
//       },
//       {
//         "destination_node_id": "node-1758265613171",
//         "id": "edge-1758350642737-hj0yssv7a",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If user has more questions to ask"
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758350883610",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller still insists on an immediate solution"
//         }
//       }
//     ],
//     "id": "node-1758350642737",
//     "type": "conversation",
//     "display_position": {
//       "x": 1801.2624195932644,
//       "y": 333.7022238457683
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": "Acknowledge Issue: Politely inform the caller that there seems to be a temporary technical issue preventing them from accessing the information at this moment.\n\nSuggest Solution: The agent should politely suggest they try again in about 30 minutes, as the issue may be temporary."
//     }
//   },
//   {
//     "name": "Problematic Status",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758351011556-bfdfnih3q",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "The caller is satisfied with the information and has no further questions."
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758351011556-3zrg3cj2e",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller still insists on an immediate solution or ask to cancel the shipment or request refund"
//         }
//       }
//     ],
//     "id": "node-1758351011556",
//     "type": "conversation",
//     "display_position": {
//       "x": 1799.723958054803,
//       "y": 856.7791469226911
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": `Acknowledge and Apologize: You must immediately and empathetically apologize for the inconvenience.\n\nExplain and Assure: Provide a general explanation (e.g., \"This could be due to unexpected logistical delays or a shipping issue.\") and assure the caller that Business is already working to resolve the matter.`
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": "Your primary goal is to book a repair or service appointment for the caller.\n\nBegin by politely asking the caller for the product they need to have serviced and the type of issue they're experiencing.\n\nData Collection: Instruct the agent to listen for keywords related to products (e.g., \"refrigerator,\" \"TV,\" \"washing machine\") and service issues (e.g., \"not cooling,\" \"broken screen,\" \"leaking\").\n\nAction Logic:\n\nGather Information: The agent must collect all the necessary details for the appointment, including the caller's full name, phone number, address, and email address. It should also get the product's model number and serial number as this is often required to schedule a repair.\n\nVerify & Confirm: After collecting the information, the agent must repeat it back to the caller to ensure accuracy.\n\nSchedule: Once all details are confirmed, use a function (book_appointment) to schedule the appointment. The agent should then provide the caller with the appointment date and time.\n\nAssure: Inform the caller that they will receive a confirmation email or text message with all the details.\n\nOffer more help: After successfully booking the appointment, ask the caller if there is anything else they need help with."
//     },
//     "name": "Service Appointment",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758353873527-zaqbn2yw9",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Appointment is successfully booked: The agent receives a successful confirmation from the backend function."
//         }
//       },
//       {
//         "destination_node_id": "node-1758359677762",
//         "id": "edge-1758353873527-z570gkxxq",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Cannot book appointment: The backend function returns an error (e.g., no technicians available in that area, invalid address, or an issue with the product model, backend Function not working or sending error)."
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758358324898",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller gets frustrated or asks for a human:"
//         }
//       }
//     ],
//     "global_node_setting": {
//       "condition": "If the caller needs help with fixing an issue with a product or troubleshoot it"
//     },
//     "start_speaker": "agent",
//     "id": "node-1758353873527",
//     "knowledge_base_ids": [],
//     "type": "conversation",
//     "display_position": {
//       "x": 1199.6937754242101,
//       "y": 1224.401665599752
//     }
//   },
//   {
//     "name": "Callback",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758359677762",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller is satisfied and don't have any other questions"
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758359980342",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "caller expresses frustration or insists on speaking to a person, even after the callback is offered"
//         }
//       }
//     ],
//     "id": "node-1758359677762",
//     "type": "conversation",
//     "display_position": {
//       "x": 1810.6072067869118,
//       "y": 1418.014026848025
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": "Acknowledge and Apologize: The agent must politely inform the caller that there was an issue and apologize for the inconvenience. \n\nExplain and Propose: Explain that the issue requires a manual review by the scheduling team and propose a callback. Gather the caller's contact information and a brief summary of the issue to pass along.\n\nAssure: Assure the caller that a human representative will call them back as soon as possible to schedule the appointment."
//     }
//   },
//   {
//     "instruction": {
//       "type": "prompt",
//       "text": "Your primary goal is to determine if the caller's request is for a return or a warranty claim and then provide the correct information or next steps.\n\nBegin by asking the caller if they are inquiring about a product return or a warranty claim for a repair.\n\nData Collection: Instruct the agent to listen for keywords like \"return,\" \"refund,\" \"warranty,\" \"guarantee,\" or \"repair under warranty.\""
//     },
//     "name": "Returns & Warranty",
//     "edges": [
//       {
//         "destination_node_id": "node-1758363752927",
//         "id": "edge-1758363102887",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Call wants to process a Return"
//         }
//       },
//       {
//         "destination_node_id": "node-1758363757925",
//         "id": "edge-1758363131855",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "If the caller wants to make a warranty claim"
//         }
//       },
//       {
//         "destination_node_id": "node-1758291037905",
//         "id": "edge-1758362993706-htar5jzz8",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller gets frustrated or asks for a human:"
//         }
//       }
//     ],
//     "global_node_setting": {
//       "condition": "If the caller needs help with fixing an issue with a product or troubleshoot it"
//     },
//     "start_speaker": "agent",
//     "id": "node-1758362993706",
//     "knowledge_base_ids": [],
//     "type": "conversation",
//     "display_position": {
//       "x": 853.084499671239,
//       "y": 537.9390035774608
//     }
//   },
//   {
//     "name": "Return Product",
//     "edges": [
//       {
//         "destination_node_id": "node-1758289183557",
//         "id": "edge-1758363752927",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller is satisfied and don't have any more questions"
//         }
//       }
//     ],
//     "id": "node-1758363752927",
//     "type": "conversation",
//     "display_position": {
//       "x": 496.10070195565083,
//       "y": 779.4576918783185
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": `Initial Check: Confirm if the product is still within Business's return policy window (e.g., 15 days from purchase).\n\nProvide Instructions: Provide clear, concise instructions on how to initiate a return, directing the caller to the Business website's returns page.\n\nOffer More Help: Ask if the caller has any other questions about the return process.`
//     }
//   },
//   {
//     "name": "Warranty Claim",
//     "edges": [
//       {
//         "id": "edge-1758363757925-gy1uu0cdh",
//         "transition_condition": {
//           "type": "prompt",
//           "prompt": "Caller is satisfied and don't have any more questions"
//         }
//       }
//     ],
//     "id": "node-1758363757925",
//     "type": "conversation",
//     "display_position": {
//       "x": 481.40216383615024,
//       "y": 1296.4468195622578
//     },
//     "instruction": {
//       "type": "prompt",
//       "text": "Initial Check: The agent will ask for the product's model number and serial number to check its warranty status in the system.\n\nProvide Next Steps: The agent will inform the caller if the product is under warranty and provide instructions for how to proceed, which may involve scheduling a repair (linking back to the Service Appointment node).\n\n\nOffer More Help: After providing the relevant information, ask if the caller needs help with anything else."
//     }
//   }
// ];

// export default function Home() {
//   const [visibleNodes, setVisibleNodes] = useState<string[]>([
//     "start-node-1758262860487",
//   ]); // Start node visible

//   const [positions, setPositions] = useState<
//     Record<string, { x: number; y: number }>
//   >(
//     nodesData.reduce(
//       (acc, node) => ({
//         ...acc,
//         [node.id]: { x: node.display_position.x, y: node.display_position.y },
//       }),
//       {}
//     )
//   );

//   const getNodeById = (id: string) => nodesData.find((n) => n.id === id);

//   const handleNodeClick = (nodeId: string) => {
//     const node = getNodeById(nodeId);
//     if (!node || !node.edges) return;

//     const childIds = node.edges
//       .map((edge: any) => edge.destination_node_id)
//       .filter((id: string) => id);

//     setVisibleNodes((prev) => {
//       const newVisible = new Set(prev);
//       const hasChildrenVisible = childIds.some((id: string) =>
//         prev.includes(id)
//       );

//       if (hasChildrenVisible) {
//         childIds.forEach((id: string) => newVisible.delete(id));
//       } else {
//         childIds.forEach((id: string) => newVisible.add(id));
//       }
//       return Array.from(newVisible);
//     });
//   };

//   const handleDrag = (nodeId: string, _e: any, data: any) => {
//     setPositions((prev) => ({
//       ...prev,
//       [nodeId]: { x: data.x, y: data.y },
//     }));
//   };

//   // Build edges only for visible nodes
//   const edges: any[] = [];
//   for (const node of nodesData) {
//     if (!node.edges) continue;
//     if (!visibleNodes.includes(node.id)) continue;

//     for (const edge of node.edges) {
//       if (!edge.destination_node_id) continue;
//       const fromNode = getNodeById(node.id);
//       const toNode = getNodeById(edge.destination_node_id);

//       if (fromNode && toNode && visibleNodes.includes(toNode.id)) {
//         edges.push({
//           id: edge.id,
//           from: positions[fromNode.id],
//           to: positions[toNode.id],
//         });
//       }
//     }
//   }

//   return (
//     <Container maxWidth="xl" sx={{ height: "100vh", position: "relative" }}>
//       {/* Render edges first so they appear behind nodes */}
//       {edges.map((edge) => (
//         <Edge key={edge.id} from={edge.from} to={edge.to} />
//       ))}

//       {/* Render nodes */}
//       {visibleNodes.map((nodeId) => {
//         const node = getNodeById(nodeId);
//         if (!node) return null;
//         return (
//           <Node
//             key={node.id}
//             node={node}
//             position={positions[node.id]}
//             onClick={() => handleNodeClick(node.id)}
//             onDrag={(e: any, data: any) => handleDrag(node.id, e, data)}
//           />
//         );
//       })}
//     </Container>
//   );
// }
