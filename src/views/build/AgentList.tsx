'use client';

// material-ui
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import AgentGeneralInfo from './CreateAgent';
import TransactionHistoryCard from './AgentPage';
import { useAuth } from 'contexts/AuthContext';
import AgentPagePartner from './Usermanager/AgentPageaPartner';

// ==============================|| SAMPLE PAGE ||============================== //

export default function AgentList({ type }: { type: string }) {
  const { user } = useAuth();
  const roleId = localStorage.getItem('roleId');

  return <TransactionHistoryCard type={type} />; 
  // return roleId == '3' ? <TransactionHistoryCard type={type} /> : <AgentPagePartner type={type} />;
}
