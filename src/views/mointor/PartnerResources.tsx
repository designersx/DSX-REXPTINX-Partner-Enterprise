// "use client"
// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import { motion } from "framer-motion";
// import Skeleton from "@mui/material/Skeleton";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Chip,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   Tabs,
//   Tab,
//   Typography,
//   CircularProgress,
//   Link,
// } from '@mui/material';
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileAlt,
//   FaFileCsv,
//   FaFileCode,
//   FaFileArchive,
//   FaFileImage,
//   FaFileVideo,
//   FaFile,
//   FaExternalLinkAlt,
// } from 'react-icons/fa';

// const PartnerResources = () => {
//   const [activeTab, setActiveTab] = useState('');
//   const [tabs, setTabs] = useState([]);
//   const [content, setContent] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editResourceId, setEditResourceId] = useState(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedLink, setSelectedLink] = useState(null);
//   const [newContent, setNewContent] = useState({
//     category: '',
//     resourceType: '',
//     title: '',
//     description: '',
//     links: [''],
//     coverImage: null,
//     files: [],
//     coverPreview: '',
//     filePreviews: [],
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const fileInputRef = useRef(null);

//   const MAX_FILES = 5;

//   const resourceTypes = {
//     'Sales and Marketing': [
//       'Product Presentations',
//       'Case Studies',
//       'Brochures & Data Sheets',
//       'Marketing Collateral',
//       'Competitive Analysis',
//     ],
//     'Training Resources': [
//       'Onboarding Guides',
//       'Troubleshooting Guides',
//       'Technical Docs',
//       'FAQs',
//       'Webinar',
//     ],
//     'Support & Communications': [
//       'Leads',
//       'Partner Manager Contact Info',
//       'Newsletters',
//     ],
//   };

//   const fileIcons = {
//     'application/pdf': { component: FaFilePdf, color: 'error.main' },
//     'application/msword': { component: FaFileWord, color: 'primary.main' },
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
//       component: FaFileWord,
//       color: 'primary.main',
//     },
//     'application/vnd.ms-excel': { component: FaFileExcel, color: 'success.main' },
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
//       component: FaFileExcel,
//       color: 'success.main',
//     },
//     'application/vnd.ms-powerpoint': { component: FaFilePowerpoint, color: 'warning.main' },
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
//       component: FaFilePowerpoint,
//       color: 'warning.main',
//     },
//     'text/plain': { component: FaFileAlt, color: 'grey.600' },
//     'text/csv': { component: FaFileCsv, color: 'info.main' },
//     'application/json': { component: FaFileCode, color: 'secondary.main' },
//     'application/zip': { component: FaFileArchive, color: 'warning.main' },
//     'image': { component: FaFileImage, color: 'secondary.main' },
//     'video': { component: FaFileVideo, color: 'info.main' },
//     default: { component: FaFile, color: 'grey.400' },
//   };

//   // Fetch resources on component mount
//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/getresources`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         let groupedContent = {};

//         res.data.forEach((resource) => {
//           let parsedLinks = [];
//           try {
//             if (typeof resource.links === 'string') {
//               parsedLinks = JSON.parse(resource.links);
//             } else if (Array.isArray(resource.links)) {
//               parsedLinks = resource.links;
//             }
//           } catch (err) {
//             parsedLinks = [];
//           }
//           const formattedResource = {
//             ...resource,
//             coverImage: resource.coverImage
//               ? `${process.env.NEXT_PUBLIC_API_URL}${resource.coverImage}`
//               : null,
//             files: resource.files.map((file) => {
//               const icon = getFileIcon(file.fileType);
//               return {
//                 name: file.fileName,
//                 url: `${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`,
//                 type: file.fileType,
//                 size: (file.fileSize / 1024).toFixed(2) + ' KB',
//                 iconComponent: icon.component,
//                 color: icon.color,
//               };
//             }),
//             links: parsedLinks,
//             linkThumbnails: parsedLinks.map((link) => ({
//               url: link,
//               thumbnail: getLinkThumbnail(link),
//             })),
//           };
//           const category = resource.category?.trim();
//           if (category) {
//             if (!groupedContent[category]) {
//               groupedContent[category] = [];
//             }
//             groupedContent[category].push(formattedResource);
//           }
//         });
//         setContent(groupedContent);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching resources:', err);
//         setError('Failed to fetch resources.');
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, []);

//   // Update tabs based on content
//   useEffect(() => {
//     const availableTabs = Object.keys(content).sort();
//     setTabs(availableTabs);
//     if (availableTabs.length > 0 && !activeTab) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [content, activeTab]);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setNewContent((prev) => ({ ...prev, category: newValue, resourceType: '' }));
//   };

//   const handleInputChange = (e, index) => {
//     const { name, value, files } = e.target;
//     if (name === 'coverImage' && files[0]) {
//       compressImage(files[0], (compressed) => {
//         const preview = URL.createObjectURL(compressed);
//         setNewContent({
//           ...newContent,
//           coverImage: compressed,
//           coverPreview: preview,
//         });
//       });
//     } else if (name === 'files') {
//       const selectedFiles = Array.from(files);
//       if (newContent.files.length + selectedFiles.length > MAX_FILES) {
//         setError(`Maximum ${MAX_FILES} files allowed.`);
//         return;
//       }
//       const previews = selectedFiles.map((file) => getFilePreview(file));
//       setNewContent({
//         ...newContent,
//         files: [...newContent.files, ...selectedFiles],
//         filePreviews: [...newContent.filePreviews, ...previews],
//       });
//       setError('');
//       fileInputRef.current.value = null;
//     } else if (name === 'link') {
//       const updatedLinks = [...newContent.links];
//       updatedLinks[index] = value;
//       setNewContent({ ...newContent, links: updatedLinks });
//     } else {
//       setNewContent({ ...newContent, [name]: value });
//     }
//   };

//   const addLinkInput = () => {
//     setNewContent({ ...newContent, links: [...newContent.links, ''] });
//   };

//   const removeLinkInput = (index) => {
//     const updatedLinks = newContent.links.filter((_, i) => i !== index);
//     setNewContent({ ...newContent, links: updatedLinks });
//   };

//   const compressImage = (file, callback) => {
//     if (!file.type.startsWith('image/')) {
//       callback(file);
//       return;
//     }

//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       const maxWidth = 800;
//       const maxHeight = 800;
//       let width = img.width;
//       let height = img.height;

//       if (width > height) {
//         if (width > maxWidth) {
//           height *= maxWidth / width;
//           width = maxWidth;
//         }
//       } else {
//         if (height > maxHeight) {
//           width *= maxHeight / height;
//           height = maxHeight;
//         }
//       }

//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);

//       canvas.toBlob(
//         (blob) => {
//           if (blob) {
//             const compressedFile = new File([blob], file.name, {
//               type: 'image/jpeg',
//               lastModified: Date.now(),
//             });
//             callback(compressedFile);
//           }
//         },
//         'image/jpeg',
//         0.7
//       );
//     };
//   };

