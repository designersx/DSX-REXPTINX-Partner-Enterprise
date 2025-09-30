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

export default function RegionalAgentsView() {
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
    
    
   
     
    </>
  );
}
