'use client';

import { useState, useEffect } from 'react';

// next
import dynamic from 'next/dynamic';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  color: string;
  height?: number;
  series?:any;
}

// ==============================|| CHART - ECOMMERCE DATA CHART ||============================== //

// export default function EcommerceDataChart({ color, height,series }: Props) {
//   const theme = useTheme();
//   const mode = theme.palette.mode;
//   console.log('sseries',series)
//   // chart options
//   const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const areaChartOptions = {
//     chart: {
//       id: 'new-stack-chart',
//       type: 'bar',
//       sparkline: {
//         enabled: true
//       },
//       toolbar: {
//         show: false
//       },
//       offsetX: -2
//     },
//     dataLabels: {
//       enabled: false
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 2,
//         columnWidth: '80%'
//       }
//     },
//     xaxis: {
//       crosshairs: {
//         width: 1
//       }
//     },
//     tooltip: {
//       fixed: {
//         enabled: false
//       },
//       x: {
//         show: false
//       }
//     }
//   };

//   const { primary, secondary } = theme.palette.text;
//   const line = theme.palette.divider;

//   const [options, setOptions] = useState<ChartProps>(areaChartOptions);

//   useEffect(() => {
//     setOptions((prevState) => ({
//       ...prevState,
//       colors: [color],
//       theme: {
//         mode: mode === ThemeMode.DARK ? 'dark' : 'light'
//       }
//     }));
//   }, [color, mode, primary, secondary, line, theme]);

//   // const [series] = useState([
//   //   {
//   //     name: 'Users',
//   //     data: [10, 30, 40, 20, 60, 50, 20, 15, 20, 25, 30, 25]
//   //   }
//   // ]);

//   return <ReactApexChart options={options} series={series} type="bar" height={height ? height : 50} />;
// }
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function EcommerceDataChart({ color, height, series }: Props) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const line = theme.palette.divider;

  const dataLength = series?.[0]?.data?.length || 12;
  const dynamicCategories = monthLabels.slice(0, dataLength);

  const areaChartOptions = {
    chart: {
      id: 'new-stack-chart',
      type: 'bar',
      sparkline: { enabled: true },
      toolbar: { show: false },
      offsetX: -2
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 2, columnWidth: '80%' }
    },
    xaxis: {
      categories: dynamicCategories,
      labels: { show: false }
    },
    tooltip: {
      // Custom tooltip with Month + Value
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const month = dynamicCategories[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const seriesName = w.config.series[seriesIndex].name || 'Users';

        return `
          <div style="
            padding: 8px 12px;
            font-size: 12px;
            background: ${mode === ThemeMode.DARK ? '#1e1e1e' : '#fff'};
            border: 1px solid ${line};
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <div style="font-weight: 600; color: ${color};">${month}</div>
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
      colors: [color],
      theme: { mode: mode === ThemeMode.DARK ? 'dark' : 'light' }
    }));
  }, [color, mode, theme, series]);

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={height || 50}
    />
  );
}