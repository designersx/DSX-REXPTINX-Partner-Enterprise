'use client';

import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';

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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// third-party
import { LabelKeyObject } from 'react-csv/lib/core';
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
import Swal from 'sweetalert2';

// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import { CSVExport, DebouncedInput, IndeterminateCheckbox, RowSelection, TablePagination } from 'components/third-party/react-table';
import AlertCustomerDelete from 'sections/apps/customer/AlertCustomerDelete';
import CustomerModal from 'sections/apps/customer/CustomerModal';
import CustomerView from 'sections/apps/customer/CustomerView';
import EmptyTables from 'views/forms-tables/tables/react-table/EmptyTable';

// api
import { useGetCustomer } from 'api/customer';
import { raiseRequest, checkUserRequestStatus } from '../../../Services/auth';

// types
import { CustomerList } from 'types/customer';

// assets
import { Add, Edit, Eye } from '@wandersonalwes/iconsax-react';

const avatarImage = '/assets/images/users';

// ==============================|| REACT TABLE - LIST ||============================== //
function ReactTable({ data, columns, modalToggler }: any) {
  console.log(data, 'datata');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
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
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const headers: LabelKeyObject[] = [];
  columns.map(
    (col) =>
      col.accessorKey &&
      headers.push({
        label: typeof col.header === 'string' ? col.header : '#',
        key: col.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2, justifyContent: 'space-between', p: 3 }}>
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data.length} records...`}
        />

        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
            Add User
          </Button>
        </Stack>
      </Stack>

      <Stack>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} onClick={header.column.getToggleSortingHandler()}>
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow sx={{ bgcolor: alpha('#1976d2', 0.1) }}>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <CustomerView data={row.original} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
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

// ==============================|| USER MANAGEMENT ||============================== //
export default function UserManagement() {
  const { customersLoading: loading, customers: lists } = useGetCustomer();

  const [customerModal, setCustomerModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerList | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [requestingUserId, setRequestingUserId] = useState<string | null>(null);
  const [requestedUsers, setRequestedUsers] = useState<Map<string, string>>(new Map());

  // ✅ Fetch requests for current user
  const fetchRequestedUsers = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      const res = await checkUserRequestStatus(currentUserId);
      console.log(res, 'aahja yaar dekhla ');
      if (res?.requests) {
        const map = new Map<string, string>();
        res.requests.forEach((r: any) => {
          map.set(r.userId, r);
        });
        setRequestedUsers(map);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  useEffect(() => {
    fetchRequestedUsers();
  }, []);

  // ✅ Handle Raise Request click
  const handleRaiseRequestClick = (user: any) => {
    setSelectedUser(user);
    setRequestModalOpen(true);
  };

  // ✅ Handle Raise Request submission
  const handleRequestSubmit = async (comment: string, userId: string, email: string) => {
    try {
      setRequestingUserId(userId);
      const raisedByUserId = localStorage.getItem('userId');
      const res = await raiseRequest({ userId, email, comment, raisedByUserId });

      if (res?.status) {
        Swal.fire({
          icon: 'success',
          title: 'Request Raised Successfully',
          timer: 1500,
          showConfirmButton: false
        });
        fetchRequestedUsers();
      } else {
        Swal.fire({ icon: 'error', title: 'Failed to Raise Request' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong.' });
    } finally {
      setRequestingUserId(null);
      setRequestModalOpen(false);
    }
  };

  const columns = useMemo<ColumnDef<CustomerList>[]>(() => {
    return [
      {
        header: '#',
        accessorKey: 'id'
      },
      {
        header: 'Username',
        accessorKey: 'name',
        cell: ({ getValue }) => (
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
            <Avatar alt="Avatar" size="sm" src={`${avatarImage}/avatar-1.png`} />
            <Typography>{getValue() as string}</Typography>
          </Stack>
        )
      },
      { header: 'Email', accessorKey: 'email' },
      {
        header: 'Phone Number',
        accessorKey: 'phone',
        cell: ({ getValue }) => <Typography>{getValue() ? (getValue() as string) : 'N/A'}</Typography>
      },
      { header: 'Referral Code', accessorKey: 'referralCode' },

      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const user = row.original;
          const matchedRequest = requestedUsers.get(user.userId);

          // Collapse icon logic 👇
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <Box component="span" sx={{ color: 'error.main' }}>
                <Add style={{ transform: 'rotate(45deg)' }} />
              </Box>
            ) : (
              <Eye />
            );

          console.log(user.userId, matchedRequest?.Status, matchedRequest, 'DEBUG BUTTON');

          let buttonText = 'Raise Request';
          let isDisabled = false;
          let tooltipText = 'Raise deletion request';

          const status = matchedRequest?.Status?.trim()?.toLowerCase();

          if (status === 'not resolved') {
            buttonText = 'Raised';
            isDisabled = true;
            tooltipText = 'Request already submitted';
          } else if (status === 'resolved') {
            buttonText = 'Resolved';
            isDisabled = true;
            tooltipText = 'Request resolved';
          } else if (matchedRequest) {
            // fallback for any other valid request
            isDisabled = true;
            tooltipText = 'Request already submitted';
          }

          // Disable button also if it's the current user
          if (requestingUserId === user.id) {
            isDisabled = true;
          }

          return (
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {/* 👇 Collapse / View icon */}
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>

              {/* 👇 Edit button */}
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  disabled={isDisabled}
                  sx={(theme) => ({
                    ':hover': {
                      ...theme.applyStyles('dark', { color: 'text.primary' })
                    }
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomer(row.original);
                    setCustomerModal(true);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              {/* 👇 Raise Request button */}
              <Tooltip title={tooltipText}>
                <span>
                  <Button variant="outlined" size="small" disabled={isDisabled} onClick={() => handleRaiseRequestClick(user)}>
                    {buttonText}
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          );
        }
      }
    ];
  }, [requestedUsers, requestingUserId]);

  if (loading) return <EmptyTables />;

  return (
    <Paper>
      <ReactTable
        data={lists}
        columns={columns}
        modalToggler={() => {
          setCustomerModal(true);
          setSelectedCustomer(null);
        }}
      />
      <CustomerModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} />
      <AlertCustomerDelete
        open={requestModalOpen}
        handleClose={() => setRequestModalOpen(false)}
        id={selectedUser?.userId}
        email={selectedUser?.email}
        title={selectedUser?.name}
        fetchRequests={fetchRequestedUsers}
      />
    </Paper>
  );
}
