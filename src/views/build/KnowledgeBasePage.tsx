import { useEffect, useState } from "react";
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
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BasicModal from "./AddKnowledgebase";
import { getUserId } from "utils/auth";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteKnowledgeBase, getKbListByUserId } from "../../../Services/auth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import EditKnowledgeBase from "./EditKnowledgeBase";



export default function KnowledgeBaseUI() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState<any>(items[0]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const userId = getUserId();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchKBs = async () => {
      try {
        // const res = await axios.get(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/getEnterpriseKBbyUserId/${userId}`
        // );
        const res =await getKbListByUserId(userId)
        console.log("fdfsaa", res);

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

          setItems(formatted);
        }
      } catch (err) {
        console.error("Error fetching KBs:", err);
      }
    };

    fetchKBs();
  }, [userId]);

  // 📂 text download handler
  const handleDownloadText = (item: any) => {
    const blob = new Blob([item.text || ""], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.name || "knowledgebase"}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handleConfirmDelete = async () => {
    if (!selectedItem?.kbId) return;
    console.log('selectedItem.kbId',selectedItem.kbId,userId)
    try {
      await deleteKnowledgeBase({ kbId:selectedItem.kbId, userId });
      setItems((prev) => prev.filter((kb) => kb.kbId != selectedItem.kbId));

      setSnackbarMessage("Knowledge Base deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(err.message || "Failed to delete KB");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

const handleSnackbarClose = (
  event?: React.SyntheticEvent | Event,
  reason?: string
) => {

  setSnackbarOpen(false);
};

const handleEditSuccess = (updatedKB) => {
   setItems((prev) =>prev.map((kb) => (kb.kbId ===updatedKB.kbId ? { ...kb, ...updatedKB } : kb))
   );
   setSelectedItem((prev) => (prev?.kbId === updatedKB.kbId ? { ...prev, ...updatedKB } : prev));
   setOpenEditModal(false);
 };

console.log(selectedItem)
  return (
    <>
      {/* ✅ Wrapper Box for responsive flex */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // default mobile
          gap: 2,
          "@media (min-width:650px)": {
            flexDirection: "row", // desktop/tablet
          },
          height: "100%",
        }}
      >
        {/* Left Panel - Knowledge Base List */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 30%" } }}>
          <Paper
            sx={{
              p: 2,
              height: "100%",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Knowledge Base
              </Typography>
              <IconButton
                color="warning"
                size="large"
                onClick={() => setOpen(true)}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <List sx={{ maxHeight: "80vh", overflowY: "auto" }}>
              {items.map((item, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() => setSelectedItem(item)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": { bgcolor: "action.hover" },
                    bgcolor:
                      selectedItem?.name === item.name
                        ? "action.selected"
                        : "inherit",
                  }}
                >
                  <ListItemIcon>
                    <DescriptionIcon sx={{ color: "#525866" }} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        minWidth: "250px",
                        maxWidth: "600px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Right Panel - Details */}
        <Box sx={{ flex: { xs: "1 1 100%", md: "0 0 70%" } }}>
          {selectedItem ? (
            <Paper
              sx={{
                p: 3,
                minHeight: "80vh",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              {/* Header */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box>
                  <Typography variant="h6">{selectedItem.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedItem.id} • Uploaded at:{" "}
                    {selectedItem.uploadedAt}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                     <IconButton
                    color="primary"
                    size="small"
                   onClick={() => setOpenEditModal(true)}
                  >
                   <EditIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* ✅ WebUrl main link */}
              {selectedItem.webUrl && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <LinkIcon color="warning" />
                    <Typography
                      component="a"
                      href={selectedItem.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontWeight: 500,
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {selectedItem.webUrl}
                    </Typography>
                  </Stack>
                  {selectedItem.details?.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setShowAllLinks(!showAllLinks)}
                    >
                      {showAllLinks ? "Hide" : "View All"}
                    </Button>
                  )}
                </Paper>
              )}

              {/* ✅ All Details */}
              {showAllLinks && (
                <Stack spacing={2} mt={2}>
                  {selectedItem.details.map((d: any, i: number) => (
                    <Paper
                      key={i}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        {d.type === "url" ? (
                          <>
                            <LinkIcon color="warning" />
                            <Box>
                              <Typography
                                fontWeight={500}
                                component="a"
                                href={
                                  d.value.startsWith("http")
                                    ? d.value
                                    : `https://${d.value}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textDecoration: "none",
                                  color: "primary.main",
                                  cursor: "pointer",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                {d.value}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <>
                            <InsertDriveFileIcon color="error" />
                            <Box>
                              <Typography
                                fontWeight={500}
                                sx={{
                                  cursor: "pointer",
                                  color: "text.primary",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                                onClick={() => {
                                  window.open(
                                    `${process.env.NEXT_PUBLIC_API_URL}/uploads/${d.value}`,
                                    "_blank"
                                  );
                                }}
                              >
                                {d.value}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {d.size}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}

              {/* ✅ Download text file */}
              {selectedItem.text && (
                <Paper
                  sx={{
                    p: 2,
                    mt: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <InsertDriveFileIcon color="error" />
                    <Typography fontWeight={500}>Text File</Typography>
                  </Stack>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleDownloadText(selectedItem)}
                  >
                    Download
                  </Button>
                </Paper>
              )}

              {selectedItem?.kbFiles?.map((file, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <InsertDriveFileIcon color="primary" />
                  <Typography fontWeight={500}>{file.fileName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  href={`${process.env.NEXT_PUBLIC_API_URL}/${file.filePath}`}
                  target="_blank"
                  download
                >
                  Download
                </Button>
              </Paper>
              ))}

            </Paper>
          ) : (
            <Paper
              sx={{
                p: 3,
                minHeight: "80vh",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography color="text.secondary">
                Select a Knowledge Base to view details
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      <BasicModal open={open} onClose={() => setOpen(false)} />

        <EditKnowledgeBase
   open={openEditModal}
   onClose={() => setOpenEditModal(false)}
  onSubmit={handleEditSuccess}
   knowledgeBase={selectedItem}
 />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Delete Knowledge Base</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Are you sure you want to delete this knowledge base? <br />
              <strong>This will affect any agent assigned to it.</strong>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

  <Snackbar
  open={snackbarOpen}
  autoHideDuration={4000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <MuiAlert
    elevation={6}
    variant="filled"
    onClose={handleSnackbarClose}
    severity={snackbarSeverity}
    sx={{ width: "100%" }}
  >
    {snackbarMessage}
  </MuiAlert>
</Snackbar>
    </>
  );
}
