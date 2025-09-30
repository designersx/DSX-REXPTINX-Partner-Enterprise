    // 'use client';

    // import { useState, useEffect } from 'react';
    // import {
    //   Button,
    //   CardContent,
    //   Divider,
    //   Modal,
    //   Stack,
    //   Typography,
    //   TextField,
    //   Box,
    //   Checkbox,
    //   FormControlLabel,
    //   List,
    //   ListItem,
    //   ListItemIcon,
    //   ListItemText,
    //   CircularProgress,
    //   IconButton,
    //   TextareaAutosize, // For read-only text display
    // } from '@mui/material';
    // import ClearIcon from '@mui/icons-material/Clear'; // New import for clear button
    // import { toast, ToastContainer } from 'react-toastify';
    // import MainCard from 'components/MainCard';
    // import { updateKnowledgeBase, listSiteMap, validateWebsite } from '../../../Services/auth';
    // import { getUserId } from 'utils/auth';

    // export default function EditKnowledgeBase({ open, onClose, onSubmit, knowledgeBase }) {
    //   const [kbName, setKbName] = useState('');
    //   const [existingFiles, setExistingFiles] = useState([]); // Existing KB files (metadata)
    //   const [newFiles, setNewFiles] = useState([]); // New uploaded files
    //   const [text, setText] = useState(''); // Editable text
    //   const [formData, setFormData] = useState({ website: '' });
    //   const [isVerifying, setIsVerifying] = useState(false);
    //   const [isWebsiteValid, setIsWebsiteValid] = useState(null);
    //   const [sitemapUrls, setSitemapUrls] = useState([]);
    //   const [showSitemap, setShowSitemap] = useState(false);
    //   const [selectedUrls, setSelectedUrls] = useState(new Set());
    //   const [errors, setErrors] = useState({ Website: '' });
    //   const userId = getUserId();
    //   const HTTPS_PREFIX = "https://";
    //   const PREFIX_LEN = HTTPS_PREFIX.length;

    //   // Pre-populate fields with existing knowledge base data
    //   useEffect(() => {
    //     if (knowledgeBase && open) {
    //       setKbName(knowledgeBase.kbName || '');
    //       setText(knowledgeBase.text || ''); // Pre-fill existing text for editing
    //       setFormData({ website: knowledgeBase.webUrl || '' });
    //       setSelectedUrls(new Set(knowledgeBase.scrapedUrls ? JSON.parse(knowledgeBase.scrapedUrls) : []));
    //       setExistingFiles(Array.isArray(knowledgeBase.kbFiles) ? knowledgeBase.kbFiles : []);
    //       setNewFiles([]); // Reset new files
    //       if (knowledgeBase.webUrl) {
    //         verifyWebsite(knowledgeBase.webUrl);
    //       }
    //     }
    //   }, [knowledgeBase, open]);

    //   const handleNewFileChange = (e) => {
    //     const selectedFiles = Array.from(e.target.files || []);
    //     const allowedTypes = [
    //       "image/png",
    //       "image/jpeg",
    //       "application/pdf",
    //       "text/csv",
    //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    //     ];
    //     const validFiles = [];
    //     const errors = [];

    //     selectedFiles.forEach((file) => {
    //       if (!allowedTypes.includes(file.type)) {
    //         errors.push(`${file.name} is not an allowed file type.`);
    //         return;
    //       }
    //       if (file.size > 10 * 1024 * 1024) {
    //         errors.push(`${file.name} exceeds 10MB.`);
    //         return;
    //       }
    //       validFiles.push(file);
    //     });

    //     if (errors.length > 0) {
    //       alert(errors.join("\n"));
    //     }

    //     setNewFiles([...newFiles, ...validFiles]); // Append to existing new files
    //     if (validFiles.length === 0) {
    //       e.target.value = "";
    //     }
    //   };

    //   const verifyWebsite = async (rawUrl) => {
    //     const urlToVerify = rawUrl || (formData.website || "").trim();
    //     if (!urlToVerify) return;

    //     let url = urlToVerify.replace(/^https?:\/\//i, "");
    //     url = `https://${url}`;
    //     setIsVerifying(true);
    //     try {
    //       const result = await validateWebsite(url);
    //       const isValid = result?.valid === true || String(result?.valid).toLowerCase() === "true";
    //       setIsWebsiteValid(isValid);
    //       setFormData((p) => ({ ...p, website: url }));

    //       if (isValid) {
    //         const res = await listSiteMap(url);
    //         if (res?.success && Array.isArray(res.urls)) {
    //           const filteredUrls = filterCompanyPages(res.urls);
    //           if (!filteredUrls.includes(url)) {
    //             filteredUrls.unshift(url);
    //           }
    //           setSitemapUrls(filteredUrls);
    //           setShowSitemap(true);
    //         } else {
    //           setSitemapUrls([]);
    //           setShowSitemap(false);
    //         }
    //       } else {
    //         setSitemapUrls([]);
    //         setShowSitemap(false);
    //       }
    //     } catch (err) {
    //       console.error("Website verification error:", err);
    //       setIsWebsiteValid(false);
    //       setSitemapUrls([]);
    //       setShowSitemap(false);
    //     } finally {
    //       setIsVerifying(false);
    //     }
    //   };

    //   const filterCompanyPages = (urls) => {
    //     const companyKeywords = [
    //       "about", "our-story", "our-company", "who-we-are", "contact", "products",
    //       "services", "solutions", "what-we-do", "offerings", "blog", "news",
    //       "resources", "insights", "faq", "help", "pricing", "plans", "privacy",
    //       "terms-and-conditions", "terms-of-use", "case-studies", "projects",
    //       "portfolio", "testimonials", "reviews",
    //     ];
    //     return urls.filter((url) => companyKeywords.some((keyword) => url.toLowerCase().includes(keyword)));
    //   };

    //   const handleClearUrl = () => {
    //     setFormData({ website: '' });
    //     setIsWebsiteValid(null);
    //     setIsVerifying(false);
    //     setShowSitemap(false);
    //     setSitemapUrls([]);
    //     setSelectedUrls(new Set());
    //   };

    //   const handleSubmit = async () => {
    //     const submitFormData = new FormData();
    //     submitFormData.append("userId", userId);
    //     submitFormData.append("kbId", knowledgeBase.kbId);
    //     submitFormData.append("kbName", kbName);
    //     // Don't append "text" - instead, create .txt file if text exists
    //     if (text.trim()) {
    //       const textBlob = new Blob([text], { type: 'text/plain' });
    //       const textFile = new File([textBlob], 'text_content.txt', { type: 'text/plain' });
    //       submitFormData.append("KbFiles", textFile);
    //     }
    //     submitFormData.append("url", formData.website || ''); // Allow empty URL
    //     submitFormData.append("selectedSitemapUrls", JSON.stringify(Array.from(selectedUrls)));

    //     // Append new files
    //     newFiles.forEach((file) => {
    //       submitFormData.append("KbFiles", file);
    //     });

    //     try {
    //       const res = await updateKnowledgeBase(submitFormData);
    //       toast.success("Knowledgebase Updated!", {
    //         position: "top-center",
    //         autoClose: 2000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //       });

    //       // Merge new files metadata (assuming backend returns updated kbFiles)
    //       const updatedKbFiles = res.data?.kbFiles || [...existingFiles, ...newFiles.map(f => ({
    //         fileName: f.name,
    //         filePath: `/uploads/EnterpriseKbFiles/${f.name}`, // Adjust based on backend filename
    //         fileType: f.type,
    //         fileSize: f.size,
    //       }))];

    //       onSubmit({
    //         ...knowledgeBase,
    //         kbName,
    //         text: null, // No longer store text in DB
    //         webUrl: formData.website || null,
    //         scrapedUrls: JSON.stringify(Array.from(selectedUrls)),
    //         kbFiles: updatedKbFiles,
    //         updatedAt: new Date().toISOString(),
    //       });
    //       setTimeout(() => {
    //         handleClose();
    //       }, 2000);
    //     } catch (err) {
    //       console.error("Error:", err);
    //       toast.error("Failed to update Knowledgebase", {
    //         position: "top-center",
    //         autoClose: 2000,
    //       });
    //     }
    //   };

    //   const handleWebsiteBlur = () => {
    //     if (formData.website.trim()) {
    //       verifyWebsite();
    //     }
    //   };

    //   const handleClose = () => {
    //     setKbName('');
    //     setExistingFiles([]);
    //     setNewFiles([]);
    //     setText('');
    //     setFormData({ website: '' });
    //     setIsVerifying(false);
    //     setIsWebsiteValid(null);
    //     setSitemapUrls([]);
    //     setShowSitemap(false);
    //     setSelectedUrls(new Set());
    //     setErrors({ Website: '' });
    //     onClose();
    //   };

    //   const toggleOne = (url) => {
    //     setSelectedUrls((prev) => {
    //       const next = new Set(prev);
    //       if (next.has(url)) {
    //         next.delete(url);
    //       } else {
    //         next.add(url);
    //       }
    //       return next;
    //     });
    //   };

    //   const toggleAll = () => {
    //     setSelectedUrls((prev) => {
    //       const next = prev.size === sitemapUrls.length ? new Set() : new Set(sitemapUrls);
    //       return next;
    //     });
    //   };

    //   const isAllSelected = sitemapUrls.length > 0 && selectedUrls.size === sitemapUrls.length;

    //   return (
    //     <Modal open={open} onClose={handleClose}>
    //       <MainCard title="Edit Knowledge Base" modal darkTitle content={false} style={{ width: '30%' }}>
    //         <CardContent>
    //           {/* Knowledge Base Name - Pre-filled, no steps */}
    //           <Box sx={{ mb: 2 }}>
    //             <Typography variant="subtitle2" gutterBottom>
    //               Knowledge Base Name
    //             </Typography>
    //             <TextField
    //               fullWidth
    //               size="small"
    //               placeholder="My Knowledge Base"
    //               value={kbName}
    //               onChange={(e) => setKbName(e.target.value)}
    //               disabled
    //             />
    //           </Box>

    //           {/* Existing Files Display */}
    //           {existingFiles.length > 0 && (
    //             <Box sx={{ mb: 2 }}>
    //               <Typography variant="subtitle2" gutterBottom>
    //                 Existing Files
    //               </Typography>
    //               <List sx={{ maxHeight: 100, overflow: 'auto' }}>
    //                 {existingFiles.map((file, idx) => (
    //                   <ListItem key={idx}>
    //                     <ListItemText
    //                       primary={file.fileName}
    //                       secondary={`${(file.fileSize / 1024 / 1024).toFixed(2)} MB`}
    //                     />
    //                     <IconButton
    //                       size="small"
    //                       href={`${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`}
    //                       target="_blank"
    //                     >
    //                       Download
    //                     </IconButton>
    //                   </ListItem>
    //                 ))}
    //               </List>
    //             </Box>
    //           )}

    //           {/* New File Upload */}
    //           <Box sx={{ mb: 2 }}>
    //             <Typography variant="subtitle2" gutterBottom>
    //               Add New Files (will append to existing)
    //             </Typography>
    //             <input
    //               type="file"
    //               multiple
    //               accept=".png,.jpg,.jpeg,.pdf,.csv,.docx"
    //               onChange={handleNewFileChange}
    //             />
    //             <Typography
    //               variant="caption"
    //               sx={{ display: "block", mt: 1, color: "text.secondary" }}
    //             >
    //               Max 10MB per file. Allowed: PNG, JPG, PDF, CSV, DOCX
    //             </Typography>
    //             {newFiles.length > 0 ? (
    //               <Typography variant="body2" sx={{ mt: 1 }}>
    //                 {newFiles.map((file) => file.name).join(", ")}
    //               </Typography>
    //             ) : (
    //               <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
    //                 No new files chosen
    //               </Typography>
    //             )}
    //           </Box>

    //           {/* Text Input - Editable, will be saved as .txt file */}
    //           <Box sx={{ mb: 2 }}>
    //             <Typography variant="subtitle2" gutterBottom>
    //               Edit Text Content (will be saved as text_content.txt)
    //             </Typography>
    //             <TextareaAutosize
    //               minRows={3}
    //               style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    //               placeholder="Type or edit text..."
    //               value={text}
    //               onChange={(e) => setText(e.target.value)}
    //             />
    //           </Box>

    //           {/* URL Input with Clear Button */}
    //           <Box sx={{ mb: 2, position: 'relative' }}>
    //             <Typography variant="subtitle2" gutterBottom>
    //               Enter URL (optional)
    //             </Typography>
    //             <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //               <TextField
    //                 fullWidth
    //                 size="small"
    //                 placeholder="https://example.com"
    //                 value={formData.website}
    //                 onChange={(e) => {
    //                   setFormData({ ...formData, website: e.target.value });
    //                   setIsWebsiteValid(null);
    //                   setErrors((prev) => ({ ...prev, Website: "" }));
    //                 }}
    //                 // ... (keep existing onKeyDown, onClick, onFocus handlers)
    //                 onBlur={handleWebsiteBlur}
    //               />
    //               {formData.website && (
    //                 <IconButton onClick={handleClearUrl} size="small">
    //                   <ClearIcon />
    //                 </IconButton>
    //               )}
    //             </Box>
    //             {formData.website && (
    //               <Box sx={{ position: 'absolute', right: 8, top: 50 }}>
    //                 {isVerifying ? (
    //                   <CircularProgress size={20} />
    //                 ) : isWebsiteValid === true ? (
    //                   <Typography variant="body2" color="success.main">✓ Valid</Typography>
    //                 ) : isWebsiteValid === false ? (
    //                   <Typography variant="body2" color="error.main">✗ Invalid</Typography>
    //                 ) : null}
    //               </Box>
    //             )}
    //           </Box>

    //           {/* Sitemap URLs Selection (same as before) */}
    //           {showSitemap && sitemapUrls.length > 0 && (
    //             <Box sx={{ mb: 2 }}>
    //               <Typography variant="subtitle2" gutterBottom>
    //                 Select Pages to Include
    //               </Typography>
    //               <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
    //                 <List>
    //                   <ListItem secondaryAction={<FormControlLabel control={<Checkbox checked={isAllSelected} indeterminate={selectedUrls.size > 0 && selectedUrls.size < sitemapUrls.length} onChange={toggleAll} />} label="Select All" />} disablePadding>
    //                     <ListItemText primary="Select All Pages" />
    //                   </ListItem>
    //                   {sitemapUrls.map((sitemapUrl) => (
    //                     <ListItem key={sitemapUrl} disablePadding>
    //                       <ListItemIcon>
    //                         <Checkbox edge="start" checked={selectedUrls.has(sitemapUrl)} onChange={() => toggleOne(sitemapUrl)} />
    //                       </ListItemIcon>
    //                       <ListItemText primary={sitemapUrl} primaryTypographyProps={{ variant: 'body2' }} />
    //                     </ListItem>
    //                   ))}
    //                 </List>
    //               </Box>
    //             </Box>
    //           )}
    //         </CardContent>

    //         <Divider />

    //         <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end', px: 2.5, py: 2 }}>
    //           <Button color="error" size="small" onClick={handleClose}>
    //             Cancel
    //           </Button>
    //           <Button
    //             variant="contained"
    //             size="small"
    //             onClick={handleSubmit}
    //             disabled={!kbName.trim()} // Only require name, others optional
    //           >
    //             Update
    //           </Button>
    //         </Stack>
    //         <ToastContainer position="bottom-right" autoClose={3000} newestOnTop={false} closeButton={true} />
    //       </MainCard>
    //     </Modal>
    //   );
    // }
    
// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Button,
//   CardContent,
//   Divider,
//   Modal,
//   Stack,
//   Typography,
//   TextField,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   CircularProgress,
//   IconButton,
//   TextareaAutosize,
//   Collapse,
// } from '@mui/material';
// import ClearIcon from '@mui/icons-material/Clear';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DownloadIcon from '@mui/icons-material/Download';
// import AddIcon from '@mui/icons-material/Add';
// import { toast, ToastContainer } from 'react-toastify';
// import MainCard from 'components/MainCard';
// import { updateKnowledgeBase, listSiteMap, validateWebsite } from '../../../Services/auth';
// import { getUserId } from 'utils/auth';

// export default function EditKnowledgeBase({ open, onClose, onSubmit, knowledgeBase }) {
//   const [currentKbName, setCurrentKbName] = useState('');
//   const [existingFiles, setExistingFiles] = useState([]); // Previous files metadata
//   const [newFiles, setNewFiles] = useState([]); // New files to add
//   const [newText, setNewText] = useState(''); // New text to add, saved as file
//   const [existingGroups, setExistingGroups] = useState([]); // Previous { baseUrl: string, subUrls: string[] }
//   const [newWebUrl, setNewWebUrl] = useState(''); // New URL to add
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isWebsiteValid, setIsWebsiteValid] = useState(null);
//   const [sitemapUrls, setSitemapUrls] = useState([]);
//   const [showSitemap, setShowSitemap] = useState(false);
//   const [selectedUrls, setSelectedUrls] = useState(new Set());
//   const [showAddMore, setShowAddMore] = useState(false); // Toggle for "Add More" section
//   const [errors, setErrors] = useState({ Website: '' });
//   const userId = getUserId();
//   const HTTPS_PREFIX = "https://";
//   const PREFIX_LEN = HTTPS_PREFIX.length;
//   const MAX_SOURCES = 500;

