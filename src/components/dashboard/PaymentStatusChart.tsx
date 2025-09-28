import React from 'react';
import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusChartDataPoint {
  status: string;
  count: number;
  amount: number;
}

interface PaymentStatusChartProps {
  data: StatusChartDataPoint[];
  currency: string;
}

const PaymentStatusChart: React.FC<PaymentStatusChartProps> = ({ data, currency }) => {
  const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100); // Assuming amount is in cents
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Status Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              name === 'count' ? value : formatCurrency(value, currency),
              name === 'count' ? 'Count' : 'Amount'
            ]}
          />
          <Bar dataKey="count" fill="#1976d2" name="count" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default PaymentStatusChart;
