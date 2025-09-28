import React from 'react';
import { Paper, Typography, Grid, Chip, Divider } from '@mui/material';
import { format } from 'date-fns';
import { Charge } from '../../types';

interface PaymentInfoProps {
  payment: Charge;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ payment }) => {
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'MMM dd, yyyy HH:mm:ss');
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Payment Information
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Payment ID
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {payment.id}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Status
          </Typography>
          <Chip
            label={payment.status}
            color={getStatusColor(payment.status) as any}
            sx={{ mt: 0.5 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Amount
          </Typography>
          <Typography variant="h6" color="primary">
            {formatCurrency(payment.amount, payment.currency)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Currency
          </Typography>
          <Typography variant="body1">
            {payment.currency.toUpperCase()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Created At
          </Typography>
          <Typography variant="body1">
            {formatDate(payment.createdAt)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Updated At
          </Typography>
          <Typography variant="body1">
            {formatDate(payment.updatedAt)}
          </Typography>
        </Grid>
        {payment.providerReferenceId && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Reference
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              {payment.providerReferenceId}
            </Typography>
          </Grid>
        )}
        {payment.description && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Description
            </Typography>
            <Typography variant="body1">
              {payment.description}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default PaymentInfo;
