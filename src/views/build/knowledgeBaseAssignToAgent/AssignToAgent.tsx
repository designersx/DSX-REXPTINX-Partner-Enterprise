
"use client"

import * as React from "react"
import { Snackbar, Alert } from "@mui/material";
import {
    Box,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
} from "@mui/material"

import { assignKnowledgeBaseToAgent, getKbListByUserId, fetchAgent } from "../../../../Services/auth"
import { getUserId } from "utils/auth"

type KBItem = {
    kbId: string
    kbName: string
}

type AgentType = {
    id: string
    agentName: string
    knowledgeBaseIds?: string[]
}

export default function AgentConfig({kbId}) {

    const userId = getUserId();
    const [agents, setAgents] = React.useState<AgentType[]>([]);
    const [existingKbList, setExistingKbList] = React.useState<KBItem[]>([]);
    const [selectedAgentId, setSelectedAgentId] = React.useState<string | null>(null);
    const [addKbOpen, setAddKbOpen] = React.useState(false);
    const [selectedKbId, setSelectedKbId] = React.useState<string | null>(kbId);

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");

    // Load agents
    const loadAgents = async () => {
        try {
            const res = await fetchAgent(); // should return { agents: [...] }
            setAgents(res?.agents || []);
        } catch (err) {
            console.error('Error fetching agents:', err);
        }
    };

    // Load KBs
    const loadKBs = async () => {
        try {
            const res = await getKbListByUserId(userId);
            if (res.success) {
                const formatted = res.data.map((kb: any) => ({
                    kbId: kb.kbId,
                    kbName: kb.kbName,
                }));
                setExistingKbList(formatted);
            }
        } catch (err) {
            console.error("Error fetching KBs:", err);
        }
    };

    React.useEffect(() => {
        loadAgents();
        loadKBs();
    }, []);

    // Assign KB to selected agent
    const handleAssignKB = async (kbId: string) => {
        if (!selectedAgentId) return;

        try {
            await assignKnowledgeBaseToAgent({
                userId,
                kbId,
                agentId: selectedAgentId,
            });

            // Update agent's KB list locally
            setAgents(prev =>
                prev.map(agent =>
                    agent.id === selectedAgentId
                        ? {
                            ...agent,
                            knowledgeBaseIds: agent.knowledgeBaseIds
                                ? [...agent.knowledgeBaseIds, kbId]
                                : [kbId],
                        }
                        : agent
                )
            );

            setSnackbarMessage("Knowledge Base assigned successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Error assigning KB:", err);
            setSnackbarMessage("Failed to assign Knowledge Base.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setAddKbOpen(false);
            setSelectedKbId(null);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);
    const handleKnowledgeBaseAssignToAgent = (e) => {
        console.log(e.target.value)
        setSelectedAgentId(e.target.value);
         handleAssignKB(kbId);
        // setAddKbOpen(true);
    }
    return (
        <Grid container spacing={2} padding={2}>
            {/* Agent Dropdown */}
            <Grid item xs={12} md={6}>
                <FormControl sx={{ minWidth: 300 }} fullWidth>
                    <InputLabel id="agent-select-label">Assign To  Agent</InputLabel>
                    <Select
                        labelId="agent-select-label"
                        value={selectedAgentId || ""}
                        label="Select Agent"
                        onChange={(e) => {
                            handleKnowledgeBaseAssignToAgent(e)
                        }}
                    >
                        {agents.map((agent) => (
                            <MenuItem key={agent.agent_id} value={agent.agent_id}>
                                {agent.agentName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Show assigned KBs for selected agent */}
                {/* {selectedAgentId && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Assigned Knowledge Bases:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                            {agents
                                .find(a => a.agent_id === selectedAgentId)
                                ?.knowledgeBaseIds?.map(kbId => {
                                    const kb = existingKbList.find(k => k.kbId === kbId);
                                    return kb ? <Chip key={kb.kbId} label={kb.kbName} size="small" /> : null;
                                })}
                        </Stack>
                    </Box>
                )} */}
            </Grid>

            {/* KB Dialog */}
            {/* <Dialog open={addKbOpen} onClose={() => setAddKbOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    Select Knowledge Base
                    <Typography variant="body2" color="text.secondary">
                        Select a knowledge base to provide context to the agent.
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <List>
                        {existingKbList.map(kb => (
                            <ListItem
                                button
                                key={kb.kbId}
                                selected={selectedKbId === kb.kbId}
                                onClick={() => {
                                    setSelectedKbId(kb.kbId);
                                    handleAssignKB(kb.kbId);
                                }}
                            >
                                <ListItemText primary={kb.kbName} />
                            </ListItem>
                        ))}
                        <Divider sx={{ my: 1 }} />

                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setAddKbOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
}
