// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   Typography,
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TextField,
//   CircularProgress
// } from '@mui/material';

// interface CommissionEntry {
//   id: number;
//   userId: string;
//   name: string;
//   email: string;
//   agentName: string;
//   planName: string;
//   commissionAmount: number;
//   currency: string;
//   agentstatus: string;
//   commissionMonth: string;
// }

// export default function EarningsTable() {
//   const [commissions, setCommissions] = useState<CommissionEntry[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedMonth, setSelectedMonth] = useState('All');
//   const [selectedYear, setSelectedYear] = useState('All');
//   const [sortField, setSortField] = useState('');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('asc');
//   const [availableMonths, setAvailableMonths] = useState<string[]>([]);
//   const [availableYears, setAvailableYears] = useState<string[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

//   const getReferralUsers = async () => {
//     // setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`);
//       const result = await res.json();

//       if (result?.status === true) {
//         const rawData = result?.commissions || [];

//         const mapped: CommissionEntry[] = rawData.map((entry: any) => ({
//           id: entry.id,
//           userId: entry.referredUser?.userId,
//           name: entry.referredUser?.name || 'Unknown',
//           email: entry.referredUser?.email || 'N/A',
//           agentName: entry.agentDetails?.agentName || 'N/A',
//           planName: entry.planName || 'N/A',
//           commissionAmount: parseFloat(entry.commissionAmount) || 0,
//           currency: entry.currency || '₹',
//           agentstatus: entry.agentStatus || '',
//           commissionMonth: entry.commissionMonth || 'N/A'
//         }));

//         setCommissions(mapped);

//         const months = new Set<string>();
//         const years = new Set<string>();

//         rawData.forEach((entry: any) => {
//           if (entry.commissionMonth) {
//             const [year, month] = entry.commissionMonth.split('-');
//             months.add(month);
//             years.add(year);
//           }
//         });

//         setAvailableMonths(Array.from(months));
//         setAvailableYears(Array.from(years));
//       }
//     } catch (err: any) {
//       console.error('Fetch error:', err);
//       setError(err.message || 'Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) getReferralUsers();
//   }, [userId]);

//   function formatCommissionMonth(monthStr: string) {
//     const date = new Date(`${monthStr}-01`);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long'
//     });
//   }

//   const filteredAndSorted = commissions
//     .filter((entry) => {
//       const [year, month] = entry.commissionMonth.split('-');
//       const matchesMonth = selectedMonth === 'All' || selectedMonth === month;
//       const matchesYear = selectedYear === 'All' || selectedYear === year;

//       const searchLower = searchTerm.toLowerCase();
//       const matchesSearch =
//         entry.name.toLowerCase().includes(searchLower) ||
//         entry.email.toLowerCase().includes(searchLower) ||
//         entry.agentName.toLowerCase().includes(searchLower);

//       return matchesMonth && matchesYear && matchesSearch;
//     })
//     .sort((a, b) => {
//       if (!sortField) return 0;
//       const aValue = (a as any)[sortField];
//       const bValue = (b as any)[sortField];

//       if (typeof aValue === 'number' && typeof bValue === 'number') {
//         return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
//       }

//       return sortOrder === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
//     });

//   //   if (loading) {
//   //     return (
//   //       <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100vh" bgcolor="background.paper">
//   //         <CircularProgress size={60} color="primary" />
//   //       </Box>
//   //     );
//   //   }

//   if (error) {
//     return (
//       <Typography color="error" textAlign="center" py={8}>
//         ⚠️ {error}
//       </Typography>
//     );
//   }

//   return (
//     <Box display="flex" flexDirection="column" gap={4}>
//       <Box>
//         <Typography variant="h4" fontWeight="bold">
//           Earnings Overview
//         </Typography>
//         <Typography color="textSecondary" mt={1}>
//           Referral commission earnings breakdown
//         </Typography>
//       </Box>

//       {/* Card with filters and table */}
//       <Card>
//         <CardHeader
//           title={
//             <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
//               <Typography variant="h6">Earning List</Typography>

