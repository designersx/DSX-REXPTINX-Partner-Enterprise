'use client';

// material-ui
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import KnowledgeBasePage from './KnowledgeBasePage';
import UserProfile from './User';

// ==============================|| SAMPLE PAGE ||============================== //

export default function KnowledgeBase() {
  return (<>
    {/* <MainCard title="Sample Card">
      <Typography variant="body1">
       HEY KNOE
      </Typography>
    </MainCard> */}
    <UserProfile/>
    </>
  );
}