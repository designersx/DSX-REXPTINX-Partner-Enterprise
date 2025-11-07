// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { PatternFormat } from 'react-number-format';

// project-imports
import Avatar from 'components/@extended/Avatar';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import MainCard from 'components/MainCard';
import { GRID_COMMON_SPACING } from 'config';

// assets
import { CallCalling, Gps, Link1, Sms } from '@wandersonalwes/iconsax-react';

const avatarImage = '/assets/images/users';

// ==============================|| ACCOUNT PROFILE - BASIC ||============================== //

export default function TabProfile() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Grid container spacing={GRID_COMMON_SPACING}>
      <Grid size={{ xs: 12, sm: 5, md: 4, xl: 3 }}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
                    <Chip label="Pro" size="small" color="primary" />
                  </Stack>
                  <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
                    <Avatar alt="Avatar 1" size="xl" src={`${avatarImage}/default.png`} />
                    <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                      <Typography variant="h5">Billy</Typography>
                      <Typography color="secondary">General Receptionist</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
                <Grid size={12}>
                  <Stack direction="row" sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
                    <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                      <Typography variant="h5">86</Typography>
                      <Typography color="secondary">Inbound Call</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                      <Typography variant="h5">40</Typography>
                      <Typography color="secondary">Outbound call</Typography>
                    </Stack>
                    <Divider orientation="vertical" flexItem />
                    <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                      <Typography variant="h5">4.5K</Typography>
                      <Typography color="secondary">Mins Left</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
                <Grid size={12}>
                  <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 1 } }}>
                    <ListItem secondaryAction={<Typography align="right">anshan.dh81@gmail.com</Typography>}>
                      <ListItemIcon>
                        <Sms size={18} />
                      </ListItemIcon>
                    </ListItem>
                    <ListItem secondaryAction={<Typography align="right">(+1-876) 8654 239 581</Typography>}>
                      <ListItemIcon>
                        <CallCalling size={18} />
                      </ListItemIcon>
                    </ListItem>
                    <ListItem secondaryAction={<Typography align="right">New York</Typography>}>
                      <ListItemIcon>
                        <Gps size={18} />
                      </ListItemIcon>
                    </ListItem>
                    <ListItem
                      secondaryAction={
                        <Link align="right" href="https://google.com" target="_blank">
                          https://anshan.dh.url
                        </Link>
                      }
                    >
                      <ListItemIcon>
                        <Link1 size={18} />
                      </ListItemIcon>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, sm: 7, md: 8, xl: 9 }}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={12}>
            <MainCard title="Personal Details">
              <List sx={{ py: 0 }}>
                <ListItem divider={!downMD}>
                  <Grid container spacing={3} size={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Agent Name</Typography>
                        <Typography>Billy</Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Role</Typography>
                        <Typography>General receptionst</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!downMD}>
                  <Grid container spacing={3} size={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Phone</Typography>
                        <Typography>
                          (+1-876) <PatternFormat value={8654239581} displayType="text" type="text" format="#### ### ###" />
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Country</Typography>
                        <Typography>New York</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem divider={!downMD}>
                  <Grid container spacing={3} size={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Business Email</Typography>
                        <Typography>anshan.dh81@gmail.com</Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Zip Code</Typography>
                        <Typography>956 754</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Stack sx={{ gap: 0.5 }}>
                    <Typography color="secondary"> Business Address</Typography>
                    <Typography>Street 110-B Kalians Bag, Dewan, M.P. New York</Typography>
                  </Stack>
                </ListItem>
              </List>
            </MainCard>
          </Grid>
          <Grid size={12}>
            <MainCard title="Details">
              <List sx={{ py: 0 }}>
                <ListItem divider>
                  <Grid container spacing={{ xs: 0.5, md: 3 }} size={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Business Type</Typography>
                        <Typography>Electronics</Typography>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Business name</Typography>
                        <Typography>Samsung</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={{ xs: 0.5, md: 3 }} size={12}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack sx={{ gap: 0.5 }}>
                        <Typography color="secondary">Created At</Typography>
                        <Typography>09/10/2025</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
