
// import React from 'react';
// import {
//   Button,
//   CardMedia,
//   Chip,
//   Stack,
//   Tooltip,
//   Typography,
//   Box,
// } from '@mui/material';
// import Avatar from 'components/@extended/Avatar';
// import IconButton from 'components/@extended/IconButton';
// import SyntaxHighlight from 'utils/SyntaxHighlight';
// import { Edit, Like1, Trash } from '@wandersonalwes/iconsax-react';

// // Types
// type Message = {
//   avatar?: string;
//   supportAgentName?: string;
//   customerName?: string;
//   chipLabel: string; // 'Agent', 'Customer', etc.
//   timeAgo: string;
//   message: string; // HTML string
//   images?: string[];
//   codeString?: string;
//   likes?: number;
//   ticketNumber?: number;
// };

// type TicketDetailsCommonCardProps = Message;

// export default function TicketDetailsCommonCard({
//   avatar,
//   supportAgentName,
//   customerName,
//   chipLabel,
//   timeAgo,
//   message,
//   images = [],
//   codeString,
//   likes = 0,
//   ticketNumber,
// }: TicketDetailsCommonCardProps) {
//   return (
//     <Stack sx={{ p: 3, gap: 2 }}>
//       <Stack sx={{ gap: 3 }} direction={{ xs: 'column', sm: 'row' }}>
//         {/* Avatar + Extra Info */}
//         {/* <Stack direction={{ xs: 'row', sm: 'column' }} sx={{ gap: 1, alignItems: 'center' }}>
//           <Avatar sx={{ height: 60, width: 60 }} src={avatar} alt={supportAgentName || customerName} />
          
//           {codeString ? (
//             <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
//               <Like1 size={16} />
//               <Typography component="span" sx={{ color: 'secondary.main' }}>
//                 {likes}
//               </Typography>
//             </Typography>
//           ) : (
//             <Typography component="div" sx={{ display: 'flex', alignItems: 'center' }}>
//               {ticketNumber ? (
//                 <Avatar variant="rounded" sx={{ mr: 0.5, height: 20, width: 20 }} color="error">
//                   {ticketNumber}
//                 </Avatar>
//               ) : null}
//               {ticketNumber ? 'Ticket' : ''}
//             </Typography>
//           )}
//         </Stack> */}

//         {/* Message Content */}
//         <Stack sx={{ gap: 2, flex: 1 }}>
//           {/* Header: Name + Chip + Actions */}
//           <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//             <Stack>
//               <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
//                 {/* <Typography variant="h4">{supportAgentName || customerName}</Typography> */}
//                 {/* <Chip size="small" label={chipLabel} color={chipLabel === 'Agent' ? 'success' : 'primary'} /> */}
//                 <Typography variant="h4">Description</Typography>

//               </Stack>
//               {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                 {timeAgo}
//               </Typography> */}
//             </Stack>

//             <Stack direction="row">
//               <Tooltip title="Edit" arrow>
//                 <IconButton color="success">
//                   {/* <Edit size={18} /> */}
//                 </IconButton>
//               </Tooltip>
//               <Tooltip title="Delete" arrow>
//                 <IconButton color="error">
//                   {/* <Trash size={18} /> */}
//                 </IconButton>
//               </Tooltip>
//             </Stack>
//           </Stack>

//           {/* Message Body */}
//           <Stack sx={{ gap: 2 }}>
//             {/* {customerName && (
//               <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                 Hello {customerName},
//               </Typography>
//             )} */}
//             <Box
//               dangerouslySetInnerHTML={{ __html: message }}
//               sx={{
//                 '& p': { m: 0, fontSize: '0.875rem', lineHeight: 1.6 },
//                 '& ul, & ol': { pl: 2.5, my: 1 },
//                 '& li': { mb: 0.5 },
//                 '& pre': { background: '#f4f4f4', p: 1, borderRadius: 1, overflow: 'auto' },
//                 '& code': { background: '#f4f4f4', px: 0.5, borderRadius: 0.5, fontSize: '0.8rem' },
//               }}
//             />
//           </Stack>

//           {/* Images */}
//           {images.length > 0 && (
//             <Stack sx={{ gap: 2, alignItems: 'flex-start' }}>
//               <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
//                 {images.map((img, idx) => (
//                   <CardMedia
//                     key={idx}
//                     component="img"
//                     image={`${process.env.NEXT_PUBLIC_API_URL}/${img}`}
//                     alt={`attachment-${idx}`}
//                     sx={{
//                       height: 80,
//                       width: 120,
//                       objectFit: 'cover',
//                       borderRadius: 1,
//                       cursor: 'pointer',
//                       '&:hover': { opacity: 0.8 },
//                     }}
//                   />
//                 ))}
//               </Stack>
//               {/* <Button color="error" variant="dashed" sx={{ border: 'none' }} startIcon={<Like1 />}>
//                 Like
//               </Button> */}
//             </Stack>
//           )}

