import React, { useMemo } from 'react';
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
import { GET_CHARGES, GET_CHARGES_DATE_RANGE_KPI } from '../graphql/queries';
import { Charge, ChargesDateRangeKPIResponse } from '../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Memoize date range to prevent unnecessary re-renders
  // Note: Using a wider date range to include the test data which is in future dates (2025)
  const dateRange = useMemo(() => ({
    from: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year ago
    to: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year in future
  }), []);

  // Fetch KPI data with optimized options
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useQuery<ChargesDateRangeKPIResponse>(GET_CHARGES_DATE_RANGE_KPI, {
    variables: {
      start: dateRange.from,
      end: dateRange.to,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-first', // Use cache if available
  });

  // Only fetch charges data for list preview - we mainly use KPI data for analytics
  const { data: chargesData, loading: chargesLoading, error: chargesError } = useQuery(GET_CHARGES, {
    variables: {
      size: 10, // Minimal data for list preview
      from: 0,
      filter: {
        createdAt: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      },
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-first', // Use cache if available
  });

  // Memoize chart data processing to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    if (!kpiData?.chargesDateRangeKPI?.data) return [];
    
    return kpiData.chargesDateRangeKPI.data.map(item => ({
      date: format(new Date(item.timestamp * 1000), 'MMM dd'),
      succeededAmount: item.succeededAmount,
      succeededCount: item.succeededCount,
      canceledAmount: item.canceledAmount,
      canceledCount: item.canceledCount,
      failedAmount: item.failedAmount,
      failedCount: item.failedCount,
      totalAmount: item.succeededAmount + item.canceledAmount + item.failedAmount,
      totalCount: item.succeededCount + item.canceledCount + item.failedCount,
    }));
  }, [kpiData?.chargesDateRangeKPI?.data]);

  // Memoize status distribution processing
  const statusChartData = useMemo(() => {
    if (!kpiData?.chargesDateRangeKPI?.total) return [];
    
    const total = kpiData.chargesDateRangeKPI.total;
    return [
      { status: 'Succeeded', count: total.succeededCount, amount: total.succeededAmount },
      { status: 'Canceled', count: total.canceledCount, amount: total.canceledAmount },
      { status: 'Failed', count: total.failedCount, amount: total.failedAmount },
      { status: 'Captured', count: total.capturedCount, amount: total.capturedAmount },
    ].filter(item => item.count > 0);
  }, [kpiData?.chargesDateRangeKPI?.total]);

  // Memoize KPI calculations
  const kpis = useMemo(() => {
    if (!kpiData?.chargesDateRangeKPI?.total) {
      return {
        totalAmount: 0,
        totalCount: 0,
        averageAmount: 0,
        currency: 'EUR',
        successRate: 0,
      };
    }

    const total = kpiData.chargesDateRangeKPI.total;
    const totalAmount = total.succeededAmount + total.canceledAmount + total.failedAmount + total.capturedAmount;
    const totalCount = total.succeededCount + total.canceledCount + total.failedCount + total.capturedCount;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
    const currency = kpiData.chargesDateRangeKPI.currency || 'EUR';
    const successRate = totalCount > 0 ? Math.round((total.succeededCount / totalCount) * 100) : 0;

    return {
      totalAmount,
      totalCount,
      averageAmount,
      currency,
      successRate,
    };
  }, [kpiData?.chargesDateRangeKPI]);

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (kpiError || chargesError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading dashboard data: {kpiError?.message || chargesError?.message}
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

      {kpiLoading || chargesLoading ? (
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
                  <Typography variant="h4" component="div" color="success.main">
                    {kpis.successRate}%
                  </Typography>
                  <Typography color="textSecondary">
                    Successful payments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {kpiData?.chargesDateRangeKPI?.total && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Failed Payments
                      </Typography>
                      <Typography variant="h4" component="div" color="error.main">
                        {kpiData.chargesDateRangeKPI.total.failedCount}
                      </Typography>
                      <Typography color="textSecondary">
                        {formatCurrency(kpiData.chargesDateRangeKPI.total.failedAmount, kpis.currency)}
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
                        {kpiData.chargesDateRangeKPI.total.canceledCount}
                      </Typography>
                      <Typography color="textSecondary">
                        {formatCurrency(kpiData.chargesDateRangeKPI.total.canceledAmount, kpis.currency)}
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
                        {formatCurrency(kpiData.chargesDateRangeKPI.total.refundedAmount, kpis.currency)}
                      </Typography>
                      <Typography color="textSecondary">
                        {kpiData.chargesDateRangeKPI.total.refundedCount} refunds
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
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
                        name === 'totalAmount' ? formatCurrency(value) : value,
                        name === 'totalAmount' ? 'Total Amount' : 'Total Count'
                      ]}
                    />
                    <Line type="monotone" dataKey="totalAmount" stroke="#1976d2" strokeWidth={2} name="totalAmount" />
                    <Line type="monotone" dataKey="succeededAmount" stroke="#4caf50" strokeWidth={2} name="succeededAmount" />
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
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'count' ? value : formatCurrency(value),
                        name === 'count' ? 'Count' : 'Amount'
                      ]}
                    />
                    <Bar dataKey="count" fill="#1976d2" name="count" />
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
