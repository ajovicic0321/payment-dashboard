import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import { Visibility, ArrowBack } from '@mui/icons-material';
import { format } from 'date-fns';
import { GET_CHARGES } from '../graphql/queries';
import { Charge, PaymentFilters } from '../types';

const PaymentsList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<PaymentFilters>({
    status: '',
    dateFrom: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year ago
    dateTo: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year in future
  });

  // Construct filter object for API
  const constructFilter = () => {
    const filter: any = {};

    if (filters.status) {
      filter.status = { eq: filters.status };
    }

    if (filters.dateFrom || filters.dateTo) {
      filter.createdAt = {};
      if (filters.dateFrom) {
        filter.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        filter.createdAt.lte = filters.dateTo;
      }
    }

    return filter;
  };

  const { data, loading, error, refetch } = useQuery(GET_CHARGES, {
    variables: {
      size: rowsPerPage,
      from: page * rowsPerPage,
      filter: constructFilter(),
    },
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof PaymentFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleViewPayment = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'MMM dd, yyyy HH:mm');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'succeeded', label: 'Succeeded' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'canceled', label: 'Canceled' },
  ];

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading payments: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Payments List
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => refetch()}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={filters.dateFrom ? format(new Date(filters.dateFrom * 1000), 'yyyy-MM-dd') : ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : undefined)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={filters.dateTo ? format(new Date(filters.dateTo * 1000), 'yyyy-MM-dd') : ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : undefined)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              onClick={() => {
                setFilters({
                  status: '',
                  dateFrom: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year ago
                  dateTo: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year in future
                });
                setPage(0);
              }}
              sx={{ height: '56px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data?.charges?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No payments found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.charges?.items?.map((payment: Charge) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {payment.id.substring(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.customer?.name || payment.customer?.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(payment.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {payment.providerReferenceId || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPayment(payment.id)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data?.charges?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default PaymentsList;
