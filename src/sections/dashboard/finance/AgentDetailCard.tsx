import { useState, MouseEvent } from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';
import MainCard from 'components/MainCard';
import { useRouter } from 'next/navigation';

// assets
import { Add } from '@wandersonalwes/iconsax-react';
import Link from 'next/link';
const Food = '/assets/images/avatrs/Female-01.png';
const Travel = '/assets/images/avatrs/Female-04.png';
const Shopping = '/assets/images/avatrs/male-03.png';
const Healthcare = '/assets/images/avatrs/male-01.png';

interface cardProps {
  name: string;
  img: string;
  percentage: number;
  money: number;
  assignedMinutes: number;
}

type Agent = {
  agent_id: string | number;
  name: string;
  status: string;
  callCount: number;
  assignedMinutes: number;
};


// const cards = [
//   { name: 'Anthony', img: Food, percentage: 65, money: 1000 },
//   { name: 'Drothy', img: Travel, percentage: 30, money: 400 },
//   { name: 'Monika', img: Shopping, percentage: 52, money: 900 },
//   { name: 'Test', img: Healthcare, percentage: 25, money: 250 }
// ];

// ===========================|| MONEY SPENT - CARD ||=========================== //

function SpentCard({ name, img, percentage, money,assignedMinutes }: cardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <MainCard content={false} sx={{ p: 1.5 }}>
      <Stack sx={{ gap: 1.25 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <CardMedia component="img" src={img} alt={name} sx={{ width: '30px', height: '30px' }} />
          {/* <IconButton
            color="secondary"
            id="wallet-button"
            aria-controls={open ? 'wallet-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            disableRipple
          >
            <MoreIcon />
          </IconButton> */}
          <Menu
            id="wallet-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{ list: { 'aria-labelledby': 'wallet-button', sx: { p: 1.25, minWidth: 150 } } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <ListItemButton onClick={handleClose}>Today</ListItemButton>
            <ListItemButton onClick={handleClose}>Weekly</ListItemButton>
            <ListItemButton onClick={handleClose}>Monthly</ListItemButton>
          </Menu>
        </Stack>
        <Typography variant="subtitle1">{name}</Typography>
        <MainCard content={false} sx={{ bgcolor: 'secondary.lighter', p: 1.5 }}>
          <Stack sx={{ gap: 1 }}>
            <LinearProgress variant="determinate" value={percentage} color="secondary" />
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Used {percentage}%</Typography>
              <Typography variant="subtitle2">{money} Mins Left</Typography>
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Agent Assigned  </Typography>
              <Typography variant="subtitle2">{assignedMinutes} Mins</Typography>
          </Stack>
          </Stack>
        </MainCard>
      </Stack>
    </MainCard>
  );
}



export default function AgentDetailCard({ agents }: { agents: Agent[] }) {
const router = useRouter();
  
  return (
    <MainCard>
      <Stack sx={{ gap: 2.5 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: 1, alignItems: { xs: 'start', sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Typography variant="h5">Agents Overview</Typography>
         <Link href="/build/agents/" passHref> <Typography variant="h5">view all</Typography></Link>
        </Stack>

        <Grid container spacing={1.5}>
        {agents?.map((agent) => {
            // convert seconds → minutes
            const planMinutes = Math.floor(agent?.planMinutes / 60);
            const minsLeft = Math.floor(agent?.mins_left / 60);
            const leftMinutes=planMinutes-minsLeft;
            const percentage =
                planMinutes > 0 ? Math.round((leftMinutes / planMinutes) * 100) : 0;

            return (
                <Grid key={agent.agent_id} size={{ xs: 12, sm: 6, lg: 3 }}>
                    <div
                  onClick={() =>router.push(`/build/agents/agentdetails/${agent.agent_id}`)}
                  className="cursor-pointer"
                >
                <SpentCard
                    // src={agent.avatar?.startsWith("/") ? agent.avatar : `/${agent.avatar}`}

                    img={agent.avatar?.startsWith("/") ? agent.avatar : `/${agent.avatar}`}
                    name={agent.agentName}
                    percentage={percentage}
                    money={minsLeft} // minutes me bhej diya
                    assignedMinutes={planMinutes}
                />
                </div>
                </Grid>
            );
            })}
        </Grid>
      </Stack>
    </MainCard>
  );
}