// 'use client';

// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogTitle, Slide, Button, Typography, Box } from '@mui/material';
// import { TransitionProps } from '@mui/material/transitions';
// import AgentGeneralInfo from './CreateAgent';
// import PartnerAgentGeneralInfo from './CreatePartnerAgent';

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
// export default function AgentGeneralInfoModal({ open, onClose, onSubmit }) {
//   return (
//     // <Dialog
//     //   open={open}
//     //   onClose={(event, reason) => {
//     //     if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
//     //     onClose(event, reason);
//     //   }}
//     //   fullWidth
//     //   disableEscapeKeyDown
//     //   TransitionComponent={Transition}
//     //   PaperProps={{
//     //     sx: {
//     //       height: '100vh',
//     //       borderRadius: 3,
//     //       overflow: 'hidden',
//     //       maxWidth: '900px',
//     //       width: '100%',
//     //     },
//     //   }}
//     // >
//     //   <DialogContent sx={{ p: 4, width: '130%', height: '100%', display: 'flex', flexDirection: 'column' }}>
// {localStorage.getItem('roleId') =='4' ?(
//     <AgentGeneralInfo open={open} onClose={onClose} onSubmit={onSubmit} /> ):(
//    <PartnerAgentGeneralInfo open={open} onClose={onClose} onSubmit={onSubmit} /> )

// }
//     //   </DialogContent>
//     // </Dialog>
//   );
// }

'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import AgentGeneralInfo from './CreateAgent';
import PartnerAgentGeneralInfo from './CreatePartnerAgent';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any>; },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AgentGeneralInfoModalProps {
  open: boolean;
  onClose: (event?: object, reason?: string) => void;
  onSubmit: () => void;
}

export default function AgentGeneralInfoModal({ open, onClose, onSubmit }: AgentGeneralInfoModalProps) {
  const roleId = localStorage.getItem('roleId');

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose(event, reason);
      }}
      fullWidth
      disableEscapeKeyDown
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          height: '100vh',
          borderRadius: 3,
          overflow: 'hidden',
          maxWidth: '900px',
          width: '100%',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 4,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {roleId == '4' ? (
          <AgentGeneralInfo open={open} onClose={onClose} onSubmit={onSubmit} />
        ) : (
          <PartnerAgentGeneralInfo open={open} onClose={onClose} onSubmit={onSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}
