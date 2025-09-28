import React from 'react';
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
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import { Visibility, Refresh } from '@mui/icons-material';
import { format } from 'date-fns';
import { Charge } from '../../types';

interface PaymentsTableProps {
  data: Charge[];
  total: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onViewPayment: (paymentId: string) => void;
  onRefresh: () => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  data,
  total,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  onRowsPerPageChange,
  onViewPayment,
  onRefresh,
}) => {
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
    switch (status.toUpperCase()) {
      case 'SUCCEEDED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      case 'CANCELED':
        return 'default';
      case 'EXPIRED':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 0 }}>
        <Typography variant="h6">Payment Records</Typography>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{ opacity: loading ? 0.5 : 1 }}
          title={loading ? 'Refreshing...' : 'Refresh data'}
        >
          {loading ? (
            <Refresh sx={{
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }} />
          ) : (
            <Refresh />
          )}
        </IconButton>
      </Box>
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
              // Skeleton loader rows
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="text" width="80px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="100px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width="80px" height="24px" sx={{ borderRadius: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="120px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="140px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="90px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="circular" width="32px" height="32px" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No payments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((payment: Charge) => (
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
                        onClick={() => onViewPayment(payment.id)}
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
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default PaymentsTable;
