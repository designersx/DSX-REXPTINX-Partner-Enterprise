import { useEffect, useState } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import { CustomerList } from 'types/customer';
import { addUser } from '../../../../Services/auth'; // your Axios function
import { useGetCustomer } from 'api/customer';
export default function FormCustomerAdd({ customer, closeModal }: { customer: CustomerList | null; closeModal: () => void }) {
  const { mutate } = useGetCustomer();

  const [loading, setLoading] = useState<boolean>(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralName, setReferralName] = useState<string | null>(null);

  // Load referral info from localStorage
  useEffect(() => {
    setReferralCode(localStorage.getItem('referralCode'));
    setReferralName(localStorage.getItem('referralName'));
    setLoading(false);
  }, []);

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    email: Yup.string().email('Enter a valid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required')
  });

  const formik = useFormik({
    initialValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phoneNumber: customer?.phone || ''
    },
    validationSchema: CustomerSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Include ID for update
        const body: any = {
          name: values.name,
          email: values.email,
          phone: values.phoneNumber,
          referralCode: referralCode || '',
          referralName: referralName || ''
        };

        // Use userId for updates
        if (customer?.userId) {
          body.id = customer.userId;
        }

        const response = await addUser(body);

        if (response.status || response.data?.status) {
          openSnackbar({
            open: true,
            message: customer ? 'User updated successfully' : 'User created successfully',
            variant: 'alert',
            alert: { color: 'success' }
          } as SnackbarProps);
          mutate();
          closeModal();
        } else {
          throw new Error(response.data?.error || 'Something went wrong');
        }

        setSubmitting(false);
      } catch (error: any) {
        console.error('Error:', error);
        openSnackbar({
          open: true,
          message: error.message || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' }
        } as SnackbarProps);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  if (loading) return <Typography sx={{ p: 5, textAlign: 'center' }}>Loading...</Typography>;

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <DialogTitle>{customer ? 'Edit User' : 'Add User'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={3}>
            <Stack sx={{ gap: 1 }}>
              <Typography variant="subtitle2">Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter name"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Stack>

            <Stack sx={{ gap: 1 }}>
              <Typography variant="subtitle2">Email</Typography>
              <TextField
                fullWidth
                placeholder="Enter email"
                {...getFieldProps('email')}
                InputProps={{ readOnly: Boolean(customer) }}
                sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' } }}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Stack>

            <Stack sx={{ gap: 1 }}>
              <Typography variant="subtitle2">Phone Number</Typography>
              <TextField
                fullWidth
                placeholder="Enter phone number"
                {...getFieldProps('phoneNumber')}
                type="tel"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button color="error" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {customer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
