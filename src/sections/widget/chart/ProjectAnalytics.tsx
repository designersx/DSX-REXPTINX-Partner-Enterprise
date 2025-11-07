// 'use client';

// import { useEffect, useState, SyntheticEvent } from 'react';

// // next
// import dynamic from 'next/dynamic';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import FormControl from '@mui/material/FormControl';
// import Grid from '@mui/material/Grid';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemText from '@mui/material/ListItemText';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import Stack from '@mui/material/Stack';
// import Tab from '@mui/material/Tab';
// import Tabs from '@mui/material/Tabs';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// // third-party
// import { Props as ChartProps } from 'react-apexcharts';

// // project-imports
// import Avatar from 'components/@extended/Avatar';
// import IconButton from 'components/@extended/IconButton';
// import MoreIcon from 'components/@extended/MoreIcon';
// import MainCard from 'components/MainCard';
// import { ThemeMode } from 'config';

// // assets
// import {
//   ArrowDown,
//   ArrowSwapHorizontal,
//   ArrowUp,
//   Bookmark,
//   Chart,
//   Edit,
//   HomeTrendUp,
//   Maximize4,
//   ShoppingCart
// } from '@wandersonalwes/iconsax-react';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`
//   };
// }

// // ==============================|| CHART ||============================== //

// function EcommerceDataChart({ data }: { data: any[] }) {
//   const theme = useTheme();
//   const mode = theme.palette.mode;

//   // chart options
//   const areaChartOptions = {
//     chart: {
//       type: 'bar',
//       toolbar: {
//         show: false
//       }
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '55%',
//         borderRadius: 4,
//         borderRadiusApplication: 'end'
//       }
//     },
//     legend: {
//       show: true,
//       position: 'top',
//       horizontalAlign: 'left'
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       show: true,
//       width: 3,
//       colors: ['transparent']
//     },
//     fill: {
//       opacity: [1, 0.5]
//     },
//     grid: {
//       strokeDashArray: 4
//     },
//     tooltip: {
//       y: {
//         formatter: (val: number) => '$ ' + val
//       }
//     }
//   };

//   const { primary, secondary } = theme.palette.text;
//   const line = theme.palette.divider;

//   const [options, setOptions] = useState<ChartProps>(areaChartOptions);

//   useEffect(() => {
//     setOptions((prevState) => ({
//       ...prevState,
//       colors: [theme.palette.primary.main, theme.palette.primary.main],
//       xaxis: {
//         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//         labels: {
//           style: { colors: secondary }
//         },
//         axisBorder: {
//           show: false,
//           color: line
//         },
//         axisTicks: {
//           show: false
//         },
//         tickAmount: 11
//       },
//       yaxis: {
//         labels: {
//           style: { colors: secondary }
//         }
//       },
//       grid: {
//         borderColor: line
//       },
//       legend: {
//         labels: {
//           colors: 'secondary.main'
//         }
//       },
//       theme: {
//         mode: mode === ThemeMode.DARK ? 'dark' : 'light'
//       }
//     }));
//   }, [mode, primary, secondary, line, theme]);

//   const [series, setSeries] = useState(data);

//   useEffect(() => {
//     setSeries(data);
//   }, [data]);

//   return <ReactApexChart options={options} series={series} type="bar" height={250} />;
// }

// // ==============================|| CHART WIDGET - PROJECT ANALYTICS ||============================== //

// export default function ProjectAnalytics() {
//   const [value, setValue] = useState(0);
//   const [age, setAge] = useState('30');

//   const chartData = [
//     [
//       {
//         name: 'Net Profit',
//         data: [76, 85, 101, 98, 87, 105, 91]
//       },
//       {
//         name: 'Revenue',
//         data: [44, 55, 57, 56, 61, 58, 63]
//       }
//     ],
//     [
//       {
//         name: 'Net Profit',
//         data: [80, 101, 90, 65, 120, 105, 85]
//       },
//       {
//         name: 'Revenue',
//         data: [45, 30, 57, 45, 78, 48, 63]
//       }
//     ],
//     [
//       {
//         name: 'Net Profit',
//         data: [79, 85, 107, 95, 83, 115, 97]
//       },
//       {
//         name: 'Revenue',
//         data: [48, 56, 50, 54, 68, 53, 65]
//       }
//     ],
//     [
//       {
//         name: 'Net Profit',
//         data: [90, 111, 105, 55, 70, 65, 75]
//       },
//       {
//         name: 'Revenue',
//         data: [55, 80, 57, 45, 38, 48, 43]
//       }
//     ]
//   ];

//   const [data, setData] = useState(chartData[0]);

//   const handleChangeSelect = (event: SelectChangeEvent) => {
//     setAge(event.target.value as string);
//   };

//   const handleChange = (event: SyntheticEvent, newValue: number) => {
//     setValue(newValue);
//     setData(chartData[newValue]);
//   };

