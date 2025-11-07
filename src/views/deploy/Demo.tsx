'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { Loader2 } from 'lucide-react';

interface DemoAppProps {
  onSessionGenerated?: () => void;
}

export default function DemoApp({ onSessionGenerated }: DemoAppProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const handleStartDemo = async () => {
    if (!userId) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/demoApp/generate-demoSessionId?userId=${encodeURIComponent(
          userId
        )}&role=${encodeURIComponent('Partner')}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { encryptedPayload, signature } = res.data;

      if (!encryptedPayload || !signature) {
        setError('Session generation failed');
        setLoading(false);
        return;
      }

      const signupUrl = `${process.env.NEXT_PUBLIC_DEMO_APP_URL}?sessionId=${encodeURIComponent(
        encryptedPayload
      )}&signature=${encodeURIComponent(signature)}`;

      window.open(signupUrl, '_blank');

      // if (onSessionGenerated) onSessionGenerated();
    } catch (err) {
      console.error(err);
      setError('Failed to generate demo session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      p={{ xs: 2, sm: 3, md: 4 }}
      bgcolor="background.default"
    >
      <Typography variant="h4" component="h1" mb={3} textAlign="center">
        Start Demo Session
      </Typography>

      {error && (
        <Typography variant="body1" color="error" mb={2} textAlign="center">
          {error}
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleStartDemo} disabled={loading} size="large" sx={{ minWidth: 200, mb: 2 }}>
        {loading ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={20} color="inherit" />
            Starting Demo...
          </Box>
        ) : (
          'Start Demo'
        )}
      </Button>

      <Typography variant="body2" color="textSecondary" textAlign="center" maxWidth={{ xs: 300, sm: 400, md: 500 }}>
        Click the button above to launch the demo application in a new tab.
      </Typography>
    </Box>
  );
}