//               <FormControl size="small">
//                 <InputLabel>Month</InputLabel>
//                 <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} label="Month">
//                   <MenuItem value="All">All</MenuItem>
//                   {availableMonths.sort().map((m) => (
//                     <MenuItem key={m} value={m}>
//                       {new Date(`2023-${m}-01`).toLocaleString('default', {
//                         month: 'long'
//                       })}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl size="small">
//                 <InputLabel>Year</InputLabel>
//                 <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Year">
//                   <MenuItem value="All">All</MenuItem>
//                   {availableYears.sort().map((y) => (
//                     <MenuItem key={y} value={y}>
//                       {y}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl size="small">
//                 <InputLabel>Sort By</InputLabel>
//                 <Select value={sortField} onChange={(e) => setSortField(e.target.value)} label="Sort By">
//                   <MenuItem value="">None</MenuItem>
//                   <MenuItem value="name">User Name</MenuItem>
//                   <MenuItem value="agentName">Agent Name</MenuItem>
//                   <MenuItem value="commissionAmount">Commission Amount</MenuItem>
//                   <MenuItem value="planName">Plan</MenuItem>
//                 </Select>
//               </FormControl>

//               <TextField
//                 size="small"
//                 placeholder="Search name, email, agent..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </Box>
//           }
//         />

//         <CardContent>
//           <Box overflow="auto">
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>User ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Agent Name</TableCell>
//                   <TableCell>Plan</TableCell>
//                   <TableCell>Agent Status</TableCell>
//                   <TableCell>Commission</TableCell>
//                   <TableCell>Commission Month</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredAndSorted.length > 0 ? (
//                   filteredAndSorted.map((entry) => (
//                     <TableRow key={entry.id} hover>
//                       <TableCell>{entry.userId}</TableCell>
//                       <TableCell>{entry.name}</TableCell>
//                       <TableCell>{entry.email}</TableCell>
//                       <TableCell>{entry.agentName}</TableCell>
//                       <TableCell>{entry.planName}</TableCell>
//                       <TableCell>{entry.agentstatus}</TableCell>
//                       <TableCell style={{ color: 'green', fontWeight: 600 }}>
//                         {entry.currency}{' '}
//                         {entry.commissionAmount.toLocaleString('en-IN', {
//                           maximumFractionDigits: 2
//                         })}
//                       </TableCell>
//                       <TableCell style={{ color: 'green', fontWeight: 600 }}>{formatCommissionMonth(entry.commissionMonth)}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={8} align="center">
//                       No commission data found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

'use client';

import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  FilterFn
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

interface CommissionEntry {
  id: number;
  userId: string;
  name: string;
  email: string;
  agentName: string;
  planName: string;
  commissionAmount: number;
  currency: string;
  agentstatus: string;
  commissionMonth: string;
}

const fuzzyFilter: FilterFn<CommissionEntry> = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// Custom Components (approximations based on referenced code)

// IndeterminateCheckbox
const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: {
  indeterminate?: boolean;
  className?: string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return <Checkbox className={className} {...rest} inputRef={ref} />;
};

