'use client';

import React, { useState, useEffect, useMemo, Fragment } from 'react';
import Avatar from 'components/@extended/Avatar';
// material-ui
import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';

// project imports
import MainCard from 'components/MainCard';
import {
  CSVExport,
  DebouncedInput,
  IndeterminateCheckbox,
  RowSelection,
  TablePagination,
  SelectColumnSorting
} from 'components/third-party/react-table';
import EmptyTables from 'views/forms-tables/tables/react-table/EmptyTable';

// types
import { CommissionEntry } from 'types/commission';
const avatarImage = '/assets/images/users';
// helper
function formatCommissionMonth(monthStr: string) {
  const date = new Date(`${monthStr}-01`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

// ==============================|| REACT TABLE - EARNINGS ||============================== //
function ReactTable({
  data,
  columns,
  availableMonths,
  availableYears,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}: any) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting, rowSelection, globalFilter },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const headers: any[] = [];
  columns.map(
    (col: any) =>
      col.accessorKey &&
      headers.push({
        label: typeof col.header === 'string' ? col.header : '#',
        key: col.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      {/* ======== Filters & Search ======== */}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, justifyContent: 'space-between', p: 3 }}>
        <Stack direction="row" gap={2} flexWrap="wrap">
          <FormControl
            size="small"
            sx={{
              mt: 0.5
            }}
          >
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value as string)} label="Month">
              <MenuItem value="All">All</MenuItem>
              {availableMonths.sort().map((m: string) => (
                <MenuItem key={m} value={m}>
                  {new Date(`2023-${m}-01`).toLocaleString('default', {
                    month: 'long'
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              mt: 0.5
            }}
          >
            <InputLabel>Year</InputLabel>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value as string)} label="Year">
              <MenuItem value="All">All</MenuItem>
              {availableYears.sort().map((y: string) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          <SelectColumnSorting
            {...{
              getState: table.getState,
              getAllColumns: table.getAllColumns,
              setSorting
            }}
          />
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${data.length} records...`}
          />
        </Stack>
      </Stack>

      {/* ======== Table Section ======== */}
      <Stack>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No commission data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider />
        <Box sx={{ p: 2 }}>
          <TablePagination
            setPageSize={table.setPageSize}
            setPageIndex={table.setPageIndex}
            getState={table.getState}
            getPageCount={table.getPageCount}
          />
        </Box>
      </Stack>
    </MainCard>
  );
}

// ==============================|| EARNINGS MANAGEMENT ||============================== //
export default function EarningsManagement() {
  const [commissions, setCommissions] = useState<CommissionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const getReferralUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`);
      console.log(res, 'resss');
      const result = await res.json();

      if (result?.status === true) {
        const rawData = result?.commissions || [];

        const mapped: CommissionEntry[] = rawData.map((entry: any) => ({
          id: entry.id,
          userId: entry.referredUser?.userId,
          name: entry.referredUser?.name || 'Unknown',
          email: entry.referredUser?.email || 'N/A',
          agentName: entry.agentDetails?.agentName || 'N/A',
          planName: entry.planName || 'N/A',
          commissionAmount: parseFloat(entry.commissionAmount) || 0,
          currency: entry.currency || '₹',
          agentstatus: entry.agentStatus || '',
          commissionMonth: entry.commissionMonth || 'N/A'
        }));

        setCommissions(mapped);

        const months = new Set<string>();
        const years = new Set<string>();

        rawData.forEach((entry: any) => {
          if (entry.commissionMonth) {
            const [year, month] = entry.commissionMonth.split('-');
            months.add(month);
            years.add(year);
          }
        });

        setAvailableMonths(Array.from(months));
        setAvailableYears(Array.from(years));
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getReferralUsers();
  }, [userId]);

  const filteredData = useMemo(() => {
    return commissions.filter((entry) => {
      const [year, month] = entry.commissionMonth.split('-') || [];
      const matchesMonth = selectedMonth === 'All' || month === selectedMonth;
      const matchesYear = selectedYear === 'All' || year === selectedYear;
      return matchesMonth && matchesYear;
    });
  }, [commissions, selectedMonth, selectedYear]);

  const columns = useMemo<ColumnDef<CommissionEntry>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
            <Avatar
              alt={row.original.name}
              src={`${avatarImage}/avatar-${row.original.avatar ? row.original.avatar : 1}.png`}
              sx={{ width: 32, height: 32 }}
            />
            <Typography variant="body2" fontWeight={500}>
              {row.original.name}
            </Typography>
          </Stack>
        )
      },
      { header: 'User ID', accessorKey: 'userId' },

      { header: 'Email', accessorKey: 'email' },
      { header: 'Agent Name', accessorKey: 'agentName' },
      { header: 'Plan', accessorKey: 'planName' },
      {
        header: 'Agent Status',
        accessorKey: 'agentstatus',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const isActive = status?.toLowerCase() === 'active';

          return (
            <Box
              sx={{
                display: 'inline-block',
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: isActive ? '#0F766E' : '#B91C1C',
                backgroundColor: isActive ? '#D1FAE5' : '#FEE2E2',
                textAlign: 'center',
                minWidth: '80px'
              }}
            >
              {status}
            </Box>
          );
        }
      },

      {
        header: 'Commission',
        accessorKey: 'commissionAmount',
        cell: ({ row }) => {
          const { currency, commissionAmount } = row.original;
          return (
            <Box
              sx={{
                backgroundColor: '#D7F3FF',
                color: '#0CAADC', // text ka blue color
                px: 2, // horizontal padding
                py: 0.5, // vertical padding
                borderRadius: '12px', // rounded corners
                display: 'inline-block', // content ke size ke hisaab se
                fontWeight: 500, // thoda bold text
                fontSize: '0.875rem' // text size
              }}
            >
              {currency} {commissionAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Box>
          );
        },
        meta: { className: 'cell-right' }
      },

      {
        header: 'Commission Month',
        accessorKey: 'commissionMonth',
        cell: ({ getValue }) => <span>{formatCommissionMonth(getValue() as string)}</span>
      }
    ],
    []
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100vh" bgcolor="background.paper">
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" py={8}>
        ⚠️ {error}
      </Typography>
    );
  }

  return (
    <Paper>
      <Box display="flex" flexDirection="column" gap={4} sx={{ p: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ fontSize: '1.87rem' }}>
            Your Earnings
          </Typography>
        </Box>
        <ReactTable
          data={filteredData}
          columns={columns}
          availableMonths={availableMonths}
          availableYears={availableYears}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </Box>
    </Paper>
  );
}