//   return (
//     <MainCard content={false}>
//       <Box sx={{ width: '100%' }}>
//         {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//           <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ px: 3, pt: 1, '& .MuiTab-root': { mb: 0.5 } }}>
//             <Tab label="Overview" {...a11yProps(0)} />
//             <Tab label="Marketing" {...a11yProps(1)} />
//             <Tab label="Project" {...a11yProps(2)} />
//             <Tab label="Order" {...a11yProps(2)} />
//           </Tabs>
//         </Box> */}
//         <Box sx={{ p: 3 }}>
//           <Grid container spacing={2}>
//             <Grid size={{ xs: 12, md: 8 }}>
//               <Stack sx={{ gap: 2 }}>
//                 {/* <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
//                   <Box sx={{ minWidth: 120 }}>
//                     <FormControl fullWidth>
//                       <Select id="demo-simple-select" value={age} onChange={handleChangeSelect}>
//                         <MenuItem value={10}>Today</MenuItem>
//                         <MenuItem value={20}>Weekly</MenuItem>
//                         <MenuItem value={30}>Monthly</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Box>
//                   <IconButton color="secondary" variant="outlined" sx={{ color: 'text.secondary' }}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton color="secondary" variant="outlined" sx={{ color: 'text.secondary' }}>
//                     <Maximize4 />
//                   </IconButton>
//                   <IconButton color="secondary" variant="outlined" sx={{ transform: 'rotate(90deg)', color: 'text.secondary' }}>
//                     <MoreIcon />
//                   </IconButton>
//                 </Stack> */}
//                 <EcommerceDataChart data={data} />
//               </Stack>
//             </Grid>
//             <Grid size={{ xs: 12, md: 4 }}>
//               <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
//                 <ListItem
//                   divider
//                   secondaryAction={
//                     <Stack sx={{ gap: 0.25, alignItems: 'flex-end' }}>
//                       <Typography variant="subtitle1">-245</Typography>
//                       <Typography color="error" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <ArrowDown style={{ transform: 'rotate(45deg)' }} size={14} /> 10.6%
//                       </Typography>
//                     </Stack>
//                   }
//                 >
//                   <ListItemAvatar>
//                     <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
//                       <Chart />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={<Typography sx={{ color: 'text.secondary' }}>Total Sales</Typography>}
//                     secondary={<Typography variant="subtitle1">1,800</Typography>}
//                   />
//                 </ListItem>
//                 <ListItem
//                   divider
//                   secondaryAction={
//                     <Stack sx={{ gap: 0.25, alignItems: 'flex-end' }}>
//                       <Typography variant="subtitle1">+2,100</Typography>
//                       <Typography sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <ArrowUp style={{ transform: 'rotate(45deg)' }} size={14} /> 30.6%
//                       </Typography>
//                     </Stack>
//                   }
//                 >
//                   <ListItemAvatar>
//                     <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
//                       <HomeTrendUp />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={<Typography sx={{ color: 'text.secondary' }}>Revenue</Typography>}
//                     secondary={<Typography variant="subtitle1">$5,667</Typography>}
//                   />
//                 </ListItem>
//                 <ListItem
//                   divider
//                   secondaryAction={
//                     <Stack sx={{ gap: 0.25, alignItems: 'flex-end' }}>
//                       <Typography variant="subtitle1">-26</Typography>
//                       <Typography sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <ArrowSwapHorizontal size={14} /> 5%
//                       </Typography>
//                     </Stack>
//                   }
//                 >
//                   <ListItemAvatar>
//                     <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
//                       <ShoppingCart />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={<Typography sx={{ color: 'text.secondary' }}>Abandon Cart</Typography>}
//                     secondary={<Typography variant="subtitle1">128</Typography>}
//                   />
//                 </ListItem>
//                 <ListItem
//                   secondaryAction={
//                     <Stack sx={{ gap: 0.25, alignItems: 'flex-end' }}>
//                       <Typography variant="subtitle1">+200</Typography>
//                       <Typography sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <ArrowUp style={{ transform: 'rotate(45deg)' }} size={14} /> 10.6%
//                       </Typography>
//                     </Stack>
//                   }
//                 >
//                   <ListItemAvatar>
//                     <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
//                       <Bookmark />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={<Typography sx={{ color: 'text.secondary' }}>Ads Spent</Typography>}
//                     secondary={<Typography variant="subtitle1">$2,500</Typography>}
//                   />
//                 </ListItem>
//               </List>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </MainCard>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import { useAnalyticsData } from 'views/dashboard/AnalyticsDataProvider';

import {
  ArrowDown,
  ArrowUp,
  Chart,
  HomeTrendUp,
  ShoppingCart,
  Bookmark
} from '@wandersonalwes/iconsax-react';
import { Box } from '@mui/system';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ==============================|| EARNINGS BAR CHART ||============================== //

