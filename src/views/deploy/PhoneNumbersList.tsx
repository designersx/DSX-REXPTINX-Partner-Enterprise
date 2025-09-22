// material-ui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

// project-imports
import ContactForm from 'sections/extra-pages/contact/ContactForm';
import ContactHeader from 'sections/extra-pages/contact/ContactHeader';
import ProfileTab from './ProfileTab';
import UserProfile from './User';
// ==============================|| CONTACT US - MAIN ||============================== //

export default function PhoneNumberList() {
  return (
    // <Grid container spacing={12} sx={{ justifyContent: 'center', alignItems: 'center', mb: 12 }}>

    <Grid size={{ xs: 12 }}>
      <UserProfile />
      {/* </Grid> */}
    </Grid>
  );
}
