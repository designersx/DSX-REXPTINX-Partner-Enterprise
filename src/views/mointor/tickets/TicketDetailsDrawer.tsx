'use client';

import {
  Box,
  Typography,
  Drawer,
  IconButton,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';
import SafeHtml from 'utils/SafeHtml';

type Ticket = {
  ticketId: string;
  subject: string;
  priority: string;
  description: string;
  category: string;
  attachments: { filename: string; url: string; type: string }[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface TicketDetailsDrawerProps {
  isOpen: boolean;
  handleDrawerOpen: () => void;
  ticket: Ticket | null;
}

export default function TicketDetailsDrawer({ isOpen, handleDrawerOpen, ticket }: TicketDetailsDrawerProps) {
  const getStatusChipProps = (status: string) => {
    switch (status) {
      case 'Open':
        return { label: status, color: 'info' as const, variant: 'filled' };
      case 'In Progress':
        return { label: status, color: 'warning' as const, variant: 'filled' };
      case 'Resolved':
        return { label: status, color: 'success' as const, variant: 'filled' };
      case 'Reopened':
        return { label: status, color: 'error' as const, variant: 'filled' };
      default:
        return { label: status, color: 'default' as const, variant: 'filled' };
    }
  };
  const parsedAttachments =
  typeof ticket?.attachments === 'string'
    ? JSON.parse(ticket?.attachments || '[]')
    : ticket?.attachments || [];
console.log('ticket',ticket,parsedAttachments)
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleDrawerOpen}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, p: 3 } }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Ticket Details</Typography>
        <IconButton onClick={handleDrawerOpen}>
          <CloseIcon />
        </IconButton>
      </Stack>
      {ticket ? (
        <Stack sx={{ gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Ticket ID</Typography>
            <Typography>{ticket?.ticketId}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Subject</Typography>
            <Typography>{ticket?.subject}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Status</Typography>
            <Chip {...getStatusChipProps(ticket?.status)} size="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Priority</Typography>
            <Typography>{ticket?.priority}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Category</Typography>
            <Typography>{ticket?.category}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Description</Typography>
            <Typography><SafeHtml html={ticket?.description} sx={{ '& p': { my: 0 } }} /></Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Created At</Typography>
            <Typography>{ticket?.createdAt && format(new Date(ticket?.createdAt), 'dd MMMM yyyy')}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Last Updated</Typography>
            <Typography>{ticket?.updatedAt && format(new Date(ticket?.updatedAt), 'dd MMMM yyyy, HH:mm')}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">Attachments</Typography>
            {parsedAttachments?.length == 0 ? (
              <Typography color="text.secondary">No attachments</Typography>
            ) : (
              parsedAttachments?.map((file, idx) => {
                const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
                return (
                  <Stack key={idx} direction="row" sx={{ alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography>{file.filename}</Typography>
                    <Button
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      startIcon={<DownloadIcon />}
                    >
                      Download
                    </Button>
                  </Stack>
                );
              })
            )}
          </Box>
        </Stack>
      ) : (
        <Typography>No ticket selected</Typography>
      )}
    </Drawer>
  );
}