//           {/* Code Block */}
//           {codeString && (
//             <Box sx={{ mt: 2 }}>
//               <SyntaxHighlight customStyle={{ margin: 0, fontSize: '0.8rem' }}>
//                 {codeString}
//               </SyntaxHighlight>
//             </Box>
//           )}
//         </Stack>
//       </Stack>
//     </Stack>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Close, Download, Visibility } from '@mui/icons-material';
import SyntaxHighlight from 'utils/SyntaxHighlight';

// === Types ===
type Message = {
  message: string;
  images?: string[]; // Actually: file paths (jpg, png, pdf, etc.)
  codeString?: string;
};

type TicketDetailsCommonCardProps = Message;

// === Helper: Get File Type ===
const getFileType = (filename: string): 'image' | 'pdf' | 'other' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'other';
};

// === Main Component ===
export default function TicketDetailsCommonCard({
  message,
  images = [],
  codeString,
}: TicketDetailsCommonCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentFile = images[selectedIndex];
  const fileType = currentFile ? getFileType(currentFile) : 'other';

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
  }, [open, selectedIndex, images.length]);

  return (
    <>
      <Stack sx={{ p: 3, gap: 2 }}>
        <Stack sx={{ gap: 2, flex: 1 }}>
          {/* Message */}
          <Box
            dangerouslySetInnerHTML={{ __html: message }}
            sx={{
              '& p': { m: 0, fontSize: '0.875rem', lineHeight: 1.6 },
              '& ul, & ol': { pl: 2.5, my: 1 },
              '& li': { mb: 0.5 },
              '& pre': { bgcolor: 'grey.100', p: 1, borderRadius: 1, overflow: 'auto' },
              '& code': { bgcolor: 'grey.100', px: 0.5, borderRadius: 0.5, fontSize: '0.8rem' },
            }}
          />

          {/* File Thumbnails */}
          {images.length > 0 && (
            <Stack sx={{ gap: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Attachments
              </Typography>
              <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap' }}>
                {images.map((file, idx) => {
                  const type = getFileType(file);
                  const isImage = type === 'image';
                  const isPdf = type === 'pdf';

                  return (
                    <Box
                      key={idx}
                      onClick={() => handleOpen(idx)}
                      sx={{
                        position: 'relative',
                        height: 80,
                        width: 120,
                        borderRadius: 1,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 3,
                          '& .overlay': { opacity: 1 },
                        },
                      }}
                    >
                      {isImage ? (
                        <CardMedia
                          component="img"
                          image={`${process.env.NEXT_PUBLIC_API_URL}/${file}`}
                          alt={`thumb-${idx}`}
                          sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
                        />
                      ) : isPdf ? (
                        <Box
                          sx={{
                            height: '100%',
                            bgcolor: 'grey.200',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 0.5,
                            color: 'error.main',
                          }}
                        >
                          <Visibility fontSize="small" />
                          <Typography variant="caption">PDF</Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            height: '100%',
                            bgcolor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            FILE
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
            </Stack>
          )}

          {/* Code Block */}
          {codeString && (
            <Box sx={{ mt: 2 }}>
              <SyntaxHighlight customStyle={{ margin: 0, fontSize: '0.8rem' }}>
                {codeString}
              </SyntaxHighlight>
            </Box>
          )}
        </Stack>
      </Stack>

      {/* Universal Preview Modal */}
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
              {currentFile?.split('/').pop() || 'File'}
            </Typography>
            <Stack direction="row" gap={1}>
              {/* Download Button */}
              <IconButton
                component="a"
                href={`${process.env.NEXT_PUBLIC_API_URL}/${currentFile}`}
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

          {/* Navigation Buttons */}
          {images.length > 1 && (
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
              pt: 10, // space for header
            }}
          >
            {fileType === 'image' && (
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_API_URL}/${currentFile}`}
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
                src={`${process.env.NEXT_PUBLIC_API_URL}/${currentFile}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: 8,
                }}
                title="PDF Preview"
              />
            )}

            {fileType === 'other' && (
              <Box
                sx={{
                  textAlign: 'center',
                  p: 4,
                  color: 'text.secondary',
                }}
              >
                <Visibility sx={{ fontSize: 48, mb: 2, color: 'grey.400' }} />
                <Typography variant="h6">Preview Not Available</Typography>
                <Typography variant="body2">
                  This file type cannot be previewed.
                </Typography>
                <Button
                  component="a"
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${currentFile}`}
                  target="_blank"
                  download
                  variant="outlined"
                  sx={{ mt: 2 }}
                >
                  Download to View
                </Button>
              </Box>
            )}
          </Box>

          {/* Footer Counter */}
          {images.length > 1 && (
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
              {selectedIndex + 1} / {images.length}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}