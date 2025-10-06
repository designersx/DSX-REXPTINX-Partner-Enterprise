'use client';

// material-ui
import Typography from '@mui/material/Typography';


// project-imports
import MainCard from 'components/MainCard';
import AgentGeneralInfo from './CreateAgent';
import TransactionHistoryCard from './AgentPage';

// ==============================|| SAMPLE PAGE ||============================== //

export default function AgentList({type}) {
  return (
<TransactionHistoryCard type={type}/>  
);
}
