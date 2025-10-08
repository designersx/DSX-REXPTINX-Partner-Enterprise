'use client';

import { Box, Grid, Typography, Button, Card, CardContent, CardHeader, Chip, Avatar, Divider } from '@mui/material';
import { ArrowLeft, Mail, Phone, Calendar, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  registrationDate?: string;
  phone: string;
  referredBy: string;
  referralCode: string;
  referalName: string;
}

interface UserDetailsProps {
  user: User;
  onBack: () => void;
}

export default function UserDetails({ user, onBack }: UserDetailsProps) {
  const getStatusChip = (status: User['status']) => {
    const variants = {
      Active: { label: 'Active', color: 'success' as const },
      Inactive: { label: 'Inactive', color: 'default' as const },
      Suspended: { label: 'Suspended', color: 'error' as const }
    };
    const variant = variants[status];
    return <Chip label={variant.label} color={variant.color} variant="filled" size="small" />;
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowLeft size={16} />}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 2
          }}
        >
          Back to Users
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            User Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete information for {user.name}
          </Typography>
        </Box>
      </Box>

      {/* Main Layout */}
      <Grid container spacing={4}>
        {/* Profile Card */}
        {/* <Grid item xs={12} lg={4}>
          <Card sx={{ p: 2, textAlign: 'center', borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
              title={
                <Box>
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Typography>
                  </Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>{getStatusChip(user.status)}</Box>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Mail size={16} color="#666" />
                <Typography variant="body2" color="text.secondary">
                  {user.email || '--'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Phone size={16} color="#666" />
                <Typography variant="body2" color="text.secondary">
                  {user.phone || '--'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Shield size={16} color="#666" />
                <Typography variant="body2" color="text.secondary">
                  {user.role || 'User'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid> */}

        {/* Right Side – Info Cards */}
        <Grid item xs={12} lg={8}>
          {/* Basic Information */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
            <CardHeader title={<Typography variant="h6">Basic Information</Typography>} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                {[
                  ['User ID', user.id],
                  ['Full Name', user.name],
                  ['Email Address', user.email || '--'],
                  ['Contact Number', user.phone || '--'],
                  ['Referral Code', user.referralCode || '--'],
                  ['Referred By (Code)', user.referredBy || '--'],
                  ['Referred By (Name)', user.referalName || '--']
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {value}
                    </Typography>
                  </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Status
                  </Typography>
                  {getStatusChip(user.status)}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Activity Information */}
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader title={<Typography variant="h6">Activity Information</Typography>} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'info.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Calendar size={20} color="#0288d1" />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Registration Date
                      </Typography>
                      <Typography variant="body1">
                        {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
