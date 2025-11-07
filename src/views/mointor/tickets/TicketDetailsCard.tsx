
// import React from 'react';
// import { Button, Divider, Stack, Typography, Box } from '@mui/material';
// import MainCard from 'components/MainCard';
// import { Lock1, Message, Edit, ProfileTick, Star1 } from '@wandersonalwes/iconsax-react';
// import TicketDetailsCommonCard from './TicketDetailsCommonCard';

// type TicketDetailsCardProps = {
//   ticket: {
//     ticketId: string;
//     subject: string;
//     description: string;
//     status: string;
//     priority: string;
//     createdAt: string;
//     // Add messages if you have conversation history
//     messages?: any[];
//   };
// };

// export default function TicketDetailsCard({ ticket }: TicketDetailsCardProps) {
//     const parsedAttachments =
//   typeof ticket?.attachments === 'string'
//     ? JSON.parse(ticket.attachments || '[]')
//     : ticket?.attachments || [];
//   // Mock conversation for now (replace with real API messages later)
//   const mockMessages = [
//     {
//       avatar: '/assets/images/users/avatar-1.png',
//       supportAgentName: ticket?.category ||'Support Agent',
//       customerName: 'You',
//       chipLabel: 'Agent',
//       timeAgo: '2 hours ago',
//       message: `<p>${ticket.description}</p>`,
//       images: parsedAttachments?.map(a => a.url) || [],
//       codeString: null,
//       likes: 0,
//       ticketNumber: null,
//     },
//   ];

//   return (
//     <MainCard
//       title={
//         <Stack direction="row" sx={{ gap: 1, alignItems: 'center', color: 'primary.main' }}>
//           {/* <Lock1 size={20} /> */}
//           <Typography variant="h5" sx={{ color: 'text.primary' }}>
//              {ticket.ticketId}
//           </Typography>
//         </Stack>
//       }
//       content={false}
//     >
//       <Stack
//         direction={{ xs: 'column', sm: 'row' }}
//         sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, px: 3, py: 1 }}
//       >
//         <Typography variant="h4">Department : {ticket?.department}</Typography>
//         {/* <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
//           <Button color="success" sx={{ border: 'none' }} variant="dashed">
//             Mark as unread
//           </Button>
//           <Box component="span" sx={{ color: 'warning.main', display: 'flex', alignItems: 'center' }}>
//             <Star1 style={{ cursor: 'pointer' }} size={20} />
//           </Box>
//         </Stack> */}
//       </Stack>
//       <Divider />

//       {/* <Stack direction="row" sx={{ gap: 1, px: 3, py: 2, flexWrap: 'wrap' }}>
//         <Button color="success" startIcon={<Message />} sx={{ border: 'none' }} variant="dashed">
//           Post a reply
//         </Button>
//         <Button color="warning" startIcon={<Edit />} sx={{ border: 'none' }} variant="dashed">
//           Post a Note
//         </Button>
//         <Button color="error" startIcon={<ProfileTick />} sx={{ border: 'none' }} variant="dashed">
//           Customer Notes
//         </Button>
//       </Stack> */}
//       <Divider />

//       {mockMessages.map((data, index) => (
//         <React.Fragment key={index}>
//           <TicketDetailsCommonCard {...data} />
//           {index < mockMessages.length - 1 && <Divider />}
//         </React.Fragment>
//       ))}
//     </MainCard>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import MainCard from 'components/MainCard';
import { Calendar, Clock, Tag } from '@wandersonalwes/iconsax-react';
import { ErrorOutline,ChevronLeft, ChevronRight, Close, Download, Visibility } from '@mui/icons-material';

type TicketDetailsCardProps = {
  ticket: {
    ticketId: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    attachments: { filename: string; url: string; type: string }[];
  };
};

const priorityColor = {
  High: 'error',
  Medium: 'warning',
  Low: 'success',
} as const;

// === Helper: Get File Type ===
const getFileType = (filename: string): 'image' | 'pdf' | 'other' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'other';
};

