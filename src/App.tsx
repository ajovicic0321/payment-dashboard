import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import PaymentsList from './components/PaymentsList';
import PaymentDetail from './components/PaymentDetail';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Payment Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payments" element={<PaymentsList />} />
            <Route path="/payments/:id" element={<PaymentDetail />} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </Box>
  );
}

export default App;