function EcommerceDataChart({ data }: { data: number[] }) {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const areaChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    fill: { opacity: 1 },
    grid: { strokeDashArray: 4 },
    xaxis: {
      categories: months,
      labels: { style: { colors: theme.palette.text.secondary } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: theme.palette.text.secondary } } },
    tooltip: {
      y: {
        formatter: (val: number) => `Earnings: ${val.toFixed(2)}`
      }
    }
  };

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      colors: [theme.palette.success.main],
      grid: { borderColor: theme.palette.divider },
      theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
    }));
  }, [mode, theme]);

  const series = [{ name: 'Your Earnings', data }];

  return <ReactApexChart options={options} series={series} type="bar" height={250} />;
}

// ==============================|| PROJECT ANALYTICS - EARNINGS ||============================== //

export default function ProjectAnalytics() {
  const theme = useTheme();
  const { commissionChartData, totalEarning, currency, loading } = useAnalyticsData();

  // Last 12 months earnings
  const earnings12Months = Array(12).fill(0);
  commissionChartData.forEach((item, idx) => {
    if (idx < 12) earnings12Months[idx] = item.amount;
  });



// === CORRECT GROWTH CALCULATION ===
const today = new Date();
const currentMonthIndex = today.getMonth(); // 0=Jan, ..., 10=Nov

// Current month (e.g., November)
const current = earnings12Months[currentMonthIndex] || 0;

// Previous month (e.g., October, or December if January)
const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
const previous = earnings12Months[previousMonthIndex] || 0;
const growth = previous === 0 ? 0 : ((current - previous) / previous) * 100;
  console.log('growth',earnings12Months,current,previous,growth)
  // const growth = previous === 0 ? 0 : ((current - previous) / previous) * 100;

  const symbol = `${currency?.toUpperCase()} ` || '';


  return (
    <MainCard content={false}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Monthly Earnings 
              </Typography>
              <EcommerceDataChart data={earnings12Months} />
           
            </Stack>
          </Grid>

          {/* Stats */}
          <Grid size={{ xs: 12, md: 4 }}>
            <List disablePadding sx={{ '& .MuiListItem-root': { px: 3, py: 1.5 } }}>
              {/* Total Earnings */}
              <ListItem divider secondaryAction={
                <Stack alignItems="flex-end" spacing={0.25}>
                  <Typography variant="subtitle1">{symbol}{totalEarning}</Typography>
                  <Typography
                    color={growth >= 0 ? 'success.main' : 'error'}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.75rem' }}
                  >
                    {growth >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {Math.abs(growth).toFixed(1)}% (Monthly)
                  </Typography>
                </Stack>
              }>
                <ListItemAvatar>
                  <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                    <Chart />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography color="text.secondary">Total Earnings</Typography>}
                  secondary={<Typography variant="h6">{symbol}{totalEarning}</Typography>}
                />
              </ListItem>

              {/* Active Months */}
              {/* <ListItem divider secondaryAction={
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1">
                    {commissionChartData.filter(m => m.amount > 0).length}
                  </Typography>
                </Stack>
              }>
                <ListItemAvatar>
                  <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                    <HomeTrendUp />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography color="text.secondary">Active Months</Typography>}
                  secondary={<Typography variant="h6">{commissionChartData.filter(m => m.amount > 0).length} / 12</Typography>}
                />
              </ListItem> */}

              {/* Avg Monthly */}
              <ListItem divider secondaryAction={
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1">
                    {symbol}{(totalEarning / Math.max(commissionChartData.filter(m => m.amount > 0).length, 1)).toFixed(2)}
                  </Typography>
                </Stack>
              }>
                <ListItemAvatar>
                  <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                    <HomeTrendUp />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography color="text.secondary">Avg. Monthly</Typography>}
                  secondary={<Typography variant="h6">                    {symbol}{(totalEarning / Math.max(commissionChartData.filter(m => m.amount > 0).length, 1)).toFixed(2)}</Typography>}
                />
              </ListItem>
                {/* Avg Anually */}
              <ListItem divider secondaryAction={
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1">
                   {symbol}{(totalEarning / 12).toFixed(2)}
                  </Typography>
                </Stack>
              }>
                <ListItemAvatar>
                  <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                     <HomeTrendUp />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography color="text.secondary">Avg. Annually</Typography>}
                  secondary={<Typography variant="h6">{symbol}{(totalEarning / 12).toFixed(2)}</Typography>}
                />
              </ListItem>

              {/* Pending Payout */}
              <ListItem secondaryAction={
                <Stack alignItems="flex-end" spacing={0.25}>
                  <Typography variant="subtitle1">{symbol}{totalEarning}</Typography>
                  <Typography color="warning.main" sx={{ fontSize: '0.75rem' }}>
                    Pending
                  </Typography>
                </Stack>
              }>
                <ListItemAvatar>
                  <Avatar variant="rounded" color="secondary" sx={{ color: 'text.secondary' }}>
                    <Bookmark />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography color="text.secondary">Pending Payout</Typography>}
                  secondary={<Typography variant="h6">{symbol}{totalEarning}</Typography>}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}