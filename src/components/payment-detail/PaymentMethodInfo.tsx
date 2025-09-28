import React from 'react';
import { Paper, Typography, Grid, Divider } from '@mui/material';
import { Charge } from '../../types';

interface PaymentMethodInfoProps {
  paymentMethod?: Charge['paymentMethod'];
}

const PaymentMethodInfo: React.FC<PaymentMethodInfoProps> = ({ paymentMethod }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {paymentMethod ? (
        <Grid container spacing={2}>
          {paymentMethod.method && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Method
              </Typography>
              <Typography variant="body1">
                {paymentMethod.method}
              </Typography>
            </Grid>
          )}
          {paymentMethod.card?.type && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Card Type
              </Typography>
              <Typography variant="body1">
                {paymentMethod.card.type}
              </Typography>
            </Grid>
          )}
          {paymentMethod.card?.brand && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Brand
              </Typography>
              <Typography variant="body1">
                {paymentMethod.card.brand}
              </Typography>
            </Grid>
          )}
          {paymentMethod.card?.last4 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Last 4 Digits
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                **** **** **** {paymentMethod.card.last4}
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
  );
};

export default PaymentMethodInfo;
