'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  IconButton,
  Stack
} from '@mui/material';
import { Search, Plus, Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { FadeLoader } from 'react-spinners';
import { UserModal } from './Usermanager/user-modal';
import { RaiseRequestModal } from './Usermanager/raiserequest';
import { retrieveAllRegisteredUsers, deleteUser, raiseRequest, checkUserRequestStatus, addUser } from '../../../Services/auth';
import UserDetails from './Usermanager/viewUser';
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string | null;
  status: string;
  registrationDate?: string | null;
  referredBy?: string;
  isUserType?: string;
  referralCode?: string;
  referalName?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [raiseModalOpen, setRaiseModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [selectedUserss, setSelectedUserss] = useState<User | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [alreadyRequested, setAlreadyRequested] = useState<
    { id: number; userId: string; email: string; comment: string; Status: string; createdAt: string }[]
  >([]);
  const usersPerPage = 5;
  console.log(selectedUserss, 'selecteduserss');
  // Fetch users
  async function fetchUsers() {
    try {
      setLoading(true);
      const apiUsers = await retrieveAllRegisteredUsers();
      console.log(apiUsers, 'resss');
      if (!Array.isArray(apiUsers)) {
        console.error('API returned error:', apiUsers);
        return;
      }
      console.log(apiUsers, 'arraay');
      const mappedUsers = apiUsers.map((u: any, index: number) => ({
        id: u.userId ?? `USR${String(index + 1).padStart(3, '0')}`,
        name: u.name ?? 'N/A',
        email: u.email ?? 'No Email',
        registrationDate: u.createdAt ?? null,
        phone: u.phone ?? 'N/A',
        referredBy: u.referredBy,
        status: u.activeStatus === 1 ? 'Active' : 'Inactive',
        isUserType: u.isUserType,
        referralCode: u.referralCode ?? 'N/A',
        referalName: u.referredByName ?? 'N/A'
      }));
      console.log(mappedUsers, 'mappedUsers');
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchRequestedUsers = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      const data = await checkUserRequestStatus(currentUserId);
      console.log('test', data);
      setAlreadyRequested(data.requests || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRequestedUsers();
  }, []);

  const handleSaveUser = async (userData: Omit<User, 'id'>) => {
    setIsSaving(true);
    const name = userData.name?.trim();
    const phone = userData.phone?.trim();
    const email = userData.email?.trim();

    const finalPayload: any = {
      email,
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      role: null
    };

    if (editingUser?.id) {
      finalPayload.id = editingUser.id;
    } else {
      const referredBy = typeof window !== 'undefined' ? localStorage.getItem('referralCode') : null;
      const referredId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      if (referredBy) finalPayload.referredBy = referredBy;
      if (referredId) finalPayload.referredId = referredId;
    }

    try {
      const response = await addUser(finalPayload);
      if (response?.status === true) {
        const userId = finalPayload.id || response?.data?.userId || `USR${String(users.length + 1).padStart(3, '0')}`;

        const savedUser: User = {
          id: userId,
          name: name || '',
          email,
          phone: phone || '',
          role: finalPayload.role ?? null,
          status: 'Active'
        };

        if (editingUser) {
          Swal.fire({
            icon: 'success',
            title: 'User updated',
            text: 'User has been updated successfully!',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'User created',
            text: 'User has been added successfully!',
            timer: 1500,
            showConfirmButton: false
          });
        }
        await fetchUsers();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to save user',
          text: response?.data.error
        });
      }
    } catch (error: any) {
      console.error('Save user error:', error);
      let errorMsg = 'Something went wrong while saving the user.';
      if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error?.message) {
        errorMsg = error.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMsg
      });
    }
    setIsSaving(false);
    setUserModalOpen(false);
    setEditingUser(null);
    setSelectedUser(null);
  };

  // Search and filter
  useEffect(() => {
    let filtered = [...users];
    if (searchTerm) {
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((u) => u.status === selectedStatus);
    }
    setFilteredUsers(filtered);
    setPage(1);
  }, [searchTerm, selectedStatus, users]);

  // Pagination logic
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleDeleteUser = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'User will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteUser(id);
      await fetchUsers();
      Swal.fire('Deleted!', 'User has been removed.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to delete user', 'error');
    }
  };

  const handleSubmitRequest = async (comment: string, userId: string, email: string) => {
    try {
      console.log('Raising request with comment:', comment, 'for email:', email);
      const res = await raiseRequest(userId);
      Swal.fire('Success', res.message, 'success');
      await fetchRequestedUsers();
    } catch (error) {
      Swal.fire('Error', 'Failed to raise request', 'error');
    }
  };

  const checkRequestStatus = async (userId: string) => {
    const res = await checkUserRequestStatus(userId);
    return res?.isRequested;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <FadeLoader color="#1976d2" />
      </Box>
    );
  }
  if (selectedUserss) {
    console.log(selectedUserss, 'selecteduserssw3');
    return (
      <UserDetails
        user={selectedUserss}
        onBack={() => setSelectedUserss(null)} // go back to user list
      />
    );
  }

  return (
    <Box p={2}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              All Users
            </Typography>
          }
        />
        <CardContent>
          {/* Top controls */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" mb={3}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 6 }} />
              }}
              sx={{ width: { xs: '100%', sm: '300px' } }}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <Select size="small" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>

              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => {
                  setSelectedUser(null);
                  setEditingUser(null);
                  setUserModalOpen(true);
                }}
              >
                Add User
              </Button>
            </Stack>
          </Stack>

          {/* Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => {
                  const hasRequest = alreadyRequested.some((req) => req.userId === user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: user.status === 'Active' ? 'green' : 'gray',
                            fontWeight: 500
                          }}
                        >
                          {user.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {/* <Tooltip title="View">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditingUser(null);
                                setUserModalOpen(true);
                              }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip> */}

                          <Tooltip title="View">
                            <IconButton color="primary" onClick={() => setSelectedUserss(user)}>
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                            <IconButton
                              color="secondary"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditingUser(user);
                                setUserModalOpen(true);
                              }}
                            >
                              <Edit size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={hasRequest ? 'Request Already Raised' : 'Raise Request'}>
                            <span>
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={hasRequest}
                                onClick={() => {
                                  if (!hasRequest) {
                                    setSelectedUser(user);
                                    setRaiseModalOpen(true);
                                  }
                                }}
                              >
                                {hasRequest ? 'Request Raised' : 'Raise Deletion Request'}
                              </Button>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
            <Button
              variant="outlined"
              startIcon={<ChevronLeft size={18} />}
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </Button>

            <Typography variant="body2">
              Page {page} of {Math.ceil(filteredUsers.length / usersPerPage)}
            </Typography>

            <Button
              variant="outlined"
              endIcon={<ChevronRight size={18} />}
              disabled={page === Math.ceil(filteredUsers.length / usersPerPage)}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Modals */}
      {userModalOpen && (
        <UserModal
          open={userModalOpen}
          onClose={() => {
            setUserModalOpen(false);
            setSelectedUser(null);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          user={selectedUser}
          isSaving={isSaving}
        />
      )}

      {raiseModalOpen && (
        <RaiseRequestModal
          isOpen={raiseModalOpen}
          onClose={() => {
            setRaiseModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?.id}
          email={selectedUser?.email}
          onSubmit={handleSubmitRequest}
        />
      )}
    </Box>
  );
}
