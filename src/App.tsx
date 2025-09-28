import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import PaymentsList from './components/PaymentsList';
import PaymentDetail from './components/PaymentDetail';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payments" element={<PaymentsList />} />
            <Route path="/payments/:id" element={<PaymentDetail />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Box>
  );
}

export default App;