//   // Pre-populate fields with existing knowledge base data
//   useEffect(() => {
//     if (knowledgeBase && open) {
//       setCurrentKbName(knowledgeBase.kbName || '');
//       setNewText(knowledgeBase.text || ''); // Pre-fill new text for editing (will be new addition)
//       const scraped = knowledgeBase.scrapedUrls ? JSON.parse(knowledgeBase.scrapedUrls) : [];
//       const initialGroups = [];
//       if (knowledgeBase.webUrl) {
//         initialGroups.push({ baseUrl: knowledgeBase.webUrl, subUrls: scraped });
//       } else if (scraped.length > 0) {
//         scraped.forEach(url => initialGroups.push({ baseUrl: url, subUrls: [] }));
//       }
//       setExistingGroups(initialGroups);
//       setExistingFiles(Array.isArray(knowledgeBase.kbFiles) ? knowledgeBase.kbFiles : []);
//       setNewFiles([]);
//       setNewWebUrl('');
//       setIsWebsiteValid(null);
//       setShowSitemap(false);
//       setSitemapUrls([]);
//       setSelectedUrls(new Set());
//     }
//   }, [knowledgeBase, open]);

//   const handleNewFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     const allowedTypes = [
//       "image/png",
//       "image/jpeg",
//       "application/pdf",
//       "text/csv",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     const validFiles = [];
//     const errors = [];

