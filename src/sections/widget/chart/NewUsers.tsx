'use client';

import { useEffect, useState } from 'react';

// next
import dynamic from 'next/dynamic';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { Props as ChartProps } from 'react-apexcharts';

// project-imports
import MainCard from 'components/MainCard';
import { ThemeMode } from 'config';

// assets
import { ArrowUp } from '@wandersonalwes/iconsax-react';
import { useAnalyticsData } from 'views/dashboard/AnalyticsDataProvider';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ==============================|| CHART ||============================== //

// function DataChart({ series: propSeries }: { series?: any[] }) {
//   const theme = useTheme();
//   const mode = theme.palette.mode;

//   // chart options
//   const areaChartOptions = {
//     chart: {
//       id: 'new-users-chart',
//       type: 'area',
//       sparkline: { enabled: true },
//       offsetX: -1
//     },
//     stroke: {
//       width: 1
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shadeIntensity: 1,
//         type: 'vertical',
//         inverseColors: false,
//         opacityFrom: 0.5,
//         opacityTo: 0
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     series: [
//       {
//         data: [1, 1, 60, 1, 1, 50, 1, 1, 40, 1, 1, 25, 0]
//       }
//     ],
//     tooltip: {
//       fixed: { enabled: false },
//       x: { show: false },
//       y: {
//         title: {
//           formatter: () => ''
//         }
//       }
//     }
//   };
//   const { primary, secondary } = theme.palette.text;
//   const line = theme.palette.divider;

//   const [options, setOptions] = useState<ChartProps>(areaChartOptions);

//   useEffect(() => {
//     setOptions((prevState) => ({
//       ...prevState,
//       colors: [theme.palette.success.main],
//       theme: {
//         mode: mode === ThemeMode.DARK ? 'dark' : 'light'
//       }
//     }));
//   }, [mode, primary, secondary, line, theme]);

//   // const [series] = useState([
//   //   {
//   //     data: [1, 1, 60, 1, 1, 50, 1, 1, 40, 1, 1, 25, 0]
//   //   }
//   // ]);

//   const defaultSeries = [{ data: [0,0,0,0,0,0,0,0,0,0,0,0] }];
//   const finalSeries = propSeries || defaultSeries;

//   // return <ReactApexChart options={options} series={series} type="area" height={86} />;
//   return <ReactApexChart options={options} series={finalSeries} type="area" height={86} />;
// }
function DataChart({ series: propSeries }: { series?: any[] }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const line = theme.palette.divider;

  // Month labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Extract data length from propSeries
  const dataLength = propSeries?.[0]?.data?.length || 12;
  const dynamicCategories = monthLabels.slice(0, dataLength);

  const areaChartOptions = {
    chart: {
      id: 'new-users-chart',
      type: 'area',
      sparkline: { enabled: true },
      offsetX: -1
    },
    stroke: {
      width: 1
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: dynamicCategories,
      labels: { show: false }
    },
    tooltip: {
      // Custom Tooltip: Month + Value
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const month = dynamicCategories[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const seriesName = w.config.series[seriesIndex].name || 'Agents';

        return `
          <div style="
            padding: 8px 12px;
            font-size: 12px;
            background: ${mode === ThemeMode.DARK ? '#1e1e1e' : '#fff'};
            border: 1px solid ${line};
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            min-width: 60px;
            text-align: center;
          ">
            <div style="font-weight: 600; color: ${theme.palette.success.main};">${month}</div>
            <div style="margin-top: 4px; color: ${mode === ThemeMode.DARK ? '#ddd' : '#333'}">
              ${seriesName}: <strong>${value}</strong>
            </div>
          </div>
        `;
      }
    }
  };

  const [options, setOptions] = useState<ChartProps>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.success.main],
      theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
    }));
  }, [mode, theme]);

  const defaultSeries = [{ data: [0,0,0,0,0,0,0,0,0,0,0,0] }];
  const finalSeries = propSeries || defaultSeries;

  return <ReactApexChart options={options} series={finalSeries} type="area" height={86} />;
}
// ==============================|| CHART WIDGETS - NEW USERS ||============================== //

// export default function NewUsers() {
//   const [age, setAge] = useState('30');
//   const handleChange = (event: SelectChangeEvent) => {
//     setAge(event.target.value as string);
//   };
  

//   return (
//     <MainCard>
//       <Grid container spacing={2}>
//         <Grid size={12}>
//           <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
//             <Typography variant="h5">Agent Count</Typography>
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
//             <Typography variant="subtitle1">$30,200</Typography>
//             {/* <Typography sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 500 }}>
//               <ArrowUp size={14} style={{ transform: 'rotate(45deg)' }} />
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
export default function NewUsers() {
  const { agentChartData, totalAgents, loading } = useAnalyticsData();
  const theme = useTheme();

  const series = [{
    name: 'Agents',
    data: agentChartData.map(d => d.amount)
  }];

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h5">Agent Count</Typography>
        </Grid>
        <Grid size={12}>
          {/* {loading ? (
            <Typography textAlign="center">Loading...</Typography>
          ) : ( */}
            <DataChart series={series} />
          {/* )} */}
        </Grid>
        <Grid size={12}>
          <Stack direction="row" justifyContent="center">
            <Typography variant="subtitle1">{totalAgents}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}