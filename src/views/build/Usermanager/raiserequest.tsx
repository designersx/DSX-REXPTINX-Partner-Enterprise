// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";

// interface RaiseRequestModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   userId: string | null;
//   email: string | null; // ✅ add email
//   onSubmit: (comment: string, userId: string, email: string) => void; // ✅ email in onSubmit
// }

// export function RaiseRequestModal({
//   isOpen,
//   onClose,
//   userId,
//   email,
//   onSubmit,
// }: RaiseRequestModalProps) {
//   const [comment, setComment] = useState("");

//   const handleSubmit = () => {
//     if (comment.trim() && userId && email) {
//       onSubmit(comment, userId, email); // ✅ pass email
//       setComment("");
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Raise a Request</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <Input
//             placeholder="Enter your comment..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//           />
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             className="bg-purple-600 hover:bg-purple-700"
//           >
//             Submit
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface RaiseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  email: string | null;
  onSubmit: (comment: string, userId: string, email: string) => void;
}

export function RaiseRequestModal({ isOpen, onClose, userId, email, onSubmit }: RaiseRequestModalProps) {
  const [comment, setComment] = useState('');

  // Reset comment when modal opens/closes
  useEffect(() => {
    if (!isOpen) setComment('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (comment.trim() && userId && email) {
      onSubmit(comment, userId, email);
      setComment('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Raise a Request</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Comment"
          placeholder="Enter your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!comment.trim()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