//     selectedFiles.forEach((file) => {
//       if (!allowedTypes.includes(file.type)) {
//         errors.push(`${file.name} is not an allowed file type.`);
//         return;
//       }
//       if (file.size > 10 * 1024 * 1024) {
//         errors.push(`${file.name} exceeds 10MB.`);
//         return;
//       }
//       validFiles.push(file);
//     });

//     if (errors.length > 0) {
//       alert(errors.join("\n"));
//     }

//     setNewFiles(validFiles);
//   };

//   const deleteExistingFile = (index) => {
//     setExistingFiles(existingFiles.filter((_, i) => i !== index));
//   };

//   const deleteExistingGroup = (index) => {
//     setExistingGroups(existingGroups.filter((_, i) => i !== index));
//   };

//   const verifyWebsite = async (rawUrl) => {
//     const urlToVerify = rawUrl || (newWebUrl || "").trim();
//     if (!urlToVerify) return;

//     let url = urlToVerify.replace(/^https?:\/\//i, "");
//     url = `https://${url}`;
//     setIsVerifying(true);
//     try {
//       const result = await validateWebsite(url);
//       const isValid = result?.valid === true || String(result?.valid).toLowerCase() === "true";
//       setIsWebsiteValid(isValid);
//       setNewWebUrl(url);

