import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, IconButton, Grid } from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { GET_CHARGE_BY_ID } from '../graphql/queries';
import { Charge } from '../types';
import { PaymentInfo, CustomerInfo, PaymentMethodInfo } from './payment-detail';

const PaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_CHARGE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  const payment: Charge | undefined = data?.charge;

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
          <PaymentInfo payment={payment} />
        </Grid>

        {/* Customer Information */}
        <Grid item xs={12} md={4}>
          <CustomerInfo customer={payment.customer} />

          {/* Payment Method Information */}
          <PaymentMethodInfo paymentMethod={payment.paymentMethod} />
        </Grid>

        {/* Metadata section removed as it's not available in the API schema */}
      </Grid>
    </Box>
  );
};

export default PaymentDetail;
