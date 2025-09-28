import React from 'react';
import { Paper, Typography, TextField, MenuItem, Button, Grid } from '@mui/material';
import { format } from 'date-fns';
import { PaymentFilters } from '../../types';

interface PaymentFiltersProps {
  filters: PaymentFilters;
  search: string;
  onFilterChange: (field: keyof PaymentFilters, value: any) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

const PaymentFiltersControls: React.FC<PaymentFiltersProps> = ({
  filters,
  search,
  onFilterChange,
  onSearchChange,
  onClearFilters,
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'SUCCEEDED', label: 'Succeeded' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELED', label: 'Canceled' },
    { value: 'EXPIRED', label: 'Expired' },
  ];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            label="Status"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search (reference or customer)"
            placeholder="e.g. 1502014 or John Doe"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            value={filters.dateFrom ? format(new Date(filters.dateFrom * 1000), 'yyyy-MM-dd') : ''}
            onChange={(e) => onFilterChange('dateFrom', e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : undefined)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            value={filters.dateTo ? format(new Date(filters.dateTo * 1000), 'yyyy-MM-dd') : ''}
            onChange={(e) => onFilterChange('dateTo', e.target.value ? Math.floor(new Date(e.target.value).getTime() / 1000) : undefined)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            onClick={onClearFilters}
            sx={{ height: '56px' }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PaymentFiltersControls;
