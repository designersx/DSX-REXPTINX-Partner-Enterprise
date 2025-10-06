// 'use client';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import Grid from '@mui/material/Grid';

// // project-imports
// import { GRID_COMMON_SPACING } from 'config';
// import Typography from '@mui/material/Typography';

// import AccountsCard from 'sections/dashboard/finance/Accounts';
// import BalanceCard from 'sections/dashboard/finance/BalanceCard';
// import CategoryCard from 'sections/dashboard/finance/Category';
// import CashflowChartCard from 'sections/dashboard/finance/CashflowChartCard';
// import MoneySpentCard from 'sections/dashboard/finance/MoneySpent';
// import Transactions from 'sections/dashboard/finance/Transactions';
// import TransactionCard from 'sections/dashboard/finance/TransactionsCard';
// import TransactionHistoryCard from 'sections/dashboard/finance/TransactionHistory';
// import QuickTransferCard from 'sections/dashboard/finance/QuickTransfer';
// import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
// import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Wallet3 } from '@wandersonalwes/iconsax-react';
// import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// // ==============================|| DASHBOARD - FINANCE ||============================== //

// export default function DashboardFinance() {
//   const theme = useTheme();
//     const [dashboardData, setDashboardData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const res = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/getEnterpriseDashboardData/RXC7XW1757518241`
//         );
//         console.log('res',res)
//         if (res.data.success) {
//           setDashboardData(res.data.data);
//         }
//       } catch (err) {
//         console.error('❌ Error fetching dashboard:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, []);

//   console.log('dashboardData',dashboardData)
//   return (
//   // <></>
//     <Grid container spacing={GRID_COMMON_SPACING}>
//        {/* <Grid size={{ xs: 12, lg: 4 }}>
//         <Grid container spacing={GRID_COMMON_SPACING}>
//           <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
//             <BalanceCard />
//           </Grid>
//            <Grid size={{ xs: 12, sm: 6, lg: 12 }}>
//             <Transactions />
//           </Grid>
//       </Grid>
//       </Grid>  */}

//        <Grid size={{ xs: 12, lg: 12 }}>
//         <Grid container spacing={GRID_COMMON_SPACING}>
//           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//             <TransactionCard
//               title="Total Calls"
//               caption="Apr 01 - Mar 31 (2023)"
//               color={theme.palette.primary.main}
//               data={[0, 70, 70, 120, 120, 120, 80, 80, 0, 0, 130, 130, 199, 199, 199]}
//               amount="505"
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6, lg: 3}}>
//             <TransactionCard
//               title="Total Bulk Minutes"
//               caption="Apr 01 - Mar 31 (2023)"
//               color={theme.palette.primary.main}
//               data={[0, 70, 70, 120, 120, 120, 80, 80, 0, 0, 130, 130, 199, 199, 199]}
//               amount="5500 Mins"
//             />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 6, lg: 3}}>
//             <TransactionCard
//               title="Used minutes "
//               caption="Apr 01 - Mar 31 (2023)"
//               color={theme.palette.success.main}
//               data={[180, 110, 110, 50, 50, 80, 80, 80, 100, 100, 199, 50, 50, 0, 0]}
//               amount="500 Mins"
//             />
//           </Grid>
//           <Grid size={{ xs: 12,sm: 6, lg: 3 }}>
//             <TransactionCard
//               title="Left Minutes"
//               caption="Apr 01 - Mar 31 (2023)"
//               color={theme.palette.error.main}
//               data={[70, 199, 199, 130, 130, 130, 0, 140, 140, 80, 80, 20, 70, 70]}
//               amount="5000 Mins"
//             />
//           </Grid>
//           <Grid size={12}>
//             {/* <CashflowChartCard /> */}
//           </Grid>
//           <Grid size={12}>
//             <MoneySpentCard />
//           </Grid>
//         </Grid>
//       </Grid>
//       {/* <Grid size={{ xs: 12, lg: 4 }}>
//         <AccountsCard />
//       </Grid>  */}
//        {/* <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//         <QuickTransferCard />
//       </Grid> */}
//       {/* <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
//         <CategoryCard />
//       </Grid> */}
//       <Grid size={{ xs: 12, lg: 12 }}>
//         {/* <TransactionHistoryCard /> */}
//       </Grid>
//     </Grid>
//   );
// }

