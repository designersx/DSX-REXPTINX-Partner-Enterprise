import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Button, CardMedia, Stack, CircularProgress, Box } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

type CallDialogProps = {
  open: boolean;
  onClose: () => void;
  agent: any;
  isCallActive: boolean;
  callLoading: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  isEndingRef: React.MutableRefObject<boolean>;
  setCallLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCallActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const CallDialog: React.FC<CallDialogProps> = ({
  open,
  onClose,
  agent,
  isCallActive,
  callLoading,
  onStartCall,
  onEndCall,
  isEndingRef,
  setCallLoading,
  setIsCallActive
}) => {
  const [conversation, setConversation] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = React.useState<any>(null);

  const displayAgentName =
    agent?.agentName && agent.agentName.length > 15 ? agent.agentName.slice(0, 12) + '...' : agent?.agentName || 'Agent';

  const displayBusinessName = agent?.businessDetails?.name || agent?.company || 'Enterprise';

  const handleClose = (event: object, reason: string) => {
    


    if (reason === 'backdropClick') return;
    console.log(agent?.source, 'agentsource');
    if (agent?.source === 'filtered') {
      onEndCall();
    } else {
      endCalleleven(agent);
    }
    onClose();
  };

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

  const handleStartClick = () => {
    console.log(agent,"agent")
    if (agent?.source === 'filtered') {
      onStartCall();
    } else {
      startCalleleven(agent);
    }
  };

  const handleEndClick = () => {
    if (agent?.source === 'filtered') {
      onEndCall();
    } else {
      endCalleleven(agent);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
          minWidth: { xs: '90%', sm: 320 }
        }
      }}
    >
      <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            image={agent?.avatar ? (agent.avatar.startsWith('/') ? agent.avatar : `/${agent.avatar}`) : '/images/male-02.png'}
            alt={displayAgentName}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              mx: 'auto',
              border: '2px solid',
              borderColor: 'primary.main',
              objectFit: 'cover'
            }}
          />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {displayAgentName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {displayBusinessName} Agent
        </Typography>

        {isEndingRef.current ? (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={24} color="error" />
            <Typography color="error.main">Disconnecting...</Typography>
          </Stack>
        ) : callLoading ? (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={24} color="success" />
            <Typography color="success.main">Connecting...</Typography>
          </Stack>
        ) : isCallActive ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<CallIcon />}
            onClick={handleEndClick}
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'medium' }}
            fullWidth
          >
            End Call
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            startIcon={<CallIcon />}
            onClick={handleStartClick}
            sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'medium' }}
            fullWidth
          >
            Start Call
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