//   const getFileIcon = (type) => {
//     if (type === 'application/pdf') return fileIcons['application/pdf'];
//     if (type.includes('word') || type.includes('msword')) return fileIcons['application/msword'];
//     if (type.includes('spreadsheet') || type.includes('ms-excel')) return fileIcons['application/vnd.ms-excel'];
//     if (type.includes('presentation') || type.includes('ms-powerpoint')) return fileIcons['application/vnd.ms-powerpoint'];
//     if (type === 'text/plain') return fileIcons['text/plain'];
//     if (type === 'text/csv') return fileIcons['text/csv'];
//     if (type === 'application/json') return fileIcons['application/json'];
//     if (type === 'application/zip') return fileIcons['application/zip'];
//     if (type.startsWith('image/')) return fileIcons['image'];
//     if (type.startsWith('video/')) return fileIcons['video'];
//     return fileIcons['default'];
//   };

//   const getFilePreview = (file) => {
//     const type = file.type;
//     const url = URL.createObjectURL(file);
//     const size = (file.size / 1024).toFixed(2) + ' KB';
//     const icon = getFileIcon(type);
//     return { type, url, name: file.name, size, iconComponent: icon.component, color: icon.color };
//   };

//   const removeFile = (index) => {
//     const updatedFiles = newContent.files.filter((_, i) => i !== index);
//     const updatedPreviews = newContent.filePreviews.filter((_, i) => i !== index);
//     setNewContent({
//       ...newContent,
//       files: updatedFiles,
//       filePreviews: updatedPreviews,
//     });
//     setError('');
//   };

//   const handleFileClick = (file) => {
//     setSelectedFile(file);
//     setSelectedLink(null);
//     setShowPreviewModal(true);
//   };

//   const handleLinkClick = (link) => {
//     setSelectedLink(link);
//     setSelectedFile(null);
//     setShowPreviewModal(true);
//   };

//   const handleDownload = (file) => {
//     const link = document.createElement('a');
//     link.href = file.url;
//     link.download = file.name;
//     link.click();
//   };

//   const isYouTubeLink = (link) => {
//     return link && (link.includes('youtube.com') || link.includes('youtu.be'));
//   };

//   const getYouTubeVideoId = (link) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = link.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const getYouTubeEmbedUrl = (link) => {
//     const videoId = getYouTubeVideoId(link);
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
//   };

//   const getLinkThumbnail = (link) => {
//     if (isYouTubeLink(link)) {
//       const videoId = getYouTubeVideoId(link);
//       return `https://img.youtube.com/vi/${videoId}/0.jpg`;
//     }
//     return '/icons/link-icon.svg';
//   };

//   const IconRenderer = ({ iconComponent: Icon, color, size = 48 }) => (
//     <Icon sx={{ fontSize: size, color }} />
//   );

//   if (loading) {
//     return (
//       <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 4, bgcolor: 'grey.50', minHeight: '100vh' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h3" component="h1" color="text.primary" fontWeight="bold">
//           Partner Resources
//         </Typography>
//       </Box>

//       {tabs.length > 0 ? (
//         <>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             sx={{ mb: 4, '& .MuiTab-root': { fontSize: '1rem', fontWeight: 500 } }}
//             indicatorColor="primary"
//             textColor="primary"
//             variant="fullWidth"
//           >
//             {tabs.map((tab) => (
//               <Tab key={tab} label={tab} value={tab} />
//             ))}
//           </Tabs>

//           <Grid container spacing={4} justifyContent="center">
//   {loading ? (
//     // Modern shimmer while loading
//     [...Array(4)].map((_, i) => (
//       <Grid item xs={12} sm={6} key={i}>
//         <Card
//           sx={{
//             height: "100%",
//             borderRadius: 3,
//             overflow: "hidden",
//             boxShadow: 3,
//           }}
//         >
//           <Skeleton variant="rectangular" height={200} />
//           <CardContent>
//             <Skeleton variant="text" width="80%" />
//             <Skeleton variant="text" width="60%" />
//             <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
//           </CardContent>
//         </Card>
//       </Grid>
//     ))
//   ) : content[activeTab]?.length > 0 ? (
//     content[activeTab].map((item, index) => (
//       <Grid item xs={12} sm={6} md={6} key={index}>
//         <motion.div
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           transition={{ type: "spring", stiffness: 250, damping: 20 }}
//         >
//           <Card
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               height: "100%",
//               borderRadius: 3,
//               boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//               overflow: "hidden",
//               transition: "box-shadow 0.3s ease",
//               "&:hover": {
//                 boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//               },
//             }}
//           >
//             {item.coverImage && (
//               <CardMedia
//                 component="img"
//                 image={item.coverImage}
//                 alt="Cover"
//                 sx={{
//                   height: 220,
//                   width: "100%",
//                   objectFit: "fill",
//                 }}
//               />
//             )}
//             <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                 <Typography
//                   variant="h6"
//                   component="h3"
//                   color="text.primary"
//                   fontWeight={600}
//                   sx={{ flexGrow: 1, mr: 2, lineHeight: 1.4 }}
//                 >
//                   {item.title}
//                 </Typography>
//                 <Chip
//                   label={item.resourceType}
//                   size="small"
//                   color="primary"
//                   variant="filled"
//                   sx={{ fontSize: "0.7rem", fontWeight: 500 }}
//                 />
//               </Box>

//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{
//                   mt: 1.5,
//                   mb: 2,
//                   lineHeight: 1.6,
//                   display: "-webkit-box",
//                   WebkitLineClamp: 3,
//                   WebkitBoxOrient: "vertical",
//                   overflow: "hidden",
//                 }}
//               >
//                 {item.description}
//               </Typography>

//               {/* Links */}
//               {item.linkThumbnails?.length > 0 && (
//                 <Box sx={{ mb: 2 }}>
//                   <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={1}>
//                     Links
//                   </Typography>
//                   <Grid container spacing={1}>
//                     {item.linkThumbnails.map((linkThumb, idx) => (
//                       <Grid item xs={6} key={idx}>
//                         <motion.div whileHover={{ scale: 1.03 }}>
//                           <Card
//                             onClick={() => handleLinkClick(linkThumb.url)}
//                             sx={{
//                               position: "relative",
//                               cursor: "pointer",
//                               borderRadius: 2,
//                               overflow: "hidden",
//                               height: 90,
//                               "&:hover": { boxShadow: 3 },
//                             }}
//                           >
//                             <CardMedia
//                               component="img"
//                               image={linkThumb.thumbnail}
//                               alt="Link Thumbnail"
//                               sx={{ height: "100%", objectFit: "cover" }}
//                             />
//                             <Box
//                               sx={{
//                                 position: "absolute",
//                                 bottom: 8,
//                                 left: 8,
//                                 bgcolor: "rgba(0,0,0,0.6)",
//                                 borderRadius: 1,
//                                 px: 1,
//                                 py: 0.3,
//                               }}
//                             >
//                               <FaExternalLinkAlt size={12} color="white" />
//                             </Box>
//                           </Card>
//                         </motion.div>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Box>
//               )}

