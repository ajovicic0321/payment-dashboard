import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Box, Button, CircularProgress, Alert, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GET_CHARGES_DATE_RANGE_KPI } from '../graphql/queries';
import { ChargesDateRangeKPIResponse } from '../types';
import { format } from 'date-fns';
import { DateFilter, KPICards, DailyPaymentVolumeChart, PaymentStatusChart } from './dashboard/index';

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
      
      <DateFilter
        dateInputs={dateInputs}
        onDateChange={handleDateFilterChange}
        onApply={applyDateFilter}
        onReset={resetDateFilter}
        loading={kpiLoading}
      />

      {kpiLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <KPICards
            kpis={kpis}
            total={kpiData?.chargesDateRangeKPI?.total}
            currency={kpis.currency}
          />

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <DailyPaymentVolumeChart
                data={chartData}
                currency={kpis.currency}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PaymentStatusChart
                data={statusChartData}
                currency={kpis.currency}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
