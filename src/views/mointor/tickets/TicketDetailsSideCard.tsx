
import { Stack, Typography, Chip, Divider, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { Calendar, Clock, Tag, User } from '@wandersonalwes/iconsax-react';

type SideCardProps = {
  ticket: {
    priority: string;
    status: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    // Add requester if available
  };
};

const priorityColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

export default function TicketDetailsSideCard({ ticket }: SideCardProps) {
  return (
    <MainCard title="Ticket Info" content={false}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tag size={18} />
          <Typography variant="subtitle1">Status</Typography>
        </Stack>
        <Chip label={ticket.status} color="primary" size="small" />

        <Divider />

        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: `${priorityColor[ticket.priority]}.main` }} />
          <Typography variant="subtitle1">Priority</Typography>
        </Stack>
        <Chip label={ticket.priority} color={priorityColor[ticket.priority]} size="small" />

        <Divider />

        <Stack direction="row" spacing={1} alignItems="center">
          <User size={18} />
          <Typography variant="subtitle1">Category</Typography>
        </Stack>
        <Typography variant="body2">{ticket.category}</Typography>

        <Divider />

        <Stack direction="row" spacing={1} alignItems="center">
          <Calendar size={18} />
          <Typography variant="subtitle1">Created</Typography>
        </Stack>
        <Typography variant="body2">
          {new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Clock size={18} />
          <Typography variant="subtitle1">Updated</Typography>
        </Stack>
        <Typography variant="body2">
          {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
        </Typography>
      </Stack>
    </MainCard>
  );
}