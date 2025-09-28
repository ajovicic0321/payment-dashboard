import React, { useEffect, useState } from 'react';
import { useQuery, NetworkStatus } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Alert, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { GET_CHARGES } from '../graphql/queries';
import { PaymentFilters } from '../types';
import { PaymentFilters as PaymentFiltersControls, PaymentsTable } from './payments';

const PaymentsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<PaymentFilters>(() => {
    const urlDateFrom = searchParams.get('dateFrom');
    const urlDateTo = searchParams.get('dateTo');
    
    return {
      status: '',
      dateFrom: urlDateFrom ? parseInt(urlDateFrom) : Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000),
      dateTo: urlDateTo ? parseInt(urlDateTo) : Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000),
    };
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input (500ms) and use trimmed value
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(id);
  }, [search]);

  // Reset to first page whenever the debounced search changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  // Construct filter object for API
  const constructFilter = () => {
    const filter: any = {};

    if (filters.status) {
      filter.status = { eq: filters.status };
    }

    if (filters.dateFrom || filters.dateTo) {
      filter.createdAt = {};
      if (filters.dateFrom) {
        filter.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        filter.createdAt.lte = filters.dateTo;
      }
    }

    // Apply inclusive search on provider reference, customer name, and email
    // Use a combination of match and wildcard to cover contains scenarios
    if (debouncedSearch) {
      const term = debouncedSearch.replace(/\s+/g, ' ').trim();
      const wild = `*${term}*`;
      filter.or = [
        { providerReferenceId: { match: term } },
        { providerReferenceId: { wildcard: wild } },
        { customerName: { matchPhrasePrefix: term } },
        { customerName: { wildcard: wild } },
        { customerEmail: { match: term } },
        { customerEmail: { wildcard: wild } },
      ];
    }

    return filter;
  };

  const { data, loading, error, refetch, networkStatus } = useQuery(GET_CHARGES, {
    variables: {
      size: rowsPerPage,
      from: page * rowsPerPage,
      filter: constructFilter(),
    },
    notifyOnNetworkStatusChange: true, // Enable to detect refetch
  });

  // Check if we're refetching
  const isRefetching = networkStatus === NetworkStatus.refetch;
  const isLoading = loading || isRefetching;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof PaymentFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleViewPayment = (paymentId: string) => {
    navigate(`/payments/${paymentId}`);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      dateFrom: Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year ago
      dateTo: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year in future
    });
    setSearch('');
    setDebouncedSearch('');
    setPage(0);
  };


  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading payments: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          Payments List
        </Typography>
      </Box>

      <PaymentFiltersControls
        filters={filters}
        search={search}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
      />

      <PaymentsTable
        data={data?.charges?.items || []}
        total={data?.charges?.total || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={isLoading}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onViewPayment={handleViewPayment}
        onRefresh={() => refetch()}
      />
    </Box>
  );
};

export default PaymentsList;
