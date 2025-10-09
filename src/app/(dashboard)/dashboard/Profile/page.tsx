// project-imports
import AgentList from 'views/build/AgentList';
import DashboardFinance from 'views/dashboard/Analytics';
import InvoiceDashboard from 'views/dashboard/PartnerAnalytics';
import SamplePagePage from 'views/other/SamplePage';
import { useAuth } from '../../../../contexts/AuthContext';
// import UserProfile from 'views/build/User';
import UserProfile from 'views/build/Profile/UserProfile';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  // return  <InvoiceDashboard />;
  return <UserProfile />;
  // return (
  //   <>
  //
  //   </>
  // );
  //
  // <AnalyticsSection/>
}