export default function TicketDetailsCard({ ticket }: TicketDetailsCardProps) {
  const attachments =
    typeof ticket.attachments === 'string'
      ? JSON.parse(ticket.attachments || '[]')
      : ticket.attachments || [];

  // === Preview Modal State ===
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentFile = attachments[selectedIndex];
  const fileType = currentFile ? getFileType(currentFile.filename) : 'other';
  const fileUrl = currentFile ? `${process.env.NEXT_PUBLIC_API_URL}${currentFile.url}` : '';

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));
  };

  // Keyboard Navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev(e as any);
      if (e.key === 'ArrowRight') handleNext(e as any);
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, selectedIndex, attachments.length]);

  return (
    <>
      <MainCard content={false}>
        {/* Header: Ticket ID + Status */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography variant="h5" color="primary">
              {ticket.subject}
            </Typography>
            <Chip
              label={ticket.status}
              color={
                ticket.status === 'Open'
                  ? 'success'
                  : ticket.status === 'Closed'
                  ? 'error'
                  : 'warning'
              }
              size="small"
            />
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Description */}
            <Box>
              <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Description
              </Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: ticket.description }}
                sx={{
                  fontSize: '0.925rem',
                  lineHeight: 1.7,
                  '& p': { margin: '0 0 0.75rem' },
                  '& ul, & ol': { pl: 3, my: 1 },
                  '& li': { mb: 0.5 },
                }}
              />
            </Box>

            {/* Attachments with Preview */}
            {attachments.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom color="text.secondary">
                  Attachments ({attachments.length})
                </Typography>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 1 }}>
                  {attachments.map((file: any, idx: number) => {
                    const isImage = getFileType(file.filename) === 'image';
                    const isPdf = file.filename.toLowerCase().endsWith('.pdf');
                    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;

                    return (
                      <Box
                        key={idx}
                        onClick={() => handleOpen(idx)}
                        sx={{
                          width: 110,
                          height: 80,
                          borderRadius: 1.5,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                            '& .overlay': { opacity: 1 },
                          },
                        }}
                      >
                        {isImage ? (
                          <CardMedia
                            component="img"
                            image={fileUrl}
                            alt={file.filename}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : isPdf ? (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: 'error.light',
                              color: 'error.dark',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                            }}
                          >
                            <ErrorOutline fontSize="small" />
                            <Typography variant="caption" fontWeight={600}>
                              PDF
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: '100%',
                              bgcolor: 'grey.100',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {file.filename.split('.').pop()?.toUpperCase()}
                            </Typography>
                          </Box>
                        )}

                        {/* Hover Overlay */}
                        <Box
                          className="overlay"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          <Visibility />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}

            <Divider />

            {/* Ticket Info */}
            <Stack spacing={2.5}>
              <Typography variant="subtitle1" color="text.secondary">
                Ticket Details
              </Typography>

              {/* Priority */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: `${priorityColor[ticket.priority as keyof typeof priorityColor]}.main`,
                  }}
                />
                <Typography variant="body1" fontWeight={500}>
                  Priority:
                </Typography>
                <Chip
                  label={ticket.priority}
                  color={priorityColor[ticket.priority as keyof typeof priorityColor]}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Stack>

              {/* Category */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Tag size={18} color="primary" />
                <Typography variant="body1" fontWeight={500}>
                  Category:
                </Typography>
                <Typography variant="body2" sx={{ ml: 'auto', color: 'text.primary' }}>
                  {ticket.category}
                </Typography>
              </Stack>

              {/* Created */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Calendar size={18} color="primary" />
                <Typography variant="body1" fontWeight={500}>
                  Created:
                </Typography>
                <Typography variant="body2" sx={{ ml: 'auto', color: 'text.primary' }}>
                  {new Date(ticket.createdAt).toLocaleDateString()} at{' '}
                  {new Date(ticket.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Stack>

              {/* Updated */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Clock size={18} color="primary" />
                <Typography variant="body1" fontWeight={500}>
                  Updated:
                </Typography>
                <Typography variant="body2" sx={{ ml: 'auto', color: 'text.primary' }}>
                  {new Date(ticket.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(ticket.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </MainCard>

      {/* === Preview Modal === */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        PaperProps={{
          sx: {
            m: 0,
            width: '95vw',
            height: '95vh',
            maxWidth: 'none',
            maxHeight: 'none',
            bgcolor: 'background.default',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', height: '100%', overflow: 'hidden' }}>
          {/* Header */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 64,
              bgcolor: 'rgba(0,0,0,0.8)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              zIndex: 10,
            }}
          >
            <Typography variant="subtitle1" noWrap sx={{ maxWidth: '70%' }}>
              {currentFile?.filename || 'File'}
            </Typography>
            <Stack direction="row" gap={1}>
              <IconButton
                component="a"
                href={fileUrl}
                target="_blank"
                download
                sx={{ color: 'white' }}
                title="Download"
              >
                <Download />
              </IconButton>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                <Close />
              </IconButton>
            </Stack>
          </Box>

          {/* Navigation */}
          {attachments.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  zIndex: 10,
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  zIndex: 10,
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          {/* File Viewer */}
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              pt: 10,
            }}
          >
            {fileType === 'image' && (
              <Box
                component="img"
                src={fileUrl}
                alt="preview"
                sx={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 1,
                  boxShadow: 3,
                }}
              />
            )}

            {fileType === 'pdf' && (
              <iframe
                src={fileUrl}
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: 8 }}
                title="PDF Preview"
              />
            )}

            {fileType === 'other' && (
              <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                <Visibility sx={{ fontSize: 48, mb: 2, color: 'grey.400' }} />
                <Typography variant="h6">Preview Not Available</Typography>
                <Typography variant="body2">This file type cannot be previewed.</Typography>
                <Tooltip title="Download to view">
                  <IconButton
                    component="a"
                    href={fileUrl}
                    target="_blank"
                    download
                    sx={{ mt: 2 }}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Footer Counter */}
          {attachments.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
              }}
            >
              {selectedIndex + 1} / {attachments.length}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}