//     // <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//     //     <EcommerceDataCard
//     //       title="All Earnings"
//     //       count="$3000"
//     //       iconPrimary={<Wallet3 />}
//     //       percentage={
//     //         <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//     //           <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
//     //         </Typography>
//     //       }
//     //     >
//     //       <EcommerceDataChart color={theme.palette.primary.main} />
//     //     </EcommerceDataCard>
//     //   </Grid>
//     //   <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//     //     <EcommerceDataCard
//     //       title="Page Views"
//     //       count="290+"
//     //       color="warning"
//     //       iconPrimary={<Book />}
//     //       percentage={
//     //         <Typography sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//     //           <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6%
//     //         </Typography>
//     //       }
//     //     >
//     //       <EcommerceDataChart color={theme.palette.warning.dark} />
//     //     </EcommerceDataCard>
//     //   </Grid>
//     //   <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//     //     <EcommerceDataCard
//     //       title="Total Task"
//     //       count="1,568"
//     //       color="success"
//     //       iconPrimary={<Calendar />}
//     //       percentage={
//     //         <Typography sx={{ color: 'success.darker', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//     //           <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
//     //         </Typography>
//     //       }
//     //     >
//     //       <EcommerceDataChart color={theme.palette.success.darker} />
//     //     </EcommerceDataCard>
//     //   </Grid>
//     //   <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
//     //     <EcommerceDataCard
//     //       title="Download"
//     //       count="$200"
//     //       color="error"
//     //       iconPrimary={<CloudChange />}
//     //       percentage={
//     //         <Typography sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//     //           <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
//     //         </Typography>
//     //       }
//     //     >
//     //       <EcommerceDataChart color={theme.palette.error.dark} />
//     //     </EcommerceDataCard>
//     //   </Grid>

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { GRID_COMMON_SPACING } from 'config';
import axios from 'axios';

// cards
import TransactionCard from 'sections/dashboard/finance/TransactionsCard';
import MoneySpentCard from 'sections/dashboard/finance/MoneySpent';
import AgentDetailCard from 'sections/dashboard/finance/AgentDetailCard';
import { getUserId } from 'utils/auth';
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import {
  ArrowDown,
  ArrowUp,
  Book,
  Calendar,
  CloudChange,
  Wallet3,
  CallMinus,
  CallCalling,
  Call,
  CallAdd
} from '@wandersonalwes/iconsax-react';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';
import CashflowChartCard from 'sections/dashboard/finance/CashflowChartCard';
import AccountsCard from 'sections/dashboard/finance/Accounts';
import QuickTransferCard from 'sections/dashboard/finance/QuickTransfer';
import CategoryCard from 'sections/dashboard/finance/Category';
import CategoryCard1 from 'sections/dashboard/finance/Category1';
import WelcomeBanner from './WelcomeBanner';
import { display } from '@mui/system';
import MyownAgent from './MyowneAgent';

export default function DashboardFinance() {
  const theme = useTheme();
  const userId = getUserId();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/enterprise/getEnterpriseDashboardData/${userId}`);
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('❌ Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userId]);

  return (
    <Grid container spacing={GRID_COMMON_SPACING}>
      {userId == 'RXDI7Q1759578841' ? (
        <Grid style={{ display: 'flex', gap: '5px' }}>
          <Grid size={12}>
            <WelcomeBanner />
          </Grid>
          <Grid size={12}>
            <MyownAgent />
          </Grid>
        </Grid>
      ) : (
        <Grid size={12}>
          <WelcomeBanner />
        </Grid>
      )}

      <Grid size={{ xs: 12, lg: 12 }}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TransactionCard
              title="Total Calls"
              caption="Enterprise Data"
              color={theme.palette.primary.main}
              data={[0, 70, 120, 80, 0, 130, 199]}
              amount={loading ? '...' : dashboardData?.totalCallCount || '0'}
              // iconPrimary={<CallCalling />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TransactionCard
              title="Total Bulk Minutes"
              caption="Enterprise Data"
              color={theme.palette.primary.main}
              data={[0, 70, 120, 80, 0, 130, 199]}
              amount={loading ? '...' : `${dashboardData?.totalMinutes || 0} Mins`}
              // iconPrimary={<Call />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TransactionCard
              title="Assigned Bulk Minutes"
              caption="Enterprise Data"
              color={theme.palette.success.main}
              data={[180, 110, 50, 80, 100, 199, 50]}
              amount={loading ? '...' : `${dashboardData?.usedMinutes || 0} Mins`}
              // iconPrimary={<CallAdd />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TransactionCard
              title="Exhausted Minutes"
              caption="Enterprise Data"
              color={theme.palette.error.main}
              data={[70, 199, 130, 140, 80, 20, 70]}
              amount={loading ? '...' : `${dashboardData?.exhaustedMinutes || 0} Mins`}
              // iconPrimary={<CallMinus />}
            />
          </Grid>
          {dashboardData?.agents?.length > 0 && (
            <Grid size={12}>
              {/* <AgentDetailCard agents={dashboardData?.agents || []}/> */}
              <AgentDetailCard agents={dashboardData?.agents?.slice(0, 4)} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={12}>
            <CashflowChartCard />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, lg: 12 }}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
            <CategoryCard />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
            <CategoryCard1 />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
