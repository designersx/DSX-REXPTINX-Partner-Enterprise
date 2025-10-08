"use client"
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-icons/fa';

const PartnerResources = () => {
  const [activeTab, setActiveTab] = useState('Sales and Marketing');
  const [content, setContent] = useState({
    'Sales and Marketing': [],
    'Training Resources': [],
    'Support & Communications': [],
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [newContent, setNewContent] = useState({
    category: 'Sales and Marketing',
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

  const tabs = ['Sales and Marketing', 'Training Resources', 'Support & Communications'];
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
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const groupedContent = {
          'Sales and Marketing': [],
          'Training Resources': [],
          'Support & Communications': [],
        };

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
          const iconInfo = getFileIconForType(); // Helper if needed, but per file
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
          if (groupedContent[resource.category]) {
            groupedContent[resource.category].push(formattedResource);
          }
        });
        setContent(groupedContent);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch resources.');
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNewContent({ ...newContent, category: tab, resourceType: '' });
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

  return (
    <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="text.primary">
          Partner Resources
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => handleTabChange(newValue)}
        sx={{ mb: 3 }}
        indicatorColor="primary"
        textColor="primary"
      >
        {tabs.map((tab) => (
          <Tab key={tab} label={tab} value={tab} />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {content[activeTab].length > 0 ? (
            content[activeTab].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 1,
                    '&:hover': { boxShadow: 3 },
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {item.coverImage && (
                    <CardMedia component="img" image={item.coverImage} alt="Cover" sx={{ height: 160 }} />
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography gutterBottom variant="h6" component="h3" color="text.primary">
                      {item.title}
                    </Typography>
                    <Chip
                      label={item.resourceType}
                      size="small"
                      color="primary"
                      sx={{ mb: 1.5, display: 'block' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    {item.linkThumbnails && item.linkThumbnails.length > 0 && (
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        {item.linkThumbnails.map((linkThumb, idx) => (
                          <Grid item xs={6} key={idx}>
                            <Card
                              sx={{ position: 'relative', cursor: 'pointer', '&:hover': { boxShadow: 2 } }}
                              onClick={() => handleLinkClick(linkThumb.url)}
                            >
                              <CardMedia
                                component="img"
                                image={linkThumb.thumbnail}
                                alt="Link Thumbnail"
                                sx={{ height: 96 }}
                              />
                              <Box sx={{ position: 'absolute', bottom: 1, left: 1 }}>
                                <Chip label="Link" size="small" color="primary" />
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                    {item.files.length > 0 && (
                      <Grid container spacing={1}>
                        {item.files.map((file, idx) => (
                          <Grid item xs={6} key={idx}>
                            <Card
                              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 2 } }}
                              onClick={() => handleFileClick(file)}
                            >
                              {file.type.startsWith('image/') && (
                                <CardMedia component="img" image={file.url} alt={file.name} sx={{ height: 96 }} />
                              )}
                              {file.type.startsWith('video/') && (
                                <CardMedia
                                  component="video"
                                  src={file.url}
                                  sx={{ height: 96, objectFit: 'cover' }}
                                  muted
                                  playsInline
                                />
                              )}
                              {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
                                <CardContent
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 96,
                                    p: 1,
                                    bgcolor: 'grey.100',
                                    '&:hover': { bgcolor: 'grey.200' },
                                  }}
                                >
                                  <IconRenderer iconComponent={file.iconComponent} color={file.color} size={48} />
                                  <Typography
                                    variant="caption"
                                    sx={{ mt: 0.5, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
                                  >
                                    {file.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {file.size}
                                  </Typography>
                                </CardContent>
                              )}
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No resources available for this category.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Preview Modal */}
      <Dialog
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        maxWidth="lg"
        fullWidth
        scroll="body"
      >
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: '80vh', overflow: 'auto' }}>
            {selectedFile && (
              <>
                <Typography variant="h6" gutterBottom color="text.primary">
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
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                      }}
                    >
                      <IconRenderer
                        iconComponent={selectedFile.iconComponent}
                        color={selectedFile.color}
                        size={64}
                      />
                      <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Size: {selectedFile.size}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload(selectedFile)}
                      >
                        Download
                      </Button>
                    </Box>
                  )}
              </>
            )}
            {selectedLink && (
              <>
                <Typography variant="h6" gutterBottom color="text.primary">
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
                  >
                    Open Link in New Tab
                  </Link>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PartnerResources;