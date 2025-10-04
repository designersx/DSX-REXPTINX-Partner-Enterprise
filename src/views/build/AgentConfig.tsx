"use client"

import * as React from "react"
import { Snackbar, Alert } from "@mui/material";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Stack,
  Button,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Mic as MicIcon,
  Chat as ChatIcon,
  Code as CodeIcon,
} from "@mui/icons-material"
import { Checkbox } from "@mui/material"
import { assignKnowledgeBaseToAgent, getKbListByUserId, unassignedKnowledgeBasefromAgent } from "../../../Services/auth"
import { getUserId } from "utils/auth"
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type AgentFunction = {
  id: string
  name: string
  description?: string
}

type KBItem = {
  id: string
  name: string
  size?: string
}

export default function AgentConfig({ agentId }) {
  const [agentName, setAgentName] = React.useState("")
  const [model, setModel] = React.useState("")
  const [assignee, setAssignee] = React.useState("")
  const [language, setLanguage] = React.useState("")
  const [welcomeWhoSpeaks, setWelcomeWhoSpeaks] = React.useState<"ai" | "user">("ai")
  const [welcomeDelayMs, setWelcomeDelayMs] = React.useState(0)
  const [selectedKbId, setSelectedKbId] = React.useState<string | null>(null); // New state for selected KB item
  const [welcomeMessage, setWelcomeMessage] = React.useState<string>()

  const [tab, setTab] = React.useState(0) // 0 = Test Audio, 1 = Test Chat
  const [showConfig, setShowConfig] = React.useState(false)
  const userId = getUserId();

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [existingKbList, setExistingKbList] = React.useState([]);
  const [agent, setAgent] = React.useState();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");
  const router = useRouter();


  React.useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/getAgent/${agentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adjust token storage as needed
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch agent');
        }


        const data = await res.json();
        console.log(data, "data"); // Fixed this line
        setAgentName(data?.agentName)
        setModel(data?.agentVoice?.split('-')[1])
        setLanguage(data?.agentLanguage)
        setAgent(data);
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchAgent();
  }, [agentId]);

  React.useEffect(() => {
    const fetchKBs = async () => {
      try {
        // const res = await axios.get(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/getEnterpriseKBbyUserId/${userId}`
        // );
        const res = await getKbListByUserId(userId)

        if (res.success) {
          // Map backend data into UI format
          const formatted = res.data.map((kb: any) => ({
            ...kb, // ✅ keep original fields like text, webUrl, scrapedUrls
            name: kb.kbName,
            id: `know...${kb.kbId}`,
            uploadedAt: new Date(kb.createdAt).toLocaleString([], {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
            details: [
              // scrapedUrls → URLs
              ...(kb.scrapedUrls
                ? JSON.parse(kb.scrapedUrls).map((url: string) => ({
                  type: "url",
                  value: url,
                  pages: null,
                  synced: kb.updatedAt,
                }))
                : []),

              // kbFiles → files
              ...(Array.isArray(kb.kbFiles)
                ? kb.kbFiles.map((f: any) => ({
                  type: "file",
                  value: f.fileName,
                  size: `${(f.fileSize / 1024).toFixed(1)} KB`,
                }))
                : []),
            ],
          }));
          setExistingKbList(formatted);
        }
      } catch (err) {
        console.error("Error fetching KBs:", err);
      }
    };

    fetchKBs();
  }, [userId]);

  const [functions, setFunctions] = React.useState<AgentFunction[]>([
    { id: "f1", name: "end_call" },
    { id: "f2", name: "transfer_call" },
    { id: "f3", name: "agent_transfer" },
  ])
  const [kbItems, setKbItems] = React.useState<KBItem[]>([
    // { id: "kb1", name: "School management-2025-05-26.pdf", size: "1.2MB" },
  ])

  const [addFnOpen, setAddFnOpen] = React.useState(false)
  const [newFnName, setNewFnName] = React.useState("")
  const [addKbOpen, setAddKbOpen] = React.useState(false)
  const [newKbName, setNewKbName] = React.useState("")

  // Debug log to verify imports
  //   console.log({
  //     Box, Grid, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  //     Tabs, Tab, IconButton, Stack, Button, Divider, Chip, Accordion, AccordionSummary,
  //     AccordionDetails, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent,
  //     DialogActions, Tooltip, Switch, FormControlLabel, ExpandMoreIcon, AddIcon, EditIcon,
  //     DeleteIcon, SettingsIcon, MicIcon, ChatIcon, CodeIcon
  //   });

  const handleAddFunction = () => {
    if (!newFnName.trim()) return
    setFunctions((prev) => [...prev, { id: crypto.randomUUID(), name: newFnName.trim() }])
    setNewFnName("")
    setAddFnOpen(false)
  }
  const handleDeleteFunction = (id: string) => setFunctions((prev) => prev.filter((f) => f.id !== id))

  const handleAddKB = () => {
    if (selectedKbId) {
      const selectedKb = kbItems.find((kb) => kb.id === selectedKbId);
      if (selectedKb && !kbItems.some((kb) => kb.id === selectedKb.id)) {
        setKbItems((prev) => [...prev, selectedKb]);
      }
    } else if (newKbName.trim()) {
      setKbItems((prev) => [...prev, { id: crypto.randomUUID(), name: newKbName.trim() }]);
      setNewKbName("");
    }
    setAddKbOpen(false);
    setSelectedKbId(null); // Reset selection
  };

  React.useEffect(() => {
    if (!agent?.knowledgeBaseIds || !existingKbList) return;

    // Filter only KBs that are linked with this agent
    const matchedKbs = existingKbList.filter((kb) =>
      agent.knowledgeBaseIds.includes(kb.knowledgeBaseId)
    );

    // Convert to your required format
    const kbItemsFormatted = matchedKbs.map((kb, index) => ({
      id: kb.kbId?.toString() || `kb${index + 1}`,
      kbId: kb.kbId,
      name: kb.kbName || `KnowledgeBase-${kb.kbId}`,
      size: kb.kbFiles?.[0]?.size
        ? `${(kb.kbFiles[0].size / (1024 * 1024)).toFixed(2)} MB`
        : "N/A", // fallback if no size available
    }));

    setKbItems(kbItemsFormatted);
  }, [agent, existingKbList]);
  // Add this state for selected existing KBs (multi-select)
  const [selectedExistingIds, setSelectedExistingIds] = React.useState<Set<string>>(new Set());

  // Function to toggle selection
  const handleToggleExisting = (id: string) => {
    const newSet = new Set(selectedExistingIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedExistingIds(newSet);
  };

  // Function to add selected existing KBs to kbItems
  const handleAddSelectedKB = async (id: string) => {
    const selectedKb = existingKbList.find((kb) => kb.kbId == id);
    if (selectedKb && !kbItems.some((kb) => kb.kbId == selectedKb.kbId)) {
      try {
        setAddKbOpen(false);
        // Call your API to assign KB to agent
        const response = await assignKnowledgeBaseToAgent({
          userId,
          kbId: selectedKb.kbId,
          agentId,
        });
        setKbItems((prev) => [...prev, selectedKb]);
        setSnackbarMessage("Knowledge Base added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        console.log("KB assigned successfully:", response);
      } catch (error) {
        console.error("Error while assigning KB to agent:", error);
        setSnackbarMessage("Failed to add Knowledge Base. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      setSnackbarMessage("Knowledge Base already exists or invalid selection.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setAddKbOpen(false);
    setSelectedKbId(null); // Reset selection
  };

  // Function to close snackbar
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {

    setSnackbarOpen(false);
  };

  // Function to navigate for new KB
  const handleNavigateToBuildKB = () => {
    setAddKbOpen(false);
    window.location.href = "/build/knowledgeBase/";
  };

  // const handleDeleteKB = (id: string) => setKbItems((prev) => prev.filter((k) => k.id !== id))
  const handleDeleteKB = async (kbId: string) => {
    try {
      // Call API to unassign KB from agent
      const response = await unassignedKnowledgeBasefromAgent({
        kbId,
        agentId,
      });

      if (response.success) {
        // Update UI only if API succeeds
        setKbItems((prev) => prev.filter((k) => k.kbId != kbId));
        setSnackbarMessage("Knowledge Base removed successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.error || "Failed to remove Knowledge Base.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error while unassigning KB from agent:", error);
      setSnackbarMessage("Failed to remove Knowledge Base. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Placeholder test handlers
  const handleTest = () => {
    // In a real app, connect to your audio/chat test backend
    alert(tab === 0 ? "Starting audio test..." : "Opening chat test...")
  }

  return (
    <>
      <Grid container spacing={2} padding={2}>



        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Go Back">
              <IconButton color="primary" onClick={() => router.back()}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="Agent name" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="model-label">Voice</InputLabel>
                  <Select labelId="model-label" label="Model" value={model} onChange={(e) => setModel(e.target.value)}>
                    <MenuItem value="Billy">Billy</MenuItem>
                    <MenuItem value="Cimo">Cimo</MenuItem>
                    <MenuItem value="Marisa">Marisa</MenuItem>
                    <MenuItem value="Samad">Samad</MenuItem>
                    <MenuItem value="Anthony">Anthony</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="lang-label">Language</InputLabel>
                  <Select
                    labelId="lang-label"
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>


        {/* Left: Prompt & basics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Prompt
            </Typography>



            <Box mt={2}>
              <TextField
                label="Global Prompt"
                multiline
                minRows={16}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)} style={{ width: '513px' }}
                disabled
              />
              <Box mt={1} display="flex" gap={1}>
                <Button variant="outlined" disabled>Edit prompt</Button>
                {/* <Button variant="text">Preview</Button> */}
              </Box>
            </Box>

          </Paper>
        </Grid>

        {/* Middle: Collapsible sections */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>


            {/* Knowledge Base */}
            <Paper elevation={0}>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Knowledge Base</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    <List dense disablePadding>
                      {kbItems.map((kb) => (
                        <ListItem
                          key={kb.id}
                          disableGutters
                          secondaryAction={
                            <IconButton size="small" aria-label="delete kb" onClick={() => handleDeleteKB(kb.kbId)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemText primary={kb.name}
                          // secondary={kb.size ? `Size: ${kb.size}` : undefined} 
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Button startIcon={<AddIcon />} onClick={() => setAddKbOpen(true)}>
                      Add
                    </Button>
                    {/* <Button variant="text" size="small">
                    Adjust KB Retrieval Chunks and Similarity
                  </Button> */}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Paper>


          </Stack>
        </Grid>

        {/* Right: Test panel */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="test-tabs">
                <Tab icon={<MicIcon />} iconPosition="start" label="Test Audio" />
                {/* <Tab icon={<ChatIcon />} iconPosition="start" label="Test Chat" /> */}
              </Tabs>

            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                flex: 1,
                minHeight: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              {tab === 0 ? (
                <Typography variant="body2" textAlign="center">
                  Test your agent (audio)
                  <br />
                  Please note call transfer is not supported in Webcall.
                </Typography>
              ) : (
                <Typography variant="body2" textAlign="center">
                  Start a test chat with your agent.
                </Typography>
              )}
            </Box>

            <Stack direction="row" justifyContent="center" mt={2}>
              <Button onClick={handleTest}
                sx={{
                  border: "1px solid #1976d2", // custom border color
                  borderRadius: "8px",         // optional, rounded corners
                }}
                disabled
              >{tab === 0 ? "Test" : "Start Chat"}</Button>
            </Stack>

            {showConfig && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  Live Config (example)
                </Typography>
                <Paper variant="outlined" sx={{ p: 1, mt: 1, maxHeight: 220, overflow: "auto" }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(
                      {
                        name: agentName,
                        model,
                        language,
                        welcome: { whoSpeaks: welcomeWhoSpeaks, delayMs: welcomeDelayMs },
                        functions: functions.map((f) => f.name),
                        knowledgeBase: kbItems.map((k) => k.name),
                      },
                      null,
                      2,
                    )}
                  </pre>
                </Paper>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Dialogs */}
        <Dialog open={addFnOpen} onClose={() => setAddFnOpen(false)}>
          <DialogTitle>Add Function</DialogTitle>
          <DialogContent>
            <TextField autoFocus label="Function name" value={newFnName} onChange={(e) => setNewFnName(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={() => setAddFnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFunction}>Add</Button>
          </DialogActions>
        </Dialog>


        <Dialog
          open={addKbOpen}
          onClose={() => setAddKbOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Knowledge Base
            <Typography variant="body2" color="text.secondary">
              Select a knowledge base to provide context to the agent.
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <List sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
              {existingKbList.map((kb) => (
                <ListItem
                  key={kb.id}
                  button
                  selected={selectedKbId === kb.id}
                  onClick={() => {
                    setSelectedKbId(kb.id);
                    handleAddSelectedKB(kb.kbId);
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={kb.name}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}

              <Divider sx={{ my: 1 }} />

              <ListItem
                button
                onClick={handleNavigateToBuildKB}
                sx={{
                  borderRadius: 2,
                  bgcolor: "grey.50",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <ListItemText
                  primary="Add New Knowledge Base"
                  primaryTypographyProps={{ color: "primary.main", fontWeight: 500 }}
                />
              </ListItem>
            </List>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setAddKbOpen(false);
                setSelectedKbId(null);
              }}
            >
              Close
            </Button>

          </DialogActions>
        </Dialog>

      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar></>
  )
}
