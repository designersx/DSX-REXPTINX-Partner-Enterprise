// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Transitions from 'components/@extended/Transitions';

// icons
import { Sms, Link2, Location } from '@wandersonalwes/iconsax-react';

const avatarImage = '/assets/images/users';

// ==============================|| CUSTOMER VIEW (REAL DATA) ||============================== //

export default function CustomerView({ data }: any) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Transitions type="slide" direction="down" in={true}>
      <Grid container spacing={2.5}>
        {/* LEFT PROFILE CARD */}
        <Grid item xs={12} sm={5} md={4} lg={4} xl={3}>
          <MainCard>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
                  <Avatar alt={data.userName} size="xl" src={`${avatarImage}/avatar-1.png`} />
                  <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                    <Typography variant="h5">{data.name}</Typography>
                    <Typography color="secondary">Registered User</Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <List aria-label="User details" sx={{ py: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                  {/* <ListItem secondaryAction={<Typography align="right">{data.userEmail}</Typography>}>
                    <ListItemIcon>
                      <Sms size={18} />
                    </ListItemIcon>
                  </ListItem> */}

                  <ListItem secondaryAction={<Typography align="right">{data.referralCode}</Typography>}>
                    <ListItemIcon>
                      <Link2 size={18} />
                    </ListItemIcon>
                  </ListItem>

                  <ListItem secondaryAction={<Typography align="right">{data.referredBy || 'N/A'}</Typography>}>
                    <ListItemIcon>
                      <Location size={18} />
                    </ListItemIcon>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>

        {/* RIGHT DETAIL CARD */}
        <Grid item xs={12} sm={7} md={8} lg={8} xl={9}>
          <Stack sx={{ gap: 2.5 }}>
            <MainCard title="User Details">
              <List sx={{ py: 0 }}>
                <ListItem divider={!downMD}>
                  <Stack sx={{ gap: 0.5 }}>
                    <Typography color="secondary">Name</Typography>
                    <Typography>{data.name}</Typography>
                  </Stack>
                </ListItem>
                <ListItem divider={!downMD}>
                  <Stack sx={{ gap: 0.5 }}>
                    <Typography color="secondary">Email</Typography>
                    <Typography>{data.email}</Typography>
                  </Stack>
                </ListItem>
                <ListItem divider={!downMD}>
                  <Stack sx={{ gap: 0.5 }}>
                    <Typography color="secondary">Referral Code</Typography>
                    <Typography>{data.referralCode}</Typography>
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack sx={{ gap: 0.5 }}>
                    <Typography color="secondary">Referred By</Typography>
                    <Typography>{data.referredBy || 'N/A'}</Typography>
                  </Stack>
                </ListItem>
              </List>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </Transitions>
  );
}
