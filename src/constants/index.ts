// API Configuration
// Note: These credentials should normally be stored in environment variables (.env file)
// but are hardcoded here for the test task demonstration purposes
export const API_CONFIG = {
  ENDPOINT: 'https://mo-graphql.microapps-staging.com',
  API_KEY: 'pk_test_4a140607778e1217f56ccb8b50540f91',
} as const;

// Default date ranges (in seconds)
export const DATE_RANGES = {
  LAST_7_DAYS: 7 * 24 * 60 * 60,
  LAST_30_DAYS: 30 * 24 * 60 * 60,
  LAST_90_DAYS: 90 * 24 * 60 * 60,
} as const;

// Payment status options
export const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'canceled', label: 'Canceled' },
] as const;

// Pagination options
export const PAGINATION_OPTIONS = [5, 10, 25, 50] as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 0,
  ROWS_PER_PAGE: 10,
} as const;

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  ERROR: '#d32f2f',
} as const;
