// material-ui
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

// project-imports
import { raiseRequest } from '../../../../Services/auth';
import { openSnackbar } from '../../../api/snackbar';
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { Message } from '@wandersonalwes/iconsax-react';

// types
import { SnackbarProps } from 'types/snackbar';

interface Props {
  id: string; // userId
  email: string;
  title: string;
  open: boolean;
  handleClose: () => void;
  fetchRequests?: () => void; // optional, if you want to refresh request list
}

// ==============================|| RAISE REQUEST MODAL (REPLACEMENT) ||============================== //

export default function AlertCustomerDelete({ id, email, title, open, handleClose, fetchRequests }: Props) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      openSnackbar({
        open: true,
        message: 'Please enter a comment before submitting.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: { color: 'warning' }
      } as SnackbarProps);
      return;
    }

    setLoading(true);
    try {
      const raisedByUserId = localStorage.getItem('userId');

      const response = await raiseRequest({
        userId: id,
        email,
        comment,
        raisedByUserId
      });

      if (response?.status) {
        openSnackbar({
          open: true,
          message: 'Request raised successfully!',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: { color: 'success' }
        } as SnackbarProps);

        if (fetchRequests) fetchRequests();
        setComment('');
        handleClose();
      } else {
        openSnackbar({
          open: true,
          message: 'Failed to raise request. Please try again.',
          anchorOrigin: { vertical: 'top', horizontal: 'right' },
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
      }
    } catch (error) {
      openSnackbar({
        open: true,
        message: 'Something went wrong while submitting the request.',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: { color: 'error' }
      } as SnackbarProps);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      slots={{ transition: PopupTransition }}
      maxWidth="xs"
      aria-labelledby="raise-request-title"
      aria-describedby="raise-request-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack sx={{ gap: 3.5, alignItems: 'center' }}>
          <Avatar color="primary" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Message variant="Bold" />
          </Avatar>

          <Stack sx={{ gap: 2, width: '100%' }}>
            <Typography variant="h4" align="center">
              Raise Request for User
            </Typography>
            <Typography align="center">
              Add a comment for{' '}
              <Typography variant="subtitle1" component="span">
                "{title}"
              </Typography>{' '}
              below.
            </Typography>

            <TextField
              label="Enter your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>

          <Stack direction="row" sx={{ gap: 2, width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="primary" variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
