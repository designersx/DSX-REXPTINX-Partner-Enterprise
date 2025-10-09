'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserId } from 'utils/auth';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import ReactQuillDemo from 'components/third-party/ReactQuill';
import { APP_DEFAULT_PATH } from 'config';

type FormData = {
  subject: string;
  category: string;
  description: string;
  department: string;
  files: File[] | null;
};

const schema = yup.object({
  subject: yup.string().required('Subject is required').trim(),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required').trim(),
  department: yup.string().required('Department is required'),
  files: yup.mixed().nullable(),
});

export default function CreateTicket() {
  const userId = getUserId();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      subject: '',
      category: 'General Inquiry',
      description: '',
      department: 'Support',
      files: null,
    }),
    []
  );

  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'tickets', to: '/mointor/tickets/' },
    { title: 'create ticket' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs custom heading="Create Ticket" links={breadcrumbLinks} />
      <MainCard>
        <Formik
          initialValues={defaultValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            if (!userId) {
              toast.error('User not authenticated');
              return;
            }
            try {
              setSubmitting(true);
              const payload = new FormData();
              Object.entries(values).forEach(([key, value]) => {
                if (key !== 'files') payload.append(key, String(value));
              });
              payload.append('userId', userId);
              payload.append('pageContext', 'tickets-page');
              if (values.files) {
                values.files.forEach((file: File) => {
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} must be under 5MB`);
                    return;
                  }
                  if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) {
                    toast.error(`${file.name} must be PNG, JPG, or PDF`);
                    return;
                  }
                  payload.append('ticketAttachments', file);
                });
              }

              const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/create_ticket`,
                payload,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                  },
                }
              );

              toast.success(`Ticket ID: ${res?.data?.ticket?.ticketId}`);
              resetForm();
              router.push('/mointor/tickets');
            } catch (err: any) {
              console.error('Submission error:', err);
              toast.error(err.response?.data?.message || 'Failed to submit ticket');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <Grid container rowSpacing={2} columnSpacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      id="category"
                      value={values.category}
                      onChange={(e) => setFieldValue('category', e.target.value)}
                      input={<OutlinedInput />}
                      error={touched.category && !!errors.category}
                      displayEmpty
                    >
                      <MenuItem disabled value="" sx={{ color: 'text.secondary' }}>
                        Select Category
                      </MenuItem>
                      <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                      <MenuItem value="Agent Creation">Agent Creation</MenuItem>
                      <MenuItem value="Agent Editing">Agent Editing</MenuItem>
                      <MenuItem value="User Management">User Management</MenuItem>
                      <MenuItem value="Commission Issue">Commission Issue</MenuItem>
                      <MenuItem value="Call Forwarding">Call Forwarding</MenuItem>
                      <MenuItem value="Phone Number Assignment">Phone Number Assignment</MenuItem>
                      <MenuItem value="Billing Issue">Billing Issue</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText error>{errors.category}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      id="department"
                      value={values.department}
                      onChange={(e) => setFieldValue('department', e.target.value)}
                      input={<OutlinedInput />}
                      error={touched.department && !!errors.department}
                      displayEmpty
                    >
                      <MenuItem disabled value="" sx={{ color: 'text.secondary' }}>
                        Select Department
                      </MenuItem>
                      <MenuItem value="Support">Support - General</MenuItem>
                      <MenuItem value="Billing">Billing - Payment issues</MenuItem>
                      <MenuItem value="Technical">Technical - System errors</MenuItem>
                      <MenuItem value="Sales">Sales - Product inquiries</MenuItem>
                    </Select>
                    {touched.department && errors.department && (
                      <FormHelperText error>{errors.department}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Subject</InputLabel>
                    <TextField
                      fullWidth
                      id="subject"
                      placeholder="Enter Subject"
                      value={values.subject}
                      onChange={(e) => setFieldValue('subject', e.target.value)}
                      error={touched.subject && !!errors.subject}
                      helperText={touched.subject && errors.subject}
                    />
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel>Description</InputLabel>
                    <ReactQuillDemo
                      value={values.description}
                      onChange={(value) => setFieldValue('description', value)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error>{errors.description}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
                    <InputLabel>Attachments (Optional)</InputLabel>
                    <UploadMultiFile
                      setFieldValue={setFieldValue}
                      files={values.files}
                      error={touched.files && !!errors.files}
                    />
                    {touched.files && errors.files && (
                      <FormHelperText error>{errors.files as string}</FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 2.5 }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push('/mointor/tickets')}
                >
                  Back
                </Button>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => setFieldValue('files', null)}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          )}
        </Formik>
      </MainCard>
    </Box>
  );
}