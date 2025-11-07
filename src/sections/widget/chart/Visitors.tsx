// 'use client';

// import { useEffect, useState } from 'react';

// // next
// import dynamic from 'next/dynamic';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import Button from '@mui/material/Button';
// import FormControl from '@mui/material/FormControl';
// import Grid from '@mui/material/Grid';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// // third-party
// import { Props as ChartProps } from 'react-apexcharts';

// // project-imports
// import MainCard from 'components/MainCard';
// import { ThemeMode } from 'config';

// // assets
// import { ArrowDown } from '@wandersonalwes/iconsax-react';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// // ==============================|| CHART ||============================== //

// function DataChart() {
//   const theme = useTheme();
//   const mode = theme.palette.mode;

//   // chart options
//   const areaChartOptions = {
//     chart: {
//       id: 'new-users-chart',
//       type: 'rangeBar',
//       sparkline: { enabled: true },
//       toolbar: {
//         show: false
//       },
//       offsetX: -2
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: '30%',
//         borderRadius: 5,
//         horizontal: false
//       }
//     },
//     yaxis: {
//       show: false
//     },
//     grid: {
//       show: false,
//       padding: {
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0
//       }
//     },
//     dataLabels: {
//       enabled: false
//     }
//   };
//   const { primary, secondary } = theme.palette.text;
//   const line = theme.palette.divider;

//   const [options, setOptions] = useState<ChartProps>(areaChartOptions);

//   useEffect(() => {
//     setOptions((prevState) => ({
//       ...prevState,
//       colors: [theme.palette.warning.main],
//       theme: {
//         mode: mode === ThemeMode.DARK ? 'dark' : 'light'
//       }
//     }));
//   }, [mode, primary, secondary, line, theme]);

//   const [series] = useState([
//     {
//       data: [
//         {
//           x: 'Rejected',
//           y: [1, 6]
//         },
//         {
//           x: 'Pending',
//           y: [3, 7]
//         },
//         {
//           x: 'New',
//           y: [4, 8]
//         },
//         {
//           x: 'Verified',
//           y: [5, 9]
//         },
//         {
//           x: 'Store',
//           y: [4, 8]
//         },
//         {
//           x: 'Deleted',
//           y: [4, 7]
//         },
//         {
//           x: 'Block',
//           y: [2, 5]
//         }
//       ]
//     }
//   ]);

//   return <ReactApexChart options={options} series={series} type="rangeBar" height={86} />;
// }

// // ==============================|| CHART WIDGETS - VISITORS ||============================== //

// export default function Visitors() {
//   const [age, setAge] = useState('30');
//   const handleChange = (event: SelectChangeEvent) => {
//     setAge(event.target.value as string);
//   };

//   return (
//     <MainCard>
//       <Grid container spacing={2}>
//         <Grid size={12}>
//           <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
//             <Typography variant="h5">Total Earnings</Typography>
//             {/* <Box sx={{ minWidth: 120 }}>
//               <FormControl fullWidth size="small">
//                 <Select id="demo-simple-select" value={age} onChange={handleChange}>
//                   <MenuItem value={10}>Today</MenuItem>
//                   <MenuItem value={20}>Weekly</MenuItem>
//                   <MenuItem value={30}>Monthly</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box> */}
//           </Stack>
//         </Grid>
//         <Grid size={12}>
//           <DataChart />
//         </Grid>
//         <Grid size={12}>
//           <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Typography variant="subtitle1">30</Typography>
//             {/* <Typography sx={{ color: 'error.dark', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
//               <ArrowDown size={14} style={{ transform: 'rotate(-45deg)' }} />
//               30.6%
//             </Typography> */}
//           </Stack>
//         </Grid>
//         {/* <Grid size={12}>
//           <Button fullWidth variant="outlined" color="secondary">
//             View more
//           </Button>
//         </Grid> */}
//       </Grid>
//     </MainCard>
//   );
// }
'use client';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';
import { useAnalyticsData } from 'views/dashboard/AnalyticsDataProvider';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Visitors() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const line = theme.palette.divider;

  const { commissionChartData, totalEarning, currency, loading } = useAnalyticsData();

  // Prepare data
  const series = [
    {
      name: 'Earnings',
      data: commissionChartData.map(item => item.amount)
    }
  ];

  const categories = commissionChartData.map(item => item.name || ''); // fallback

  // Base options
  const baseOptions = {
    chart: {
      type: 'bar',
      sparkline: { enabled: true },
      toolbar: { show: false },
      offsetX: -2
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '60%'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { show: false }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const month = w.config.xaxis.categories[dataPointIndex] || 'N/A';
        const value = series[seriesIndex][dataPointIndex];
        const symbol =  currency?.toUpperCase()|| "";

        return `
          <div style="
            padding: 8px 12px;
            font-size: 12px;
            background: ${mode === ThemeMode.DARK ? '#1e1e1e' : '#fff'};
            border: 1px solid ${line};
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            min-width: 70px;
            text-align: center;
          ">
            <div style="font-weight: 600; color: ${theme.palette.warning.main};">${month}</div>
            <div style="margin-top: 4px; color: ${mode === ThemeMode.DARK ? '#ddd' : '#333'}">
              Earnings: <strong>${symbol}${value}</strong>
            </div>
          </div>
        `;
      }
    }
  };

  const [chartOptions, setChartOptions] = useState(baseOptions);

  // Update colors & theme on mode/theme change
  useEffect(() => {
    setChartOptions(prev => ({
      ...prev,
      colors: [theme.palette.warning.main],
      theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
    }));
  }, [mode, theme]);

  // Update categories when data changes
  useEffect(() => {
    setChartOptions(prev => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        categories
      }
    }));
  }, [commissionChartData]);

  // if (loading) {
  //   return (
  //     <MainCard>
  //       <Typography textAlign="center" variant="body2">Loading earnings...</Typography>
  //     </MainCard>
  //   );
  // }

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">Total Earnings</Typography>
        </Grid>

        <Grid size={12}>
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={86}
          />
        </Grid>

        <Grid size={12}>
          <Stack direction="row" justifyContent="center" alignItems="center" gap={0.5}>
            <Typography variant="subtitle1">
              {currency?.toUpperCase()} {totalEarning}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}