'use client';
import { useEffect, useState } from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Stack,
  Box,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Chip,
  Alert,
  MenuItem as MenuItemSelect,
  Snackbar
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SipIcon from '@mui/icons-material/Voicemail';
import NumbersIcon from '@mui/icons-material/Dialpad';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SearchIcon from '@mui/icons-material/Search';
import { getUserId } from 'utils/auth';
import { v4 as uuidv4 } from 'uuid';
import { countries } from './helper';
import { fetchAgent, fetchAvailablePhoneNumberByCountry } from '../../../Services/auth';
import BuyPhoneNumberModal from './BuyPhoneNumberModal';
import { assignNumberToAgent, getPhoneNumbersWithUserId } from '../../../Services/phoneNumbers';
import ResourceListItem from './ResourceListItem';
// Option Selection Modal
const OptionSelectionModal = ({ open, onClose, onSelect }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          Add New Phone Resource
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Choose what type of phone resource you want to add to your account
          </Typography>

          <Stack spacing={2} sx={{ width: '100%' }}>
            {/* SIP Option */}
            {/* <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                   cursor: 'not-allowed',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                border: '2px solid transparent'
              }}
              onClick={() => onSelect('sip')}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SipIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" mb={0.5}>
                    SIP Trunk Configuration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect to existing SIP provider or configure new SIP trunk
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label="Advanced Setup" size="small" color="primary" variant="outlined" />
                    <Chip label="Customizable" size="small" color="secondary" variant="outlined" />
                  </Stack>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 24, color: 'success.main' }} />
              </Stack>
            </Paper> */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                cursor: 'not-allowed',
                opacity: 0.6,
                position: 'relative',
                transition: 'all 0.2s',
                border: '2px solid transparent',
                '&:hover .overlay': {
                  opacity: 1,
                },
              }}
            >
              {/* Content */}
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SipIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" mb={0.5}>
                    SIP Trunk Configuration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect to existing SIP provider or configure new SIP trunk
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip
                      label="Advanced Setup"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label="Customizable"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 24, color: 'success.main' }} />
              </Stack>

              {/* Overlay */}
              <Box
                className="overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Coming Soon
              </Box>
            </Paper>


            {/* Number Purchase Option */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)'
                },
                border: '2px solid transparent'
              }}
              onClick={() => onSelect('number')}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <NumbersIcon sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="bold" mb={0.5}>
                    Buy Phone Number
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Purchase new phone numbers
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label="local " size="small" color="success" variant="outlined" />
                    <Chip label="Toll-free" size="small" color="info" variant="outlined" />
                  </Stack>
                </Box>
                <CreditCardIcon sx={{ fontSize: 24, color: 'warning.main' }} />
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// SIP Configuration Modal
const SIPConfigurationModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    inboundCallAgent: '',
    outboundCallAgent: '',
    terminationUri: '',
    sipTrunkUsername: '',
    sipTrunkPassword: '',
    addInbound: false,
    addOutbound: false,
    smsEnabled: false,
    verifiedPhoneNumber: '',
    displayName: '',
    nickname: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: uuidv4(),
      type: 'sip',
      createdAt: new Date().toISOString(),
      isActive: true
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          SIP Trunk Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your SIP trunk connection details
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Basic Info */}
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Configuration Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <FormGroup>
                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    control={<Checkbox name="addInbound" checked={formData.addInbound} onChange={handleChange} />}
                    label="Add Inbound Call Agent"
                  />
                  <FormControlLabel
                    control={<Checkbox name="addOutbound" checked={formData.addOutbound} onChange={handleChange} />}
                    label="Add Outbound Call Agent"
                  />
                </Stack>
              </FormGroup>
            </Stack>

            {/* SIP Details */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                SIP Trunk Details
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Inbound/Outbound Call Agent"
                  name="inboundCallAgent"
                  value={formData.inboundCallAgent}
                  onChange={handleChange}
                  placeholder="Draft agent"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Termination URI (SIP Server)"
                  name="terminationUri"
                  value={formData.terminationUri}
                  onChange={handleChange}
                  placeholder="sip.example.com"
                  variant="outlined"
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="SIP Trunk Username"
                    name="sipTrunkUsername"
                    value={formData.sipTrunkUsername}
                    onChange={handleChange}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="SIP Trunk Password"
                    name="sipTrunkPassword"
                    type="password"
                    value={formData.sipTrunkPassword}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* SMS & Verification */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                SMS & Verification Settings
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Checkbox name="smsEnabled" checked={formData.smsEnabled} onChange={handleChange} />}
                  label="Enable SMS to SIP"
                />

                {formData.smsEnabled && (
                  <TextField
                    fullWidth
                    label="Verified Phone Number for SMS"
                    name="verifiedPhoneNumber"
                    value={formData.verifiedPhoneNumber}
                    onChange={handleChange}
                    placeholder="+1 555-123-4567"
                    variant="outlined"
                  />
                )}

                <TextField
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Your SIP Display Name"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Nickname (Optional)"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="Friendly name for this config"
                  variant="outlined"
                />
              </Stack>
            </Paper>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!formData.name}>
            Save SIP Configuration
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
// Delete Confirmation Dialog
const DeleteDialog = ({ open, onClose, onDelete, resourceName, resourceType }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete {resourceType === 'sip' ? 'SIP Configuration' : 'Phone Number'}</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete "{resourceName}"?
        {resourceType === 'number' && ' This will also cancel your monthly subscription.'}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onDelete} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default function PhoneNumbersView() {
  const token = localStorage.getItem("authToken")
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [openOptionModal, setOpenOptionModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "sip", "number", or null
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [inboundAgent, setInboundAgent] = useState("");
  const [outboundAgent, setOutboundAgent] = useState("");
  const [agents, setAgents] = useState([])
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const userId = getUserId();
  const getPhoneNumbers = async () => {
    try {
      const response = await getPhoneNumbersWithUserId(token, userId)
      console.log(response, "response")
      setResources(response?.data?.data)
    } catch (error) {
    }
  }
  const handleOptionSelect = (option) => {
    setActiveModal(option);
    setOpenOptionModal(false);
  };
  const handleSIPSubmit = (sipConfig) => {
    setResources((prev) => [sipConfig, ...prev]);
    setSelectedResource(sipConfig);
  };
  const handleNumberSubmit = () => {
    getPhoneNumbers()
  };
  const handleDeleteResource = () => {
    if (deleteTarget) {
      setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      if (selectedResource?.id === deleteTarget.id) {
        setSelectedResource(null);
      }
      setDeleteTarget(null);
      setOpenDeleteDialog(false);
    }
  };
  const handleEditResource = (resource) => {
    setActiveModal(resource.type);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  useEffect(() => {
    getPhoneNumbers()
    fetchAgent().then((res) => {
      console.log(res, "AHELEE")
      let agentsData = res?.agents || [];
      setAgents(agentsData)
    })

  }, [userId]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleAssignNumber = (agent, selectedResource) => {
    console.log(selectedResource)
    const inbound_agent_id = agent.agent_id
    const outbound_agent_id = agent.agent_id
    const phoneNumber = selectedResource.phoneNumber
    const importStatus1 = selectedResource.importStatus
    try {
      const res = assignNumberToAgent(token, inbound_agent_id, outbound_agent_id, phoneNumber, importStatus1)
      setSnackbar({
        open: true,
        message: 'Number assign Successfully',
        severity: 'success'
      });
      getPhoneNumbers()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, height: '100vh', p: 2 }}>
        {/* Static Sidebar */}
        <Paper
          sx={{
            width: { xs: '100%', md: 360 },
            height: { xs: 'auto', md: '100%' },
            borderRadius: 2,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight="bold">
                Phone Resources
              </Typography>
              <IconButton color="primary" onClick={() => setOpenOptionModal(true)} size="large">
                <AddIcon />
              </IconButton>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {resources.length} total resources
            </Typography>
          </Box>

          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {resources.map((resource) => (
              <ResourceListItem
                key={resource.id}
                resource={resource}
                selected={selectedResource?.id === resource.id}
                onSelect={setSelectedResource}
                onEdit={handleEditResource}
                onDelete={(resource) => {
                  setDeleteTarget(resource);
                  setOpenDeleteDialog(true);
                }}
              />
            ))}

            {resources.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No phone resources"
                  secondary="Click the + button to add your first resource"
                  primaryTypographyProps={{ align: 'center', color: 'text.secondary' }}
                  secondaryTypographyProps={{ align: 'center', color: 'text.secondary' }}
                />
              </ListItem>
            )}
          </List>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          {selectedResource ? (
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2, boxShadow: 3, overflow: 'auto' }}>
              {/* Resource Header */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                spacing={2}
                mb={3}
              >
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                    {selectedResource.import_type === 'sip' ? (
                      <SipIcon sx={{ color: 'info.main' }} />
                    ) : (
                      <PhoneIcon sx={{ color: 'primary.main' }} />
                    )}
                    <Typography variant="h5" fontWeight="bold">
                      {selectedResource.name}
                    </Typography>
                    {selectedResource.isActive && <CheckCircleIcon sx={{ color: 'success.main' }} />}
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {selectedResource.import_type === 'phone' ? selectedResource.phoneNumber : 'SIP Configuration'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added: {formatDate(selectedResource.createdAt)} • {selectedResource.status || 'Active'}
                  </Typography>
                </Box>


              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Resource Details */}
              <Grid container md={12} >
                {selectedResource.type === 'sip' ? (
                  // SIP Details
                  <>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                          SIP Configuration
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Termination URI
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.terminationUri}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Username
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.sipTrunkUsername}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                          Additional Settings
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Inbound Agent
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.inboundCallAgent || 'Not set'}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              SMS Enabled
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.smsEnabled ? 'Yes' : 'No'}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Display Name
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.displayName || 'Not set'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  </>
                ) : (
                  // Phone Number Details
                  <Grid container spacing={2}>
                    {/* Phone Details */}
                    <Grid item xs={12} md={12}>
                      <Paper sx={{ p: 2, height: "100%" }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                          Phone Details
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Number
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.phoneNumber}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Type
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.phone_number_type}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Import Type
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.import_type}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                    {/* Agent & Add-ons Section */}
                    <Grid item xs={12} md={12}>
                      <Paper sx={{ p: 2, height: "100%" }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                          Call Agent Configuration
                        </Typography>
                        <Stack spacing={2}>
                          {/* Inbound Agent */}
                          <FormControl fullWidth>
                            <InputLabel>Inbound call agent</InputLabel>
                            <Select
                              value={selectedResource?.inboundAgent?.agent_id || inboundAgent || ""}
                              onChange={(e) => setInboundAgent(e.target.value)}
                              label="Inbound call agent"
                            >
                              {agents.map((agent) => (
                                <MenuItem
                                  key={agent.agent_id}
                                  onClick={() => handleAssignNumber(agent, selectedResource)}
                                  value={agent.agent_id}
                                >
                                  {agent.agentName}
                                </MenuItem>
                              ))}
                            </Select>

                          </FormControl>


                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ) : (
            <Paper
              sx={{
                height: '100%',
                borderRadius: 2,
                boxShadow: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Box>
                <Box sx={{ fontSize: 64, mb: 2 }}>📞</Box>
                <Typography variant="h6" color="text.secondary" mb={1}>
                  Select a phone resource
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click on a resource from the sidebar to view details
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => setOpenOptionModal(true)}>
                  Add First Resource
                </Button>
              </Box>
            </Paper>
          )
          }
        </Box>
      </Box>

      {/* Modals */}
      <OptionSelectionModal open={openOptionModal} onClose={() => setOpenOptionModal(false)} onSelect={handleOptionSelect} />

      <SIPConfigurationModal open={activeModal === 'sip'} onClose={() => setActiveModal(null)} onSubmit={handleSIPSubmit} />

      <BuyPhoneNumberModal open={activeModal === 'number'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleNumberSubmit}
        countries={countries} />

      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setDeleteTarget(null);
        }}
        onDelete={handleDeleteResource}
        resourceName={deleteTarget?.name}
        resourceType={deleteTarget?.type}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
