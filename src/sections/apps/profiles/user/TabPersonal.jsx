'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Camera } from 'lucide-react';
import { FadeLoader } from 'react-spinners';
import axios from 'axios';

// MUI imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project-imports
import { openSnackbar } from 'api/snackbar';

export default function TabPersonal({ onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [googleBusiness, setGoogleBusiness] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/images/defaultiprofile.svg');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState('www.rxpt.us');

  const autocompleteInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.maps?.places && autocompleteInputRef.current) {
        initAutocomplete();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const initAutocomplete = () => {
    if (!autocompleteInputRef.current || !window.google?.maps) return;

    const autocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const comps = place?.address_components || [];
      const get = (type) => comps.find((c) => c.types.includes(type))?.long_name || '';

      setGoogleBusiness(place?.formatted_address || '');
      setCity(get('locality') || get('administrative_area_level_2'));
      setState(get('administrative_area_level_1'));
      setCountry(get('country'));
      setPinCode(get('postal_code'));
    });
  };

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/users/${userId}`);
        const data = res.data;

        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        if (data.profilePicture) {
          const rawPath = data.profilePicture;
          const cleanPath = rawPath.replace(/^(\.\.\/)+public/, '');
          const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
          setPreviewUrl(fullUrl);
        }
        setGoogleBusiness(data.address || '');
        setAddressLine(data.addressLine || '');
        setCity(data.city || '');
        setState(data.state || '');
        setCountry(data.country || '');
        setPinCode(data.pinCode || '');
        setPrimaryDomain(data.primaryDomain || 'www.rxpt.us');
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // Show local preview for selected image
  useEffect(() => {
    if (profileImage) {
      const objectUrl = URL.createObjectURL(profileImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [profileImage]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) setProfileImage(file);
  };

  const handleSubmit = async () => {
    try {
      setUpdating(true);
      const fullAddress = `${addressLine}, ${googleBusiness}, ${city}, ${state}, ${country} - ${pinCode}`;

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/updatePartnerProfile/${userId}`, {
        name,
        email,
        phone,
        addressLine,
        address: fullAddress,
        city,
        state,
        country,
        pinCode,
        primaryDomain
      });

      localStorage.setItem('primaryDomain', primaryDomain);

      if (profileImage) {
        const formData = new FormData();
        formData.append('profilePicture', profileImage);
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/endusers/user/update_profile_picture/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      openSnackbar({
        open: true,
        message: 'Profile updated successfully.',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    } catch (err) {
      console.error('Error updating profile', err);
      openSnackbar({
        open: true,
        message: 'Failed to update profile.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return openSnackbar({
        open: true,
        message: 'Please fill all fields.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    }
    if (newPassword !== confirmPassword) {
      return openSnackbar({
        open: true,
        message: 'New and confirm passwords do not match.',
        variant: 'alert',
        alert: {
          color: 'error'
        }
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
          alert: {
            color: 'success'
          }
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordModal(false);
      }
    } catch (err) {
      console.error('Password update error:', err);
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || 'Something went wrong';
      openSnackbar({
        open: true,
        message: errorMessage,
        variant: 'alert',
        alert: {
          color: 'error'
        }
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 1 }}>
      <Card sx={{ boxShadow: 0 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider',
              pb: 2,
              mb: 3
            }}
          >
            <Typography variant="h4" component="h2">
              Your Profile
            </Typography>
          </Box>

          {/* Profile Image and Name */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            <TextField fullWidth label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </Box>

          {/* Email and Phone */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" value={email} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Grid>
          </Grid>

          {/* Nearby Place */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              inputRef={autocompleteInputRef}
              label="Nearby place"
              placeholder="Search address or business"
              value={googleBusiness}
              onChange={(e) => setGoogleBusiness(e.target.value)}
            />
          </Box>

          {/* Address Fields */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="State" value={state} onChange={(e) => setState(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Pincode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
            </Grid>
          </Grid>

          {/* Primary Domain */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 300 }}>
              Primary Domain
            </Typography>
            <RadioGroup value={primaryDomain} onChange={(e) => setPrimaryDomain(e.target.value)} row sx={{ gap: 1, mt: 1 }}>
              <FormControlLabel value="www.rxpt.us" control={<Radio />} label="www.rxpt.us" />
              <FormControlLabel value="www.rxpt.ca" control={<Radio />} label="www.rxpt.ca" />
            </RadioGroup>
          </Box>

          {/* Update Button */}
          <Box key="update-box" sx={{ pt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              key="update-button"
              onClick={handleSubmit}
              disabled={updating}
              variant="contained"
              color="primary"
              size="large"
              startIcon={updating ? <Loader2 key="loader" sx={{ animation: 'spin 1s linear infinite' }} /> : null}
              sx={{ minWidth: 200 }}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>

          {/* Password Change Dialog */}
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
                        <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                          {showConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Cancel
              </Button>
              <Button disabled={changingPassword} onClick={handlePasswordChange} variant="contained" color="primary">
                {changingPassword ? (
                  <>
                    <Loader2 sx={{ animation: 'spin 1s linear infinite', mr: 1 }} /> Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
}
