import React, { useMemo, useState } from 'react';
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
  TextField,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { GET_CHARGES_DATE_RANGE_KPI } from '../graphql/queries';
import { ChargesDateRangeKPIResponse } from '../types';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Date filter state for the dashboard (default to wide range to capture test data)
  const [dateRange, setDateRange] = useState(() => ({
    from: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year ago
    to: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year in future
  }));

  // Local state for date inputs (string format for TextField)
  const [dateInputs, setDateInputs] = useState(() => ({
    from: format(new Date(dateRange.from * 1000), 'yyyy-MM-dd'),
    to: format(new Date(dateRange.to * 1000), 'yyyy-MM-dd'),
  }));

  // Handle date filter changes
  const handleDateFilterChange = (field: 'from' | 'to', value: string) => {
    setDateInputs(prev => ({ ...prev, [field]: value }));
  };

  const applyDateFilter = () => {
    const newDateRange = {
      from: Math.floor(new Date(dateInputs.from).getTime() / 1000),
      to: Math.floor(new Date(dateInputs.to + 'T23:59:59').getTime() / 1000), // End of day
    };
    setDateRange(newDateRange);
  };

  const resetDateFilter = () => {
    const defaultRange = {
      from: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000),
      to: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000),
    };
    setDateRange(defaultRange);
    setDateInputs({
      from: format(new Date(defaultRange.from * 1000), 'yyyy-MM-dd'),
      to: format(new Date(defaultRange.to * 1000), 'yyyy-MM-dd'),
    });
  };

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

  // Note: Removed unused charges query since we only need KPI data for dashboard

  // Memoize chart data processing to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    if (!kpiData?.chargesDateRangeKPI?.data) return [];
    
    return kpiData.chargesDateRangeKPI.data
      .filter(item => item.timestamp) // Filter out invalid entries
      .map(item => ({
        date: format(new Date(item.timestamp * 1000), 'MMM dd, yyyy'),
        timestamp: item.timestamp, // Keep original timestamp for navigation
        succeededAmount: item.succeededAmount || 0,
        succeededCount: item.succeededCount || 0,
        canceledAmount: item.canceledAmount || 0,
        canceledCount: item.canceledCount || 0,
        failedAmount: item.failedAmount || 0,
        failedCount: item.failedCount || 0,
        capturedAmount: item.capturedAmount || 0,
        capturedCount: item.capturedCount || 0,
        totalAmount: (item.succeededAmount || 0) + (item.canceledAmount || 0) + (item.failedAmount || 0) + (item.capturedAmount || 0),
        totalCount: (item.succeededCount || 0) + (item.canceledCount || 0) + (item.failedCount || 0) + (item.capturedCount || 0),
      }))
      .filter(item => item.totalAmount > 0 || item.totalCount > 0); // Only show days with activity
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

  if (kpiError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading dashboard data: {kpiError.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
      
      {/* Date Filter Controls */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', minWidth: 'fit-content' }}>
          Date Range Filter:
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <TextField
            type="date"
            label="From"
            size="small"
            value={dateInputs.from}
            onChange={(e) => handleDateFilterChange('from', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 140 }}
          />
          <TextField
            type="date"
            label="To"
            size="small"
            value={dateInputs.to}
            onChange={(e) => handleDateFilterChange('to', e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 140 }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={applyDateFilter}
            disabled={kpiLoading}
          >
            Apply Filter
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={resetDateFilter}
            disabled={kpiLoading}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {kpiLoading ? (
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
                  <LineChart 
                    data={chartData}
                    onClick={(data) => {
                      if (data && data.activeLabel) {
                        // Find the data point for the clicked date
                        const clickedPoint = chartData.find(item => item.date === data.activeLabel);
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
                    }}
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
                                💰 Total Amount: {formatCurrency(data.totalAmount, kpis.currency)}
                              </Typography>
                              <Typography variant="body2" color="success.main">
                                ✅ Succeeded: {formatCurrency(data.succeededAmount, kpis.currency)} ({data.succeededCount} payments)
                              </Typography>
                              <Typography variant="body2" color="warning.main">
                                ⚠️ Canceled: {formatCurrency(data.canceledAmount, kpis.currency)} ({data.canceledCount} payments)
                              </Typography>
                              <Typography variant="body2" color="error.main">
                                ❌ Failed: {formatCurrency(data.failedAmount, kpis.currency)} ({data.failedCount} payments)
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