//               {/* Files */}
//               {item.files?.length > 0 && (
//                 <Box sx={{ mt: "auto" }}>
//                   <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={1}>
//                     Files
//                   </Typography>
//                   <Grid container spacing={1}>
//                     {item.files.map((file, idx) => (
//                       <Grid item xs={6} key={idx}>
//                         <motion.div whileHover={{ scale: 1.03 }}>
//                           <Card
//                             onClick={() => handleFileClick(file)}
//                             sx={{
//                               height: 90,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               bgcolor: "grey.50",
//                               borderRadius: 2,
//                               cursor: "pointer",
//                               "&:hover": { bgcolor: "grey.100" },
//                             }}
//                           >
//                             <IconRenderer
//                               iconComponent={file.iconComponent}
//                               color={file.color}
//                               size={28}
//                             />
//                             <Typography
//                               variant="caption"
//                               sx={{
//                                 ml: 1,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 fontWeight: 500,
//                                 color: "text.primary",
//                               }}
//                             >
//                               {file.name}
//                             </Typography>
//                           </Card>
//                         </motion.div>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </Box>
//               )}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </Grid>
//     ))
//   ) : (
//     <Grid item xs={12}>
//       <Box sx={{ textAlign: "center", py: 8 }}>
//         <Typography variant="h6" color="text.secondary" fontWeight={500}>
//           No resources available for this category.
//         </Typography>
//       </Box>
//     </Grid>
//   )}
// </Grid>
//         </>
//       ) : (
//         <Box sx={{ textAlign: 'center', py: 8 }}>
//           <Typography variant="h6" color="text.secondary" fontWeight="500">
//             No resources available.
//           </Typography>
//         </Box>
//       )}

//       {/* Preview Modal */}
//       <Dialog
//         open={showPreviewModal}
//         onClose={() => setShowPreviewModal(false)}
//         maxWidth="lg"
//         fullWidth
//         scroll="body"
//         PaperProps={{
//           sx: { borderRadius: 2 }
//         }}
//       >
//         <DialogTitle sx={{ pb: 1 }}>Preview</DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
//             {selectedFile && (
//               <>
//                 <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
//                   {selectedFile.name}
//                 </Typography>
//                 {selectedFile.type.startsWith('image/') && (
//                   <img
//                     src={selectedFile.url}
//                     alt={selectedFile.name}
//                     style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
//                   />
//                 )}
//                 {selectedFile.type.startsWith('video/') && (
//                   <video
//                     src={selectedFile.url}
//                     controls
//                     autoPlay
//                     style={{ width: '100%', maxHeight: '80vh' }}
//                   />
//                 )}
//                 {selectedFile.type === 'application/pdf' && (
//                   <iframe
//                     src={`${selectedFile.url}#zoom=fit`}
//                     title={selectedFile.name}
//                     style={{ width: '100%', height: '80vh', border: 'none' }}
//                   />
//                 )}
//                 {!selectedFile.type.startsWith('image/') &&
//                   !selectedFile.type.startsWith('video/') &&
//                   selectedFile.type !== 'application/pdf' && (
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         p: 4,
//                         bgcolor: 'grey.50',
//                         borderRadius: 2,
//                         textAlign: 'center',
//                       }}
//                     >
//                       <IconRenderer
//                         iconComponent={selectedFile.iconComponent}
//                         color={selectedFile.color}
//                         size={64}
//                       />
//                       <Typography variant="h6" color="text.primary" sx={{ mt: 2, mb: 1 }}>
//                         {selectedFile.name}
//                       </Typography>
//                       <Typography color="text.secondary" sx={{ mb: 3 }}>
//                         Size: {selectedFile.size}
//                       </Typography>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FaFile />}
//                         onClick={() => handleDownload(selectedFile)}
//                         sx={{ borderRadius: 2 }}
//                       >
//                         Download
//                       </Button>
//                     </Box>
//                   )}
//               </>
//             )}
//             {selectedLink && (
//               <>
//                 <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
//                   {selectedLink}
//                 </Typography>
//                 {isYouTubeLink(selectedLink) ? (
//                   <iframe
//                     src={getYouTubeEmbedUrl(selectedLink)}
//                     title="YouTube video player"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     style={{ width: '100%', height: '80vh' }}
//                   />
//                 ) : (
//                   <Link
//                     href={selectedLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     underline="hover"
//                     color="primary"
//                     variant="body1"
//                     sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
//                   >
//                     Open Link in New Tab
//                     <FaExternalLinkAlt size={14} />
//                   </Link>
//                 )}
//               </>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button 
//             onClick={() => setShowPreviewModal(false)} 
//             variant="outlined" 
//             color="primary"
//             sx={{ borderRadius: 1, px: 3 }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default PartnerResources;

// "use client"
// import axios from 'axios';
// import React, { useState, useRef, useEffect } from 'react';
// import { motion } from "framer-motion";
// import Skeleton from "@mui/material/Skeleton";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Chip,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   Tabs,
//   Tab,
//   Typography,
//   CircularProgress,
//   Link,
// } from '@mui/material';
// import {
//   FaFilePdf,
//   FaFileWord,
//   FaFileExcel,
//   FaFilePowerpoint,
//   FaFileAlt,
//   FaFileCsv,
//   FaFileCode,
//   FaFileArchive,
//   FaFileImage,
//   FaFileVideo,
//   FaFile,
//   FaExternalLinkAlt,
// } from 'react-icons/fa';

// const PartnerResources = () => {
//   const [activeTab, setActiveTab] = useState('');
//   const [tabs, setTabs] = useState([]);
//   const [content, setContent] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editResourceId, setEditResourceId] = useState(null);
//   const [showPreviewModal, setShowPreviewModal] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedLink, setSelectedLink] = useState(null);
//   const [newContent, setNewContent] = useState({
//     category: '',
//     resourceType: '',
//     title: '',
//     description: '',
//     links: [''],
//     coverImage: null,
//     files: [],
//     coverPreview: '',
//     filePreviews: [],
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const fileInputRef = useRef(null);

//   const MAX_FILES = 5;

//   const resourceTypes = {
//     'Sales and Marketing': [
//       'Product Presentations',
//       'Case Studies',
//       'Brochures & Data Sheets',
//       'Marketing Collateral',
//       'Competitive Analysis',
//     ],
//     'Training Resources': [
//       'Onboarding Guides',
//       'Troubleshooting Guides',
//       'Technical Docs',
//       'FAQs',
//       'Webinar',
//     ],
//     'Support & Communications': [
//       'Leads',
//       'Partner Manager Contact Info',
//       'Newsletters',
//     ],
//   };

