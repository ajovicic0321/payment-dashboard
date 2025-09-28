import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { format } from 'date-fns';
import { GET_CHARGE_BY_ID } from '../graphql/queries';
import { Charge } from '../types';

const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_CHARGE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const payment: Charge | undefined = data?.charge;

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading payment details: {error.message}
      </Alert>
    );
  }

  if (!payment) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Payment not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/payments')} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Payment Details
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Payment Information */}
        <Grid item xs={12} md={8}>
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
        </Grid>

        {/* Customer Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {payment.customer ? (
              <Grid container spacing={2}>
                {payment.customer.name && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography variant="body1">
                      {payment.customer.name}
                    </Typography>
                  </Grid>
                )}
                {payment.customer.email && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {payment.customer.email}
                    </Typography>
                  </Grid>
                )}
                {payment.customer.phone && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {payment.customer.phone}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No customer information available
              </Typography>
            )}
          </Paper>

          {/* Payment Method Information */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {payment.paymentMethod ? (
              <Grid container spacing={2}>
                {payment.paymentMethod.method && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Method
                    </Typography>
                    <Typography variant="body1">
                      {payment.paymentMethod.method}
                    </Typography>
                  </Grid>
                )}
                {payment.paymentMethod.card?.type && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Card Type
                    </Typography>
                    <Typography variant="body1">
                      {payment.paymentMethod.card.type}
                    </Typography>
                  </Grid>
                )}
                {payment.paymentMethod.card?.brand && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Brand
                    </Typography>
                    <Typography variant="body1">
                      {payment.paymentMethod.card.brand}
                    </Typography>
                  </Grid>
                )}
                {payment.paymentMethod.card?.last4 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Last 4 Digits
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      **** **** **** {payment.paymentMethod.card.last4}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No payment method information available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Metadata section removed as it's not available in the API schema */}
      </Grid>
    </Box>
  );
};

export default PaymentDetail;
