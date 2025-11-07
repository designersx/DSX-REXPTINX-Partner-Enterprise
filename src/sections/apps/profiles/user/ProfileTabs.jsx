'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// next
import { usePathname, useRouter } from 'next/navigation';

// material-ui
import {
  Box,
  Grid,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  FormLabel
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Loader2, Camera } from 'lucide-react';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// icons
import { Profile, Lock, Setting3 } from '@wandersonalwes/iconsax-react';

// snackbar
import { openSnackbar } from 'api/snackbar';

export default function ProfileTabs({ focusInput }) {
  const router = useRouter();
  const pathname = usePathname();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const getPathIndex = (path) => {
    switch (path) {
      case '/system/userprofile':
        return 0;
      default:
        return 0;
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(getPathIndex(pathname || '/'));
  const handleListItemClick = (index, route) => {
    setSelectedIndex(index);
    router.push(route);
  };
  useEffect(() => setSelectedIndex(getPathIndex(pathname)), [pathname]);

  // ---------- Dynamic Name ----------
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/users/${userId}`);
        setName(res.data.name);
        if (res.data.profilePicture) {
          // Construct full URL like in the second code
          const rawPath = res.data.profilePicture;
          const cleanPath = rawPath.replace(/^(\.\.\/)+public/, '');
          const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
          setAvatar(fullUrl);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, [userId]);

  // ---------- Avatar Upload ----------
  const avatarImage = '/assets/images/users`';
  const [profileImage, setProfileImage] = useState(null);
  const [avatar, setAvatar] = useState(`${avatarImage}/default.png`);
  const [uploading, setUploading] = useState(false);

  // Show local preview
  useEffect(() => {
    if (profileImage) {
      const objectUrl = URL.createObjectURL(profileImage);
      setAvatar(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  // 🟢 Upload image to API (immediate upload on change, like original)
  const handleImageUpload = async (file) => {
    if (!file || !userId) return;
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/user/update_profile_picture/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === true || res.status === 200) {
        openSnackbar({
          open: true,
          message: 'Profile picture updated successfully!',
          variant: 'alert',
          alert: { color: 'success' }
        });
        // Use the returned URL if available, else keep preview
        if (res.data.profilePicUrl) {
          setAvatar(res.data.profilePicUrl);
        }
      } else {
        openSnackbar({
          open: true,
          message: res.data.message || 'Failed to upload image.',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    } catch (err) {
      console.error('Image upload error:', err);
      openSnackbar({
        open: true,
        message: 'Something went wrong while uploading image.',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setUploading(false);
      setProfileImage(null); // Clear after upload
    }
  };

  // When file selected
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // Preview is handled in useEffect, upload immediately
      handleImageUpload(file);
    }
  };

  // ---------- Change Password Dialog ----------
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return openSnackbar({
        open: true,
        message: 'Please fill all fields.',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }
    if (newPassword !== confirmPassword) {
      return openSnackbar({
        open: true,
        message: 'New and confirm passwords do not match.',
        variant: 'alert',
        alert: { color: 'error' }
      });
    }

    try {
      setChangingPassword(true);
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updateUserPassword/${userId}`, {
        oldPassword,
        newPassword
      });

      if (res.data.status === true) {
        openSnackbar({
          open: true,
          message: res.data.message || 'Password changed successfully.',
          variant: 'alert',
          alert: { color: 'success' }
        });
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Password update error:', err);
      const errorMessage = err?.response?.data?.error || 'Something went wrong';
      openSnackbar({
        open: true,
        message: errorMessage,
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <MainCard>
      <Grid container spacing={6} sx={{ p: 1 }}>
        <Grid item xs={12}>
          {/* Avatar Section */}
          <Stack sx={{ gap: 2, alignItems: 'center', mt: 3, ml: 5 }}>
            <FormLabel
              htmlFor="change-avatar"
              sx={{
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                '&:hover .MuiBox-root': { opacity: 1 },
                cursor: 'pointer'
              }}
            >
              <Avatar alt="User Avatar" src={avatar} sx={{ width: 124, height: 124, border: '1px dashed' }} />
              {uploading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Loader2 className="animate-spin" />
                </Box>
              )}
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bgcolor: 'rgba(0,0,0,.65)',
                  ...theme.applyStyles('dark', { bgcolor: 'rgba(255, 255, 255, .75)' }),
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                })}
              >
                <Stack sx={{ gap: 0.5, alignItems: 'center', color: 'secondary.lighter' }}>
                  <Camera style={{ fontSize: '2rem' }} />
                  <Typography>Upload</Typography>
                </Stack>
              </Box>
            </FormLabel>
            <TextField type="file" id="change-avatar" sx={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
            <Typography variant="h5">{name}</Typography>
          </Stack>
        </Grid>

        {/* Profile Tabs */}
        <Grid item xs={12}>
          <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: 'secondary.main' } }}>
            <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0, '/system/userprofile')}>
              <ListItemIcon>
                <Profile size={18} />
              </ListItemIcon>
              <ListItemText primary="Personal Information" />
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 2}
              onClick={() => {
                setShowPasswordModal(true);
              }}
            >
              <ListItemIcon>
                <Lock size={18} />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>

            {/* <ListItemButton selected={selectedIndex === 3} onClick={() => handleListItemClick(3, '')}>
              <ListItemIcon>
                <Setting3 size={18} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton> */}
          </List>
        </Grid>
      </Grid>

      {/* Password Dialog */}
      <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Old Password"
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOld(!showOld)}>{showOld ? <VisibilityOff /> : <Visibility />}</IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNew(!showNew)}>{showNew ? <VisibilityOff /> : <Visibility />}</IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <VisibilityOff /> : <Visibility />}</IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordModal(false)}>Cancel</Button>
          <Button disabled={changingPassword} onClick={handlePasswordChange} variant="contained" color="primary">
            {changingPassword ? (
              <>
                <Loader2 style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} /> Changing...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}

ProfileTabs.propTypes = {
  focusInput: PropTypes.func
};
