import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GET_CHARGES } from '../graphql/queries';
import { Charge } from '../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dateRange = {
    from: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000), // 30 days ago
    to: Math.floor(Date.now() / 1000), // now
  };

  const { data: chargesData, loading: chargesLoading, error: chargesError } = useQuery(GET_CHARGES, {
    variables: {
      limit: 1000, // Get more data for better KPI calculations
      offset: 0,
      dateFrom: dateRange.from,
      dateTo: dateRange.to,
    },
  });

  // Process data for charts
  const processChartData = (charges: Charge[]) => {
    const dailyData: { [key: string]: { date: string; amount: number; count: number } } = {};
    
    charges?.forEach((charge) => {
      const date = format(new Date(charge.createdAt * 1000), 'yyyy-MM-dd');
      if (!dailyData[date]) {
        dailyData[date] = { date, amount: 0, count: 0 };
      }
      dailyData[date].amount += charge.amount;
      dailyData[date].count += 1;
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  };

  const chartData = processChartData(chargesData?.charges?.data || []);

  // Process status distribution
  const statusDistribution = chargesData?.charges?.data?.reduce((acc: { [key: string]: number }, charge: Charge) => {
    acc[charge.status] = (acc[charge.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const statusChartData = Object.entries(statusDistribution).map(([status, count]) => ({
    status,
    count,
  }));

  // Calculate KPIs from charges data
  const calculateKPIs = (charges: Charge[]) => {
    if (!charges || charges.length === 0) {
      return {
        totalAmount: 0,
        totalCount: 0,
        averageAmount: 0,
        currency: 'EUR',
        successRate: 0,
      };
    }

    const totalAmount = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const totalCount = charges.length;
    const averageAmount = totalAmount / totalCount;
    const currency = charges[0]?.currency || 'EUR';
    const succeededCount = charges.filter(charge => charge.status === 'succeeded').length;
    const successRate = Math.round((succeededCount / totalCount) * 100);

    return {
      totalAmount,
      totalCount,
      averageAmount,
      currency,
      successRate,
    };
  };

  const kpis = calculateKPIs(chargesData?.charges?.data || []);

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (chargesError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading dashboard data: {chargesError.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Payment Analytics Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/payments')}
          sx={{ ml: 2 }}
        >
          View All Payments
        </Button>
      </Box>

      {chargesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
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
                  <Typography variant="h4" component="div">
                    {kpis.successRate}%
                  </Typography>
                  <Typography color="textSecondary">
                    Successful payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Payment Volume
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'amount' ? formatCurrency(value) : value,
                        name === 'amount' ? 'Amount' : 'Count'
                      ]}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