//       if (isValid) {
//         const res = await listSiteMap(url);
//         if (res?.success && Array.isArray(res.urls)) {
//           const filteredUrls = filterCompanyPages(res.urls);
//           if (!filteredUrls.includes(url)) {
//             filteredUrls.unshift(url);
//           }
//           setSitemapUrls(filteredUrls);
//           setShowSitemap(true);
//           setSelectedUrls(new Set([url])); // Pre-select base
//         } else {
//           setSitemapUrls([]);
//           setShowSitemap(false);
//         }
//       } else {
//         setSitemapUrls([]);
//         setShowSitemap(false);
//       }
//     } catch (err) {
//       console.error("Website verification error:", err);
//       setIsWebsiteValid(false);
//       setSitemapUrls([]);
//       setShowSitemap(false);
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const filterCompanyPages = (urls) => {
//     const companyKeywords = [
//       "about", "our-story", "our-company", "who-we-are", "contact", "products",
//       "services", "solutions", "what-we-do", "offerings", "blog", "news",
//       "resources", "insights", "faq", "help", "pricing", "plans", "privacy",
//       "terms-and-conditions", "terms-of-use", "case-studies", "projects",
//       "portfolio", "testimonials", "reviews",
//     ];
//     return urls.filter((url) => companyKeywords.some((keyword) => url.toLowerCase().includes(keyword)));
//   };

//   const handleWebsiteBlur = () => {
//     if (newWebUrl.trim()) {
//       verifyWebsite();
//     }
//   };

//   const addNewUrl = () => {
//     if (newWebUrl && isWebsiteValid) {
//       const newSubs = Array.from(selectedUrls).filter(u => u !== newWebUrl);
//       setExistingGroups([...existingGroups, { baseUrl: newWebUrl, subUrls: newSubs }]);
//       setNewWebUrl('');
//       setIsWebsiteValid(null);
//       setShowSitemap(false);
//       setSitemapUrls([]);
//       setSelectedUrls(new Set());
//     }
//   };

//   const getTotalSources = () => {
//     return existingFiles.length + (newFiles.length > 0 ? 1 : 0) + (newText.trim() ? 1 : 0) + existingGroups.reduce((sum, g) => sum + 1 + g.subUrls.length, 0);
//   };

//   const handleSubmit = async () => {
//     if (getTotalSources() > MAX_SOURCES) {
//       toast.error(`Cannot exceed ${MAX_SOURCES} sources in a knowledge base.`, {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     const submitFormData = new FormData();
//     submitFormData.append("userId", userId);
//     submitFormData.append("kbId", knowledgeBase.kbId);
//     submitFormData.append("kbName", currentKbName);
//     if (newText.trim()) {
//       const textBlob = new Blob([newText], { type: 'text/plain' });
//       const textFile = new File([textBlob], 'text_content.txt', { type: 'text/plain' });
//       submitFormData.append("KbFiles", textFile);
//     }
//     const flatUrls = existingGroups.reduce((arr, g) => [...arr, g.baseUrl, ...g.subUrls], []);
//     submitFormData.append("selectedSitemapUrls", JSON.stringify(flatUrls));
//     submitFormData.append("url", '');

//     // Append new files
//     newFiles.forEach((file) => {
//       submitFormData.append("KbFiles", file);
//     });

//     // Send updated file list (excluding deleted)
//     submitFormData.append("updatedKbFiles", JSON.stringify(existingFiles));

//     try {
//       const res = await updateKnowledgeBase(submitFormData);
//       toast.success("Knowledgebase Updated!", {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });

//       const updatedKbFiles = res.data?.kbFiles || [
//         ...existingFiles,
//         ...newFiles.map(f => ({
//           fileName: f.name,
//           filePath: `/uploads/EnterpriseKbFiles/${f.name}`,
//           fileType: f.type,
//           fileSize: f.size,
//         })),
//       ];

//       onSubmit({
//         ...knowledgeBase,
//         kbName: currentKbName,
//         text: null,
//         webUrl: null,
//         scrapedUrls: JSON.stringify(flatUrls),
//         kbFiles: updatedKbFiles,
//         updatedAt: new Date().toISOString(),
//       });
//       setTimeout(() => {
//         handleClose();
//       }, 2000);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error("Failed to update Knowledgebase", {
//         position: "top-center",
//         autoClose: 2000,
//       });
//     }
//   };

//   const handleClose = () => {
//     setCurrentKbName('');
//     setExistingFiles([]);
//     setNewFiles([]);
//     setNewText('');
//     setExistingGroups([]);
//     setNewWebUrl('');
//     setIsVerifying(false);
//     setIsWebsiteValid(null);
//     setSitemapUrls([]);
//     setShowSitemap(false);
//     setSelectedUrls(new Set());
//     setShowAddMore(false);
//     setErrors({ Website: '' });
//     onClose();
//   };

//   const toggleOne = (url) => {
//     setSelectedUrls((prev) => {
//       const next = new Set(prev);
//       if (next.has(url)) {
//         next.delete(url);
//       } else {
//         next.add(url);
//       }
//       return next;
//     });
//   };

//   const toggleAll = () => {
//     setSelectedUrls((prev) => {
//       const next = prev.size === sitemapUrls.length ? new Set() : new Set(sitemapUrls);
//       return next;
//     });
//   };

//   const isAllSelected = sitemapUrls.length > 0 && selectedUrls.size === sitemapUrls.length;

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <MainCard title="Edit Knowledge Base" modal darkTitle content={false} style={{ width: '30%' }}>
//         <CardContent>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Knowledge Base Name
//             </Typography>
//             <TextField
//               fullWidth
//               size="small"
//               value={currentKbName}
//               onChange={(e) => setCurrentKbName(e.target.value)}
//             />
//           </Box>

//           {/* Existing URL Section */}
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Existing Base URLs and Subpages
//             </Typography>
//             {existingGroups.length > 0 ? (
//               <List sx={{ maxHeight: 150, overflow: 'auto' }}>
//                 {existingGroups.map((g, idx) => (
//                   <ListItem
//                     key={idx}
//                     secondaryAction={
//                       <IconButton edge="end" color="error" onClick={() => deleteExistingGroup(idx)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     }
//                   >
//                     <ListItemText primary={g.baseUrl} secondary={`${g.subUrls.length} Subpages`} />
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography color="text.secondary">No existing URLs</Typography>
//             )}
//           </Box>

//           {/* Existing Files Section */}
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Existing Files
//             </Typography>
//             {existingFiles.length > 0 ? (
//               <List sx={{ maxHeight: 150, overflow: 'auto' }}>
//                 {existingFiles.map((file, idx) => (
//                   <ListItem
//                     key={idx}
//                     secondaryAction={
//                       <Stack direction="row" spacing={1}>
//                         <IconButton
//                           size="small"
//                           href={`${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`}
//                           target="_blank"
//                         >
//                           <DownloadIcon />
//                         </IconButton>
//                         <IconButton edge="end" color="error" onClick={() => deleteExistingFile(idx)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </Stack>
//                     }
//                   >
//                     <ListItemText
//                       primary={file.fileName}
//                       secondary={`${(file.fileSize / 1024 / 1024).toFixed(2)} MB`}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             ) : (
//               <Typography color="text.secondary">No existing files</Typography>
//             )}
//           </Box>

//           {/* Add More Button */}
//           <Box sx={{ mb: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<AddIcon />}
//               onClick={() => setShowAddMore(!showAddMore)}
//             >
//               Add More
//             </Button>
//           </Box>

//           {/* Add More Section (Collapsible) - Only New Additions */}
//           <Collapse in={showAddMore}>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Preview New Files
//               </Typography>
//               <input
//                 type="file"
//                 multiple
//                 accept=".png,.jpg,.jpeg,.pdf,.csv,.docx"
//                 onChange={handleNewFileChange}
//               />
//               <Typography
//                 variant="caption"
//                 sx={{ display: "block", mt: 1, color: "text.secondary" }}
//               >
//                 Max 10MB per file. Allowed: PNG, JPG, PDF, CSV, DOCX
//               </Typography>
//               {newFiles.length > 0 ? (
//                 <List sx={{ maxHeight: 100, overflow: 'auto' }}>
//                   {newFiles.map((file, idx) => (
//                     <ListItem key={idx}>
//                       <ListItemText
//                         primary={file.name}
//                         secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               ) : (
//                 <Typography color="text.secondary">No new files selected</Typography>
//               )}
//             </Box>

//             <Box sx={{ mb: 2, position: 'relative' }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Add New Base URL
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   placeholder="https://example.com"
//                   value={newWebUrl}
//                   onChange={(e) => {
//                     setNewWebUrl(e.target.value);
//                     setIsWebsiteValid(null);
//                     setErrors((prev) => ({ ...prev, Website: "" }));
//                   }}
//                   onBlur={handleWebsiteBlur}
//                   onKeyDown={(e) => {
//                     const input = e.currentTarget;
//                     const { key } = e;
//                     const { selectionStart, selectionEnd, value } = input;
//                     const fullSelection = selectionStart === 0 && selectionEnd === value.length;
//                     if (key === "Backspace" || key === "Delete") {
//                       if (fullSelection) {
//                         e.preventDefault();
//                         setNewWebUrl(HTTPS_PREFIX);
//                         requestAnimationFrame(() => input.setSelectionRange(PREFIX_LEN, PREFIX_LEN));
//                       }
//                       if (selectionStart <= PREFIX_LEN) {
//                         e.preventDefault();
//                         input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
//                       }
//                     }
//                   }}
//                   onClick={(e) => {
//                     const input = e.currentTarget;
//                     if (input.selectionStart < PREFIX_LEN) {
//                       input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
//                     }
//                   }}
//                   onFocus={(e) => {
//                     const input = e.currentTarget;
//                     if (!input.value.startsWith(HTTPS_PREFIX)) {
//                       setNewWebUrl(HTTPS_PREFIX + input.value);
//                       requestAnimationFrame(() => input.setSelectionRange(PREFIX_LEN, PREFIX_LEN));
//                     }
//                   }}
//                 />
//                 {newWebUrl && (
//                   <IconButton onClick={() => setNewWebUrl('')} size="small">
//                     <ClearIcon />
//                   </IconButton>
//                 )}
//               </Box>
//               {newWebUrl && (
//                 <Box sx={{ mt: 1 }}>
//                   {isVerifying ? (
//                     <CircularProgress size={20} />
//                   ) : isWebsiteValid === true ? (
//                     <Typography variant="body2" color="success.main">✓ Valid</Typography>
//                   ) : isWebsiteValid === false ? (
//                     <Typography variant="body2" color="error.main">✗ Invalid</Typography>
//                   ) : null}
//                 </Box>
//               )}
//               {showSitemap && sitemapUrls.length > 0 && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="subtitle2" gutterBottom>
//                     Select New Subpages
//                   </Typography>
//                   <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
//                     <List>
//                       <ListItem secondaryAction={
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={isAllSelected}
//                               indeterminate={selectedUrls.size > 0 && selectedUrls.size < sitemapUrls.length}
//                               onChange={toggleAll}
//                             />
//                           }
//                           label="Select All"
//                         />
//                       } disablePadding>
//                         <ListItemText primary="Select All Pages" />
//                       </ListItem>
//                       {sitemapUrls.map((sitemapUrl) => (
//                         <ListItem key={sitemapUrl} disablePadding>
//                           <ListItemIcon>
//                             <Checkbox
//                               edge="start"
//                               checked={selectedUrls.has(sitemapUrl)}
//                               onChange={() => toggleOne(sitemapUrl)}
//                             />
//                           </ListItemIcon>
//                           <ListItemText primary={sitemapUrl} primaryTypographyProps={{ variant: 'body2' }} />
//                         </ListItem>
//                       ))}
//                     </List>
//                   </Box>
//                   <Button variant="outlined" size="small" onClick={addNewUrl} sx={{ mt: 1 }}>
//                     Add URL and Selected Subpages
//                   </Button>
//                 </Box>
//               )}
//               {!showSitemap && isWebsiteValid === true && (
//                 <Button variant="outlined" size="small" onClick={addNewUrl} sx={{ mt: 1 }}>
//                   Add URL (No Subpages Found)
//                 </Button>
//               )}
//             </Box>

//             <Box sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Preview New Text Content
//               </Typography>
//               <TextareaAutosize
//                 minRows={3}
//                 style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
//                 placeholder="Type new text..."
//                 value={newText}
//                 onChange={(e) => setNewText(e.target.value)}
//               />
//               {newText.trim() && (
//                 <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
//                   Will be saved as text_content.txt
//                 </Typography>
//               )}
//             </Box>
//           </Collapse>
//         </CardContent>

//         <Divider />

//         <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end', px: 2.5, py: 2 }}>
//           <Button color="error" size="small" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             onClick={handleSubmit}
//             disabled={!currentKbName.trim() || getTotalSources() > MAX_SOURCES}
//           >
//             Update
//           </Button>
//         </Stack>
//         <ToastContainer position="bottom-right" autoClose={3000} newestOnTop={false} closeButton={true} />
//       </MainCard>
//     </Modal>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  CardContent,
  Divider,
  Modal,
  Stack,
  Typography,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  IconButton,
  TextareaAutosize,
  Tabs,
  Tab,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import MainCard from 'components/MainCard';
import { updateKnowledgeBase, listSiteMap, validateWebsite, updateKb } from '../../../Services/auth';
import { getUserId } from 'utils/auth';

export default function EditKnowledgeBase({ open, onClose, onSubmit, knowledgeBase }) {
  const [currentKbName, setCurrentKbName] = useState('');
  const [existingFiles, setExistingFiles] = useState([]); // Existing files from DB
  const [newFiles, setNewFiles] = useState([]); // New files to add
  const [existingText, setExistingText] = useState(''); // Existing text from DB
  const [newText, setNewText] = useState(''); // New text to add
  const [existingGroups, setExistingGroups] = useState([]); // Existing { baseUrl, subUrls } from DB
  const [pendingGroups, setPendingGroups] = useState([]); // New URL groups to add
  const [newWebUrl, setNewWebUrl] = useState(''); // New URL to add
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWebsiteValid, setIsWebsiteValid] = useState(null);
  const [sitemapUrls, setSitemapUrls] = useState([]);
  const [showSitemap, setShowSitemap] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState(new Set());
  const [tabValue, setTabValue] = useState(0); // Tab control (0 = Existing, 1 = Add New)
  const [errors, setErrors] = useState({ Website: '' });
  const userId = getUserId();
  const HTTPS_PREFIX = "https://";
  const PREFIX_LEN = HTTPS_PREFIX.length;
  const MAX_SOURCES = 500;

  // Pre-populate fields with existing knowledge base data
  useEffect(() => {
    if (knowledgeBase && open) {
      setCurrentKbName(knowledgeBase.kbName || '');
      setExistingText(knowledgeBase.text || '');
      const scraped = knowledgeBase.scrapedUrls ? JSON.parse(knowledgeBase.scrapedUrls) : [];
      const initialGroups = groupBaseUrls(scraped, knowledgeBase.webUrl);
      setExistingGroups(initialGroups);
      setExistingFiles(Array.isArray(knowledgeBase.kbFiles) ? knowledgeBase.kbFiles : []);
      setNewFiles([]);
      setNewText('');
      setNewWebUrl('');
      setPendingGroups([]);
      setIsWebsiteValid(null);
      setShowSitemap(false);
      setSitemapUrls([]);
      setSelectedUrls(new Set());
    }
  }, [knowledgeBase, open]);

// Function to group base URLs and subpages from scraped URLs based on domain only
const groupBaseUrls = (scrapedUrls, webUrl) => {
  const groups = [];
  const allUrls = scrapedUrls;

  // Extract unique domains (ignoring path and trailing slash) and their subpages
  const urlMap = new Map();
  allUrls.forEach(url => {
    // Check if URL is valid before processing
    if (url && typeof url === 'string' && url.trim().length > 0) {
      try {
        const parsedUrl = new URL(url);
        const domain = parsedUrl.origin; // e.g., https://neeshperfumes.com
        if (!urlMap.has(domain)) {
          urlMap.set(domain, new Set());
        }
        urlMap.get(domain).add(url);
      } catch (e) {
        console.warn(`Invalid URL skipped: ${url}`, e.message);
        // Skip invalid URL and continue
      }
    } else {
      console.warn(`Invalid or empty URL skipped: ${url}`);
    }
  });

  urlMap.forEach((subUrls, domain) => {
    groups.push({ baseUrl: domain, subUrls: Array.from(subUrls) });
  });

  return groups;
};

  const handleNewFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not an allowed file type.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 10MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    setNewFiles(validFiles);
  };

  const deleteExistingFile = (index) => {
    setExistingFiles(existingFiles.filter((_, i) => i !== index));
  };

  const deleteExistingGroup = (index) => {
    const updatedGroups = [...existingGroups];
    updatedGroups.splice(index, 1); // Remove the group and its subpages
    setExistingGroups(updatedGroups);
  };

  const verifyWebsite = async (rawUrl) => {
    const urlToVerify = rawUrl || (newWebUrl || "").trim();
    if (!urlToVerify) return;

    let url = urlToVerify.replace(/^https?:\/\//i, "");
    url = `https://${url}`;
    setIsVerifying(true);
    try {
      const result = await validateWebsite(url);
      const isValid = result?.valid === true || String(result?.valid).toLowerCase() === "true";
      setIsWebsiteValid(isValid);
      setNewWebUrl(url);

      if (isValid) {
        const res = await listSiteMap(url);
        if (res?.success && Array.isArray(res.urls)) {
          const filteredUrls = filterCompanyPages(res.urls);
          if (!filteredUrls.includes(url)) {
            filteredUrls.unshift(url);
          }
          setSitemapUrls(filteredUrls);
          setShowSitemap(true);
          setSelectedUrls(new Set([url])); // Pre-select base
        } else {
          setSitemapUrls([]);
          setShowSitemap(false);
        }
      } else {
        setSitemapUrls([]);
        setShowSitemap(false);
      }
    } catch (err) {
      console.error("Website verification error:", err);
      setIsWebsiteValid(false);
      setSitemapUrls([]);
      setShowSitemap(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const filterCompanyPages = (urls) => {
    const companyKeywords = [
      "about", "our-story", "our-company", "who-we-are", "contact", "products",
      "services", "solutions", "what-we-do", "offerings", "blog", "news",
      "resources", "insights", "faq", "help", "pricing", "plans", "privacy",
      "terms-and-conditions", "terms-of-use", "case-studies", "projects",
      "portfolio", "testimonials", "reviews",
    ];
    return urls.filter((url) => companyKeywords.some((keyword) => url.toLowerCase().includes(keyword)));
  };

  const handleWebsiteBlur = () => {
    if (newWebUrl.trim()) {
      verifyWebsite();
    }
  };

  const addNewUrlToPending = () => {
    if (newWebUrl && isWebsiteValid) {
      const newSubs = Array.from(selectedUrls).filter(u => u !== newWebUrl);
      setPendingGroups([...pendingGroups, { baseUrl: newWebUrl, subUrls: newSubs }]);
      setNewWebUrl('');
      setIsWebsiteValid(null);
      setShowSitemap(false);
      setSitemapUrls([]);
      setSelectedUrls(new Set());
    }
  };

  const deletePendingGroup = (index) => {
    setPendingGroups(pendingGroups.filter((_, i) => i !== index));
  };

  const getTotalSources = () => {
    return existingFiles.length + (newFiles.length > 0 ? 1 : 0) + (existingText.trim() ? 1 : 0) + (newText.trim() ? 1 : 0) + existingGroups.reduce((sum, g) => sum + 1 + g.subUrls.length, 0) + pendingGroups.reduce((sum, g) => sum + 1 + g.subUrls.length, 0);
  };

  const handleSubmit = async () => {
    if (getTotalSources() > MAX_SOURCES) {
      toast.error(`Cannot exceed ${MAX_SOURCES} sources in a knowledge base.`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("userId", userId);
    submitFormData.append("kbId", knowledgeBase.kbId);
    submitFormData.append("kbName", currentKbName);
    if (existingText.trim()) {
      const textBlob = new Blob([existingText], { type: 'text/plain' });
      const textFile = new File([textBlob], 'text_content.txt', { type: 'text/plain' });
      submitFormData.append("KbFiles", textFile);
    }
    if (newText.trim()) {
      const newTextBlob = new Blob([newText], { type: 'text/plain' });
      const newTextFile = new File([newTextBlob], 'new_text_content.txt', { type: 'text/plain' });
      submitFormData.append("KbFiles", newTextFile);
    }
    const flatUrls = [...existingGroups, ...pendingGroups].reduce((arr, g) => [...arr, g.baseUrl, ...g.subUrls], []);
    submitFormData.append("selectedSitemapUrls", JSON.stringify(flatUrls));
    submitFormData.append("url", '');

    // Append new files
    newFiles.forEach((file) => {
      submitFormData.append("KbFiles", file);
    });

    // Send updated file list (excluding deleted)
    submitFormData.append("updatedKbFiles", JSON.stringify(existingFiles));

    try {
      const res = await updateKb(submitFormData);
      toast.success("Knowledgebase Updated!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const updatedKbFiles = res.data?.kbFiles || [
        ...existingFiles,
        ...newFiles.map(f => ({
          fileName: f.name,
          filePath: `/uploads/EnterpriseKbFiles/${f.name}`,
          fileType: f.type,
          fileSize: f.size,
        })),
      ];

      const updatedGroups = [...existingGroups, ...pendingGroups];
      onSubmit({
        ...knowledgeBase,
        kbName: currentKbName,
        text: null,
        webUrl: null,
        scrapedUrls: JSON.stringify(flatUrls),
        kbFiles: updatedKbFiles,
        updatedAt: new Date().toISOString(),
      });
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to update Knowledgebase", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleClose = () => {
    setCurrentKbName('');
    setExistingFiles([]);
    setNewFiles([]);
    setExistingText('');
    setNewText('');
    setExistingGroups([]);
    setPendingGroups([]);
    setNewWebUrl('');
    setIsVerifying(false);
    setIsWebsiteValid(null);
    setSitemapUrls([]);
    setShowSitemap(false);
    setSelectedUrls(new Set());
    setTabValue(0);
    setErrors({ Website: '' });
    onClose();
  };

  const toggleOne = (url) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedUrls((prev) => {
      const next = prev.size === sitemapUrls.length ? new Set() : new Set(sitemapUrls);
      return next;
    });
  };

  const isAllSelected = sitemapUrls.length > 0 && selectedUrls.size === sitemapUrls.length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={open} 
    // onClose={handleClose}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return; // ❌ prevent close on outside click or ESC
        }
        handleClose(); // ✅ allow programmatic close (like after submit)
      }}
    >
      <MainCard title="Edit Knowledge Base" modal darkTitle content={false} style={{ width: '60%' }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Knowledge Base Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={currentKbName}
              onChange={(e) => setCurrentKbName(e.target.value)}
            />
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange} aria-label="knowledge base tabs">
            <Tab label="Existing Sources" />
            <Tab label="Add New Sources" />
          </Tabs>

          {tabValue === 0 && (
            <>
              {/* Existing URL Section */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Existing Base URLs and Subpages
                </Typography>
                {existingGroups.length > 0 ? (
                  <List sx={{ maxHeight: 150, overflow: 'auto' }}>
                    {existingGroups.map((g, idx) => (
                      <ListItem
                        key={idx}
                        secondaryAction={
                          <IconButton edge="end" color="error" onClick={() => deleteExistingGroup(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={g.baseUrl} secondary={`${g.subUrls.length} Subpages`} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No existing URLs</Typography>
                )}
              </Box>

              {/* Existing Files Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Existing Files
                </Typography>
                {existingFiles.length > 0 ? (
                  <List sx={{ maxHeight: 150, overflow: 'auto' }}>
                    {existingFiles.map((file, idx) => (
                      <ListItem
                        key={idx}
                        secondaryAction={
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              size="small"
                              href={`${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`}
                              target="_blank"
                            >
                              <DownloadIcon />
                            </IconButton>
                            <IconButton edge="end" color="error" onClick={() => deleteExistingFile(idx)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        }
                      >
                        <ListItemText
                          primary={file.fileName}
                          secondary={`${(file.fileSize / 1024 / 1024).toFixed(2)} MB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No existing files</Typography>
                )}
              </Box>

              {/* Existing Text Section */}
              {existingText.trim() && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Existing Text Content
                  </Typography>
                  <TextareaAutosize
                    minRows={3}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    value={existingText}
                    onChange={(e) => setExistingText(e.target.value)}
                  />
                </Box>
              )}
            </>
          )}

          {tabValue === 1 && (
            <>
              {/* New Files Preview */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview New Files
                </Typography>
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.csv,.docx"
                  onChange={handleNewFileChange}
                />
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "text.secondary" }}
                >
                  Max 10MB per file. Allowed: PNG, JPG, PDF, CSV, DOCX
                </Typography>
                {newFiles.length > 0 ? (
                  <List sx={{ maxHeight: 100, overflow: 'auto' }}>
                    {newFiles.map((file, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">No new files selected</Typography>
                )}
              </Box>

              {/* New Base URL */}
              <Box sx={{ mb: 2, position: 'relative' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add New Base URL
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="https://example.com"
                    value={newWebUrl}
                    onChange={(e) => {
                      setNewWebUrl(e.target.value);
                      setIsWebsiteValid(null);
                      setErrors((prev) => ({ ...prev, Website: "" }));
                    }}
                    onBlur={handleWebsiteBlur}
                    onKeyDown={(e) => {
                      const input = e.currentTarget;
                      const { key } = e;
                      const { selectionStart, selectionEnd, value } = input;
                      const fullSelection = selectionStart === 0 && selectionEnd === value.length;
                      if (key === "Backspace" || key === "Delete") {
                        if (fullSelection) {
                          e.preventDefault();
                          setNewWebUrl(HTTPS_PREFIX);
                          requestAnimationFrame(() => input.setSelectionRange(PREFIX_LEN, PREFIX_LEN));
                        }
                        if (selectionStart <= PREFIX_LEN) {
                          e.preventDefault();
                          input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
                        }
                      }
                    }}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      if (input.selectionStart < PREFIX_LEN) {
                        input.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
                      }
                    }}
                    onFocus={(e) => {
                      const input = e.currentTarget;
                      if (!input.value.startsWith(HTTPS_PREFIX)) {
                        setNewWebUrl(HTTPS_PREFIX + input.value);
                        requestAnimationFrame(() => input.setSelectionRange(PREFIX_LEN, PREFIX_LEN));
                      }
                    }}
                  />
                  {newWebUrl && (
                    <IconButton onClick={() => setNewWebUrl('')} size="small">
                      <ClearIcon />
                    </IconButton>
                  )}
                </Box>
                {newWebUrl && (
                  <Box sx={{ mt: 1 }}>
                    {isVerifying ? (
                      <CircularProgress size={20} />
                    ) : isWebsiteValid === true ? (
                      <Typography variant="body2" color="success.main">✓ Valid</Typography>
                    ) : isWebsiteValid === false ? (
                      <Typography variant="body2" color="error.main">✗ Invalid</Typography>
                    ) : null}
                  </Box>
                )}
                {showSitemap && sitemapUrls.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Select New Subpages
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                      <List>
                        <ListItem secondaryAction={
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isAllSelected}
                                indeterminate={selectedUrls.size > 0 && selectedUrls.size < sitemapUrls.length}
                                onChange={toggleAll}
                              />
                            }
                            label="Select All"
                          />
                        } disablePadding>
                          <ListItemText primary="Select All Pages" />
                        </ListItem>
                        {sitemapUrls.map((sitemapUrl) => (
                          <ListItem key={sitemapUrl} disablePadding>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={selectedUrls.has(sitemapUrl)}
                                onChange={() => toggleOne(sitemapUrl)}
                              />
                            </ListItemIcon>
                            <ListItemText primary={sitemapUrl} primaryTypographyProps={{ variant: 'body2' }} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Button variant="outlined" size="small" onClick={addNewUrlToPending} sx={{ mt: 1 }}>
                      Add URL and Selected Subpages
                    </Button>
                  </Box>
                )}
                {!showSitemap && isWebsiteValid === true && (
                  <Button variant="outlined" size="small" onClick={addNewUrlToPending} sx={{ mt: 1 }}>
                    Add URL (No Subpages Found)
                  </Button>
                )}
              </Box>

              {/* Preview Pending URLs */}
              {pendingGroups.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview New URLs
                  </Typography>
                  <List sx={{ maxHeight: 150, overflow: 'auto' }}>
                    {pendingGroups.map((g, idx) => (
                      <ListItem
                        key={idx}
                        secondaryAction={
                          <IconButton edge="end" color="error" onClick={() => deletePendingGroup(idx)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={g.baseUrl} secondary={`${g.subUrls.length} Subpages`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* New Text Preview */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview New Text Content
                </Typography>
                <TextareaAutosize
                  minRows={3}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Type new text..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                {newText.trim() && (
                  <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                    Will be saved as new_text_content.txt
                  </Typography>
                )}
              </Box>
            </>
          )}

        </CardContent>

        <Divider />

        <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end', px: 2.5, py: 2 }}>
          <Button color="error" size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={!currentKbName.trim() || getTotalSources() > MAX_SOURCES}
          >
            Update
          </Button>
        </Stack>
        <ToastContainer position="bottom-right" autoClose={3000} newestOnTop={false} closeButton={true} />
      </MainCard>
    </Modal>
  );
}