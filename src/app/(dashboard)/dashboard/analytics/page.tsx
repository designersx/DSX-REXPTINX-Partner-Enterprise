// project-imports
import AgentList from 'views/build/AgentList';
import DashboardFinance from 'views/dashboard/Analytics';
import InvoiceDashboard from 'views/dashboard/PartnerAnalytics';
import SamplePagePage from 'views/other/SamplePage';
import { useAuth } from '../../../../contexts/AuthContext';
// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {

  // return  <InvoiceDashboard />;
  return  <DashboardFinance />;
  // return (
  //   <>
  //     
  //   </>
  // );
  //
  // <AnalyticsSection/>
}