//   const fileIcons = {
//     'application/pdf': { component: FaFilePdf, color: 'error.main' },
//     'application/msword': { component: FaFileWord, color: 'primary.main' },
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
//       component: FaFileWord,
//       color: 'primary.main',
//     },
//     'application/vnd.ms-excel': { component: FaFileExcel, color: 'success.main' },
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
//       component: FaFileExcel,
//       color: 'success.main',
//     },
//     'application/vnd.ms-powerpoint': { component: FaFilePowerpoint, color: 'warning.main' },
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
//       component: FaFilePowerpoint,
//       color: 'warning.main',
//     },
//     'text/plain': { component: FaFileAlt, color: 'grey.600' },
//     'text/csv': { component: FaFileCsv, color: 'info.main' },
//     'application/json': { component: FaFileCode, color: 'secondary.main' },
//     'application/zip': { component: FaFileArchive, color: 'warning.main' },
//     'image': { component: FaFileImage, color: 'secondary.main' },
//     'video': { component: FaFileVideo, color: 'info.main' },
//     default: { component: FaFile, color: 'grey.400' },
//   };

//   // Fetch resources on component mount
//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/getresources`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         });
//         let groupedContent = {};

//         res.data.forEach((resource) => {
//           let parsedLinks = [];
//           try {
//             if (typeof resource.links === 'string') {
//               parsedLinks = JSON.parse(resource.links);
//             } else if (Array.isArray(resource.links)) {
//               parsedLinks = resource.links;
//             }
//           } catch (err) {
//             parsedLinks = [];
//           }
//           const formattedResource = {
//             ...resource,
//             coverImage: resource.coverImage
//               ? `${process.env.NEXT_PUBLIC_API_URL}${resource.coverImage}`
//               : null,
//             files: resource.files.map((file) => {
//               const icon = getFileIcon(file.fileType);
//               return {
//                 name: file.fileName,
//                 url: `${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`,
//                 type: file.fileType,
//                 size: (file.fileSize / 1024).toFixed(2) + ' KB',
//                 iconComponent: icon.component,
//                 color: icon.color,
//               };
//             }),
//             links: parsedLinks,
//             linkThumbnails: parsedLinks.map((link) => ({
//               url: link,
//               thumbnail: getLinkThumbnail(link),
//             })),
//           };
//           const category = resource.category?.trim();
//           if (category) {
//             if (!groupedContent[category]) {
//               groupedContent[category] = [];
//             }
//             groupedContent[category].push(formattedResource);
//           }
//         });
//         setContent(groupedContent);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching resources:', err);
//         setError('Failed to fetch resources.');
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, []);

//   // Update tabs based on content
//   useEffect(() => {
//     const availableTabs = Object.keys(content).sort();
//     setTabs(availableTabs);
//     if (availableTabs.length > 0 && !activeTab) {
//       setActiveTab(availableTabs[0]);
//     }
//   }, [content, activeTab]);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setNewContent((prev) => ({ ...prev, category: newValue, resourceType: '' }));
//   };

//   const handleInputChange = (e, index) => {
//     const { name, value, files } = e.target;
//     if (name === 'coverImage' && files[0]) {
//       compressImage(files[0], (compressed) => {
//         const preview = URL.createObjectURL(compressed);
//         setNewContent({
//           ...newContent,
//           coverImage: compressed,
//           coverPreview: preview,
//         });
//       });
//     } else if (name === 'files') {
//       const selectedFiles = Array.from(files);
//       if (newContent.files.length + selectedFiles.length > MAX_FILES) {
//         setError(`Maximum ${MAX_FILES} files allowed.`);
//         return;
//       }
//       const previews = selectedFiles.map((file) => getFilePreview(file));
//       setNewContent({
//         ...newContent,
//         files: [...newContent.files, ...selectedFiles],
//         filePreviews: [...newContent.filePreviews, ...previews],
//       });
//       setError('');
//       fileInputRef.current.value = null;
//     } else if (name === 'link') {
//       const updatedLinks = [...newContent.links];
//       updatedLinks[index] = value;
//       setNewContent({ ...newContent, links: updatedLinks });
//     } else {
//       setNewContent({ ...newContent, [name]: value });
//     }
//   };

//   const addLinkInput = () => {
//     setNewContent({ ...newContent, links: [...newContent.links, ''] });
//   };

//   const removeLinkInput = (index) => {
//     const updatedLinks = newContent.links.filter((_, i) => i !== index);
//     setNewContent({ ...newContent, links: updatedLinks });
//   };

//   const compressImage = (file, callback) => {
//     if (!file.type.startsWith('image/')) {
//       callback(file);
//       return;
//     }

//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       const maxWidth = 800;
//       const maxHeight = 800;
//       let width = img.width;
//       let height = img.height;

//       if (width > height) {
//         if (width > maxWidth) {
//           height *= maxWidth / width;
//           width = maxWidth;
//         }
//       } else {
//         if (height > maxHeight) {
//           width *= maxHeight / height;
//           height = maxHeight;
//         }
//       }

//       canvas.width = width;
//       canvas.height = height;
//       ctx.drawImage(img, 0, 0, width, height);

//       canvas.toBlob(
//         (blob) => {
//           if (blob) {
//             const compressedFile = new File([blob], file.name, {
//               type: 'image/jpeg',
//               lastModified: Date.now(),
//             });
//             callback(compressedFile);
//           }
//         },
//         'image/jpeg',
//         0.7
//       );
//     };
//   };

//   const getFileIcon = (type) => {
//     if (type === 'application/pdf') return fileIcons['application/pdf'];
//     if (type.includes('word') || type.includes('msword')) return fileIcons['application/msword'];
//     if (type.includes('spreadsheet') || type.includes('ms-excel')) return fileIcons['application/vnd.ms-excel'];
//     if (type.includes('presentation') || type.includes('ms-powerpoint')) return fileIcons['application/vnd.ms-powerpoint'];
//     if (type === 'text/plain') return fileIcons['text/plain'];
//     if (type === 'text/csv') return fileIcons['text/csv'];
//     if (type === 'application/json') return fileIcons['application/json'];
//     if (type === 'application/zip') return fileIcons['application/zip'];
//     if (type.startsWith('image/')) return fileIcons['image'];
//     if (type.startsWith('video/')) return fileIcons['video'];
//     return fileIcons['default'];
//   };

//   const getFilePreview = (file) => {
//     const type = file.type;
//     const url = URL.createObjectURL(file);
//     const size = (file.size / 1024).toFixed(2) + ' KB';
//     const icon = getFileIcon(type);
//     return { type, url, name: file.name, size, iconComponent: icon.component, color: icon.color };
//   };

//   const removeFile = (index) => {
//     const updatedFiles = newContent.files.filter((_, i) => i !== index);
//     const updatedPreviews = newContent.filePreviews.filter((_, i) => i !== index);
//     setNewContent({
//       ...newContent,
//       files: updatedFiles,
//       filePreviews: updatedPreviews,
//     });
//     setError('');
//   };

//   const handleFileClick = (file) => {
//     setSelectedFile(file);
//     setSelectedLink(null);
//     setShowPreviewModal(true);
//   };

//   const handleLinkClick = (link) => {
//     setSelectedLink(link);
//     setSelectedFile(null);
//     setShowPreviewModal(true);
//   };

