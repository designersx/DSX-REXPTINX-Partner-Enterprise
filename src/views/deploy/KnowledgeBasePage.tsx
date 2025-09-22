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
  MenuItem as MenuItemSelect
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
                    Purchase new phone numbers from Twilio or Telnyx
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label="Standard $2/mo" size="small" color="success" variant="outlined" />
                    <Chip label="Toll-free $5/mo" size="small" color="info" variant="outlined" />
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

// Buy Phone Number Modal
const BuyPhoneNumberModal = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    provider: 'twilio',
    country: 'US',
    numberType: 'standard',
    searchQuery: '',
    phoneNumber: ''
  });

  const providers = [
    { value: 'twilio', label: 'Twilio', icon: '📞' },
    { value: 'telnyx', label: 'Telnyx', icon: '☎️' }
  ];

  const countries = [
    { value: 'US', label: 'United States', flag: '🇺🇸' },
    { value: 'CA', label: 'Canada', flag: '🇨🇦' },
    { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'IN', label: 'India', flag: '🇮🇳' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // Simulate search - in real app, this would call an API
    const mockNumbers = ['+1 555-123-4567', '+1 555-234-5678', '+1 555-345-6789', '+1 555-456-7890'];
    // Filter based on search query
    const filtered = mockNumbers.filter((num) => num.includes(formData.searchQuery.replace(/\D/g, '')));
    setFormData((prev) => ({ ...prev, phoneNumber: filtered[0] || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phoneNumber) {
      alert('Please search and select a phone number');
      return;
    }

    onSubmit({
      ...formData,
      id: uuidv4(),
      type: 'number',
      phone: formData.phoneNumber,
      status: 'purchased',
      createdAt: new Date().toISOString(),
      isActive: true,
      monthlyCost: formData.numberType === 'standard' ? 2 : 5
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Buy Phone Number
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Purchase a new phone number from your preferred provider
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Provider Selection */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                Provider Selection
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <FormControl fullWidth>
                  <InputLabel>Provider</InputLabel>
                  <Select name="provider" value={formData.provider} onChange={handleChange} label="Provider">
                    {providers.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{provider.icon}</span>
                          <span>{provider.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select name="country" value={formData.country} onChange={handleChange} label="Country">
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <span>{country.flag}</span>
                          <span>{country.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Paper>

            {/* Number Type Selection */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                Number Type
              </Typography>
              <RadioGroup row name="numberType" value={formData.numberType} onChange={handleChange}>
                <FormControlLabel
                  value="standard"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon fontSize="small" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          Standard
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          $2/month
                        </Typography>
                      </Box>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value="tollfree"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon fontSize="small" color="warning" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          Toll-free
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          $5/month
                        </Typography>
                      </Box>
                    </Stack>
                  }
                />
              </RadioGroup>
            </Paper>

            {/* Search Numbers */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                Search Available Numbers
              </Typography>
              <Stack direction="row" spacing={2} alignItems="end">
                <TextField
                  fullWidth
                  label="Search numbers (e.g., 650)"
                  name="searchQuery"
                  value={formData.searchQuery}
                  onChange={handleChange}
                  placeholder="Enter area code or partial number"
                  variant="outlined"
                />
                <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ minWidth: 120 }}>
                  Search
                </Button>
              </Stack>

              {formData.phoneNumber && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Selected Number: {formData.phoneNumber}
                  </Typography>
                </Alert>
              )}
            </Paper>

            <Alert severity="info" icon={<CreditCardIcon />}>
              <Typography variant="body2">
                Payment is required for purchasing phone numbers. You will be charged ${formData.numberType === 'standard' ? 2 : 5}/month.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!formData.phoneNumber} startIcon={<CreditCardIcon />}>
            Purchase Number - ${formData.numberType === 'standard' ? 2 : 5}/mo
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Phone Resource List Item
const ResourceListItem = ({ resource, selected, onSelect, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    return type === 'sip' ? <SipIcon fontSize="small" /> : <PhoneIcon fontSize="small" />;
  };

  const getTypeColor = (type) => {
    return type === 'sip' ? 'info.main' : 'primary.main';
  };

  return (
    <ListItem
      button
      onClick={() => onSelect(resource)}
      selected={selected}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        mx: 1,
        '&:hover': { bgcolor: 'action.hover' },
        bgcolor: selected ? 'action.selected' : 'inherit',
        border: selected ? '2px solid' : 'none',
        borderColor: selected ? 'primary.main' : 'transparent'
      }}
    >
      <ListItemIcon>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${getTypeColor(resource.type)} 0%, ${getTypeColor(resource.type)}80 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {getTypeIcon(resource.type)}
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={
          <Box>
            <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 200 }}>
              {resource.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
              {resource.type === 'number' ? resource.phone : resource.terminationUri || 'SIP Config'}
            </Typography>
          </Box>
        }
        secondary={
          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
            <Chip
              label={resource.type === 'sip' ? 'SIP' : 'Phone'}
              size="small"
              color={resource.type === 'sip' ? 'info' : 'primary'}
              variant="outlined"
            />
            {resource.isActive && <CheckCircleIcon sx={{ fontSize: '12px', color: 'success.main' }} />}
            <Typography variant="caption" color="text.secondary">
              {formatDate(resource.createdAt)}
            </Typography>
          </Stack>
        }
        secondaryTypographyProps={{ component: 'div', sx: { mt: 0.25 } }}
      />

      <Stack direction="row" spacing={0.5}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(resource);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(resource);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </ListItem>
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

export default function KnowledgeBaseUI() {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [openOptionModal, setOpenOptionModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "sip", "number", or null
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const userId = getUserId();

  useEffect(() => {
    const savedResources = localStorage.getItem(`phoneResources_${userId}`);
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      const sampleResources = [
        {
          id: '1',
          name: 'Main SIP Trunk',
          type: 'sip',
          inboundCallAgent: 'Inbound Agent',
          terminationUri: 'sip.mycompany.com',
          sipTrunkUsername: 'trunk_user',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Support Line',
          type: 'number',
          phone: '+1 (555) 123-4567',
          provider: 'twilio',
          numberType: 'standard',
          status: 'active',
          monthlyCost: 2,
          isActive: true,
          createdAt: '2024-02-20T14:22:00Z'
        },
        {
          id: '3',
          name: 'Sales Toll-free',
          type: 'number',
          phone: '+1 800-123-4567',
          provider: 'telnyx',
          numberType: 'tollfree',
          status: 'active',
          monthlyCost: 5,
          isActive: true,
          createdAt: '2024-03-10T09:15:00Z'
        }
      ];
      setResources(sampleResources);
      localStorage.setItem(`phoneResources_${userId}`, JSON.stringify(sampleResources));
    }
  }, [userId]);

  useEffect(() => {
    if (resources.length > 0) {
      localStorage.setItem(`phoneResources_${userId}`, JSON.stringify(resources));
    }
  }, [resources, userId]);

  const handleOptionSelect = (option) => {
    setActiveModal(option);
    setOpenOptionModal(false);
  };

  const handleSIPSubmit = (sipConfig) => {
    setResources((prev) => [sipConfig, ...prev]);
    setSelectedResource(sipConfig);
  };

  const handleNumberSubmit = (phoneNumber) => {
    setResources((prev) => [phoneNumber, ...prev]);
    setSelectedResource(phoneNumber);
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
    // For now, just reopen the modal with current data
    setActiveModal(resource.type);
    // You can implement full editing later
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

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, height: '100vh', p: 2 }}>
        {/* Static Sidebar */}
        <Paper
          sx={{
            width: { xs: '100%', md: 350 },
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
                    {selectedResource.type === 'sip' ? (
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
                    {selectedResource.type === 'number' ? selectedResource.phone : 'SIP Configuration'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added: {formatDate(selectedResource.createdAt)} • {selectedResource.status || 'Active'}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditResource(selectedResource)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setDeleteTarget(selectedResource);
                      setOpenDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Resource Details */}
              <Grid container spacing={3}>
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
                  <>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                          Phone Details
                        </Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Number
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.phone}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Provider
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.provider}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Type
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedResource.numberType}
                            </Typography>
                          </Stack>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Monthly Cost
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              ${selectedResource.monthlyCost}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                          Quick Actions
                        </Typography>
                        <Stack spacing={2}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<PhoneIcon />}
                            onClick={() => (window.location.href = `tel:${selectedResource.phone.replace(/\D/g, '')}`)}
                          >
                            Call Number
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => navigator.clipboard.writeText(selectedResource.phone)}
                          >
                            Copy Number
                          </Button>
                          <Button fullWidth variant="outlined" color="success" startIcon={<CheckCircleIcon />}>
                            Configure Call Flow
                          </Button>
                        </Stack>
                      </Paper>
                    </Grid>
                  </>
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
          )}
        </Box>
      </Box>

      {/* Modals */}
      <OptionSelectionModal open={openOptionModal} onClose={() => setOpenOptionModal(false)} onSelect={handleOptionSelect} />

      <SIPConfigurationModal open={activeModal === 'sip'} onClose={() => setActiveModal(null)} onSubmit={handleSIPSubmit} />

      <BuyPhoneNumberModal open={activeModal === 'number'} onClose={() => setActiveModal(null)} onSubmit={handleNumberSubmit} />

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
    </>
  );
}