// DebouncedInput
function DebouncedInput({
  value: initialValue,
  onFilterChange: onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onFilterChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return <TextField {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

// HeaderSort
function HeaderSort({ column }: { column: any }) {
  if (!column.getIsSorted()) return null;
  return <span>{column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼'}</span>;
}

// RowSelection
function RowSelection({ selected }: { selected: number }) {
  if (selected === 0) return null;
  return <Typography sx={{ p: 2 }}>{selected} row(s) selected</Typography>;
}

// SelectColumnSorting (with order)
function SelectColumnSorting({
  getAllColumns,
  setSorting,
  getState
}: {
  getAllColumns: () => any[];
  setSorting: (sorting: any) => void;
  getState: () => any;
}) {
  const columns = getAllColumns().filter((c: any) => c.getCanSort());
  const currentSort = getState().sorting[0] || { id: '', desc: false };

  const handleColumnChange = (e: any) => {
    const colId = e.target.value;
    if (colId === '') {
      setSorting([]);
    } else {
      setSorting([{ id: colId, desc: currentSort.desc }]);
    }
  };

  const handleOrderChange = (e: any) => {
    setSorting([{ id: currentSort.id, desc: e.target.value === 'desc' }]);
  };

  return (
    <Stack direction="row" gap={1}>
      <FormControl size="small">
        <InputLabel>Sort By</InputLabel>
        <Select value={currentSort.id} onChange={handleColumnChange} label="Sort By">
          <MenuItem value="">None</MenuItem>
          {columns.map((col: any) => (
            <MenuItem key={col.id} value={col.id}>
              {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {currentSort.id && (
        <FormControl size="small">
          <InputLabel>Order</InputLabel>
          <Select value={currentSort.desc ? 'desc' : 'asc'} onChange={handleOrderChange} label="Order">
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      )}
    </Stack>
  );
}

// TablePagination
function TablePagination({
  getState,
  setPageIndex,
  setPageSize,
  getPageCount
}: {
  getState: () => any;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  getPageCount: () => number;
}) {
  const { pagination } = getState();

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
      <Typography>Rows per page:</Typography>
      <Select value={pagination.pageSize} onChange={(e) => setPageSize(Number(e.target.value))} size="small">
        {[5, 10, 20, 30].map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
      <Typography>
        {pagination.pageIndex + 1} of {getPageCount()}
      </Typography>
      <IconButton onClick={() => setPageIndex(0)} disabled={pagination.pageIndex === 0}>
        <FirstPage />
      </IconButton>
      <IconButton onClick={() => setPageIndex(pagination.pageIndex - 1)} disabled={pagination.pageIndex === 0}>
        <ChevronLeft />
      </IconButton>
      <IconButton onClick={() => setPageIndex(pagination.pageIndex + 1)} disabled={pagination.pageIndex >= getPageCount() - 1}>
        <ChevronRight />
      </IconButton>
      <IconButton onClick={() => setPageIndex(getPageCount() - 1)} disabled={pagination.pageIndex >= getPageCount() - 1}>
        <LastPage />
      </IconButton>
    </Stack>
  );
}

interface Props {
  columns: ColumnDef<CommissionEntry>[];
  data: CommissionEntry[];
}

// ReactTable Component
function ReactTable({ data, columns }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true
  });

  return (
    <Stack>
      <RowSelection selected={Object.keys(rowSelection).length} />
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                    Object.assign(header.column.columnDef.meta, {
                      className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                    });
                  }

                  return (
                    <TableCell
                      key={header.id}
                      {...header.column.columnDef.meta}
                      onClick={header.column.getToggleSortingHandler()}
                      {...(header.column.getCanSort() &&
                        header.column.columnDef.meta === undefined && {
                          className: 'cursor-pointer prevent-select'
                        })}
                    >
                      {header.isPlaceholder ? null : (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                          {header.column.getCanSort() && <HeaderSort column={header.column} />}
                        </Stack>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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
          {...{
            setPageSize: table.setPageSize,
            setPageIndex: table.setPageIndex,
            getState: table.getState,
            getPageCount: table.getPageCount
          }}
        />
      </Box>
    </Stack>
  );
}

export default function EarningsTable() {
  const [commissions, setCommissions] = useState<CommissionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const getReferralUsers = async () => {
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/referral/getUserReferralCommission/${userId}`);
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

  function formatCommissionMonth(monthStr: string) {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

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
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      {
        header: 'User ID',
        accessorKey: 'userId'
      },
      {
        header: 'Name',
        accessorKey: 'name'
      },
      {
        header: 'Email',
        accessorKey: 'email'
      },
      {
        header: 'Agent Name',
        accessorKey: 'agentName'
      },
      {
        header: 'Plan',
        accessorKey: 'planName'
      },
      {
        header: 'Agent Status',
        accessorKey: 'agentstatus'
      },
      {
        header: 'Commission',
        accessorKey: 'commissionAmount',
        cell: ({ row }) => {
          const { currency, commissionAmount } = row.original;
          return (
            <span style={{ color: 'green', fontWeight: 600 }}>
              {currency} {commissionAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          );
        },
        meta: {
          className: 'cell-right'
        }
      },
      {
        header: 'Commission Month',
        accessorKey: 'commissionMonth',
        cell: ({ getValue }) => <span style={{ color: 'green', fontWeight: 600 }}>{formatCommissionMonth(getValue() as string)}</span>
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
    <Box display="flex" flexDirection="column" gap={4}>
      <Box>
        <Typography variant="h4" fontWeight="bold">
          Referral commission earnings
        </Typography>
        {/* <Typography color="textSecondary" mt={1}>
      
        </Typography> */}
      </Box>

      {/* Card with filters and table */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
        

              <FormControl size="small">
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value as string)} label="Month">
                  <MenuItem value="All">All</MenuItem>
                  {availableMonths.sort().map((m) => (
                    <MenuItem key={m} value={m}>
                      {new Date(`2023-${m}-01`).toLocaleString('default', {
                        month: 'long'
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Year</InputLabel>
                <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value as string)} label="Year">
                  <MenuItem value="All">All</MenuItem>
                  {availableYears.sort().map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DebouncedInput
                value={''}
                onFilterChange={() => {}}
                placeholder={`Search ${filteredData.length} records...`}
                sx={{ width: { xs: 1, sm: 'auto' } }}
              />
            </Box>
          }
        />
        <CardContent>
          <Box overflow="auto">
            <ReactTable data={filteredData} columns={columns} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
