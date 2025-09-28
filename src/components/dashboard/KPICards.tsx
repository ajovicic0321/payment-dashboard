import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { ChargesDateRangeKPITotal } from '../../types';

interface KPICardsProps {
  kpis: {
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
    currency: string;
    successRate: number;
  };
  total?: ChargesDateRangeKPITotal;
  currency: string;
}

const KPICards: React.FC<KPICardsProps> = ({ kpis, total, currency }) => {
  const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100); // Assuming amount is in cents
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Amount
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(kpis.totalAmount, kpis.currency)}
            </Typography>
            <Typography color="textSecondary">
              Last 30 days
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Payments
            </Typography>
            <Typography variant="h4" component="div">
              {kpis.totalCount}
            </Typography>
            <Typography color="textSecondary">
              Transactions
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Average Amount
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(kpis.averageAmount, kpis.currency)}
            </Typography>
            <Typography color="textSecondary">
              Per transaction
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Success Rate
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {kpis.successRate}%
            </Typography>
            <Typography color="textSecondary">
              Successful payments
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {total && (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Failed Payments
                </Typography>
                <Typography variant="h4" component="div" color="error.main">
                  {total.failedCount}
                </Typography>
                <Typography color="textSecondary">
                  {formatCurrency(total.failedAmount, currency)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Canceled Payments
                </Typography>
                <Typography variant="h4" component="div" color="warning.main">
                  {total.canceledCount}
                </Typography>
                <Typography color="textSecondary">
                  {formatCurrency(total.canceledAmount, currency)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Refunded Amount
                </Typography>
                <Typography variant="h4" component="div" color="info.main">
                  {formatCurrency(total.refundedAmount, currency)}
                </Typography>
                <Typography color="textSecondary">
                  {total.refundedCount} refunds
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default KPICards;
