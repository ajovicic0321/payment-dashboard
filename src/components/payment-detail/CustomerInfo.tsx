import React from 'react';
import { Paper, Typography, Grid, Divider } from '@mui/material';
import { Charge } from '../../types';

interface CustomerInfoProps {
  customer?: Charge['customer'];
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Customer Information
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {customer ? (
        <Grid container spacing={2}>
          {customer.name && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">
                {customer.name}
              </Typography>
            </Grid>
          )}
          {customer.email && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">
                {customer.email}
              </Typography>
            </Grid>
          )}
          {customer.phone && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {customer.phone}
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
  );
};

export default CustomerInfo;
