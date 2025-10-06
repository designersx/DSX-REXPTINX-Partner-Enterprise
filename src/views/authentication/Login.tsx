// // next
// import Link from 'next/link';

// // material-ui
// import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// // project-imports
// import AuthWrapper from 'sections/auth/AuthWrapper';
// import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// // ================================|| LOGIN ||================================ //

// export default function Login() {
//   return (
//     <AuthWrapper>
//       <Grid container spacing={3}>
//         <Grid size={12}>
//           <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: { xs: -0.5, sm: 0.5 } }}>
//             <Typography variant="h3">Login</Typography>
//             {/* <Typography component={Link} href={'/register'} variant="body1" sx={{ textDecoration: 'none' }} color="primary" passHref>
//               Don&apos;t have an account?
//             </Typography> */}
//           </Stack>
//         </Grid>
//         <Grid size={12}>
//           <AuthLogin />
//         </Grid>
//       </Grid>
//     </AuthWrapper>
//   );
// }


// next
import Link from 'next/link';
import Image from 'next/image'; // Import Image component from Next.js for optimized images

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Image
            src="/assets/logorexpt.png" // Path to your logo in the public folder
            alt="Company Logo"
            width={150} // Adjust width as needed
            height={50} // Adjust height as needed
            priority // Optional: prioritize loading for above-the-fold content
          />
        </Grid>
        <Grid size={12}>
          <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            {/* <Typography component={Link} href={'/register'} variant="body1" sx={{ textDecoration: 'none' }} color="primary" passHref>
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        
        <Grid size={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}