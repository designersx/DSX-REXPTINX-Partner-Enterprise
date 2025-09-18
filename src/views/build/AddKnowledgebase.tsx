'use client';

import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

// project-imports
import MainCard from 'components/MainCard';
import { listSiteMap, validateWebsite } from '../../../Services/auth';

export default function BasicModal({ open, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [kbName, setKbName] = useState('');
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState({ website: '' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWebsiteValid, setIsWebsiteValid] = useState(null);
  const [sitemapUrls, setSitemapUrls] = useState<string[]>([]);
  const [showSitemap, setShowSitemap] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState({ Website: '' });
  const [hasNoWebsite, setHasNoWebsite] = useState(false);
  
  const HTTPS_PREFIX = "https://";
  const PREFIX_LEN = HTTPS_PREFIX.length;

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const verifyWebsite = async (rawUrl) => {
    const urlToVerify = rawUrl || (formData.website || "").trim();
    if (!urlToVerify) return;

    let url = urlToVerify.replace(/^https?:\/\//i, "");
    url = `https://${url}`;

    setIsVerifying(true);
    try {
      const result = await validateWebsite(url);
      const isValid = result?.valid === true || String(result?.valid).toLowerCase() === "true";
      setIsWebsiteValid(isValid);
      setFormData((p) => ({ ...p, website: url }));

      if (typeof window !== "undefined") {
        sessionStorage.setItem("businessUrl", url);
        localStorage.setItem("isVerified", isValid ? "true" : "false");
      }

      if (isValid) {
        const res = await listSiteMap(url);
        if (res?.success && Array.isArray(res.urls)) {
          const filteredUrls = filterCompanyPages(res.urls);
          if (!filteredUrls.includes(url)) {
            filteredUrls.unshift(url);
          }
          setSitemapUrls(filteredUrls);
          setShowSitemap(true);
          const formattedUrls = filteredUrls.map((link) => ({
            url: link,
            checkedStatus: true,
          }));
          localStorage.setItem("selectedSitemapUrls", JSON.stringify(formattedUrls));
          localStorage.setItem("sitemapUrls", JSON.stringify(filteredUrls));
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
      localStorage.setItem("isVerified", "false");
    } finally {
      setIsVerifying(false);
    }
  };

  const filterCompanyPages = (urls) => {
    const companyKeywords = [
      "about",
      "our-story",
      "our-company",
      "who-we-are",
      "contact",
      "products",
      "services",
      "solutions",
      "what-we-do",
      "offerings",
      "blog",
      "news",
      "resources",
      "insights",
      "faq",
      "help",
      "pricing",
      "plans",
      "privacy",
      "terms-and-conditions",
      "terms-of-use",
      "case-studies",
      "projects",
      "portfolio",
      "testimonials",
      "reviews",
    ];
    return urls.filter((url) => companyKeywords.some((keyword) => url.toLowerCase().includes(keyword)));
  };

  const handleSubmit = () => {
    const data = { 
      kbName, 
      files, 
      text, 
      url: formData.website,
      selectedSitemapUrls: Array.from(selectedUrls)
    };
    if (onSubmit) onSubmit(data);
    handleClose();
  };

  const handleWebsiteBlur = () => {
    if (formData.website.trim()) {
      verifyWebsite();
    }
  };

  const handleClose = () => {
    setStep(1);
    setKbName('');
    setFiles([]);
    setText('');
    setUrl('');
    setFormData({ website: '' });
    setIsVerifying(false);
    setIsWebsiteValid(null);
    setSitemapUrls([]);
    setShowSitemap(false);
    setSelectedUrls(new Set());
    setErrors({ Website: '' });
    setHasNoWebsite(false);
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
      localStorage.setItem(
        "selectedSitemapUrls",
        JSON.stringify([...next].map((urlItem) => ({ url: urlItem, checkedStatus: true })))
      );
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedUrls((prev) => {
      const next = prev.size === sitemapUrls.length ? new Set() : new Set(sitemapUrls);
      localStorage.setItem(
        "selectedSitemapUrls",
        JSON.stringify([...next].map((urlItem) => ({ url: urlItem, checkedStatus: true })))
      );
      return next;
    });
  };

  const isAllSelected = sitemapUrls.length > 0 && selectedUrls.size === sitemapUrls.length;

  return (
    <Modal open={open} onClose={handleClose}>
      <MainCard title="Knowledge Base" modal darkTitle content={false} style={{width:'30%'}}>
        <CardContent>
          {step === 1 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Enter Knowledge Base Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="My Knowledge Base"
                value={kbName}
                onChange={(e) => setKbName(e.target.value)}
              />
            </Box>
          )}

          {step === 2 && (
            <>
              {/* File Upload */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Upload Files
                </Typography>
                <input type="file" multiple onChange={handleFileChange} />
                {files.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {files.length} file(s) selected
                  </Typography>
                )}
              </Box>

              {/* Text Input */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Enter Text
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type something..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  multiline
                  rows={3}
                />
              </Box>

              {/* URL Input */}
              <Box sx={{ mb: 2, position: 'relative' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Enter URL
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => {
                    setFormData({ ...formData, website: e.target.value });
                    setIsWebsiteValid(null);
                    setHasNoWebsite(false);
                    setErrors((prev) => ({ ...prev, Website: "" }));
                  }}
                  onKeyDown={(e) => {
                    const input = e.currentTarget;
                    const { key } = e;
                    const { selectionStart, selectionEnd, value } = input;
                    const fullSelection = selectionStart === 0 && selectionEnd === value.length;
                    if (key === "Backspace" || key === "Delete") {
                      if (fullSelection) {
                        e.preventDefault();
                        setFormData({ ...formData, website: HTTPS_PREFIX });
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
                      setFormData({ ...formData, website: HTTPS_PREFIX + input.value });
                      requestAnimationFrame(() => input.setSelectionRange(PREFIX_LEN, PREFIX_LEN));
                    }
                  }}
                  onBlur={handleWebsiteBlur}
                />
                {formData.website && (
                  <Box sx={{ position: 'absolute', right: 8, top: 50 }}>
                    {isVerifying ? (
                      <CircularProgress size={20} />
                    ) : isWebsiteValid === true ? (
                      <Typography variant="body2" color="success.main">
                        ✓ Valid
                      </Typography>
                    ) : isWebsiteValid === false ? (
                      <Typography variant="body2" color="error.main">
                        ✗ Invalid
                      </Typography>
                    ) : null}
                  </Box>
                )}
              </Box>

              {/* Sitemap URLs Selection */}
              {showSitemap && sitemapUrls.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Pages to Include
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    <List>
                      <ListItem 
                        secondaryAction={
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
                        }
                        disablePadding
                      >
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
                          <ListItemText 
                            primary={sitemapUrl} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </>
          )}
        </CardContent>

        <Divider />

        <Stack direction="row" sx={{ gap: 1, justifyContent: 'flex-end', px: 2.5, py: 2 }}>
          <Button color="error" size="small" onClick={handleClose}>
            Cancel
          </Button>

          {step === 1 ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => kbName.trim() && setStep(2)}
              disabled={!kbName.trim()}
            >
              Next
            </Button>
          ) : (
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleSubmit}
              disabled={!kbName.trim() && !files.length && !text.trim() && !formData.website.trim()}
            >
              Submit
            </Button>
          )}
        </Stack>
      </MainCard>
    </Modal>
  );
}