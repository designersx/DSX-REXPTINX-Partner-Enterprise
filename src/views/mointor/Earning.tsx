'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  CircularProgress
} from '@mui/material';

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

export default function EarningsTable() {
  const [commissions, setCommissions] = useState<CommissionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('asc');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const getReferralUsers = async () => {
    // setLoading(true);
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

  const filteredAndSorted = commissions
    .filter((entry) => {
      const [year, month] = entry.commissionMonth.split('-');
      const matchesMonth = selectedMonth === 'All' || selectedMonth === month;
      const matchesYear = selectedYear === 'All' || selectedYear === year;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        entry.name.toLowerCase().includes(searchLower) ||
        entry.email.toLowerCase().includes(searchLower) ||
        entry.agentName.toLowerCase().includes(searchLower);

      return matchesMonth && matchesYear && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
    });

  //   if (loading) {
  //     return (
  //       <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100vh" bgcolor="background.paper">
  //         <CircularProgress size={60} color="primary" />
  //       </Box>
  //     );
  //   }

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
          Earnings Overview
        </Typography>
        <Typography color="textSecondary" mt={1}>
          Referral commission earnings breakdown
        </Typography>
      </Box>

      {/* Card with filters and table */}
      <Card>
        <CardHeader
          title={
            <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
              <Typography variant="h6">Earning List</Typography>

              <FormControl size="small">
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} label="Month">
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
                <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} label="Year">
                  <MenuItem value="All">All</MenuItem>
                  {availableYears.sort().map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Sort By</InputLabel>
                <Select value={sortField} onChange={(e) => setSortField(e.target.value)} label="Sort By">
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="name">User Name</MenuItem>
                  <MenuItem value="agentName">Agent Name</MenuItem>
                  <MenuItem value="commissionAmount">Commission Amount</MenuItem>
                  <MenuItem value="planName">Plan</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                placeholder="Search name, email, agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          }
        />

        <CardContent>
          <Box overflow="auto">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Agent Name</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Agent Status</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Commission Month</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSorted.length > 0 ? (
                  filteredAndSorted.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>{entry.userId}</TableCell>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.agentName}</TableCell>
                      <TableCell>{entry.planName}</TableCell>
                      <TableCell>{entry.agentstatus}</TableCell>
                      <TableCell style={{ color: 'green', fontWeight: 600 }}>
                        {entry.currency}{' '}
                        {entry.commissionAmount.toLocaleString('en-IN', {
                          maximumFractionDigits: 2
                        })}
                      </TableCell>
                      <TableCell style={{ color: 'green', fontWeight: 600 }}>{formatCommissionMonth(entry.commissionMonth)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No commission data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