//   const handleDownload = (file) => {
//     const link = document.createElement('a');
//     link.href = file.url;
//     link.download = file.name;
//     link.click();
//   };

//   const isYouTubeLink = (link) => {
//     return link && (link.includes('youtube.com') || link.includes('youtu.be'));
//   };

//   const getYouTubeVideoId = (link) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = link.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const getYouTubeEmbedUrl = (link) => {
//     const videoId = getYouTubeVideoId(link);
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
//   };

//   const getLinkThumbnail = (link) => {
//     if (isYouTubeLink(link)) {
//       const videoId = getYouTubeVideoId(link);
//       return `https://img.youtube.com/vi/${videoId}/0.jpg`;
//     }
//     return '/icons/link-icon.svg';
//   };

//   const IconRenderer = ({ iconComponent: Icon, color, size = 48 }) => (
//     <Icon sx={{ fontSize: size, color }} />
//   );

//   if (loading) {
//     return (
//       <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 4, bgcolor: 'grey.50', minHeight: '100vh' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h3" component="h1" color="text.primary" fontWeight="bold">
//           Partner Resources
//         </Typography>
//       </Box>

//       {tabs.length > 0 ? (
//         <>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             sx={{ mb: 4, '& .MuiTab-root': { fontSize: '1rem', fontWeight: 500 } }}
//             indicatorColor="primary"
//             textColor="primary"
//             variant="fullWidth"
//           >
//             {tabs.map((tab) => (
//               <Tab key={tab} label={tab} value={tab} />
//             ))}
//           </Tabs>

//           <Grid container spacing={3} justifyContent="flex-start" alignItems="stretch">
//             {loading ? (
//               [...Array(4)].map((_, i) => (  // Adjusted to 4 skeletons for 2-col layout
//                 <Grid item xs={12} sm={6} key={i}>  // FIXED: Removed md=4, now always 2 cols on sm+
//                   <Card
//                     sx={{
//                       height: "100%",
//                       borderRadius: 3,
//                       overflow: "hidden",
//                       boxShadow: 1,
//                     }}
//                   >
//                     <Skeleton variant="rectangular" height={200} />
//                     <CardContent>
//                       <Skeleton variant="text" width="80%" />
//                       <Skeleton variant="text" width="60%" />
//                       <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))
//             ) : content[activeTab]?.length > 0 ? (
//               content[activeTab].map((item, index) => (
//                 <Grid item xs={12} sm={6} key={index}>  
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     transition={{ type: "spring", stiffness: 250, damping: 20 }}
//                   >
//                     <Card
//                       sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         height: "100%",
//                         minHeight: 450,  // INCREASED: Slightly taller min-height for better uniformity
//                         borderRadius: 3,
//                         boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
//                         overflow: "hidden",
//                         transition: "box-shadow 0.3s ease, transform 0.2s ease",
//                         border: "1px solid rgba(0,0,0,0.05)",
//                         "&:hover": {
//                           boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
//                           transform: "translateY(-2px)",
//                         },
//                         // REMOVED: width:"50%" - let Grid handle it
//                       }}
//                     >
//                       {item.coverImage && (
//                         <CardMedia
//                           component="img"
//                           image={item.coverImage}
//                           alt="Cover"
//                           sx={{
//                             height: 200,
//                             width: "100%",
//                             objectFit: "cover",  // CHANGED BACK: "cover" instead of "fill" to avoid distortion
//                           }}
//                         />
//                       )}
//                       <CardContent sx={{ 
//                         p: 3, 
//                         display: "flex", 
//                         flexDirection: "column", 
//                         flexGrow: 1,
//                         justifyContent: "space-between"
//                       }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                           <Typography
//                             variant="h6"
//                             component="h3"
//                             color="text.primary"
//                             fontWeight={600}
//                             sx={{ flexGrow: 1, mr: 2, lineHeight: 1.4 }}
//                           >
//                             {item.title}
//                           </Typography>
//                           <Chip
//                             label={item.resourceType}
//                             size="small"
//                             color="primary"
//                             variant="filled"
//                             sx={{ fontSize: "0.7rem", fontWeight: 500 }}
//                           />
//                         </Box>

//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                           sx={{
//                             mt: 1.5,
//                             mb: 2,
//                             lineHeight: 1.6,
//                             display: "-webkit-box",
//                             WebkitLineClamp: 3,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                           }}
//                         >
//                           {item.description}
//                         </Typography>

//                         {/* FIXED LINKS: Fixed height container, show ellipsis if overflow */}
//                         {item.linkThumbnails?.length > 0 && (
//                           <Box sx={{ mb: 2, height: 120, overflow: 'hidden' }}>  
//                             <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={1}>
//                               Links
//                             </Typography>
//                             <Grid container spacing={1}>
//                               {item.linkThumbnails.slice(0, 4).map((linkThumb, idx) => (  // Limit to 4 items max
//                                 <Grid item xs={6} key={idx}>
//                                   <motion.div whileHover={{ scale: 1.03 }}>
//                                     <Card
//                                       onClick={() => handleLinkClick(linkThumb.url)}
//                                       sx={{
//                                         position: "relative",
//                                         cursor: "pointer",
//                                         borderRadius: 2,
//                                         overflow: "hidden",
//                                         height: 90,
//                                         "&:hover": { boxShadow: 2 },
//                                       }}
//                                     >
//                                       <CardMedia
//                                         component="img"
//                                         image={linkThumb.thumbnail}
//                                         alt="Link Thumbnail"
//                                         sx={{ height: "100%", objectFit: "cover" }}
//                                       />
//                                       <Box
//                                         sx={{
//                                           position: "absolute",
//                                           bottom: 8,
//                                           left: 8,
//                                           bgcolor: "rgba(0,0,0,0.6)",
//                                           borderRadius: 1,
//                                           px: 1,
//                                           py: 0.3,
//                                         }}
//                                       >
//                                         <FaExternalLinkAlt size={12} color="white" />
//                                       </Box>
//                                     </Card>
//                                   </motion.div>
//                                 </Grid>
//                               ))}
//                               {item.linkThumbnails.length > 4 && (
//                                 <Grid item xs={12}>  // NEW: "See more" for overflow
//                                   <Typography variant="caption" color="text.secondary">
//                                     +{item.linkThumbnails.length - 4} more...
//                                   </Typography>
//                                 </Grid>
//                               )}
//                             </Grid>
//                           </Box>
//                         )}

//                         {/* FIXED FILES: Same as links - strict height, limit items */}
//                         {item.files?.length > 0 && (
//                           <Box sx={{ height: 120, overflow: 'hidden' }}>
//                             <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={1}>
//                               Files
//                             </Typography>
//                             <Grid container spacing={1}>
//                               {item.files.slice(0, 4).map((file, idx) => (  // Limit to 4 items max
//                                 <Grid item xs={6} key={idx}>
//                                   <motion.div whileHover={{ scale: 1.03 }}>
//                                     <Card
//                                       onClick={() => handleFileClick(file)}
//                                       sx={{
//                                         height: 90,
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         bgcolor: "grey.50",
//                                         borderRadius: 2,
//                                         cursor: "pointer",
//                                         "&:hover": { bgcolor: "grey.100" },
//                                       }}
//                                     >
//                                       <IconRenderer
//                                         iconComponent={file.iconComponent}
//                                         color={file.color}
//                                         size={28}
//                                       />
//                                       <Typography
//                                         variant="caption"
//                                         sx={{
//                                           ml: 1,
//                                           overflow: "hidden",
//                                           textOverflow: "ellipsis",
//                                           whiteSpace: "nowrap",
//                                           fontWeight: 500,
//                                           color: "text.primary",
//                                         }}
//                                       >
//                                         {file.name}
//                                       </Typography>
//                                     </Card>
//                                   </motion.div>
//                                 </Grid>
//                               ))}
//                               {item.files.length > 4 && (
//                                 <Grid item xs={12}>  // NEW: "See more" for overflow
//                                   <Typography variant="caption" color="text.secondary">
//                                     +{item.files.length - 4} more...
//                                   </Typography>
//                                 </Grid>
//                               )}
//                             </Grid>
//                           </Box>
//                         )}

//                         {/* NEW: Spacer to push content up if sections are empty */}
//                         <Box sx={{ flexGrow: 1 }} />
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </Grid>
//               ))
//             ) : (
//               <Grid item xs={12}>
//                 <Box sx={{ textAlign: "center", py: 8 }}>
//                   <Typography variant="h6" color="text.secondary" fontWeight={500}>
//                     No resources available for this category.
//                   </Typography>
//                   <Box sx={{ mt: 2, color: 'grey.400' }}>
//                     <FaFile size={48} />
//                   </Box>
//                 </Box>
//               </Grid>
//             )}
//           </Grid>
//         </>
//       ) : (
//         <Box sx={{ textAlign: 'center', py: 8 }}>
//           <Typography variant="h6" color="text.secondary" fontWeight={500}>
//             No resources available.
//           </Typography>
//           <Box sx={{ mt: 2, color: 'grey.400' }}>
//             <FaFile size={48} />
//           </Box>
//         </Box>
//       )}

//       {/* Preview Modal */}
//       <Dialog
//         open={showPreviewModal}
//         onClose={() => setShowPreviewModal(false)}
//         maxWidth="lg"
//         fullWidth
//         scroll="body"
//         PaperProps={{
//           sx: { borderRadius: 2 }
//         }}
//       >
//         <DialogTitle sx={{ pb: 1 }}>Preview</DialogTitle>
//         <DialogContent sx={{ p: 3 }}>
//           <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
//             {selectedFile && (
//               <>
//                 <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
//                   {selectedFile.name}
//                 </Typography>
//                 {selectedFile.type.startsWith('image/') && (
//                   <img
//                     src={selectedFile.url}
//                     alt={selectedFile.name}
//                     style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
//                   />
//                 )}
//                 {selectedFile.type.startsWith('video/') && (
//                   <video
//                     src={selectedFile.url}
//                     controls
//                     autoPlay
//                     style={{ width: '100%', maxHeight: '80vh' }}
//                   />
//                 )}
//                 {selectedFile.type === 'application/pdf' && (
//                   <iframe
//                     src={`${selectedFile.url}#zoom=fit`}
//                     title={selectedFile.name}
//                     style={{ width: '100%', height: '80vh', border: 'none' }}
//                   />
//                 )}
//                 {!selectedFile.type.startsWith('image/') &&
//                   !selectedFile.type.startsWith('video/') &&
//                   selectedFile.type !== 'application/pdf' && (
//                     <Box
//                       sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         p: 4,
//                         bgcolor: 'grey.50',
//                         borderRadius: 2,
//                         textAlign: 'center',
//                       }}
//                     >
//                       <IconRenderer
//                         iconComponent={selectedFile.iconComponent}
//                         color={selectedFile.color}
//                         size={64}
//                       />
//                       <Typography variant="h6" color="text.primary" sx={{ mt: 2, mb: 1 }}>
//                         {selectedFile.name}
//                       </Typography>
//                       <Typography color="text.secondary" sx={{ mb: 3 }}>
//                         Size: {selectedFile.size}
//                       </Typography>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<FaFile />}
//                         onClick={() => handleDownload(selectedFile)}
//                         sx={{ borderRadius: 2 }}
//                       >
//                         Download
//                       </Button>
//                     </Box>
//                   )}
//               </>
//             )}
//             {selectedLink && (
//               <>
//                 <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
//                   {selectedLink}
//                 </Typography>
//                 {isYouTubeLink(selectedLink) ? (
//                   <iframe
//                     src={getYouTubeEmbedUrl(selectedLink)}
//                     title="YouTube video player"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                     style={{ width: '100%', height: '80vh' }}
//                   />
//                 ) : (
//                   <Link
//                     href={selectedLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     underline="hover"
//                     color="primary"
//                     variant="body1"
//                     sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
//                   >
//                     Open Link in New Tab
//                     <FaExternalLinkAlt size={14} />
//                   </Link>
//                 )}
//               </>
//             )}
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button 
//             onClick={() => setShowPreviewModal(false)} 
//             variant="outlined" 
//             color="primary"
//             sx={{ borderRadius: 1, px: 3 }}
//           >
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default PartnerResources;
"use client"
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Link,
  Stack,
  Rating,
  Divider,
  IconButton,
} from '@mui/material';
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
  FaFileCsv,
  FaFileCode,
  FaFileArchive,
  FaFileImage,
  FaFileVideo,
  FaFile,
  FaExternalLinkAlt,
  FaHeart,
} from 'react-icons/fa';

