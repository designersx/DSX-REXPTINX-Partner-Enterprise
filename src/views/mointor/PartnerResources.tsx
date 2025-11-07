'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// MUI Components
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Slide from '@mui/material/Slide';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import EmptyUserCard from '../../../src/app/(dashboard)/dashboard/skeleton/EmptyUserCard';

// Icons
import { Edit } from '@wandersonalwes/iconsax-react';
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
  FaEye
} from 'react-icons/fa';

const DefaultCover = '/assets/images/online-panel/courseImg1.png';

// File Icon Mapping
const fileIcons = {
  'application/pdf': { component: FaFilePdf, color: 'error.main' },
  'application/msword': { component: FaFileWord, color: 'primary.main' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { component: FaFileWord, color: 'primary.main' },
  'application/vnd.ms-excel': { component: FaFileExcel, color: 'success.main' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { component: FaFileExcel, color: 'success.main' },
  'application/vnd.ms-powerpoint': { component: FaFilePowerpoint, color: 'warning.main' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { component: FaFilePowerpoint, color: 'warning.main' },
  'text/plain': { component: FaFileAlt, color: 'grey.600' },
  'text/csv': { component: FaFileCsv, color: 'info.main' },
  'application/json': { component: FaFileCode, color: 'secondary.main' },
  'application/zip': { component: FaFileArchive, color: 'warning.main' },
  image: { component: FaFileImage, color: 'secondary.main' },
  video: { component: FaFileVideo, color: 'info.main' },
  default: { component: FaFile, color: 'grey.400' }
};

const PartnerResources = () => {
  const [activeTab, setActiveTab] = useState('');
  const [tabs, setTabs] = useState([]);
  const [content, setContent] = useState({});
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);

  // Fetch Resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/getresources`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        let groupedContent = {};
        res.data.forEach((resource) => {
          let parsedLinks = [];
          try {
            parsedLinks = typeof resource.links === 'string' ? JSON.parse(resource.links) : resource.links || [];
          } catch {
            parsedLinks = [];
          }

          const formattedResource = {
            ...resource,
            coverImage: resource.coverImage ? `${process.env.NEXT_PUBLIC_API_URL}${resource.coverImage}` : DefaultCover,
            files: (resource.files || []).map((file) => {
              const icon = getFileIcon(file.fileType);
              return {
                name: file.fileName,
                url: `${process.env.NEXT_PUBLIC_API_URL}${file.filePath}`,
                type: file.fileType,
                size: (file.fileSize / 1024).toFixed(2) + ' KB',
                iconComponent: icon.component,
                color: icon.color
              };
            }),
            links: parsedLinks,
            linkThumbnails: parsedLinks.map((link) => ({
              url: link,
              thumbnail: getLinkThumbnail(link)
            }))
          };

          const category = resource.category?.trim();
          if (category) {
            if (!groupedContent[category]) groupedContent[category] = [];
            groupedContent[category].push(formattedResource);
          }
        });

        setContent(groupedContent);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Tabs setup
  useEffect(() => {
    const availableTabs = Object.keys(content).sort();
    setTabs(availableTabs);
    if (availableTabs.length > 0 && !activeTab) setActiveTab(availableTabs[0]);
  }, [content, activeTab]);

  useEffect(() => {
    const resourcesForTab = content[activeTab] || [];
    setFilteredResources(resourcesForTab);
  }, [activeTab, content]);

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return fileIcons['application/pdf'];
    if (type.includes('word')) return fileIcons['application/msword'];
    if (type.includes('excel') || type.includes('spreadsheet')) return fileIcons['application/vnd.ms-excel'];
    if (type.includes('powerpoint') || type.includes('presentation')) return fileIcons['application/vnd.ms-powerpoint'];
    if (type.startsWith('image/')) return fileIcons['image'];
    if (type.startsWith('video/')) return fileIcons['video'];
    return fileIcons['default'];
  };

  const getLinkThumbnail = (link) => {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = link.match(regExp);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/0.jpg`;
      }
    }
    return '/icons/link-icon.svg';
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

  const IconRenderer = ({ iconComponent: Icon, color, size = 24 }) => (
    <Icon style={{ fontSize: size, color: `var(--mui-palette-${color})` || color }} />
  );

  const ResourceCard = ({ resource }) => (
    <MainCard content={false} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', maxWidth: 400 }}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <CardMedia
          component="img"
          image={resource.coverImage}
          alt={resource.title}
          sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 1 }}
        />
      </Box>
      {resource.resourceType && (
        <Badge
          sx={{
            mt: 2,
            alignSelf: 'flex-start',
            left: 28,
            marginLeft: '20px',
            marginBottom: '10px',
            '.MuiBadge-badge': {
              p: 2,
              borderRadius: 0.5,
              bgcolor: 'primary.main',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 600
            }
          }}
          badgeContent={resource.resourceType}
        />
      )}

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="h6" noWrap>
          {resource.title}
        </Typography>
      </Stack>

      {/* Description Section */}
      {resource.description && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: 'text.secondary',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-line' // \n ko new line ke tarah dikhata hai
          }}
        >
          {resource.description.replace(/(.{50})/g, '$1\n')}
        </Typography>
      )}

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 350, pr: 1 }}>
        {/* Links Section */}
        {resource.links?.length > 0 && (
          <Stack sx={{ py: 1 }}>
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', mb: 1 }}>Links</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                overflowX: 'auto',
                py: 1,
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 2 }
              }}
            >
              {resource.linkThumbnails.map((linkThumb, idx) => (
                <Box
                  key={idx}
                  onClick={() => handleLinkClick(linkThumb.url)}
                  sx={{
                    minWidth: 80,
                    height: 70,
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'grey.200' },
                    flexShrink: 0
                  }}
                >
                  <CardMedia
                    component="img"
                    image={linkThumb.thumbnail}
                    alt="Link"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 3,
                      left: 3,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      borderRadius: 1,
                      p: 0.25
                    }}
                  >
                    <FaEye size={10} color="white" />
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>
        )}

        {/* Files Section */}
        {resource.files?.length > 0 && (
          <Stack sx={{ py: 1 }}>
            <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', mb: 1 }}>Files ({resource.files.length})</Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'flex-start'
              }}
            >
              {resource.files.map((file, idx) => (
                <Box
                  key={idx}
                  onClick={() => handleFileClick(file)}
                  sx={{
                    width: '30%',
                    minWidth: 100,
                    height: 90,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1.5,
                    bgcolor: 'grey.50',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'scale(1.02)'
                    },
                    textAlign: 'center',
                    p: 1
                  }}
                >
                  <IconRenderer iconComponent={file.iconComponent} color={file.color} size={26} />

                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      mt: 0.5,
                      fontWeight: 500,
                      fontSize: '0.70rem',
                      maxWidth: '50%'
                    }}
                  >
                    {file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.65rem'
                    }}
                  >
                    {file.size}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        )}
      </Box>
    </MainCard>
  );

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading resources...</Typography>
      </Box>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Partner Resources</h1>
      </div>
      {/* Tabs */}
      {tabs.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'contained' : 'text'}
                onClick={() => setActiveTab(tab)}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                {tab}
              </Button>
            ))}
          </Stack>
        </Box>
      )}

      {/* Resources */}
      <Grid container spacing={GRID_COMMON_SPACING}>
        {filteredResources.length > 0 ? (
          filteredResources.map((resource, index) => (
            <Slide key={index} direction="up" in={true} timeout={100}>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <ResourceCard resource={resource} />
                </motion.div>
              </Grid>
            </Slide>
          ))
        ) : (
          <Grid item xs={12}>
            <EmptyUserCard title="No resources available." />
          </Grid>
        )}
      </Grid>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onClose={() => setShowPreviewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedFile.name}
              </Typography>

              {/* Check if the file is an image */}
              {selectedFile.type.startsWith('image/') && (
                <img src={selectedFile.url} alt={selectedFile.name} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
              )}

              {/* Check if the file is a PDF */}
              {selectedFile.type === 'application/pdf' && (
                <iframe src={`${selectedFile.url}#zoom=100`} style={{ width: '100%', height: '70vh', border: 'none' }} />
              )}

              {/* For other file types, you can choose to show a message or do nothing */}
              {!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf' && (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Unsupported file type
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowPreviewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PartnerResources;
