import { format } from 'date-fns';

/**
 * Format currency amount from cents to display format
 * @param amount - Amount in cents
 * @param currency - Currency code (default: EUR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

/**
 * Format Unix timestamp to human-readable date
 * @param timestamp - Unix timestamp in seconds
 * @param formatString - Date format string (default: 'MMM dd, yyyy HH:mm')
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number, formatString: string = 'MMM dd, yyyy HH:mm'): string => {
  return format(new Date(timestamp * 1000), formatString);
};

/**
 * Get status color for Material-UI components
 * @param status - Payment status
 * @returns Color name for MUI components
 */
export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Truncate string with ellipsis
 * @param str - String to truncate
 * @param length - Maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, length: number = 8): string => {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Calculate success rate percentage
 * @param succeeded - Number of succeeded payments
 * @param total - Total number of payments
 * @returns Success rate percentage
 */
export const calculateSuccessRate = (succeeded: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((succeeded / total) * 100);
};
