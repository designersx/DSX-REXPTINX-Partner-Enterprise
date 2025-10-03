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

export default function AgentConfig({agentId}) {
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
    const [agent,setAgent] = React.useState();
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
          const res =await getKbListByUserId(userId)
  
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
    kbId:kb.kbId,
    name: kb.kbName || `KnowledgeBase-${kb.kbId}`,
    size: kb.kbFiles?.[0]?.size
      ? `${(kb.kbFiles[0].size / (1024 * 1024)).toFixed(2)} MB`
      : "N/A", // fallback if no size available
  }));

  setKbItems(kbItemsFormatted);
}, [agent, existingKbList]);

// const existingKbList: KBItem[] = [
//   { id: "ex1", name: "Immigrate Management-2025-05-26" },
//   { id: "ex2", name: "Company Sales Management-2025-05-26" },
//   { id: "ex3", name: "School management-2025-05-26" },
//   { id: "ex4", name: "Company Management-2025-05-26" },
//   { id: "ex5", name: "Landmark Immigrations pvt ltd-2025-05-26" },
//   { id: "ex6", name: "as-17482608604565" },
// ];

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
  const selectedKb = existingKbList.find((kb) => kb.kbId ==id);
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
          {/* <Typography variant="h6" sx={{ flex: 1 }}>
            {agentName}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={model} color="primary" variant="outlined" /> 
            <Chip label={assignee} variant="outlined" />
            <Chip label={language} variant="outlined" />
             <Tooltip title="Settings">
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
            </Tooltip> 
          </Stack> */}
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
              onChange={(e) => setWelcomeMessage(e.target.value)} style={{width:'513px'}}
              disabled
            />
            <Box mt={1} display="flex" gap={1}>
              <Button variant="outlined" disabled>Edit prompt</Button>  
              {/* <Button variant="text">Preview</Button> */}
            </Box>
          </Box>
{/* 
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Welcome Message
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel id="who-label">Who speaks first</InputLabel>
                <Select
                  labelId="who-label"
                  label="Who speaks first"
                  value={welcomeWhoSpeaks}
                  onChange={(e) => setWelcomeWhoSpeaks(e.target.value as "ai" | "user")}
                >
                  <MenuItem value="ai">AI speaks first</MenuItem>
                  <MenuItem value="user">User speaks first</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                type="number"
                label="Pause Before Speaking (ms)"
                value={welcomeDelayMs}
                onChange={(e) => setWelcomeDelayMs(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label="Dynamic message" placeholder="Optional template" />
            </Grid>
          </Grid> */}
        </Paper>
      </Grid>

      {/* Middle: Collapsible sections */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Stack spacing={2}>
          {/* Functions */}
          {/* <Paper elevation={0}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Functions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <List dense disablePadding>
                    {functions.map((fn) => (
                      <ListItem
                        key={fn.id}
                        disableGutters
                        secondaryAction={
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" aria-label="edit function">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label="delete function"
                              onClick={() => handleDeleteFunction(fn.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        }
                      >
                        <ListItemText primary={fn.name} />
                      </ListItem>
                    ))}
                  </List>
                  <Button startIcon={<AddIcon />} onClick={() => setAddFnOpen(true)}>
                    Add
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

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

          {/* Speech Settings */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Speech Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <FormControlLabel control={<Switch defaultChecked />} label="Enable TTS" />
                  <TextField label="Voice" placeholder="Alloy or similar" />
                  <TextField type="number" label="Speaking Rate" defaultValue={1} />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

          {/* Realtime Transcription Settings */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Realtime Transcription Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="stt-label">STT Model</InputLabel>
                    <Select labelId="stt-label" label="STT Model" defaultValue="whisper-turbo">
                      <MenuItem value="whisper-turbo">Whisper Turbo</MenuItem>
                      <MenuItem value="deepgram">Deepgram Nova</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel control={<Switch defaultChecked />} label="Punctuation" />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

          {/* Call Settings */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Call Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <TextField label="Max Call Duration (min)" type="number" defaultValue={30} />
                  <FormControlLabel control={<Switch defaultChecked />} label="Record Calls" />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

          {/* Post-Call Analysis */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Post-Call Analysis</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <FormControlLabel control={<Switch />} label="Generate Summary" />
                  <FormControlLabel control={<Switch />} label="Extract Action Items" />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

          {/* Security & Fallback */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Security & Fallback Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <FormControlLabel control={<Switch />} label="Enable Safe Responses" />
                  <TextField label="Fallback message" placeholder="I'll connect you to someone..." />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

          {/* Webhook Settings */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Webhook Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <TextField label="Webhook URL" placeholder="https://example.com/webhook" />
                  <FormControlLabel control={<Switch />} label="Send events" />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}

          {/* MCPs */}
          {/* <Paper elevation={0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">MCPs</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <TextField label="Provider" placeholder="e.g. filesystem, calendar" />
                  <Button variant="outlined" startIcon={<AddIcon />}>
                    Add MCP
                  </Button>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Paper> */}
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
            {/* <Tooltip title="View config JSON">
              <IconButton onClick={() => setShowConfig((s) => !s)} aria-label="show config">
                <CodeIcon />
              </IconButton>
            </Tooltip> */}
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

{/* <Dialog open={addKbOpen} onClose={() => setAddKbOpen(false)}>
  <DialogTitle>Knowledge Base</DialogTitle>
  <DialogContent>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      Select knowledge base to provide context to the agent.
    </Typography>
    <List dense>
      {existingKbList.map((kb) => (
        <ListItem
          key={kb.id}
          button
          selected={selectedKbId === kb.id}
          onClick={() => {
            setSelectedKbId(kb.id);
            handleAddSelectedKB(kb.kbId);
          }}
          disablePadding
        >
          <ListItemText primary={kb.name} />
        </ListItem>
      ))}
      <Divider sx={{ my: 1 }} />
      <ListItem button onClick={handleNavigateToBuildKB}>
        <ListItemText primary="Add New Knowledge Base" />
      </ListItem>
    </List>
  </DialogContent>
  <DialogActions>
    <Button variant="text" onClick={() => {
      setAddKbOpen(false);
      setSelectedKbId(null);
    }}>
      Close
    </Button>
     <Button onClick={() => {
      if (selectedKbId) handleAddSelectedKB(selectedKbId);
    }} disabled={!selectedKbId}>
      Add
    </Button> 
  </DialogActions>
</Dialog> */}
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
    {/* If you want Add button */}
    {/* <Button
      variant="contained"
      onClick={() => {
        if (selectedKbId) handleAddSelectedKB(selectedKbId);
      }}
      disabled={!selectedKbId}
    >
      Add
    </Button> */}
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

//2 src/components/AgentConfig.tsx
// "use client"
// import React, { useState, useCallback } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   Divider,
//   useTheme,
// } from '@mui/material';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowForward } from '@mui/icons-material';
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   Node as FlowNode,
//   Edge as FlowEdge,
//   useNodesState,
//   useEdgesState,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// // Sample nodes data (replace with your actual nodes array)
// const initialNodes = [
//  {
//             "instruction": {
//                 "type": "static_text",
//                 "text": "Hi {{first_name}}. It's Kelsey here from South Bay Investment the Bay Area property investment company, you had previously showed some interest in an advert for a property investment Bay Area. It is just a quick call, are you familiar with South Bay Investment?"
//             },
//             "name": "Greeting",
//             "edges": [
//                 {
//                     "condition": "User replies",
//                     "id": "edge-1",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User replies"
//                     },
//                     "destination_node_id": "node-1735833439816"
//                 }
//             ],
//             "start_speaker": "agent",
//             "id": "start-node-1735833334791",
//             "type": "conversation",
//             "display_position": {
//                 "x": -70.81939554856974,
//                 "y": -841.5348322789481
//             }
//         },
//         {
//             "name": "Confirm",
//             "edges": [
//                 {
//                     "condition": "user said yes or shows interests",
//                     "id": "edge-1735833536291",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user said yes or shows interests"
//                     },
//                     "destination_node_id": "node-1735833814191"
//                 },
//                 {
//                     "condition": "user is a bit hesitant or has no interest ",
//                     "id": "edge-1736577612042",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user is a bit hesitant or has no interest "
//                     },
//                     "destination_node_id": "node-1735833710558"
//                 }
//             ],
//             "id": "node-1735833439816",
//             "type": "conversation",
//             "display_position": {
//                 "x": 324.53038193419246,
//                 "y": -1563.7612786409936
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Let user know you work with a lot of clients diversify their portfolio and invest in Bay Area with annual returns up to 14% and mortgages available for every nationality. I just wanted to reach out to you and see if real estate investment was something you have looked into before or were interested in exploring?"
//             }
//         },
//         {
//             "name": "Collect info",
//             "edges": [
//                 {
//                     "condition": "client said yes or shows interests",
//                     "id": "edge-1735833710558",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "client said yes or shows interests"
//                     },
//                     "destination_node_id": "node-1735833814191"
//                 }
//             ],
//             "id": "node-1735833710558",
//             "type": "conversation",
//             "display_position": {
//                 "x": 853.0713517116209,
//                 "y": -1947.7606693602804
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "We want to ask open ended questions related to the previous question and get the client talking. Ask something like \"It's great to hear you had looked into property investment before, what was it that had given you some interest in buying property in the country?"
//             }
//         },
//         {
//             "finetune_conversation_examples": [],
//             "instruction": {
//                 "type": "static_text",
//                 "text": "Great, we use data, analytics and proven methodology – which we will teach you, to find the best performing investment properties in the highest performing areas. One way we do this is areas where there is significant government investment, new transport links, new business or universities opening. We then get you a mortgage to help buy the property, support with all solicitors and legal aspects and finally manage the property for you at the end, giving an end to end solution. Are there any specific counties of the Bay Area that you prefer or that you have visited before?"
//             },
//             "name": "Establish genuine interest",
//             "edges": [
//                 {
//                     "condition": "user responds",
//                     "id": "edge-1735833814191",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user responds"
//                     },
//                     "destination_node_id": "node-1735833833607"
//                 }
//             ],
//             "id": "node-1735833814191",
//             "type": "conversation",
//             "display_position": {
//                 "x": 2000,
//                 "y": 502
//             }
//         },
//         {
//             "name": "Budget info",
//             "edges": [
//                 {
//                     "condition": "get budget information from user",
//                     "id": "edge-1735833833607",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "get budget information from user"
//                     },
//                     "destination_node_id": "node-1735833930066"
//                 },
//                 {
//                     "condition": "user say no",
//                     "id": "edge-1735927788190",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user say no"
//                     },
//                     "destination_node_id": "node-1735833850790"
//                 }
//             ],
//             "id": "node-1735833833607",
//             "type": "conversation",
//             "display_position": {
//                 "x": 2162.265190967096,
//                 "y": -703.9634608221731
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Let user know that you are able to get 65% up to 75% of the property cost covered  in those counties (or just bay area in general) with finance, meaning you pay on average around 30% deposit.\n\nThis would normally mean you would want to be able to access $70,000 plus in the next couple of months. Do you have a budget allocated to this investment or would that kind of range work for you?"
//             }
//         },
//         {
//             "name": "Confirm budget",
//             "edges": [
//                 {
//                     "condition": "User reply yes",
//                     "id": "edge-1735833850790",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User reply yes"
//                     },
//                     "destination_node_id": "node-1735833930066"
//                 }
//             ],
//             "id": "node-1735833850790",
//             "type": "conversation",
//             "display_position": {
//                 "x": 3000,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "static_text",
//                 "text": "That’s fine, do you have a budget in mind that you would want to keep under? Needs to be over $70,000. "
//             }
//         },
//         {
//             "name": "Confirm online meeting",
//             "edges": [
//                 {
//                     "condition": "User reply no",
//                     "id": "edge-1735833930066",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User reply no"
//                     },
//                     "destination_node_id": "node-1735834579374"
//                 },
//                 {
//                     "condition": "User reply yes",
//                     "id": "edge-1735834567855",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User reply yes"
//                     },
//                     "destination_node_id": "node-1735833949716"
//                 }
//             ],
//             "id": "node-1735833930066",
//             "type": "conversation",
//             "display_position": {
//                 "x": 3500,
//                 "y": 570
//             },
//             "instruction": {
//                 "type": "static_text",
//                 "text": "Does an online meeting where I can share a screen and show you the best ways to invest and the best places to invest sound helpful for you? We tend to do this over Zoom or Google Meets."
//             }
//         },
//         {
//             "name": "Ask for availiability",
//             "edges": [
//                 {
//                     "condition": "that time works",
//                     "id": "edge-1735833949716",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "that time works"
//                     },
//                     "destination_node_id": "node-1735834052879"
//                 },
//                 {
//                     "condition": "that time does not work",
//                     "id": "edge-1736581008978",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "that time does not work"
//                     },
//                     "destination_node_id": "node-1736581022615"
//                 }
//             ],
//             "id": "node-1735833949716",
//             "type": "conversation",
//             "display_position": {
//                 "x": 4500,
//                 "y": 504
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "That is great, I really think it will be helpful for you. After the meeting, worst case scenario you will either have more information on Bay Area investments than anyone else you know, or best case you will find that an investment would work for you and we can work together on picking a property that suits.\n\nWould you be available for 45 mins tomorrow or (business day after that)?"
//             }
//         },
//         {
//             "name": "Booking",
//             "edges": [
//                 {
//                     "condition": "City obtained",
//                     "id": "edge-1735834052879",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "City obtained"
//                     },
//                     "destination_node_id": "node-1736581119470"
//                 }
//             ],
//             "id": "node-1735834052879",
//             "type": "conversation",
//             "display_position": {
//                 "x": 5500,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask which city they are in so that you can understand the timezone to use later."
//             }
//         },
//         {
//             "name": "Confirm phone call",
//             "edges": [
//                 {
//                     "condition": "user agrees to call",
//                     "id": "edge-1735834579374",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user agrees to call"
//                     },
//                     "destination_node_id": "node-1735833949716"
//                 }
//             ],
//             "id": "node-1735834579374",
//             "type": "conversation",
//             "display_position": {
//                 "x": 4000,
//                 "y": 394
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask if they would be more comfortable with a call instead."
//             }
//         },
//         {
//             "name": "End Call",
//             "id": "node-1735928715422",
//             "type": "end",
//             "display_position": {
//                 "x": 8500,
//                 "y": 208
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": ""
//             }
//         },
//         {
//             "tool_id": "tool-1735930052950",
//             "name": "Check availability",
//             "edges": [
//                 {
//                     "condition": "availability exists for selected or nearby range",
//                     "id": "edge-1735929605286",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "availability exists for selected or nearby range"
//                     },
//                     "destination_node_id": "node-1736579201470"
//                 },
//                 {
//                     "condition": "no availability exists",
//                     "id": "edge-1736579487914",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "no availability exists"
//                     },
//                     "destination_node_id": "node-1736580464935"
//                 }
//             ],
//             "id": "node-1735929256389",
//             "type": "function",
//             "tool_type": "local",
//             "speak_during_execution": false,
//             "display_position": {
//                 "x": 6500,
//                 "y": 623
//             },
//             "wait_for_result": true
//         },
//         {
//             "tool_id": "tool-1735930073314",
//             "name": "Book Meeting",
//             "edges": [
//                 {
//                     "condition": "book success",
//                     "id": "edge-1735929770831",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "book success"
//                     },
//                     "destination_node_id": "node-1736184354447"
//                 },
//                 {
//                     "condition": "book failed",
//                     "id": "edge-1735930593664",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "book failed"
//                     },
//                     "destination_node_id": "node-1736580464935"
//                 }
//             ],
//             "id": "node-1735929762524",
//             "type": "function",
//             "tool_type": "local",
//             "speak_during_execution": false,
//             "display_position": {
//                 "x": 7500,
//                 "y": 157
//             },
//             "wait_for_result": true
//         },
//         {
//             "name": "Final confirmation",
//             "edges": [
//                 {
//                     "condition": "All tasks finished and user said farewell message",
//                     "id": "edge-1736184354447",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "All tasks finished and user said farewell message"
//                     },
//                     "destination_node_id": "node-1735928715422"
//                 }
//             ],
//             "id": "node-1736184354447",
//             "type": "conversation",
//             "display_position": {
//                 "x": 8000,
//                 "y": 0
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "\"I also want to let you know that we will have the number one bay area property specialist join us in the meeting. Their schedule is usually fully booked, so this is a rare opportunity, let's make the most of this chance to discuss your investment opportunities. I’m looking forward to our discussion and will be preparing some personalized insights for you. Can I count on you to be there?\"\n\nSend Calendar Invite:\n\n\"I’ll send you a calendar invite shortly. If you have any changes or need to reschedule, please let me know as soon as possible.\"\n\nThank and Reassure:\n\n\"Thank you and take care. Goodbye\""
//             }
//         },
//         {
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Tell user that feel free to reach back out if they've changed their minds. Politely end the call."
//             },
//             "name": "Handle no interest",
//             "edges": [
//                 {
//                     "condition": "Describe the transition condition",
//                     "id": "edge-1736577809771",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "Describe the transition condition"
//                     }
//                 }
//             ],
//             "global_node_setting": {
//                 "condition": "If user got angry or is not interested at all"
//             },
//             "id": "node-1736577809771",
//             "type": "conversation",
//             "display_position": {
//                 "x": 0,
//                 "y": 859.5
//             },
//             "skip_response_edge": {
//                 "condition": "Skip response",
//                 "id": "edge-1736577869883",
//                 "transition_condition": {
//                     "type": "prompt",
//                     "prompt": "Skip response"
//                 },
//                 "destination_node_id": "node-1736577860868"
//             }
//         },
//         {
//             "name": "End Call",
//             "id": "node-1736577860868",
//             "type": "end",
//             "display_position": {
//                 "x": 500,
//                 "y": 984
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Politely end the call"
//             }
//         },
//         {
//             "name": "Conversation",
//             "edges": [
//                 {
//                     "condition": "Slot chosen",
//                     "id": "edge-1736579201470",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "Slot chosen"
//                     },
//                     "destination_node_id": "node-1735929762524"
//                 }
//             ],
//             "id": "node-1736579201470",
//             "type": "conversation",
//             "display_position": {
//                 "x": 7000,
//                 "y": 118
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "inform user about the availability (date, time, timezone) and ask user to choose from it. Make sure user chose a slot within detailed available slot."
//             }
//         },
//         {
//             "name": "Conversation",
//             "edges": [
//                 {
//                     "condition": "Got new time",
//                     "id": "edge-1736580464935",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "Got new time"
//                     },
//                     "destination_node_id": "node-1735929256389"
//                 }
//             ],
//             "id": "node-1736580464935",
//             "type": "conversation",
//             "display_position": {
//                 "x": 8000,
//                 "y": 572
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Tell user that time does not work, ask if they have any other time range that are available."
//             }
//         },
//         {
//             "name": "Conversation",
//             "edges": [
//                 {
//                     "condition": "preferred date and time obtained",
//                     "id": "edge-1736581022615",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "preferred date and time obtained"
//                     },
//                     "destination_node_id": "node-1735834052879"
//                 }
//             ],
//             "id": "node-1736581022615",
//             "type": "conversation",
//             "display_position": {
//                 "x": 5000,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask what's their preferred date and time."
//             }
//         },
//         {
//             "name": "email",
//             "edges": [
//                 {
//                     "condition": "email obtained",
//                     "id": "edge-1736581119470",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "email obtained"
//                     },
//                     "destination_node_id": "node-1735929256389"
//                 }
//             ],
//             "id": "node-1736581119470",
//             "type": "conversation",
//             "display_position": {
//                 "x": 6000,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask user for their email."
//             }
//         },
//         {
//             "agent_id": "",
//             "edge": {
//                 "id": "edge-1759465625960",
//                 "transition_condition": {
//                     "type": "prompt",
//                     "prompt": "Transfer failed"
//                 }
//             },
//             "webhook_setting": "only_source_agent",
//             "name": "Agent Transfer Node",
//             "agent_version": 0,
//             "post_call_analysis_setting": "only_destination_agent",
//             "id": "node-1759465625960",
//             "type": "agent_swap",
//             "display_position": {
//                 "x": 0,
//                 "y": 1264.5
//             }
//         }
  
//   // Add more nodes from your JSON here
//   // For brevity, I'm using only one node. Replace with your full array.
// ].map((node) => ({
//   ...node,
//   instruction: node.instruction || { type: 'prompt', text: 'No instruction provided' },
// }));

// const getFlowNodes = (nodes: any[]): FlowNode[] =>
//   nodes.map((node) => ({
//     id: node.id,
//     type: node.edges?.length <= 1 ? 'parentNode' : 'default',
//     data: { label: node.name, instruction: node.instruction.text, edges: node.edges },
//     position: { x: node.display_position.x, y: node.display_position.y },
//   }));

// const getFlowEdges = (nodes: any[]): FlowEdge[] =>
//   nodes
//     .flatMap((node) =>
//       node.edges?.map((edge: any) => ({
//         id: edge.id,
//         source: node.id,
//         target: edge.destination_node_id,
//         label: edge.condition,
//         animated: true,
//         style: { stroke: '#1976d2' },
//       })),
//     )
//     .filter((edge): edge is FlowEdge => !!edge);

// // Custom Node Component
// const CustomNode = ({ data }: { data: { label: string; instruction: string; edges: any[] } }) => {
//   const theme = useTheme();
//   const isParentNode = data.edges?.length <= 1;

//   return (
//     <Card
//       sx={{
//         minWidth: 200,
//         maxWidth: 250,
//         bgcolor: isParentNode ? theme.palette.primary.light : theme.palette.background.paper,
//         boxShadow: 3,
//         borderRadius: 2,
//         p: 1,
//       }}
//     >
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           {data.label}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {data.instruction?.substring(0, 50) || 'No instruction'}...
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// const nodeTypes = { parentNode: CustomNode, default: CustomNode };

// const AgentConfig: React.FC = () => {
//   const theme = useTheme();
//   const [nodes, setNodes] = useNodesState(getFlowNodes(initialNodes));
//   const [edges, setEdges] = useEdgesState(getFlowEdges(initialNodes));
//   const [selectedNode, setSelectedNode] = useState<any | null>(null);

//   const onNodeClick = useCallback((event: any, node: FlowNode) => {
//     setSelectedNode(node);
//     setNodes((nds) =>
//       nds.map((n) => ({
//         ...n,
//         data: { ...n.data, selected: n.id === node.id },
//       })),
//     );
//   }, []);

//   const onEdgeClick = useCallback((event: any, edge: FlowEdge) => {
//     const targetNode = nodes.find((n) => n.id === edge.target);
//     if (targetNode) {
//       setSelectedNode(targetNode);
//       setNodes((nds) =>
//         nds.map((n) => ({
//           ...n,
//           data: { ...n.data, selected: n.id === edge.target },
//         })),
//       );
//     }
//   }, [nodes]);

//   return (
//     <Box sx={{ p: 4, bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
//         Agent Configuration Flow
//       </Typography>

//       <Box sx={{ display: 'flex', height: '80vh' }}>
//         <Box sx={{ flex: 3, height: '100%' }}>
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodeClick={onNodeClick}
//             onEdgeClick={onEdgeClick}
//             nodeTypes={nodeTypes}
//             fitView
//             style={{ background: theme.palette.background.paper }}
//           >
//             <Background />
//             <Controls />
//             <MiniMap />
//           </ReactFlow>
//         </Box>
//         <Box sx={{ flex: 1, ml: 2 }}>
//           <AnimatePresence>
//             {selectedNode && (
//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 50 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card sx={{ p: 2, boxShadow: 3 }}>
//                   <CardContent>
//                     <Typography variant="h5" gutterBottom>
//                       {selectedNode.data.label}
//                     </Typography>
//                     <Typography variant="body1" color="text.secondary" paragraph>
//                       {selectedNode.data.instruction || 'No instruction available'}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       Node ID: {selectedNode.id}
//                     </Typography>
//                     <Divider sx={{ my: 2 }} />
//                     <Typography variant="caption" fontWeight="bold">
//                       Type: {initialNodes.find((n) => n.id === selectedNode.id)?.type}
//                     </Typography>
//                     {selectedNode.data.edges && selectedNode.data.edges.length > 0 && (
//                       <Box mt={2}>
//                         <Typography variant="caption" fontWeight="bold">
//                           Next Nodes:
//                         </Typography>
//                         {selectedNode.data.edges.map((edge: any) => (
//                           <Chip
//                             key={edge.id}
//                             label={edge.condition}
//                             onClick={() =>
//                               onEdgeClick(null, {
//                                 id: edge.id,
//                                 source: selectedNode.id,
//                                 target: edge.destination_node_id,
//                               })
//                             }
//                             icon={<ArrowForward />}
//                             sx={{ m: 0.5, cursor: 'pointer' }}
//                             color="primary"
//                             variant="outlined"
//                           />
//                         ))}
//                       </Box>
//                     )}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default AgentConfig;

// "use client";
// import React, { useEffect, useState } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
//   useEdgesState,
//   useNodesState,
// } from "reactflow";
// import dagre from "dagre";
// import "reactflow/dist/style.css";

// const nodeWidth = 220;
// const nodeHeight = 80;

// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

// const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
//   dagreGraph.setGraph({ rankdir: direction });

//   nodes.forEach((node) => {
//     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//   });

//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });

//   dagre.layout(dagreGraph);

//   nodes.forEach((node) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     node.position = {
//       x: nodeWithPosition.x - nodeWidth / 2,
//       y: nodeWithPosition.y - nodeHeight / 2,
//     };
//   });

//   return { nodes, edges };
// };

// const rawNodes = [
//  {
//             "instruction": {
//                 "type": "static_text",
//                 "text": "Hi {{first_name}}. It's Kelsey here from South Bay Investment the Bay Area property investment company, you had previously showed some interest in an advert for a property investment Bay Area. It is just a quick call, are you familiar with South Bay Investment?"
//             },
//             "name": "Greeting",
//             "edges": [
//                 {
//                     "condition": "User replies",
//                     "id": "edge-1",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User replies"
//                     },
//                     "destination_node_id": "node-1735833439816"
//                 }
//             ],
//             "start_speaker": "agent",
//             "id": "start-node-1735833334791",
//             "type": "conversation",
//             "display_position": {
//                 "x": -70.81939554856974,
//                 "y": -841.5348322789481
//             }
//         },
//         {
//             "name": "Confirm",
//             "edges": [
//                 {
//                     "condition": "user said yes or shows interests",
//                     "id": "edge-1735833536291",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user said yes or shows interests"
//                     },
//                     "destination_node_id": "node-1735833814191"
//                 },
//                 {
//                     "condition": "user is a bit hesitant or has no interest ",
//                     "id": "edge-1736577612042",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user is a bit hesitant or has no interest "
//                     },
//                     "destination_node_id": "node-1735833710558"
//                 }
//             ],
//             "id": "node-1735833439816",
//             "type": "conversation",
//             "display_position": {
//                 "x": 324.53038193419246,
//                 "y": -1563.7612786409936
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Let user know you work with a lot of clients diversify their portfolio and invest in Bay Area with annual returns up to 14% and mortgages available for every nationality. I just wanted to reach out to you and see if real estate investment was something you have looked into before or were interested in exploring?"
//             }
//         },
//         {
//             "name": "Collect info",
//             "edges": [
//                 {
//                     "condition": "client said yes or shows interests",
//                     "id": "edge-1735833710558",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "client said yes or shows interests"
//                     },
//                     "destination_node_id": "node-1735833814191"
//                 }
//             ],
//             "id": "node-1735833710558",
//             "type": "conversation",
//             "display_position": {
//                 "x": 853.0713517116209,
//                 "y": -1947.7606693602804
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "We want to ask open ended questions related to the previous question and get the client talking. Ask something like \"It's great to hear you had looked into property investment before, what was it that had given you some interest in buying property in the country?"
//             }
//         },
//         {
//             "finetune_conversation_examples": [],
//             "instruction": {
//                 "type": "static_text",
//                 "text": "Great, we use data, analytics and proven methodology – which we will teach you, to find the best performing investment properties in the highest performing areas. One way we do this is areas where there is significant government investment, new transport links, new business or universities opening. We then get you a mortgage to help buy the property, support with all solicitors and legal aspects and finally manage the property for you at the end, giving an end to end solution. Are there any specific counties of the Bay Area that you prefer or that you have visited before?"
//             },
//             "name": "Establish genuine interest",
//             "edges": [
//                 {
//                     "condition": "user responds",
//                     "id": "edge-1735833814191",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user responds"
//                     },
//                     "destination_node_id": "node-1735833833607"
//                 }
//             ],
//             "id": "node-1735833814191",
//             "type": "conversation",
//             "display_position": {
//                 "x": 2000,
//                 "y": 502
//             }
//         },
//         {
//             "name": "Budget info",
//             "edges": [
//                 {
//                     "condition": "get budget information from user",
//                     "id": "edge-1735833833607",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "get budget information from user"
//                     },
//                     "destination_node_id": "node-1735833930066"
//                 },
//                 {
//                     "condition": "user say no",
//                     "id": "edge-1735927788190",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user say no"
//                     },
//                     "destination_node_id": "node-1735833850790"
//                 }
//             ],
//             "id": "node-1735833833607",
//             "type": "conversation",
//             "display_position": {
//                 "x": 2162.265190967096,
//                 "y": -703.9634608221731
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Let user know that you are able to get 65% up to 75% of the property cost covered  in those counties (or just bay area in general) with finance, meaning you pay on average around 30% deposit.\n\nThis would normally mean you would want to be able to access $70,000 plus in the next couple of months. Do you have a budget allocated to this investment or would that kind of range work for you?"
//             }
//         },
//         {
//             "name": "Confirm budget",
//             "edges": [
//                 {
//                     "condition": "User reply yes",
//                     "id": "edge-1735833850790",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User reply yes"
//                     },
//                     "destination_node_id": "node-1735833930066"
//                 }
//             ],
//             "id": "node-1735833850790",
//             "type": "conversation",
//             "display_position": {
//                 "x": 3000,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "static_text",
//                 "text": "That’s fine, do you have a budget in mind that you would want to keep under? Needs to be over $70,000. "
//             }
//         },
//         {
//             "name": "Confirm online meeting",
//             "edges": [
//                 {
//                     "condition": "User reply no",
//                     "id": "edge-1735833930066",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User reply no"
//                     },
//                     "destination_node_id": "node-1735834579374"
//                 },
//                 {
//                     "condition": "User reply yes",
//                     "id": "edge-1735834567855",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "User reply yes"
//                     },
//                     "destination_node_id": "node-1735833949716"
//                 }
//             ],
//             "id": "node-1735833930066",
//             "type": "conversation",
//             "display_position": {
//                 "x": 3500,
//                 "y": 570
//             },
//             "instruction": {
//                 "type": "static_text",
//                 "text": "Does an online meeting where I can share a screen and show you the best ways to invest and the best places to invest sound helpful for you? We tend to do this over Zoom or Google Meets."
//             }
//         },
//         {
//             "name": "Ask for availiability",
//             "edges": [
//                 {
//                     "condition": "that time works",
//                     "id": "edge-1735833949716",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "that time works"
//                     },
//                     "destination_node_id": "node-1735834052879"
//                 },
//                 {
//                     "condition": "that time does not work",
//                     "id": "edge-1736581008978",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "that time does not work"
//                     },
//                     "destination_node_id": "node-1736581022615"
//                 }
//             ],
//             "id": "node-1735833949716",
//             "type": "conversation",
//             "display_position": {
//                 "x": 4500,
//                 "y": 504
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "That is great, I really think it will be helpful for you. After the meeting, worst case scenario you will either have more information on Bay Area investments than anyone else you know, or best case you will find that an investment would work for you and we can work together on picking a property that suits.\n\nWould you be available for 45 mins tomorrow or (business day after that)?"
//             }
//         },
//         {
//             "name": "Booking",
//             "edges": [
//                 {
//                     "condition": "City obtained",
//                     "id": "edge-1735834052879",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "City obtained"
//                     },
//                     "destination_node_id": "node-1736581119470"
//                 }
//             ],
//             "id": "node-1735834052879",
//             "type": "conversation",
//             "display_position": {
//                 "x": 5500,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask which city they are in so that you can understand the timezone to use later."
//             }
//         },
//         {
//             "name": "Confirm phone call",
//             "edges": [
//                 {
//                     "condition": "user agrees to call",
//                     "id": "edge-1735834579374",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "user agrees to call"
//                     },
//                     "destination_node_id": "node-1735833949716"
//                 }
//             ],
//             "id": "node-1735834579374",
//             "type": "conversation",
//             "display_position": {
//                 "x": 4000,
//                 "y": 394
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask if they would be more comfortable with a call instead."
//             }
//         },
//         {
//             "name": "End Call",
//             "id": "node-1735928715422",
//             "type": "end",
//             "display_position": {
//                 "x": 8500,
//                 "y": 208
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": ""
//             }
//         },
//         {
//             "tool_id": "tool-1735930052950",
//             "name": "Check availability",
//             "edges": [
//                 {
//                     "condition": "availability exists for selected or nearby range",
//                     "id": "edge-1735929605286",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "availability exists for selected or nearby range"
//                     },
//                     "destination_node_id": "node-1736579201470"
//                 },
//                 {
//                     "condition": "no availability exists",
//                     "id": "edge-1736579487914",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "no availability exists"
//                     },
//                     "destination_node_id": "node-1736580464935"
//                 }
//             ],
//             "id": "node-1735929256389",
//             "type": "function",
//             "tool_type": "local",
//             "speak_during_execution": false,
//             "display_position": {
//                 "x": 6500,
//                 "y": 623
//             },
//             "wait_for_result": true
//         },
//         {
//             "tool_id": "tool-1735930073314",
//             "name": "Book Meeting",
//             "edges": [
//                 {
//                     "condition": "book success",
//                     "id": "edge-1735929770831",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "book success"
//                     },
//                     "destination_node_id": "node-1736184354447"
//                 },
//                 {
//                     "condition": "book failed",
//                     "id": "edge-1735930593664",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "book failed"
//                     },
//                     "destination_node_id": "node-1736580464935"
//                 }
//             ],
//             "id": "node-1735929762524",
//             "type": "function",
//             "tool_type": "local",
//             "speak_during_execution": false,
//             "display_position": {
//                 "x": 7500,
//                 "y": 157
//             },
//             "wait_for_result": true
//         },
//         {
//             "name": "Final confirmation",
//             "edges": [
//                 {
//                     "condition": "All tasks finished and user said farewell message",
//                     "id": "edge-1736184354447",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "All tasks finished and user said farewell message"
//                     },
//                     "destination_node_id": "node-1735928715422"
//                 }
//             ],
//             "id": "node-1736184354447",
//             "type": "conversation",
//             "display_position": {
//                 "x": 8000,
//                 "y": 0
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "\"I also want to let you know that we will have the number one bay area property specialist join us in the meeting. Their schedule is usually fully booked, so this is a rare opportunity, let's make the most of this chance to discuss your investment opportunities. I’m looking forward to our discussion and will be preparing some personalized insights for you. Can I count on you to be there?\"\n\nSend Calendar Invite:\n\n\"I’ll send you a calendar invite shortly. If you have any changes or need to reschedule, please let me know as soon as possible.\"\n\nThank and Reassure:\n\n\"Thank you and take care. Goodbye\""
//             }
//         },
//         {
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Tell user that feel free to reach back out if they've changed their minds. Politely end the call."
//             },
//             "name": "Handle no interest",
//             "edges": [
//                 {
//                     "condition": "Describe the transition condition",
//                     "id": "edge-1736577809771",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "Describe the transition condition"
//                     }
//                 }
//             ],
//             "global_node_setting": {
//                 "condition": "If user got angry or is not interested at all"
//             },
//             "id": "node-1736577809771",
//             "type": "conversation",
//             "display_position": {
//                 "x": 0,
//                 "y": 859.5
//             },
//             "skip_response_edge": {
//                 "condition": "Skip response",
//                 "id": "edge-1736577869883",
//                 "transition_condition": {
//                     "type": "prompt",
//                     "prompt": "Skip response"
//                 },
//                 "destination_node_id": "node-1736577860868"
//             }
//         },
//         {
//             "name": "End Call",
//             "id": "node-1736577860868",
//             "type": "end",
//             "display_position": {
//                 "x": 500,
//                 "y": 984
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Politely end the call"
//             }
//         },
//         {
//             "name": "Conversation",
//             "edges": [
//                 {
//                     "condition": "Slot chosen",
//                     "id": "edge-1736579201470",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "Slot chosen"
//                     },
//                     "destination_node_id": "node-1735929762524"
//                 }
//             ],
//             "id": "node-1736579201470",
//             "type": "conversation",
//             "display_position": {
//                 "x": 7000,
//                 "y": 118
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "inform user about the availability (date, time, timezone) and ask user to choose from it. Make sure user chose a slot within detailed available slot."
//             }
//         },
//         {
//             "name": "Conversation",
//             "edges": [
//                 {
//                     "condition": "Got new time",
//                     "id": "edge-1736580464935",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "Got new time"
//                     },
//                     "destination_node_id": "node-1735929256389"
//                 }
//             ],
//             "id": "node-1736580464935",
//             "type": "conversation",
//             "display_position": {
//                 "x": 8000,
//                 "y": 572
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Tell user that time does not work, ask if they have any other time range that are available."
//             }
//         },
//         {
//             "name": "Conversation",
//             "edges": [
//                 {
//                     "condition": "preferred date and time obtained",
//                     "id": "edge-1736581022615",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "preferred date and time obtained"
//                     },
//                     "destination_node_id": "node-1735834052879"
//                 }
//             ],
//             "id": "node-1736581022615",
//             "type": "conversation",
//             "display_position": {
//                 "x": 5000,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask what's their preferred date and time."
//             }
//         },
//         {
//             "name": "email",
//             "edges": [
//                 {
//                     "condition": "email obtained",
//                     "id": "edge-1736581119470",
//                     "transition_condition": {
//                         "type": "prompt",
//                         "prompt": "email obtained"
//                     },
//                     "destination_node_id": "node-1735929256389"
//                 }
//             ],
//             "id": "node-1736581119470",
//             "type": "conversation",
//             "display_position": {
//                 "x": 6000,
//                 "y": 592
//             },
//             "instruction": {
//                 "type": "prompt",
//                 "text": "Ask user for their email."
//             }
//         },
//         {
//             "agent_id": "",
//             "edge": {
//                 "id": "edge-1759465625960",
//                 "transition_condition": {
//                     "type": "prompt",
//                     "prompt": "Transfer failed"
//                 }
//             },
//             "webhook_setting": "only_source_agent",
//             "name": "Agent Transfer Node",
//             "agent_version": 0,
//             "post_call_analysis_setting": "only_destination_agent",
//             "id": "node-1759465625960",
//             "type": "agent_swap",
//             "display_position": {
//                 "x": 0,
//                 "y": 1264.5
//             }
//         }
  
//   // Add more nodes from your JSON here
//   // For brevity, I'm using only one node. Replace with your full array.
// ]

// // Convert JSON → ReactFlow nodes & edges
// const initialNodes = rawNodes.map((n) => ({
//   id: n.id,
//   type: "default",
//   data: { label: n.name, instruction: n.instruction },
//   position: { x: 0, y: 0 },
// }));

// const initialEdges = rawNodes.flatMap((n) =>
//   (n.edges || []).map((e) => ({
//     id: e.id,
//     source: n.id,
//     target: e.destination_node_id,
//     label: e.condition,
//   }))
// );

// export default function ConversationFlow() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [selectedNode, setSelectedNode] = useState<any>(null);

//   useEffect(() => {
//     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
//       [...initialNodes],
//       [...initialEdges],
//       "LR"
//     );
//     setNodes(layoutedNodes);
//     setEdges(layoutedEdges);
//   }, []);

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Flowchart area */}
//       <div style={{ flex: 1 }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onNodeClick={(_, node) => setSelectedNode(node.data)}
//           fitView
//         >
//           <Background />
//           <MiniMap />
//           <Controls />
//         </ReactFlow>
//       </div>

//       {/* Sidebar area */}
//       {selectedNode && (
//         <div style={{ width: "300px", borderLeft: "1px solid #ccc", padding: "16px" }}>
//           <h3 className="font-bold text-lg mb-2">{selectedNode.label}</h3>
//           <p className="text-gray-700">
//             {selectedNode.instruction?.text || "No instruction available"}
//           </p>
//           <button
//             onClick={() => setSelectedNode(null)}
//             className="mt-4 px-3 py-1 bg-red-500 text-white rounded"
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }