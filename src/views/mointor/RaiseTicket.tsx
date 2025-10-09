// "use client";

// import { useEffect, useState, useMemo } from "react";
// import SendIcon from "@mui/icons-material/Send";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Chip,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Paper,
//   IconButton,
//   useTheme,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DownloadIcon from "@mui/icons-material/Download";
// import { useForm, Controller } from "react-hook-form";
// import { format } from "date-fns";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { getUserId } from "utils/auth";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import CloseIcon from "@mui/icons-material/Close";

// type Ticket = {
//   ticketId: string;
//   subject: string;
//   priority: string;
//   description: string;
//   category: string;
//   attachments: any[];
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type FormData = {
//   subject: string;
//   category: string;
//   description: string;
//   priority: string;
//   department: string;
//   relatedFeatureId: string;
// };

// interface Attachment {
//   filename: string;
//   url: string;
//   type: string;
// }

// interface AttachmentPreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   attachments: Attachment[] | string;
// }

// function AttachmentPreviewModal({
//   isOpen,
//   onClose,
//   attachments,
// }: AttachmentPreviewModalProps) {
//   const theme = useTheme();

//   // Parse attachments if they are a string
//   const parsedAttachments = (() => {
//     if (typeof attachments === "string") {
//       try {
//         return JSON.parse(attachments) as Attachment[];
//       } catch (e) {
//         console.error("Failed to parse attachments:", e);
//         return [];
//       }
//     }
//     return attachments || [];
//   })();

//   const renderAttachment = (file: Attachment, idx: number) => {
//     const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
//     const isImage = file.type?.startsWith("image/");
//     const isPDF = file.type?.includes("pdf");
//     const isText = file.type?.startsWith("text/");

//     console.log(fileUrl, { isImage, isPDF, isText });

//     return (
//       <Grid item xs={12} sm={6} md={4} key={idx}>
//         <Paper
//           elevation={2}
//           sx={{
//             p: 2,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             height: "100%",
//             minHeight: 300,
//             borderRadius: 2,
//           }}
//         >
//           {isImage && (
//             <Box
//               sx={{
//                 width: "100%",
//                 height: 250,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 overflow: "hidden",
//                 mb: 1,
//               }}
//             >
//               <img
//                 src={fileUrl}
//                 alt={file.filename}
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "100%",
//                   objectFit: "contain",
//                   borderRadius: 8,
//                 }}
//               />
//             </Box>
//           )}
//           {isPDF && (
//             <Box
//               sx={{
//                 width: "100%",
//                 height: 250,
//                 mb: 1,
//               }}
//             >
//               <iframe
//                 src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//                 title={file.filename}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   borderRadius: 8,
//                 }}
//               />
//             </Box>
//           )}
//           {isText && (
//             <Box
//               sx={{
//                 width: "100%",
//                 height: 250,
//                 overflow: "auto",
//                 p: 2,
//                 bgcolor: "grey.100",
//                 borderRadius: 1,
//                 mb: 1,
//               }}
//             >
//               <iframe
//                 src={fileUrl}
//                 title={file.filename}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   border: "none",
//                 }}
//               />
//             </Box>
//           )}
//           {!isImage && !isPDF && !isText && (
//             <Box sx={{ textAlign: "center", mb: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 {file.filename}
//               </Typography>
//             </Box>
//           )}
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <Typography variant="caption" color="text.secondary">
//               {file.filename}
//             </Typography>
//             <IconButton
//               size="small"
//               href={fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label={`Download ${file.filename}`}
//               sx={{ color: theme.palette.primary.main }}
//             >
//               <DownloadIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         </Paper>
//       </Grid>
//     );
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       sx={{
//         "& .MuiDialog-paper": {
//           height: "90vh",
//           maxHeight: "90vh",
//           overflowY: "auto",
//         },
//       }}
//     >
//       <DialogTitle sx={{ textAlign: "center", py: 2 }}>
//         <Typography variant="h6">Attachment Preview</Typography>
//       </DialogTitle>
//       <DialogContent sx={{ p: 3 }}>
//         {parsedAttachments?.length === 0 ? (
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               height: 200,
//             }}
//           >
//             <Typography variant="body2" color="text.secondary">
//               No attachments found.
//             </Typography>
//           </Box>
//         ) : (
//           <Grid container spacing={2}>
//             {Array.isArray(parsedAttachments) && parsedAttachments.map(renderAttachment)}
//           </Grid>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// function RaiseTicketModal({
//   isOpen,
//   onClose,
//   pageContext,
//   agentId,
//   mode = "raise",
//   ticket = null,
//   onSuccess,
//   priority = "Medium",
//   department = "Support",
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   pageContext: string;
//   agentId: string | null;
//   mode: string;
//   ticket?: any;
//   onSuccess?: () => void;
//   priority?: string;
//   department?: string;
// }) {
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//   const theme = useTheme();

//   const defaultValues = useMemo(() => {
//     const categoryMap: Record<string, string> = {
//       "Edit Agent": "Agent Editing",
//       "Create Agent": "Agent Creation",
//       "User Management": "User Management",
//       Commission: "Commission Issue",
//       "Call Forwarding": "Call Forwarding",
//       "Phone Number Assignment": "Phone Number Assignment",
//     };
//     return {
//       subject: ticket?.subject || "",
//       category: mode !== "raise" ? ticket?.category || "" : categoryMap[pageContext] || "General Inquiry",
//       description: ticket?.description || "",
//       priority: ticket?.priority || priority,
//       department: ticket?.department || department,
//       relatedFeatureId: ticket?.relatedFeatureId || "",
//     };
//   }, [mode, ticket, pageContext, priority, department]);

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>({ defaultValues });

//   useEffect(() => {
//     reset(defaultValues);
//   }, [defaultValues, reset]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = e.target.files?.[0];
//     if (!selected) return;
//     if (selected.size > 5 * 1024 * 1024) {
//       toast.error("File must be under 5MB");
//       return;
//     }
//     if (!["image/png", "image/jpeg", "application/pdf"].includes(selected.type)) {
//       toast.error("Only PNG, JPG, or PDF files allowed");
//       return;
//     }
//     setFile(selected);
//   };

//   const validateForm = (data: FormData) => {
//     if (!data.subject.trim()) return toast.error("Subject is required"), false;
//     if (!data.category) return toast.error("Category is required"), false;
//     if (!data.description.trim()) return toast.error("Description is required"), false;
//     if (!data.priority) return toast.error("Priority is required"), false;
//     if (!data.department) return toast.error("Department is required"), false;
//     return true;
//   };

//   const onSubmit = async (data: FormData) => {
//     if (!validateForm(data) || !userId) return;
//     try {
//       setLoading(true);
//       const payload = new FormData();
//       Object.entries(data).forEach(([key, value]) => payload.append(key, value));
//       payload.append("agentId", data.relatedFeatureId || "");
//       payload.append("userId", userId);
//       payload.append("pageContext", pageContext);
//       if (file) payload.append("ticketAttachments", file);
//         console.log('data',data)
//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/create_ticket`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );

//       toast.success(`Ticket ID: ${res?.data?.ticket?.ticketId}`);
//       reset();
//       setFile(null);
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to submit ticket");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           overflow: "hidden",
//         },
//       }}
//     >
//       {/* Header */}
//       <DialogTitle
//         sx={{
//           px: 4,
//           py: 3,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           bgcolor: theme.palette.grey[50],
//         }}
//       >
//         <Typography variant="h6" fontWeight="bold">
//           {mode === "raise"
//             ? "Raise a New Ticket"
//             : mode === "resolve"
//             ? "Resolve Ticket"
//             : "Reopen Ticket"}
//         </Typography>
//       </DialogTitle>

//       {/* Content */}
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent sx={{ px: 4, py: 3 }}>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             {/* Subject */}
//             <Controller
//               name="subject"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Subject *"
//                   placeholder="Enter a concise subject"
//                   fullWidth
//                   error={!!errors.subject}
//                   helperText={errors.subject?.message}
//                 />
//               )}
//             />

//             {/* Category */}
//             <Controller
//               name="category"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth error={!!errors.category}>
//                   <InputLabel>Category *</InputLabel>
//                   <Select {...field} label="Category *">
//                     <MenuItem value="General Inquiry">General Inquiry</MenuItem>
//                     <MenuItem value="Agent Creation">Agent Creation</MenuItem>
//                     <MenuItem value="Agent Editing">Agent Editing</MenuItem>
//                     <MenuItem value="User Management">User Management</MenuItem>
//                     <MenuItem value="Commission Issue">Commission Issue</MenuItem>
//                     <MenuItem value="Call Forwarding">Call Forwarding</MenuItem>
//                     <MenuItem value="Phone Number Assignment">Phone Number Assignment</MenuItem>
//                     <MenuItem value="Billing Issue">Billing Issue</MenuItem>
//                     <MenuItem value="Other">Other</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             {/* Description */}
//             <Controller
//               name="description"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Description *"
//                   placeholder="Describe your issue in detail"
//                   multiline
//                   minRows={4}
//                   fullWidth
//                   error={!!errors.description}
//                   helperText={errors.description?.message}
//                 />
//               )}
//             />

//             {/* Priority */}
//             <Controller
//               name="priority"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth error={!!errors.priority}>
//                   <InputLabel>Priority *</InputLabel>
//                   <Select {...field} label="Priority *">
//                     <MenuItem value="Low">Low - Not urgent</MenuItem>
//                     <MenuItem value="Medium">Medium - Normal priority</MenuItem>
//                     <MenuItem value="High">High - Urgent issue</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             {/* Department */}
//             <Controller
//               name="department"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth error={!!errors.department}>
//                   <InputLabel>Department *</InputLabel>
//                   <Select {...field} label="Department *">
//                     <MenuItem value="Support">Support - General</MenuItem>
//                     <MenuItem value="Billing">Billing - Payment issues</MenuItem>
//                     <MenuItem value="Technical">Technical - System errors</MenuItem>
//                     <MenuItem value="Sales">Sales - Product inquiries</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             {/* Related Agent */}
//             <Controller
//               name="relatedFeatureId"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Related Agent ID (Optional)"
//                   placeholder="Enter Agent ID if applicable"
//                   fullWidth
//                 />
//               )}
//             />

//             {/* Attachment */}
//             <Box
//               sx={{
//                 p: 2,
//                 border: "1px dashed",
//                 borderColor: "grey.400",
//                 borderRadius: 2,
//                 bgcolor: theme.palette.grey[50],
//               }}
//             >
//               <Typography variant="subtitle2" fontWeight={500} mb={1}>
//                 Attachment (Optional)
//               </Typography>
//               <Button
//                 variant="contained"
//                 component="label"
//                 startIcon={<AttachFileIcon />}
//                 sx={{ borderRadius: 2, textTransform: "none" }}
//                 fullWidth
//               >
//                 Upload File
//                 <input type="file" hidden onChange={handleFileChange} />
//               </Button>
//               {file && (
//                 <Box
//                   sx={{
//                     mt: 2,
//                     p: 1.5,
//                     borderRadius: 1,
//                     bgcolor: "success.light",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography variant="body2">{file.name}</Typography>
//                   <IconButton size="small" onClick={() => setFile(null)}>
//                     <CloseIcon />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </DialogContent>

//         {/* Footer */}
//         <DialogActions
//           sx={{
//             px: 4,
//             py: 2.5,
//             borderTop: "1px solid",
//             borderColor: "divider",
//             bgcolor: theme.palette.grey[50],
//           }}
//         >
//           <Button
//             variant="outlined"
//             onClick={onClose}
//             disabled={loading}
//             sx={{ borderRadius: 2, textTransform: "none" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             disabled={loading}
//             startIcon={
//               loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
//             }
//             sx={{
//               borderRadius: 2,
//               textTransform: "none",
//               minWidth: 140,
//             }}
//           >
//             {loading
//               ? "Submitting..."
//               : mode === "raise"
//               ? "Submit Ticket"
//               : mode === "resolve"
//               ? "Resolve Ticket"
//               : "Reopen Ticket"}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }

// export default function RaiseTickets() {
//   const [allTickets, setAllTickets] = useState<Ticket[]>([]);
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [searchText, setSearchText] = useState("");
//   const [status, setStatus] = useState("");
//   const [priority, setPriority] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
//   const [selectedAttachments, setSelectedAttachments] = useState<any[]>([]);
//   const userId = getUserId();
//   const theme = useTheme();

//   const getStatusChipProps = (status: string) => {
//     switch (status) {
//       case "Open":
//         return { label: status, color: "info" as const, variant: "filled" };
//       case "In Progress":
//         return { label: status, color: "warning" as const, variant: "filled" };
//       case "Resolved":
//         return { label: status, color: "success" as const, variant: "filled" };
//       case "Reopened":
//         return { label: status, color: "error" as const, variant: "filled" };
//       default:
//         return { label: status, color: "default" as const, variant: "filled" };
//     }
//   };

//   const fetchTickets = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get_tickets_by_user?userId=${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );
//       console.log('tickets',res)
//       setAllTickets(res.data.tickets);
//     } catch (err) {
//       console.error("Failed to fetch tickets", err);
//       toast.error("Failed to fetch tickets");
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [userId]);

//   useEffect(() => {
//     let filtered = allTickets;

//     if (status) {
//       filtered = filtered.filter((ticket) => ticket.status === status);
//     }

//     if (priority) {
//       filtered = filtered.filter((ticket) => ticket.priority === priority);
//     }

//     if (searchText.trim()) {
//       const text = searchText.toLowerCase();
//       filtered = filtered.filter(
//         (ticket) =>
//           ticket.ticketId.toLowerCase().includes(text) ||
//           ticket.subject.toLowerCase().includes(text)
//       );
//     }

//     setTickets(filtered);
//   }, [allTickets, status, priority, searchText]);

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setCurrentPage(0);
//   };

//   const handleClearFilters = () => {
//     setStatus("");
//     setPriority("");
//     setSearchText("");
//     setCurrentPage(0);
//   };

//   const handleViewAttachments = (attachments: any[]) => {
//     setSelectedAttachments(attachments);
//     setAttachmentModalOpen(true);
//   };

//   const emptyRows =
//     rowsPerPage - Math.min(rowsPerPage, tickets.length - currentPage * rowsPerPage);

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//         <Typography variant="h5" component="h2" fontWeight="bold">
//           Tickets
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setModalOpen(true)}
//           sx={{ backgroundColor: theme.palette.primary.main, "&:hover": { backgroundColor: theme.palette.primary.dark } }}
//         >
//           Raise New Ticket
//         </Button>
//       </Box>

//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             placeholder="Search by Ticket ID or Subject"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth size="small">
//             <InputLabel>Status</InputLabel>
//             <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value as string)}>
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="Open">Open</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Resolved">Resolved</MenuItem>
//               <MenuItem value="Closed">Closed</MenuItem>
//               <MenuItem value="Reopened">Reopened</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth size="small">
//             <InputLabel>Priority</InputLabel>
//             <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value as string)}>
//               <MenuItem value="">All</MenuItem>
//               <MenuItem value="Low">Low</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="High">High</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<ClearIcon />}
//             onClick={handleClearFilters}
//             size="small"
//           >
//             Clear Filter
//           </Button>
//         </Grid>
//       </Grid>

//       <Card>
//         <TableContainer>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Ticket ID</TableCell>
//                 <TableCell>Subject</TableCell>
//                 <TableCell>Priority</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Attachments</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Ticket Raised</TableCell>
//                 <TableCell>Last Activity</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {(rowsPerPage > 0
//                 ? tickets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
//                 : tickets
//               ).map((ticket) => (
//                 <TableRow key={ticket.ticketId} hover>
//                   <TableCell>{ticket.ticketId}</TableCell>
//                   <TableCell>{ticket.subject}</TableCell>
//                   <TableCell>
//                     <Chip label={ticket.priority} size="small" variant="outlined" />
//                   </TableCell>
//                   <TableCell>{ticket.description}</TableCell>
//                   <TableCell>{ticket.category}</TableCell>
//                   <TableCell>
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       onClick={() => handleViewAttachments(ticket.attachments)}
//                     >
//                       View Attachments
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     <Chip {...getStatusChipProps(ticket.status)} size="small" />
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(ticket.createdAt), "dd MMMM yyyy")}
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(ticket.updatedAt), "dd MMMM yyyy, HH:mm")}
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={9} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={tickets.length}
//           rowsPerPage={rowsPerPage}
//           page={currentPage}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Card>

//       <RaiseTicketModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         mode="raise"
//         pageContext="tickets-page"
//         agentId={null}
//         priority="Medium"
//         department="Support"
//         onSuccess={() => {
//           fetchTickets();
//           setModalOpen(false);
//         }}
//       />
//       <AttachmentPreviewModal
//         isOpen={attachmentModalOpen}
//         onClose={() => setAttachmentModalOpen(false)}
//         attachments={selectedAttachments}
//       />
//     </Box>
//   );
// }


// "use client";

// import { useEffect, useState, useMemo } from "react";
// import SendIcon from "@mui/icons-material/Send";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Chip,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Paper,
//   IconButton,
//   useTheme,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import ClearIcon from "@mui/icons-material/Clear";
// import DownloadIcon from "@mui/icons-material/Download";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { format } from "date-fns";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { getUserId } from "utils/auth";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
// import CloseIcon from "@mui/icons-material/Close";

// type Ticket = {
//   ticketId: string;
//   subject: string;
//   priority: string;
//   description: string;
//   category: string;
//   attachments: any[];
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type FormData = {
//   subject: string;
//   category: string;
//   description: string;
//   priority: string;
//   department: string;
//   relatedFeatureId: string;
// };

// interface Attachment {
//   filename: string;
//   url: string;
//   type: string;
// }

// interface AttachmentPreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   attachments: Attachment[] | string;
// }



// interface Attachment {
//   filename: string;
//   url: string;
//   type: string;
// }

// interface AttachmentPreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   attachments: Attachment[] | string;
// }

// function AttachmentPreviewModal({
//   isOpen,
//   onClose,
//   attachments,
// }: AttachmentPreviewModalProps) {
//   const theme = useTheme();

//   const parsedAttachments = (() => {
//     if (typeof attachments === "string") {
//       try {
//         return JSON.parse(attachments) as Attachment[];
//       } catch (e) {
//         console.error("Failed to parse attachments:", e);
//         return [];
//       }
//     }
//     return attachments || [];
//   })();

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={onClose}
//       maxWidth="xl"
//       fullWidth
//       sx={{
//         "& .MuiDialog-paper": {
//           height: "90vh",
//           borderRadius: 3,
//           overflow: "hidden",
//           backgroundColor: theme.palette.background.default,
//         },
//       }}
//     >
//       {/* Header */}
//       <DialogTitle
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           px: 3,
//           py: 2,
//           bgcolor: theme.palette.grey[50],
//         }}
//       >
//         <Typography variant="h6" fontWeight="bold">
//           Attachment Preview
//         </Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Content */}
//       <DialogContent
//         sx={{
//           p: 0,
//           height: "calc(90vh - 64px)", // subtract header height
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           bgcolor: theme.palette.grey[100],
//         }}
//       >
//         {parsedAttachments?.length === 0 ? (
//           <Typography color="text.secondary">No attachments found</Typography>
//         ) : (
//           parsedAttachments.map((file, idx) => {
//             const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
//             const isImage = file.type?.startsWith("image/");
//             const isPDF =
//               file.type?.includes("pdf") ||
//               file.filename.toLowerCase().endsWith(".pdf");

//             return (
//               <Box
//                 key={idx}
//                 sx={{
//                   width: "100%",
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 {/* ✅ PDF Preview - Full Width */}
//                 {isPDF && (
//                   <iframe
//                     src={fileUrl}
//                     title={file.filename}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       border: "none",
//                     }}
//                   />
//                 )}

//                 {/* ✅ Image Preview */}
//                 {isImage && (
//                   <img
//                     src={fileUrl}
//                     alt={file.filename}
//                     style={{
//                       maxWidth: "100%",
//                       maxHeight: "100%",
//                       objectFit: "contain",
//                       borderRadius: 8,
//                     }}
//                   />
//                 )}

//                 {/* ✅ Download Section */}
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     bottom: 16,
//                     right: 24,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     backgroundColor: "rgba(255,255,255,0.9)",
//                     borderRadius: "20px",
//                     px: 2,
//                     py: 0.5,
//                     boxShadow: 2,
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ fontSize: "0.8rem" }}
//                   >
//                     {file.filename}
//                   </Typography>
//                   <IconButton
//                     href={fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     size="small"
//                     sx={{ color: theme.palette.primary.main }}
//                   >
//                     <DownloadIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               </Box>
//             );
//           })
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }


// // Validation schema
// const schema = yup.object({
//   subject: yup.string().required("Subject is required").trim(),
//   category: yup.string().required("Category is required"),
//   description: yup.string().required("Description is required").trim(),
//   priority: yup.string().required("Priority is required"),
//   department: yup.string().required("Department is required"),
//   relatedFeatureId: yup.string().optional(),
// });

// function RaiseTicketModal({
//   isOpen,
//   onClose,
//   pageContext,
//   agentId,
//   mode = "raise",
//   ticket = null,
//   onSuccess,
//   priority = "Medium",
//   department = "Support",
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   pageContext: string;
//   agentId: string | null;
//   mode: string;
//   ticket?: any;
//   onSuccess?: () => void;
//   priority?: string;
//   department?: string;
// }) {
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const userId = getUserId(); // Use consistent getUserId from utils
//   const theme = useTheme();

//   const defaultValues = useMemo(() => {
//     const categoryMap: Record<string, string> = {
//       "Edit Agent": "Agent Editing",
//       "Create Agent": "Agent Creation",
//       "User Management": "User Management",
//       Commission: "Commission Issue",
//       "Call Forwarding": "Call Forwarding",
//       "Phone Number Assignment": "Phone Number Assignment",
//     };
//     return {
//       subject: ticket?.subject || "",
//       category: mode !== "raise" ? ticket?.category || "" : categoryMap[pageContext] || "General Inquiry",
//       description: ticket?.description || "",
//       priority: ticket?.priority || priority,
//       department: ticket?.department || department,
//       relatedFeatureId: ticket?.relatedFeatureId || "",
//     };
//   }, [mode, ticket, pageContext, priority, department]);

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: yupResolver(schema),
//     defaultValues,
//   });

//   useEffect(() => {
//     reset(defaultValues);
//     setFile(null); // Reset file on reopen
//   }, [defaultValues, reset]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = e.target.files?.[0];
//     if (!selected) return;
//     if (selected.size > 5 * 1024 * 1024) {
//       toast.error("File must be under 5MB");
//       return;
//     }
//     if (!["image/png", "image/jpeg", "application/pdf"].includes(selected.type)) {
//       toast.error("Only PNG, JPG, or PDF files allowed");
//       return;
//     }
//     setFile(selected);
//   };

//   const onSubmit = async (data: FormData) => {
//     console.log('submit hoit',data)
//     if (!userId) {
//       toast.error("User not authenticated");
//       return;
//     }
//     try {
//       setLoading(true);
//       const payload = new FormData();
//       Object.entries(data).forEach(([key, value]) => payload.append(key, String(value)));
//       payload.append("agentId", data.relatedFeatureId || "");
//       payload.append("userId", userId);
//       payload.append("pageContext", pageContext);
//       if (file) payload.append("ticketAttachments", file);

//       console.log("Submitting data:", data); // Keep for debugging
//       // Log FormData contents for debugging (can't log FormData directly, but can iterate)
//       for (let [key, value] of payload.entries()) {
//         console.log(key, value);
//       }

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/create_ticket`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );

//       toast.success(`Ticket ID: ${res?.data?.ticket?.ticketId}`);
//       reset();
//       setFile(null);
//       onSuccess?.();
//       onClose();
//     } catch (err: any) {
//       console.error("Submission error:", err);
//       toast.error(err.response?.data?.message || "Failed to submit ticket");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={(e, reason) => {
//         if (reason !== "backdropClick") onClose(); // Prevent close on backdrop click
//       }}
//       maxWidth="sm" // Increased from sm for better responsiveness
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           overflow: "hidden",
//           minHeight: "60vh", // Ensure minimum height
//         },
//       }}
//     >
//       {/* Header */}
//       <DialogTitle
//         sx={{
//           px: 3,
//           py: 2.5,
//           borderBottom: "1px solid",
//           borderColor: "divider",
//           bgcolor: theme.palette.grey[50],
//         }}
//       >
//         <Typography variant="h6" fontWeight="bold">
//           {mode === "raise"
//             ? "Raise a New Ticket"
//             : mode === "resolve"
//             ? "Resolve Ticket"
//             : "Reopen Ticket"}
//         </Typography>
//       </DialogTitle>

//       {/* Content - Made scrollable */}
//       <DialogContent
//         sx={{
//           px: 3,
//           py: 2.5,
//           maxHeight: "60vh", // Limit height to enable scroll
//           overflowY: "auto",
//           "&::-webkit-scrollbar": {
//             width: 6,
//           },
//           "&::-webkit-scrollbar-track": {
//             background: "transparent",
//           },
//           "&::-webkit-scrollbar-thumb": {
//             background: theme.palette.grey[400],
//             borderRadius: 3,
//           },
//         }}
//       >
//         <form id="raise-ticket-form">
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}> {/* Reduced gap for better fit */}
//             {/* Subject */}
//             <Controller
//               name="subject"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Subject *"
//                   placeholder="Enter a concise subject"
//                   fullWidth
//                   error={!!errors.subject}
//                   helperText={errors.subject?.message}
//                   size="small" // Smaller size for better space
//                 />
//               )}
//             />

//             {/* Category */}
//             <Controller
//               name="category"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth error={!!errors.category}>
//                   <InputLabel>Category *</InputLabel>
//                   <Select {...field} label="Category *" size="small">
//                     <MenuItem value="General Inquiry">General Inquiry</MenuItem>
//                     <MenuItem value="Agent Creation">Agent Creation</MenuItem>
//                     <MenuItem value="Agent Editing">Agent Editing</MenuItem>
//                     <MenuItem value="User Management">User Management</MenuItem>
//                     <MenuItem value="Commission Issue">Commission Issue</MenuItem>
//                     <MenuItem value="Call Forwarding">Call Forwarding</MenuItem>
//                     <MenuItem value="Phone Number Assignment">Phone Number Assignment</MenuItem>
//                     <MenuItem value="Billing Issue">Billing Issue</MenuItem>
//                     <MenuItem value="Other">Other</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             {/* Description */}
//             <Controller
//               name="description"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Description *"
//                   placeholder="Describe your issue in detail"
//                   multiline
//                   minRows={3} // Reduced rows for space
//                   fullWidth
//                   error={!!errors.description}
//                   helperText={errors.description?.message}
//                   size="small"
//                 />
//               )}
//             />

//             {/* Priority & Department - Separate rows for all screen sizes */}
//             <Controller
//               name="priority"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth error={!!errors.priority}>
//                   <InputLabel>Priority *</InputLabel>
//                   <Select {...field} label="Priority *" size="small">
//                     <MenuItem value="Low">Low - Not urgent</MenuItem>
//                     <MenuItem value="Medium">Medium - Normal priority</MenuItem>
//                     <MenuItem value="High">High - Urgent issue</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             <Controller
//               name="department"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth error={!!errors.department}>
//                   <InputLabel>Department *</InputLabel>
//                   <Select {...field} label="Department *" size="small">
//                     <MenuItem value="Support">Support - General</MenuItem>
//                     <MenuItem value="Billing">Billing - Payment issues</MenuItem>
//                     <MenuItem value="Technical">Technical - System errors</MenuItem>
//                     <MenuItem value="Sales">Sales - Product inquiries</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             {/* Related Agent */}
//             <Controller
//               name="relatedFeatureId"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Related Agent ID (Optional)"
//                   placeholder="Enter Agent ID if applicable"
//                   fullWidth
//                   size="small"
//                 />
//               )}
//             />

//             {/* Attachment */}
//             <Box
//               sx={{
//                 p: 2,
//                 border: "1px dashed",
//                 borderColor: "grey.400",
//                 borderRadius: 2,
//                 bgcolor: theme.palette.grey[50],
//               }}
//             >
//               <Typography variant="subtitle2" fontWeight={500} mb={1}>
//                 Attachment (Optional)
//               </Typography>
//               <Button
//                 variant="contained"
//                 component="label"
//                 startIcon={<AttachFileIcon />}
//                 sx={{ borderRadius: 2, textTransform: "none" }}
//                 fullWidth
//                 size="small"
//               >
//                 Upload File
//                 <input type="file" hidden onChange={handleFileChange} accept="image/png,image/jpeg,application/pdf" />
//               </Button>
//               {file && (
//                 <Box
//                   sx={{
//                     mt: 1.5,
//                     p: 1,
//                     borderRadius: 1,
//                     bgcolor: "success.light",
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Typography variant="body2" noWrap sx={{ maxWidth: "80%" }}>
//                     {file.name}
//                   </Typography>
//                   <IconButton size="small" onClick={() => setFile(null)}>
//                     <CloseIcon />
//                   </IconButton>
//                 </Box>
//               )}
//             </Box>
//           </Box>
//         </form>
//       </DialogContent>

//       {/* Footer */}
//       <DialogActions
//         sx={{
//           px: 3,
//           py: 2,
//           borderTop: "1px solid",
//           borderColor: "divider",
//           bgcolor: theme.palette.grey[50],
//           gap: 1,
//         }}
//       >
//         <Button
//           variant="outlined"
//           onClick={onClose}
//           disabled={loading}
//           sx={{ borderRadius: 2, textTransform: "none", flex: 1 }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           disabled={loading}
//           onClick={handleSubmit(onSubmit)}
//           startIcon={
//             loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
//           }
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             minWidth: 140,
//             flex: 1,
//           }}
//         >
//           {loading
//             ? "Submitting..."
//             : mode === "raise"
//             ? "Submit Ticket"
//             : mode === "resolve"
//             ? "Resolve Ticket"
//             : "Reopen Ticket"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default function RaiseTickets() {
//   const [allTickets, setAllTickets] = useState<Ticket[]>([]);
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [searchText, setSearchText] = useState("");
//   const [status, setStatus] = useState("");
//   const [priority, setPriority] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
//   const [selectedAttachments, setSelectedAttachments] = useState<any[]>([]);
//   const userId = getUserId();
//   const theme = useTheme();

//   const getStatusChipProps = (status: string) => {
//     switch (status) {
//       case "Open":
//         return { label: status, color: "info" as const, variant: "filled" };
//       case "In Progress":
//         return { label: status, color: "warning" as const, variant: "filled" };
//       case "Resolved":
//         return { label: status, color: "success" as const, variant: "filled" };
//       case "Reopened":
//         return { label: status, color: "error" as const, variant: "filled" };
//       default:
//         return { label: status, color: "default" as const, variant: "filled" };
//     }
//   };

//   const fetchTickets = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get_tickets_by_user?userId=${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );
//       console.log("Fetched tickets:", res.data.tickets);
//       setAllTickets(res.data.tickets || []);
//     } catch (err: any) {
//       console.error("Failed to fetch tickets", err);
//       toast.error(err.response?.data?.message || "Failed to fetch tickets");
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [userId]);

//   useEffect(() => {
//     let filtered = allTickets;

//     if (status) {
//       filtered = filtered.filter((ticket) => ticket.status === status);
//     }

//     if (priority) {
//       filtered = filtered.filter((ticket) => ticket.priority === priority);
//     }

//     if (searchText.trim()) {
//       const text = searchText.toLowerCase();
//       filtered = filtered.filter(
//         (ticket) =>
//           ticket.ticketId.toLowerCase().includes(text) ||
//           ticket.subject.toLowerCase().includes(text)
//       );
//     }

//     setTickets(filtered);
//   }, [allTickets, status, priority, searchText]);

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setCurrentPage(0);
//   };

//   const handleClearFilters = () => {
//     setStatus("");
//     setPriority("");
//     setSearchText("");
//     setCurrentPage(0);
//   };

//   const handleViewAttachments = (attachments: any[]) => {
//     setSelectedAttachments(attachments);
//     setAttachmentModalOpen(true);
//   };

//   const emptyRows =
//     rowsPerPage - Math.min(rowsPerPage, tickets.length - currentPage * rowsPerPage);

//   return (
//     <Box sx={{ p: 1 }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//         <Typography variant="h5" component="h2" fontWeight="bold">
//           Tickets
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => setModalOpen(true)}
//           sx={{ backgroundColor: theme.palette.primary.main, "&:hover": { backgroundColor: theme.palette.primary.dark } }}
//         >
//           Raise New Ticket
//         </Button>
//       </Box>
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         <Grid item xs={12} sm={6} md={3} >
//           <TextField fullWidth placeholder="Search by Ticket ID or Subject" value={searchText} onChange={(e) => setSearchText(e.target.value)} size="small" />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
//             <InputLabel id="status-filter">Status</InputLabel>
//             <Select labelId="status-filter" value={status} label="Status" onChange={(e) => setStatus(e.target.value as string)}  renderValue={(selected) => selected || <em>All</em>}>
//               <MenuItem value=""><em>All</em></MenuItem>
//               <MenuItem value="Open">Open</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Resolved">Resolved</MenuItem>
//               <MenuItem value="Closed">Closed</MenuItem>
//               <MenuItem value="Reopened">Reopened</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
//             <InputLabel id="priority-filter">Priority</InputLabel>
//             <Select labelId="priority-filter" value={priority} label="Priority" onChange={(e) => setPriority(e.target.value as string)}  renderValue={(selected) => selected || <em>All</em>}>
//               <MenuItem value=""><em>All</em></MenuItem>
//               <MenuItem value="Low">Low</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="High">High</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Button fullWidth variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters} size="small">
//             Clear Filter
//           </Button>
//         </Grid>
//       </Grid>

//       <Card>
//         <TableContainer sx={{ maxHeight: 600 }}> {/* Added maxHeight for scrollable table if needed */}
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Ticket ID</TableCell>
//                 <TableCell>Subject</TableCell>
//                 <TableCell>Priority</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Attachments</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Ticket Raised</TableCell>
//                 <TableCell>Last Activity</TableCell>
//                 <TableCell>	Resolution Note</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//             { tickets.length === 0 ? (
//             <TableRow>
//             <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
//             <Typography variant="h6" color="text.secondary">
//             No tickets found
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//             Raise your first ticket using the button above.
//             </Typography>
//             </Box>
//             </TableCell>
//             </TableRow>
//             ) : (
//             <>
//               {(rowsPerPage > 0
//                 ? tickets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
//                 : tickets
//               ).map((ticket) => (
//                 <TableRow key={ticket.ticketId} hover>
//                   <TableCell>{ticket.ticketId}</TableCell>
//                   <TableCell>{ticket.subject}</TableCell>
//                   <TableCell>
//                     <Chip label={ticket.priority} size="small" variant="outlined" />
//                   </TableCell>
//                   <TableCell>{ticket.description}</TableCell>
//                   <TableCell>{ticket.category}</TableCell>
//                   <TableCell>
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       onClick={() => handleViewAttachments(ticket.attachments)}
//                     >
//                       View Attachments
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     <Chip {...getStatusChipProps(ticket.status)} size="small" />
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(ticket.createdAt), "dd MMMM yyyy")}
//                   </TableCell>
//                   <TableCell>
//                     {format(new Date(ticket.updatedAt), "dd MMMM yyyy, HH:mm")}
//                   </TableCell>
//                 </TableRow>
//               ))}
//               </>
//               )
//             }
//               {/* {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={9} />
//                 </TableRow>
//               )} */}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={tickets.length}
//           rowsPerPage={rowsPerPage}
//           page={currentPage}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Card>

//       <RaiseTicketModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         mode="raise"
//         pageContext="tickets-page"
//         agentId={null}
//         priority="Medium"
//         department="Support"
//         onSuccess={() => {
//           fetchTickets();
//           setModalOpen(false);
//         }}
//       />
//       <AttachmentPreviewModal
//         isOpen={attachmentModalOpen}
//         onClose={() => setAttachmentModalOpen(false)}
//         attachments={selectedAttachments}
//       />
//     </Box>
//   );
// }

// 'use client';
// import { useEffect, useState, useMemo } from 'react';
// import SendIcon from '@mui/icons-material/Send';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Chip,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress,
//   Paper,
//   IconButton,
//   useTheme,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import ClearIcon from '@mui/icons-material/Clear';
// import DownloadIcon from '@mui/icons-material/Download';
// import FormHelperText from '@mui/material/FormHelperText';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Stack from '@mui/material/Stack';
// import { Formik } from 'formik';
// import * as yup from 'yup';
// import { format } from 'date-fns';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { getUserId } from 'utils/auth';
// import CloseIcon from '@mui/icons-material/Close';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';
// import MainCard from 'components/MainCard';
// import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
// import { APP_DEFAULT_PATH } from 'config';
// import ReactQuillDemo from 'components/third-party/ReactQuill';

// type Ticket = {
//   ticketId: string;
//   subject: string;
//   priority: string;
//   description: string;
//   category: string;
//   attachments: any[];
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// };

// type FormData = {
//   subject: string;
//   category: string;
//   description: string;
//   priority: string;
//   department: string;
//   relatedFeatureId: string;
//   files: File[] | null;
// };

// interface Attachment {
//   filename: string;
//   url: string;
//   type: string;
// }

// interface AttachmentPreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   attachments: Attachment[] | string;
// }

// function AttachmentPreviewModal({
//   isOpen,
//   onClose,
//   attachments,
// }: AttachmentPreviewModalProps) {
//   const theme = useTheme();

//   const parsedAttachments = (() => {
//     if (typeof attachments === 'string') {
//       try {
//         return JSON.parse(attachments) as Attachment[];
//       } catch (e) {
//         console.error('Failed to parse attachments:', e);
//         return [];
//       }
//     }
//     return attachments || [];
//   })();

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={onClose}
//       maxWidth="xl"
//       fullWidth
//       sx={{
//         '& .MuiDialog-paper': {
//           height: '90vh',
//           borderRadius: 3,
//           overflow: 'hidden',
//           backgroundColor: theme.palette.background.default,
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           borderBottom: '1px solid',
//           borderColor: 'divider',
//           px: 3,
//           py: 2,
//           bgcolor: theme.palette.grey[50],
//         }}
//       >
//         <Typography variant="h6" fontWeight="bold">
//           Attachment Preview
//         </Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent
//         sx={{
//           p: 0,
//           height: 'calc(90vh - 64px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           bgcolor: theme.palette.grey[100],
//         }}
//       >
//         {parsedAttachments?.length === 0 ? (
//           <Typography color="text.secondary">No attachments found</Typography>
//         ) : (
//           parsedAttachments.map((file, idx) => {
//             const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
//             const isImage = file.type?.startsWith('image/');
//             const isPDF =
//               file.type?.includes('pdf') ||
//               file.filename.toLowerCase().endsWith('.pdf');

//             return (
//               <Box
//                 key={idx}
//                 sx={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 {isPDF && (
//                   <iframe
//                     src={fileUrl}
//                     title={file.filename}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       border: 'none',
//                     }}
//                   />
//                 )}
//                 {isImage && (
//                   <img
//                     src={fileUrl}
//                     alt={file.filename}
//                     style={{
//                       maxWidth: '100%',
//                       maxHeight: '100%',
//                       objectFit: 'contain',
//                       borderRadius: 8,
//                     }}
//                   />
//                 )}
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     bottom: 16,
//                     right: 24,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                     backgroundColor: 'rgba(255,255,255,0.9)',
//                     borderRadius: '20px',
//                     px: 2,
//                     py: 0.5,
//                     boxShadow: 2,
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ fontSize: '0.8rem' }}
//                   >
//                     {file.filename}
//                   </Typography>
//                   <IconButton
//                     href={fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     size="small"
//                     sx={{ color: theme.palette.primary.main }}
//                   >
//                     <DownloadIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               </Box>
//             );
//           })
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// const schema = yup.object({
//   subject: yup.string().required('Subject is required').trim(),
//   category: yup.string().required('Category is required'),
//   description: yup.string().required('Description is required').trim(),
//   priority: yup.string().required('Priority is required'),
//   department: yup.string().required('Department is required'),
//   relatedFeatureId: yup.string().optional(),
//   files: yup.mixed().nullable(),
// });

// function RaiseTicket({
//   pageContext,
//   agentId,
//   mode = 'raise',
//   ticket = null,
//   onSuccess,
//   priority = 'Medium',
//   department = 'Support',
// }: {
//   pageContext: string;
//   agentId: string | null;
//   mode?: string;
//   ticket?: any;
//   onSuccess?: () => void;
//   priority?: string;
//   department?: string;
// }) {
//   const userId = getUserId();
//   const theme = useTheme();

//   const defaultValues = useMemo(() => {
//     const categoryMap: Record<string, string> = {
//       'Edit Agent': 'Agent Editing',
//       'Create Agent': 'Agent Creation',
//       'User Management': 'User Management',
//       Commission: 'Commission Issue',
//       'Call Forwarding': 'Call Forwarding',
//       'Phone Number Assignment': 'Phone Number Assignment',
//     };
//     return {
//       subject: ticket?.subject || '',
//       category: mode !== 'raise' ? ticket?.category || '' : categoryMap[pageContext] || 'General Inquiry',
//       description: ticket?.description || '',
//       priority: ticket?.priority || priority,
//       department: ticket?.department || department,
//       relatedFeatureId: ticket?.relatedFeatureId || '',
//       files: null,
//     };
//   }, [mode, ticket, pageContext, priority, department]);

//   const breadcrumbLinks = [
//     { title: 'home', to: APP_DEFAULT_PATH },
//     { title: 'helpdesk', to: '/admin-panel/helpdesk/dashboard' },
//     { title: 'create ticket' },
//   ];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Breadcrumbs custom heading="Create Ticket" links={breadcrumbLinks} />
//       <MainCard>
//         <Formik
//           initialValues={defaultValues}
//           validationSchema={schema}
//           onSubmit={async (values, { setSubmitting, resetForm }) => {
//             if (!userId) {
//               toast.error('User not authenticated');
//               return;
//             }
//             try {
//               setSubmitting(true);
//               const payload = new FormData();
//               Object.entries(values).forEach(([key, value]) => {
//                 if (key !== 'files') payload.append(key, String(value));
//               });
//               payload.append('agentId', values.relatedFeatureId || '');
//               payload.append('userId', userId);
//               payload.append('pageContext', pageContext);
//               if (values.files) {
//                 values.files.forEach((file: File) => {
//                   if (file.size > 5 * 1024 * 1024) {
//                     toast.error(`${file.name} must be under 5MB`);
//                     return;
//                   }
//                   if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) {
//                     toast.error(`${file.name} must be PNG, JPG, or PDF`);
//                     return;
//                   }
//                   payload.append('ticketAttachments', file);
//                 });
//               }

//               const res = await axios.post(
//                 `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/create_ticket`,
//                 payload,
//                 {
//                   headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//                   },
//                 }
//               );

//               toast.success(`Ticket ID: ${res?.data?.ticket?.ticketId}`);
//               resetForm();
//               onSuccess?.();
//             } catch (err: any) {
//               console.error('Submission error:', err);
//               toast.error(err.response?.data?.message || 'Failed to submit ticket');
//             } finally {
//               setSubmitting(false);
//             }
//           }}
//         >
//           {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting }) => (
//             <form onSubmit={handleSubmit}>
//               <Grid container rowSpacing={2} columnSpacing={2.5}>
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Stack sx={{ gap: 1 }}>
//                     <InputLabel>Category</InputLabel>
//                     <Select
//                       id="category"
//                       value={values.category}
//                       onChange={(e) => setFieldValue('category', e.target.value)}
//                       input={<OutlinedInput />}
//                       error={touched.category && !!errors.category}
//                       displayEmpty
//                     >
//                       <MenuItem disabled value="" sx={{ color: 'text.secondary' }}>
//                         Select Category
//                       </MenuItem>
//                       <MenuItem value="General Inquiry">General Inquiry</MenuItem>
//                       <MenuItem value="Agent Creation">Agent Creation</MenuItem>
//                       <MenuItem value="Agent Editing">Agent Editing</MenuItem>
//                       <MenuItem value="User Management">User Management</MenuItem>
//                       <MenuItem value="Commission Issue">Commission Issue</MenuItem>
//                       <MenuItem value="Call Forwarding">Call Forwarding</MenuItem>
//                       <MenuItem value="Phone Number Assignment">Phone Number Assignment</MenuItem>
//                       <MenuItem value="Billing Issue">Billing Issue</MenuItem>
//                       <MenuItem value="Other">Other</MenuItem>
//                     </Select>
//                     {touched.category && errors.category && (
//                       <FormHelperText error>{errors.category}</FormHelperText>
//                     )}
//                   </Stack>
//                 </Grid>
//                 {/* <Grid size={{ xs: 12, sm: 6 }}>
//                   <Stack sx={{ gap: 1 }}>
//                     <InputLabel>Priority</InputLabel>
//                     <Select
//                       id="priority"
//                       value={values.priority}
//                       onChange={(e) => setFieldValue('priority', e.target.value)}
//                       input={<OutlinedInput />}
//                       error={touched.priority && !!errors.priority}
//                       displayEmpty
//                     >
//                       <MenuItem disabled value="" sx={{ color: 'text.secondary' }}>
//                         Select Priority
//                       </MenuItem>
//                       <MenuItem value="Low">Low - Not urgent</MenuItem>
//                       <MenuItem value="Medium">Medium - Normal priority</MenuItem>
//                       <MenuItem value="High">High - Urgent issue</MenuItem>
//                     </Select>
//                     {touched.priority && errors.priority && (
//                       <FormHelperText error>{errors.priority}</FormHelperText>
//                     )}
//                   </Stack>
//                 </Grid> */}
//                 <Grid size={{ xs: 12, sm: 6 }}>
//                   <Stack sx={{ gap: 1 }}>
//                     <InputLabel>Department</InputLabel>
//                     <Select
//                       id="department"
//                       value={values.department}
//                       onChange={(e) => setFieldValue('department', e.target.value)}
//                       input={<OutlinedInput />}
//                       error={touched.department && !!errors.department}
//                       displayEmpty
//                     >
//                       <MenuItem disabled value="" sx={{ color: 'text.secondary' }}>
//                         Select Department
//                       </MenuItem>
//                       <MenuItem value="Support">Support - General</MenuItem>
//                       <MenuItem value="Billing">Billing - Payment issues</MenuItem>
//                       <MenuItem value="Technical">Technical - System errors</MenuItem>
//                       <MenuItem value="Sales">Sales - Product inquiries</MenuItem>
//                     </Select>
//                     {touched.department && errors.department && (
//                       <FormHelperText error>{errors.department}</FormHelperText>
//                     )}
//                   </Stack>
//                 </Grid>
//                 {/* <Grid size={{ xs: 12, sm: 6 }}>
//                   <Stack sx={{ gap: 1 }}>
//                     <InputLabel>Related Agent ID (Optional)</InputLabel>
//                     <TextField
//                       fullWidth
//                       id="relatedFeatureId"
//                       placeholder="Enter Agent ID if applicable"
//                       value={values.relatedFeatureId}
//                       onChange={(e) => setFieldValue('relatedFeatureId', e.target.value)}
//                       error={touched.relatedFeatureId && !!errors.relatedFeatureId}
//                       helperText={touched.relatedFeatureId && errors.relatedFeatureId}
//                     />
//                   </Stack>
//                 </Grid> */}
//                 <Grid size={12}>
//                   <Stack sx={{ gap: 1 }}>
//                     <InputLabel>Subject</InputLabel>
//                     <TextField
//                       fullWidth
//                       id="subject"
//                       placeholder="Enter Subject"
//                       value={values.subject}
//                       onChange={(e) => setFieldValue('subject', e.target.value)}
//                       error={touched.subject && !!errors.subject}
//                       helperText={touched.subject && errors.subject}
//                     />
//                   </Stack>
//                 </Grid>
//                 <Grid size={12}>
//                   <Stack sx={{ gap: 1 }}>
//                     <InputLabel>Description</InputLabel>
//                     <ReactQuillDemo
//                       value={values.description}
//                       onChange={(value) => setFieldValue('description', value)}
//                     />
//                     {touched.description && errors.description && (
//                       <FormHelperText error>{errors.description}</FormHelperText>
//                     )}
//                   </Stack>
//                 </Grid>
//                 <Grid size={12}>
//                   <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
//                     <InputLabel>Attachments (Optional)</InputLabel>
//                     <UploadMultiFile
//                       setFieldValue={setFieldValue}
//                       files={values.files}
//                       error={touched.files && !!errors.files}
//                     />
//                     {touched.files && errors.files && (
//                       <FormHelperText error>{errors.files as string}</FormHelperText>
//                     )}
//                   </Stack>
//                 </Grid>
//               </Grid>
//               <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
//                 <Button
//                   color="secondary"
//                   variant="outlined"
//                   onClick={() => setFieldValue('files', null)}
//                 >
//                   Clear
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={isSubmitting}
//                   startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
//                 </Button>
//               </Stack>
//             </form>
//           )}
//         </Formik>
//       </MainCard>
//     </Box>
//   );
// }

// export default function RaiseTickets() {
//   const [allTickets, setAllTickets] = useState<Ticket[]>([]);
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [status, setStatus] = useState('');
//   const [priority, setPriority] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
//   const [selectedAttachments, setSelectedAttachments] = useState<any[]>([]);
//   const [showRaiseTicket, setShowRaiseTicket] = useState(false);
//   const userId = getUserId();
//   const theme = useTheme();

//   const getStatusChipProps = (status: string) => {
//     switch (status) {
//       case 'Open':
//         return { label: status, color: 'info' as const, variant: 'filled' };
//       case 'In Progress':
//         return { label: status, color: 'warning' as const, variant: 'filled' };
//       case 'Resolved':
//         return { label: status, color: 'success' as const, variant: 'filled' };
//       case 'Reopened':
//         return { label: status, color: 'error' as const, variant: 'filled' };
//       default:
//         return { label: status, color: 'default' as const, variant: 'filled' };
//     }
//   };

//   const fetchTickets = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get_tickets_by_user?userId=${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           },
//         }
//       );
//       console.log('Fetched tickets:', res.data.tickets);
//       setAllTickets(res.data.tickets || []);
//     } catch (err: any) {
//       console.error('Failed to fetch tickets', err);
//       toast.error(err.response?.data?.message || 'Failed to fetch tickets');
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [userId]);

//   useEffect(() => {
//     let filtered = allTickets;

//     if (status) {
//       filtered = filtered.filter((ticket) => ticket.status === status);
//     }

//     if (priority) {
//       filtered = filtered.filter((ticket) => ticket.priority === priority);
//     }

//     if (searchText.trim()) {
//       const text = searchText.toLowerCase();
//       filtered = filtered.filter(
//         (ticket) =>
//           ticket.ticketId.toLowerCase().includes(text) ||
//           ticket.subject.toLowerCase().includes(text)
//       );
//     }

//     setTickets(filtered);
//   }, [allTickets, status, priority, searchText]);

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setCurrentPage(0);
//   };

//   const handleClearFilters = () => {
//     setStatus('');
//     setPriority('');
//     setSearchText('');
//     setCurrentPage(0);
//   };

//   const handleViewAttachments = (attachments: any[]) => {
//     setSelectedAttachments(attachments);
//     setAttachmentModalOpen(true);
//   };

//   return (
//     <Box sx={{ p: 1 }}>
//       {showRaiseTicket ? (
//         <RaiseTicket
//           pageContext="tickets-page"
//           agentId={null}
//           mode="raise"
//           priority="Medium"
//           department="Support"
//           onSuccess={() => {
//             fetchTickets();
//             setShowRaiseTicket(false);
//           }}
//         />
//       ) : (
//         <>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h5" component="h2" fontWeight="bold">
//               Tickets
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={() => setShowRaiseTicket(true)}
//               sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark } }}
//             >
//               Raise New Ticket
//             </Button>
//           </Box>
//           <Grid container spacing={2} sx={{ mb: 2 }}>
//             <Grid item xs={12} sm={6} md={3}>
//               <TextField
//                 fullWidth
//                 placeholder="Search by Ticket ID or Subject"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 size="small"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
//                 <InputLabel id="status-filter">Status</InputLabel>
//                 <Select
//                   labelId="status-filter"
//                   value={status}
//                   label="Status"
//                   onChange={(e) => setStatus(e.target.value as string)}
//                   renderValue={(selected) => selected || <em>All</em>}
//                 >
//                   <MenuItem value=""><em>All</em></MenuItem>
//                   <MenuItem value="Open">Open</MenuItem>
//                   <MenuItem value="In Progress">In Progress</MenuItem>
//                   <MenuItem value="Resolved">Resolved</MenuItem>
//                   <MenuItem value="Closed">Closed</MenuItem>
//                   <MenuItem value="Reopened">Reopened</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
//                 <InputLabel id="priority-filter">Priority</InputLabel>
//                 <Select
//                   labelId="priority-filter"
//                   value={priority}
//                   label="Priority"
//                   onChange={(e) => setPriority(e.target.value as string)}
//                   renderValue={(selected) => selected || <em>All</em>}
//                 >
//                   <MenuItem value=""><em>All</em></MenuItem>
//                   <MenuItem value="Low">Low</MenuItem>
//                   <MenuItem value="Medium">Medium</MenuItem>
//                   <MenuItem value="High">High</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 startIcon={<ClearIcon />}
//                 onClick={handleClearFilters}
//                 size="small"
//               >
//                 Clear Filter
//               </Button>
//             </Grid>
//           </Grid>
//           <Card>
//             <TableContainer sx={{ maxHeight: 600 }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Ticket ID</TableCell>
//                     <TableCell>Subject</TableCell>
//                     <TableCell>Priority</TableCell>
//                     <TableCell>Description</TableCell>
//                     <TableCell>Category</TableCell>
//                     <TableCell>Attachments</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Ticket Raised</TableCell>
//                     <TableCell>Last Activity</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {tickets.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//                           <Typography variant="h6" color="text.secondary">
//                             No tickets found
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             Raise your first ticket using the button above.
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     (rowsPerPage > 0
//                       ? tickets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
//                       : tickets
//                     ).map((ticket) => (
//                       <TableRow key={ticket.ticketId} hover>
//                         <TableCell>{ticket.ticketId}</TableCell>
//                         <TableCell>{ticket.subject}</TableCell>
//                         <TableCell>
//                           <Chip label={ticket.priority} size="small" variant="outlined" />
//                         </TableCell>
//                         <TableCell>{ticket.description}</TableCell>
//                         <TableCell>{ticket.category}</TableCell>
//                         <TableCell>
//                           <Button
//                             size="small"
//                             variant="outlined"
//                             onClick={() => handleViewAttachments(ticket.attachments)}
//                           >
//                             View Attachments
//                           </Button>
//                         </TableCell>
//                         <TableCell>
//                           <Chip {...getStatusChipProps(ticket.status)} size="small" />
//                         </TableCell>
//                         <TableCell>
//                           {format(new Date(ticket.createdAt), 'dd MMMM yyyy')}
//                         </TableCell>
//                         <TableCell>
//                           {format(new Date(ticket.updatedAt), 'dd MMMM yyyy, HH:mm')}
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={tickets.length}
//               rowsPerPage={rowsPerPage}
//               page={currentPage}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </Card>
//           <AttachmentPreviewModal
//             isOpen={attachmentModalOpen}
//             onClose={() => setAttachmentModalOpen(false)}
//             attachments={selectedAttachments}
//           />
//         </>
//       )}
//     </Box>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Chip,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   useTheme,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import ClearIcon from '@mui/icons-material/Clear';
// import DownloadIcon from '@mui/icons-material/Download';
// import CloseIcon from '@mui/icons-material/Close';
// import { format } from 'date-fns';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { getUserId } from 'utils/auth';

// type Ticket = {
//   ticketId: string;
//   subject: string;
//   priority: string;
//   description: string;
//   category: string;
//   attachments: any[];
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// };

// interface Attachment {
//   filename: string;
//   url: string;
//   type: string;
// }

// interface AttachmentPreviewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   attachments: Attachment[] | string;
// }

// function AttachmentPreviewModal({
//   isOpen,
//   onClose,
//   attachments,
// }: AttachmentPreviewModalProps) {
//   const theme = useTheme();

//   const parsedAttachments = (() => {
//     if (typeof attachments === 'string') {
//       try {
//         return JSON.parse(attachments) as Attachment[];
//       } catch (e) {
//         console.error('Failed to parse attachments:', e);
//         return [];
//       }
//     }
//     return attachments || [];
//   })();

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={onClose}
//       maxWidth="xl"
//       fullWidth
//       sx={{
//         '& .MuiDialog-paper': {
//           height: '90vh',
//           borderRadius: 3,
//           overflow: 'hidden',
//           backgroundColor: theme.palette.background.default,
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           borderBottom: '1px solid',
//           borderColor: 'divider',
//           px: 3,
//           py: 2,
//           bgcolor: theme.palette.grey[50],
//         }}
//       >
//         <Typography variant="h6" fontWeight="bold">
//           Attachment Preview
//         </Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent
//         sx={{
//           p: 0,
//           height: 'calc(90vh - 64px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           bgcolor: theme.palette.grey[100],
//         }}
//       >
//         {parsedAttachments?.length === 0 ? (
//           <Typography color="text.secondary">No attachments found</Typography>
//         ) : (
//           parsedAttachments.map((file, idx) => {
//             const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${file.url}`;
//             const isImage = file.type?.startsWith('image/');
//             const isPDF =
//               file.type?.includes('pdf') ||
//               file.filename.toLowerCase().endsWith('.pdf');

//             return (
//               <Box
//                 key={idx}
//                 sx={{
//                   width: '100%',
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 {isPDF && (
//                   <iframe
//                     src={fileUrl}
//                     title={file.filename}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       border: 'none',
//                     }}
//                   />
//                 )}
//                 {isImage && (
//                   <img
//                     src={fileUrl}
//                     alt={file.filename}
//                     style={{
//                       maxWidth: '100%',
//                       maxHeight: '100%',
//                       objectFit: 'contain',
//                       borderRadius: 8,
//                     }}
//                   />
//                 )}
//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     bottom: 16,
//                     right: 24,
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1,
//                     backgroundColor: 'rgba(255,255,255,0.9)',
//                     borderRadius: '20px',
//                     px: 2,
//                     py: 0.5,
//                     boxShadow: 2,
//                   }}
//                 >
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{ fontSize: '0.8rem' }}
//                   >
//                     {file.filename}
//                   </Typography>
//                   <IconButton
//                     href={fileUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     size="small"
//                     sx={{ color: theme.palette.primary.main }}
//                   >
//                     <DownloadIcon fontSize="small" />
//                   </IconButton>
//                 </Box>
//               </Box>
//             );
//           })
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default function RaiseTickets() {
//   const [allTickets, setAllTickets] = useState<Ticket[]>([]);
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [status, setStatus] = useState('');
//   const [priority, setPriority] = useState('');
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(25);
//   const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
//   const [selectedAttachments, setSelectedAttachments] = useState<any[]>([]);
//   const userId = getUserId();
//   const theme = useTheme();
//   const router = useRouter();

//   const getStatusChipProps = (status: string) => {
//     switch (status) {
//       case 'Open':
//         return { label: status, color: 'info' as const, variant: 'filled' };
//       case 'In Progress':
//         return { label: status, color: 'warning' as const, variant: 'filled' };
//       case 'Resolved':
//         return { label: status, color: 'success' as const, variant: 'filled' };
//       case 'Reopened':
//         return { label: status, color: 'error' as const, variant: 'filled' };
//       default:
//         return { label: status, color: 'default' as const, variant: 'filled' };
//     }
//   };

//   const fetchTickets = async () => {
//     if (!userId) return;
//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get_tickets_by_user?userId=${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           },
//         }
//       );
//       console.log('Fetched tickets:', res.data.tickets);
//       setAllTickets(res.data.tickets || []);
//     } catch (err: any) {
//       console.error('Failed to fetch tickets', err);
//       toast.error(err.response?.data?.message || 'Failed to fetch tickets');
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [userId]);

//   useEffect(() => {
//     let filtered = allTickets;

//     if (status) {
//       filtered = filtered.filter((ticket) => ticket.status === status);
//     }

//     if (priority) {
//       filtered = filtered.filter((ticket) => ticket.priority === priority);
//     }

//     if (searchText.trim()) {
//       const text = searchText.toLowerCase();
//       filtered = filtered.filter(
//         (ticket) =>
//           ticket.ticketId.toLowerCase().includes(text) ||
//           ticket.subject.toLowerCase().includes(text)
//       );
//     }

//     setTickets(filtered);
//   }, [allTickets, status, priority, searchText]);

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setCurrentPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setCurrentPage(0);
//   };

//   const handleClearFilters = () => {
//     setStatus('');
//     setPriority('');
//     setSearchText('');
//     setCurrentPage(0);
//   };

//   const handleViewAttachments = (attachments: any[]) => {
//     setSelectedAttachments(attachments);
//     setAttachmentModalOpen(true);
//   };

//   return (
//     <Box sx={{ p: 1 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h5" component="h2" fontWeight="bold">
//           Tickets
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={() => router.push('/mointor/tickets/create')}
//           sx={{ backgroundColor: theme.palette.primary.main, '&:hover': { backgroundColor: theme.palette.primary.dark } }}
//         >
//           Create New Ticket
//         </Button>
//       </Box>
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             placeholder="Search by Ticket ID or Subject"
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
//             <InputLabel id="status-filter">Status</InputLabel>
//             <Select
//               labelId="status-filter"
//               value={status}
//               label="Status"
//               onChange={(e) => setStatus(e.target.value as string)}
//               renderValue={(selected) => selected || <em>All</em>}
//             >
//               <MenuItem value=""><em>All</em></MenuItem>
//               <MenuItem value="Open">Open</MenuItem>
//               <MenuItem value="In Progress">In Progress</MenuItem>
//               <MenuItem value="Resolved">Resolved</MenuItem>
//               <MenuItem value="Closed">Closed</MenuItem>
//               <MenuItem value="Reopened">Reopened</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
//             <InputLabel id="priority-filter">Priority</InputLabel>
//             <Select
//               labelId="priority-filter"
//               value={priority}
//               label="Priority"
//               onChange={(e) => setPriority(e.target.value as string)}
//               renderValue={(selected) => selected || <em>All</em>}
//             >
//               <MenuItem value=""><em>All</em></MenuItem>
//               <MenuItem value="Low">Low</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="High">High</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Button
//             fullWidth
//             variant="outlined"
//             startIcon={<ClearIcon />}
//             onClick={handleClearFilters}
//             size="small"
//           >
//             Clear Filter
//           </Button>
//         </Grid>
//       </Grid>
//       <Card>
//         <TableContainer sx={{ maxHeight: 600 }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Ticket ID</TableCell>
//                 <TableCell>Subject</TableCell>
//                 <TableCell>Priority</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Attachments</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Ticket Raised</TableCell>
//                 <TableCell>Last Activity</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tickets.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//                       <Typography variant="h6" color="text.secondary">
//                         No tickets found
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Raise your first ticket using the button above.
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 (rowsPerPage > 0
//                   ? tickets.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
//                   : tickets
//                 ).map((ticket) => (
//                   <TableRow key={ticket.ticketId} hover>
//                     <TableCell>{ticket.ticketId}</TableCell>
//                     <TableCell>{ticket.subject}</TableCell>
//                     <TableCell>
//                       <Chip label={ticket.priority} size="small" variant="outlined" />
//                     </TableCell>
//                     <TableCell>{ticket.description}</TableCell>
//                     <TableCell>{ticket.category}</TableCell>
//                     <TableCell>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         onClick={() => handleViewAttachments(ticket.attachments)}
//                       >
//                         View Attachments
//                       </Button>
//                     </TableCell>
//                     <TableCell>
//                       <Chip {...getStatusChipProps(ticket.status)} size="small" />
//                     </TableCell>
//                     <TableCell>
//                       {format(new Date(ticket.createdAt), 'dd MMMM yyyy')}
//                     </TableCell>
//                     <TableCell>
//                       {format(new Date(ticket.updatedAt), 'dd MMMM yyyy, HH:mm')}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={tickets.length}
//           rowsPerPage={rowsPerPage}
//           page={currentPage}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Card>
//       <AttachmentPreviewModal
//         isOpen={attachmentModalOpen}
//         onClose={() => setAttachmentModalOpen(false)}
//         attachments={selectedAttachments}
//       />
//     </Box>
//   );
// }

'use client';

import { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { Element3, HambergerMenu, TextalignJustifycenter } from '@wandersonalwes/iconsax-react';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserId } from 'utils/auth';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import TicketCommonCard from 'components/cards/helpdesk/TicketCommonCard';
import TicketNotificationsCard from 'components/cards/helpdesk/TicketNotificationsCard';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import { ticketNotificationsData } from 'data/helpdesk';
import TicketDetailsDrawer from './tickets/TicketDetailsDrawer';

type Ticket = {
  ticketId: string;
  subject: string;
  priority: string;
  description: string;
  category: string;
  attachments: any[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function RaiseTickets() {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [alignment, setAlignment] = useState<number | null>(1);
  const [showBox, setShowBox] = useState(true);
  const [showAvatarStack, setShowAvatarStack] = useState(true);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const userId = getUserId();
  const router = useRouter();

  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'helpdesk', to: '/mointor/tickets' },
    { title: 'ticket list' },
  ];

  const getStatusChipProps = (status: string) => {
    switch (status) {
      case 'Open':
        return { label: status, color: 'info' as const, variant: 'filled' };
      case 'In Progress':
        return { label: status, color: 'warning' as const, variant: 'filled' };
      case 'Resolved':
        return { label: status, color: 'success' as const, variant: 'filled' };
      case 'Reopened':
        return { label: status, color: 'error' as const, variant: 'filled' };
      default:
        return { label: status, color: 'default' as const, variant: 'filled' };
    }
  };

  const getBorderProps = (priority: string) => {
    switch (priority) {
      case 'High':
        return { borderLeft: true, borderColor: 'error.main' };
      case 'Medium':
        return { borderLeft: true, borderColor: 'warning.main' };
      case 'Low':
        return { borderLeft: true, borderColor: 'success.main' };
      default:
        return { borderLeft: false, borderColor: '' };
    }
  };

  const fetchTickets = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/get_tickets_by_user?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      console.log('Fetched tickets:', res.data.tickets);
      setAllTickets(res.data.tickets || []);
    } catch (err: any) {
      console.error('Failed to fetch tickets:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch tickets');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  useEffect(() => {
    let filtered = allTickets;

    if (status) {
      filtered = filtered.filter((ticket) => ticket.status === status);
    }

    if (priority) {
      filtered = filtered.filter((ticket) => ticket.priority === priority);
    }

    if (searchText.trim()) {
      const text = searchText.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticketId.toLowerCase().includes(text) ||
          ticket.subject.toLowerCase().includes(text)
      );
    }

    setTickets(filtered);
  }, [allTickets, status, priority, searchText]);

  const handleAlignment = (event: MouseEvent<HTMLElement>, newAlignment: number | null) => {
    setAlignment(newAlignment);
    if (newAlignment === 1) {
      setShowBox(true);
      setShowAvatarStack(true);
    } else if (newAlignment === 2) {
      setShowBox(false);
      setShowAvatarStack(false);
    } else if (newAlignment === 3) {
      setShowBox(false);
      setShowAvatarStack(true);
    }
  };

  const handleDrawerOpen = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setOpenDrawer(true);
  };

  const handleClearFilters = () => {
    setStatus('');
    setPriority('');
    setSearchText('');
  };

  console.log('tickets',tickets)
  return (
    <Box sx={{ p: 3 }}>
      {/* <Breadcrumbs custom heading="Ticket List" links={breadcrumbLinks} /> */}
      <Grid container spacing={GRID_COMMON_SPACING}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Stack sx={{ gap: GRID_COMMON_SPACING }}>
            <MainCard>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Ticket List</Typography>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                  <ToggleButtonGroup
                    value={alignment}
                    sx={{ '& .MuiToggleButton-root': { p: 0.625 } }}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="view mode"
                  >
                    <ToggleButton value={2} aria-label="small list view">
                      <TextalignJustifycenter />
                    </ToggleButton>
                    <ToggleButton value={3} aria-label="medium list view">
                      <HambergerMenu />
                    </ToggleButton>
                    <ToggleButton value={1} aria-label="details view">
                      <Element3 />
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/mointor/tickets/create')}
                  >
                    Create New Ticket
                  </Button>
                </Stack>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by Ticket ID or Subject"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="status-filter">Status</InputLabel>
                    <Select
                      labelId="status-filter"
                      value={status}
                      label="Status"
                      onChange={(e) => setStatus(e.target.value as string)}
                      renderValue={(selected) => selected || <em>All</em>}
                    >
                      <MenuItem value=""><em>All</em></MenuItem>
                      <MenuItem value="Open">Open</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Resolved">Resolved</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                      <MenuItem value="Reopened">Reopened</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="priority-filter">Priority</InputLabel>
                    <Select
                      labelId="priority-filter"
                      value={priority}
                      label="Priority"
                      onChange={(e) => setPriority(e.target.value as string)}
                      renderValue={(selected) => selected || <em>All</em>}
                    >
                      <MenuItem value=""><em>All</em></MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    size="small"
                  >
                    Clear Filter
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
            {tickets.length === 0 ? (
              <MainCard>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No tickets found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Raise your first ticket using the button above.
                  </Typography>
                </Box>
              </MainCard>
            ) : (
              tickets.map((ticket, index) => (
                <TicketCommonCard
                  key={index}
                  drawerOpen={() => handleDrawerOpen(ticket)}
                  chipLabel={ticket.status}
                  customerName={`User ${userId}`}
                  ticketCount={null}
                  issueTitle={ticket.subject}
                  likes={null}
                  addCode={null}
                  removeCode={null}
                  customerAvatar={null}
                  productAvatar={null}
                  productName={ticket.category}
                  supporterAvatar={null}
                  supporterName="Support Team"
                  updateTime={format(new Date(ticket.updatedAt), 'dd MMMM yyyy, HH:mm')}
                  messageCount={0}
                  showBox={showBox}
                  showAvatarStack={showAvatarStack}
                  borderLeft={getBorderProps(ticket.priority).borderLeft}
                  borderColor={getBorderProps(ticket.priority).borderColor}
                />
              ))
            )}
          </Stack>
        </Grid>
        {/* <Grid size={{ xs: 12, lg: 4 }}>
          <Stack sx={{ gap: GRID_COMMON_SPACING }}>
            {ticketNotificationsData.map((data, index) => (
              <TicketNotificationsCard key={index} title={data.title} tickets={data.notifications} />
            ))}
          </Stack>
        </Grid> */}
      </Grid>
      {/* <TicketDetailsDrawer
        isOpen={openDrawer}
        handleDrawerOpen={() => setOpenDrawer(false)}
        ticket={selectedTicket}
      /> */}
    </Box>
  );
}