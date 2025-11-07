'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Alert, Typography, Grid } from '@mui/material';
import axios from 'axios';

// Import your full layout components
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import TicketDetailsCard from 'views/mointor/tickets/TicketDetailsCard';
import TicketDetailsSideCard from 'views/mointor/tickets/TicketDetailsSideCard';


type ApiTicket = {
  id: string;
  ticketId: string;
  subject: string;
  priority: string;
  description: string;
  category: string;
  attachments: { filename: string; url: string; type: string }[];
  status: string;
  createdAt: string;
  updatedAt: string;
  // Add messages if API returns them, otherwise mock
  messages?: any[];
};

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<ApiTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get_ticket_by_id?ticketId=${ticketId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        setTicket(res?.data?.ticket);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  // Breadcrumb
  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'helpdesk', to: '/admin-panel/helpdesk/tickets' },
    { title: `${ticket?.ticketId || ''}` }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!ticket) {
    return <Typography>No ticket found</Typography>;
  }

  return (
    <>
      <Breadcrumbs custom heading={`#${ticket.ticketId}`} links={breadcrumbLinks} />
      <Breadcrumbs links={breadcrumbLinks} />

      <Grid container spacing={GRID_COMMON_SPACING}>
        {/* Main Content */}
        <Grid size={{ xs: 12, md: 12 }}>
          <TicketDetailsCard ticket={ticket} />
        </Grid>

        {/* Side Card */}
        {/* <Grid size={{ xs: 12, md: 4 }}>
          <TicketDetailsSideCard ticket={ticket} />
        </Grid> */}
      </Grid>
    </>
  );
}