const PartnerResources = () => {
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState([]);
  const [content, setContent] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [newContent, setNewContent] = useState({
    category: '',
    resourceType: '',
    title: '',
    description: '',
    links: [''],
    coverImage: null,
    files: [],
    coverPreview: '',
    filePreviews: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const MAX_FILES = 5;

  const resourceTypes = {
    'Sales and Marketing': [
      'Product Presentations',
      'Case Studies',
      'Brochures & Data Sheets',
      'Marketing Collateral',
      'Competitive Analysis',
    ],
    'Training Resources': [
      'Onboarding Guides',
      'Troubleshooting Guides',
      'Technical Docs',
      'FAQs',
      'Webinar',
    ],
    'Support & Communications': [
      'Leads',
      'Partner Manager Contact Info',
      'Newsletters',
    ],
  };

  const fileIcons = {
    'application/pdf': { component: FaFilePdf, color: 'error.main' },
    'application/msword': { component: FaFileWord, color: 'primary.main' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      component: FaFileWord,
      color: 'primary.main',
    },
    'application/vnd.ms-excel': { component: FaFileExcel, color: 'success.main' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      component: FaFileExcel,
      color: 'success.main',
    },
    'application/vnd.ms-powerpoint': { component: FaFilePowerpoint, color: 'warning.main' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
      component: FaFilePowerpoint,
      color: 'warning.main',
    },
    'text/plain': { component: FaFileAlt, color: 'grey.600' },
    'text/csv': { component: FaFileCsv, color: 'info.main' },
    'application/json': { component: FaFileCode, color: 'secondary.main' },
    'application/zip': { component: FaFileArchive, color: 'warning.main' },
    'image': { component: FaFileImage, color: 'secondary.main' },
    'video': { component: FaFileVideo, color: 'info.main' },
    default: { component: FaFile, color: 'grey.400' },
  };

  // Fetch resources on component mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/getresources`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        let groupedContent = {};

        res.data.forEach((resource) => {
          let parsedLinks = [];
          try {
            if (typeof resource.links === 'string') {
              parsedLinks = JSON.parse(resource.links);
            } else if (Array.isArray(resource.links)) {
              parsedLinks = resource.links;
            }
          } catch (err) {
            parsedLinks = [];
          }
          const formattedResource = {
            ...resource,
            coverImage: resource.coverImage
              ? `${process.env.NEXT_PUBLIC_API_URL}${resource.coverImage}`
              : null,
            files: resource.files.map((file) => {
              const icon = getFileIcon(file.fileType);
              return {
                name: file.fileName,
                url: `${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`,
                type: file.fileType,
                size: (file.fileSize / 1024).toFixed(2) + ' KB',
                iconComponent: icon.component,
                color: icon.color,
              };
            }),
            links: parsedLinks,
            linkThumbnails: parsedLinks.map((link) => ({
              url: link,
              thumbnail: getLinkThumbnail(link),
            })),
          };
          const category = resource.category?.trim();
          if (category) {
            if (!groupedContent[category]) {
              groupedContent[category] = [];
            }
            groupedContent[category].push(formattedResource);
          }
        });
        setContent(groupedContent);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to fetch resources.');
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Update tabs based on content
  useEffect(() => {
    const availableTabs = Object.keys(content).sort();
    setTabs(availableTabs);
    if (availableTabs.length > 0 && !activeTab) {
      setActiveTab(availableTabs[0]);
    }
  }, [content, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setNewContent((prev) => ({ ...prev, category: newValue, resourceType: '' }));
  };

  const handleInputChange = (e, index) => {
    const { name, value, files } = e.target;
    if (name === 'coverImage' && files[0]) {
      compressImage(files[0], (compressed) => {
        const preview = URL.createObjectURL(compressed);
        setNewContent({
          ...newContent,
          coverImage: compressed,
          coverPreview: preview,
        });
      });
    } else if (name === 'files') {
      const selectedFiles = Array.from(files);
      if (newContent.files.length + selectedFiles.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed.`);
        return;
      }
      const previews = selectedFiles.map((file) => getFilePreview(file));
      setNewContent({
        ...newContent,
        files: [...newContent.files, ...selectedFiles],
        filePreviews: [...newContent.filePreviews, ...previews],
      });
      setError('');
      fileInputRef.current.value = null;
    } else if (name === 'link') {
      const updatedLinks = [...newContent.links];
      updatedLinks[index] = value;
      setNewContent({ ...newContent, links: updatedLinks });
    } else {
      setNewContent({ ...newContent, [name]: value });
    }
  };

  const addLinkInput = () => {
    setNewContent({ ...newContent, links: [...newContent.links, ''] });
  };

  const removeLinkInput = (index) => {
    const updatedLinks = newContent.links.filter((_, i) => i !== index);
    setNewContent({ ...newContent, links: updatedLinks });
  };

  const compressImage = (file, callback) => {
    if (!file.type.startsWith('image/')) {
      callback(file);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 800;
      const maxHeight = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            callback(compressedFile);
          }
        },
        'image/jpeg',
        0.7
      );
    };
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return fileIcons['application/pdf'];
    if (type.includes('word') || type.includes('msword')) return fileIcons['application/msword'];
    if (type.includes('spreadsheet') || type.includes('ms-excel')) return fileIcons['application/vnd.ms-excel'];
    if (type.includes('presentation') || type.includes('ms-powerpoint')) return fileIcons['application/vnd.ms-powerpoint'];
    if (type === 'text/plain') return fileIcons['text/plain'];
    if (type === 'text/csv') return fileIcons['text/csv'];
    if (type === 'application/json') return fileIcons['application/json'];
    if (type === 'application/zip') return fileIcons['application/zip'];
    if (type.startsWith('image/')) return fileIcons['image'];
    if (type.startsWith('video/')) return fileIcons['video'];
    return fileIcons['default'];
  };

  const getFilePreview = (file) => {
    const type = file.type;
    const url = URL.createObjectURL(file);
    const size = (file.size / 1024).toFixed(2) + ' KB';
    const icon = getFileIcon(type);
    return { type, url, name: file.name, size, iconComponent: icon.component, color: icon.color };
  };

  const removeFile = (index) => {
    const updatedFiles = newContent.files.filter((_, i) => i !== index);
    const updatedPreviews = newContent.filePreviews.filter((_, i) => i !== index);
    setNewContent({
      ...newContent,
      files: updatedFiles,
      filePreviews: updatedPreviews,
    });
    setError('');
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setSelectedLink(null);
    setShowPreviewModal(true);
  };

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    setSelectedFile(null);
    setShowPreviewModal(true);
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const isYouTubeLink = (link) => {
    return link && (link.includes('youtube.com') || link.includes('youtu.be'));
  };

  const getYouTubeVideoId = (link) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeEmbedUrl = (link) => {
    const videoId = getYouTubeVideoId(link);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getLinkThumbnail = (link) => {
    if (isYouTubeLink(link)) {
      const videoId = getYouTubeVideoId(link);
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    return '/icons/link-icon.svg';
  };

  const IconRenderer = ({ iconComponent: Icon, color, size = 48 }) => (
    <Icon sx={{ fontSize: size, color }} />
  );

  // Wishlist state
  const [wishlistedResources, setWishlistedResources] = useState({});

  const toggleWishlist = (id) => {
    setWishlistedResources(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 4, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" color="text.primary" fontWeight="bold">
          Partner Resources
        </Typography>
      </Box>

      {tabs.length > 0 ? (
        <>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 4, '& .MuiTab-root': { fontSize: '1rem', fontWeight: 500 } }}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {tabs.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Grid container spacing={3} justifyContent="flex-start" alignItems="stretch">
            {content[activeTab]?.length > 0 ? (
              content[activeTab].map((item, index) => ( // FIXED: Ensure map renders ALL items
                <Grid item xs={12} sm={6} md={4} key={index}> {/* Reference: 3-col on md */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  >
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        minHeight: 450,
                        borderRadius: 3,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        transition: "all .4s ease-in-out",
                        border: "1px solid rgba(0,0,0,0.05)",
                        position: 'relative',
                        "&:hover": {
                          boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      {/* Absolute chips on top */}
                      {/* <Stack
                        direction="row"
                        sx={{ 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          width: '100%', 
                          position: 'absolute', 
                          top: 8, 
                          left: 8, 
                          right: 8,
                          zIndex: 1
                        }}
                      >
                        {(!item.files || item.files.length === 0) && (!item.links || item.links.length === 0) && (
                          <Chip variant="light" color="error" size="small" label="No Attachments" />
                        )}
                        {(item.files && item.files.length > 0) && (
                          <Chip label={`${item.files.length} Files`} variant="combined" color="success" size="small" />
                        )}
                        {(item.links && item.links.length > 0) && (
                          <Chip label={`${item.links.length} Links`} variant="combined" color="info" size="small" />
                        )}
                        <IconButton
                          color={wishlistedResources[item.id] ? 'error' : 'secondary'}
                          sx={{ ml: 'auto', '&:hover': { bgcolor: 'transparent' } }}
                          onClick={() => toggleWishlist(item.id)}
                        >
                          <FaHeart size={18} />
                        </IconButton>
                      </Stack> */}

                      {/* Image */}
                      {item.coverImage ? (
                        <CardMedia
                          component="img"
                          image={item.coverImage}
                          alt={item.title}
                          sx={{
                            height: 250,
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box sx={{ height: 250, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaFile size={48} color="grey.400" />
                        </Box>
                      )}

                      <Divider />

                      <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Stack>
                              <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                  color: 'text.primary',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  display: 'block',
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Chip
                                label={item.resourceType}
                                size="small"
                                color="primary"
                                variant="filled"
                                sx={{ fontSize: "0.7rem", fontWeight: 500, mt: 0.5 }}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                                mb: 2,
                                lineHeight: 1.6,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Grid>
                          {/* Rating placeholder */}
                          {/* <Grid item xs={12}>
                            <Stack direction="row" sx={{ alignItems: 'flex-start' }}>
                              <Rating precision={0.5} value={4.5} size="small" readOnly />
                              <Typography variant="caption" sx={{ ml: 1 }}>(4.5)</Typography>
                            </Stack>
                          </Grid> */}
                          {/* Total items as "price" */}
                          {/* <Grid item xs={12}>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
                              <Stack>
                                <Typography variant="h5" color="success.main">
                                  {item.files?.length + (item.links?.length || 0)} Items
                                </Typography>
                                {item.files?.[0] && (
                                  <Typography variant="body2" color="text.secondary">
                                    {item.files[0].name}
                                  </Typography>
                                )}
                              </Stack>
                              <Button 
                                variant="contained" 
                                onClick={() => {
                                  if (item.files?.[0]) handleFileClick(item.files[0]);
                                  else if (item.links?.[0]) handleLinkClick(item.links[0]);
                                }}
                                disabled={!item.files?.length && !item.links?.length}
                                sx={{ borderRadius: 2 }}
                              >
                                {(!item.files?.length && !item.links?.length) ? 'No Items' : 'View Resource'}
                              </Button>
                            </Stack>
                          </Grid> */}
                          {/* FIXED: Add back summary grids for files/links - but compact to avoid height issues */}
                          {item.linkThumbnails?.length > 0 && (
                            <Grid item xs={12}>
                              <Box sx={{ height: 80, overflow: 'hidden' }}>
                                <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={1} sx={{ fontSize: '0.875rem' }}>
                                  Links ({item.linkThumbnails.length})
                                </Typography>
                                <Grid container spacing={1}>
                                  {item.linkThumbnails.slice(0, 2).map((linkThumb, idx) => (
                                    <Grid item xs={6} key={idx}>
                                      <Card
                                        onClick={() => handleLinkClick(linkThumb.url)}
                                        sx={{ height: 60, cursor: 'pointer', '&:hover': { boxShadow: 1 } }}
                                      >
                                        <CardMedia
                                          component="img"
                                          image={linkThumb.thumbnail}
                                          sx={{ height: '100%', objectFit: 'cover' }}
                                        />
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            </Grid>
                          )}
                          {item.files?.length > 0 && (
                            <Grid item xs={12}>
                              <Box sx={{ height: 80, overflow: 'hidden' }}>
                                <Typography variant="subtitle2" color="text.primary" fontWeight={600} mb={1} sx={{ fontSize: '0.875rem' }}>
                                  Files ({item.files.length})
                                </Typography>
                                <Grid container spacing={1}>
                                  {item.files.slice(0, 2).map((file, idx) => (
                                    <Grid item xs={6} key={idx}>
                                      <Card
                                        onClick={() => handleFileClick(file)}
                                        sx={{ height: 60, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': { boxShadow: 1 } }}
                                      >
                                        <IconRenderer iconComponent={file.iconComponent} color={file.color} size={20} />
                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                          {file.name.slice(0, 10)}...
                                        </Typography>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary" fontWeight={500}>
                    No resources available for this category.
                  </Typography>
                  <Box sx={{ mt: 2, color: 'grey.400' }}>
                    <FaFile size={48} />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" fontWeight="500">
            No resources available.
          </Typography>
          <Box sx={{ mt: 2, color: 'grey.400' }}>
            <FaFile size={48} />
          </Box>
        </Box>
      )}

      {/* Preview Modal - unchanged */}
      <Dialog
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        maxWidth="lg"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Preview</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
            {selectedFile && (
              <>
                <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
                  {selectedFile.name}
                </Typography>
                {selectedFile.type.startsWith('image/') && (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                  />
                )}
                {selectedFile.type.startsWith('video/') && (
                  <video
                    src={selectedFile.url}
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: '80vh' }}
                  />
                )}
                {selectedFile.type === 'application/pdf' && (
                  <iframe
                    src={`${selectedFile.url}#zoom=fit`}
                    title={selectedFile.name}
                    style={{ width: '100%', height: '80vh', border: 'none' }}
                  />
                )}
                {!selectedFile.type.startsWith('image/') &&
                  !selectedFile.type.startsWith('video/') &&
                  selectedFile.type !== 'application/pdf' && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 4,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                        textAlign: 'center',
                      }}
                    >
                      <IconRenderer
                        iconComponent={selectedFile.iconComponent}
                        color={selectedFile.color}
                        size={64}
                      />
                      <Typography variant="h6" color="text.primary" sx={{ mt: 2, mb: 1 }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Size: {selectedFile.size}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaFile />}
                        onClick={() => handleDownload(selectedFile)}
                        sx={{ borderRadius: 2 }}
                      >
                        Download
                      </Button>
                    </Box>
                  )}
              </>
            )}
            {selectedLink && (
              <>
                <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
                  {selectedLink}
                </Typography>
                {isYouTubeLink(selectedLink) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedLink)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '80vh' }}
                  />
                ) : (
                  <Link
                    href={selectedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    color="primary"
                    variant="body1"
                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                  >
                    Open Link in New Tab
                    <FaExternalLinkAlt size={14} />
                  </Link>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setShowPreviewModal(false)} 
            variant="outlined" 
            color="primary"
            sx={{ borderRadius: 1, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PartnerResources;