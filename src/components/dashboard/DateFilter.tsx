import React from 'react';
import { Paper, Typography, TextField, Button, Stack } from '@mui/material';

interface DateFilterProps {
  dateInputs: {
    from: string;
    to: string;
  };
  onDateChange: (field: 'from' | 'to', value: string) => void;
  onApply: () => void;
  onReset: () => void;
  loading: boolean;
}

const DateFilter: React.FC<DateFilterProps> = ({
  dateInputs,
  onDateChange,
  onApply,
  onReset,
  loading,
}) => {
  return (
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
          onChange={(e) => onDateChange('from', e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 140 }}
        />
        <TextField
          type="date"
          label="To"
          size="small"
          value={dateInputs.to}
          onChange={(e) => onDateChange('to', e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 140 }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={onApply}
          disabled={loading}
        >
          Apply Filter
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  );
};

export default DateFilter;
