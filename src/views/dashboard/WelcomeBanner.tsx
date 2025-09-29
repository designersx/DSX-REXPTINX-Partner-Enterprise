// material-ui
"use client";
import { Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import MainCard from 'components/MainCard';
import Link from 'next/link';

// assets
const cardBack = '/assets/images/widget/img-dropbox-bg.svg';
// const WelcomeImage = 	'https://www.rexpt.us/images/Mask-Profile.png';
const WelcomeImage = 	'/assets/images/Mask-Profile rex.png';

// ==============================|| ANALYTICS - WELCOME ||============================== //

export default function WelcomeBanner() {
  return (
    <MainCard
      border={false}
      sx={(theme: Theme) => ({
        color: 'background.paper',
        bgcolor: 'primary.darker',
        ...theme.applyStyles('dark', { color: 'text.primary', bgcolor: 'primary.400' }),
        '&:after': {
          content: '""',
          background: `url("${cardBack}") 100% 100% / cover no-repeat`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.5
        }
      })}
    >
      <Grid container>
        <Grid size={{ md: 6, sm: 6, xs: 12 }}>
          <Stack sx={{ gap: 2, padding: 3 }}>
            <Typography variant="h2">Create Agents with Rexpt</Typography>
            <Typography variant="h6">
            Build, customize, and manage intelligent agents seamlessly with the power of Rexpt. 
            Unlock endless possibilities for automation and innovation.      
            </Typography>
            <Box sx={{ pt: 1.5 }}>
              <Link href="/build/agents/" passHref>
              <Button
                variant="outlined"
                color="secondary"
                // onClick={() => router.push("/create-agent")}
                sx={(theme) => ({
                  color: 'background.paper',
                  borderColor: 'background.paper',
                  ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' }),
                  zIndex: 2,
                  '&:hover': {
                    color: 'background.paper',
                    borderColor: 'background.paper',
                    bgcolor: 'primary.main',
                    ...theme.applyStyles('dark', { color: 'text.primary', borderColor: 'text.primary' })
                  }
                })}
                target="_blank"
              >
                Create Agent
              </Button>
              </Link>
            </Box>
          </Stack>
        </Grid>
        <Grid sx={{ display: { xs: 'none', sm: 'initial' } }} size={{ sm: 6, xs: 12 }}>
          <Stack sx={{ justifyContent: 'center', alignItems: 'flex-end', position: 'relative', pr: { sm: 3, md: 8 }, zIndex: 2 }}>
            <CardMedia component="img" sx={{ width: 200 }} src={WelcomeImage} alt="Welcome" />
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
