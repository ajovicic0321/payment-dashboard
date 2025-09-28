import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface ChartDataPoint {
  date: string;
  timestamp: number;
  succeededAmount: number;
  succeededCount: number;
  canceledAmount: number;
  canceledCount: number;
  failedAmount: number;
  failedCount: number;
  capturedAmount: number;
  capturedCount: number;
  totalAmount: number;
  totalCount: number;
}

interface DailyPaymentVolumeChartProps {
  data: ChartDataPoint[];
  currency: string;
}

const DailyPaymentVolumeChart: React.FC<DailyPaymentVolumeChartProps> = ({ data, currency }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number, currencyCode: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount / 100); // Assuming amount is in cents
  };

  const handleChartClick = (data: any) => {
    if (data && data.activeLabel) {
      // Find the data point for the clicked date
      const clickedPoint = data.find((item: ChartDataPoint) => item.date === data.activeLabel);
      if (clickedPoint) {
        // Use the original timestamp for accurate filtering
        const clickedTimestamp = clickedPoint.timestamp;

        // Calculate start and end of the day using the original timestamp
        const clickedDate = new Date(clickedTimestamp * 1000);
        const dayStart = Math.floor(new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate()).getTime() / 1000);
        const dayEnd = dayStart + (24 * 60 * 60) - 1; // End of day

        navigate(`/payments?dateFrom=${dayStart}&dateTo=${dayEnd}`);
      }
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Daily Payment Volume
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onClick={handleChartClick}
          style={{ cursor: 'pointer' }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Box sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    p: 2,
                    boxShadow: 2
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      💰 Total Amount: {formatCurrency(data.totalAmount, currency)}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      ✅ Succeeded: {formatCurrency(data.succeededAmount, currency)} ({data.succeededCount} payments)
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      ⚠️ Canceled: {formatCurrency(data.canceledAmount, currency)} ({data.canceledCount} payments)
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      ❌ Failed: {formatCurrency(data.failedAmount, currency)} ({data.failedCount} payments)
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                      📊 Total Count: {data.totalCount} payments
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                      💡 Click to view payments for this day
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="#1976d2"
            strokeWidth={2}
            name="totalAmount"
          />
          <Line
            type="monotone"
            dataKey="succeededAmount"
            stroke="#4caf50"
            strokeWidth={2}
            name="succeededAmount"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DailyPaymentVolumeChart;
