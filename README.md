# Payment Dashboard

A comprehensive React TypeScript application designed for the MONEI technical challenge. This dashboard displays payment analytics and manages payment records through interactive charts, detailed payment views, and advanced filtering capabilities using the MONEI GraphQL API.

## Features

### 🏠 Analytics Dashboard
- **Real KPI Data**: Uses `chargesDateRangeKPI` GraphQL query for accurate aggregated metrics
- **Comprehensive KPIs**: Total amount, payment count, average amount, success rate, failed payments, canceled payments, and refunds
- **Interactive Charts**: Daily payment volume trends with multiple data series and status distribution
- **Real-time Data**: Fetches data from MONEI GraphQL API with automatic refresh capabilities
- **Responsive Design**: Material-UI components optimized for desktop and mobile viewing

### 📋 Payments List View
- **Paginated Table**: Efficiently displays large datasets with customizable page sizes
- **Advanced Filtering**: Filter by status, date range, and other payment attributes
- **Quick Actions**: Direct navigation to detailed payment views
- **Status Indicators**: Color-coded status chips for quick visual identification

### 🔍 Detailed Payment View
- **Comprehensive Information**: Complete payment details including metadata
- **Customer Information**: Associated customer data and contact details
- **Payment Method Details**: Card information and payment method specifics
- **Metadata Display**: Structured view of all payment metadata

### 🛠 Technical Features
- **TypeScript**: Full type safety and enhanced developer experience
- **GraphQL Integration**: Apollo Client for efficient data fetching
- **Material-UI**: Modern, accessible UI components
- **React Router**: Seamless navigation between views
- **Error Handling**: Comprehensive error states and loading indicators
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Technology Stack

- **React 18** with TypeScript
- **Apollo Client** for GraphQL data fetching
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Recharts** for data visualization
- **date-fns** for date formatting

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd payment-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

## Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx    # Analytics dashboard with KPIs and charts
│   ├── PaymentsList.tsx # Paginated payments list with filters
│   └── PaymentDetail.tsx # Detailed payment view
├── graphql/             # GraphQL queries and mutations
│   └── queries.ts       # API queries for charges and KPIs
├── types/               # TypeScript type definitions
│   └── index.ts         # Interface definitions for API responses
├── apolloClient.ts      # Apollo Client configuration
├── App.tsx             # Main application component with routing
└── index.tsx           # Application entry point
```

## API Configuration

The application connects to the GraphQL API at:
- **Endpoint**: `https://mo-graphql.microapps-staging.com`
- **Authentication**: API Key `pk_test_4a140607778e1217f56ccb8b50540f91`

### Available Queries

1. **`chargesDateRangeKPI`**: Fetches aggregated payment metrics for analytics dashboard
   - Returns total KPIs (succeeded, failed, canceled, captured, refunded amounts and counts)
   - Provides time-series data for charts and trends
   - Supports date range filtering with start/end timestamps

2. **`charges`**: Retrieves paginated list of payment records
   - Uses `size`/`from` parameters for pagination
   - Supports advanced filtering with `SearchableChargeFilterInput`
   - Returns items array and total count

3. **`charge`**: Gets detailed information for a specific payment by ID

## Usage

### Dashboard Navigation
- **Home**: Analytics dashboard with KPIs and charts
- **Payments**: Complete list of all payments with filtering
- **Payment Details**: Individual payment information

### Filtering Payments
- **Status Filter**: Filter by payment status (succeeded, pending, failed, canceled)
- **Date Range**: Select custom date ranges for payment data
- **Clear Filters**: Reset all filters to default state

### Data Visualization
- **Line Chart**: Daily payment volume trends
- **Bar Chart**: Payment status distribution
- **KPI Cards**: Key metrics with formatted currency values

## Design Decisions

### Architecture
- **Component-based Architecture**: Modular, reusable components for maintainability
- **Separation of Concerns**: Clear separation between data fetching, UI, and business logic
- **Type Safety**: Comprehensive TypeScript interfaces for all API responses

### User Experience
- **Loading States**: Skeleton loaders and spinners for better perceived performance
- **Error Handling**: User-friendly error messages with retry capabilities
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA labels and keyboard navigation support

### Performance
- **Apollo Client Caching**: Efficient data caching to reduce API calls
- **Pagination**: Server-side pagination for large datasets
- **Lazy Loading**: Components loaded on demand for better initial load times

## Assumptions Made

1. **Currency Formatting**: All amounts are in cents and converted to currency format for display
2. **Date Handling**: Unix timestamps are converted to human-readable formats using date-fns
3. **API Schema**: GraphQL schema discovered through introspection and tested queries
4. **Error States**: Graceful degradation when API data is unavailable with user-friendly error messages
5. **Authentication**: API key authentication sent in Authorization header as required
6. **Data Aggregation**: Primary analytics use `chargesDateRangeKPI` for accurate server-side aggregation
7. **Pagination**: Server-side pagination using `size`/`from` parameters for optimal performance
8. **Filtering**: Complex filters use nested objects as per `SearchableChargeFilterInput` schema
9. **Time Zones**: Default to system timezone for date displays
10. **API Reliability**: The staging API is stable and available for development/testing
11. **Test Data Date Range**: The MONEI staging API contains test data with future timestamps (2025), so date filters use a wider range (±1 year) to include all available data

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build production bundle
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App (irreversible)

### Code Style
- ESLint configuration for consistent code formatting
- TypeScript strict mode enabled
- Material-UI design system for consistent styling

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your preferred hosting service (Netlify, Vercel, AWS S3, etc.)

## Business Requirements Compliance

✅ **Private Dashboard**: Static page with hardcoded API keys (no authentication required)  
✅ **Analytics Dashboard**: Uses `chargesDateRangeKPI` for aggregated metrics display  
✅ **KPI Display**: Shows total payments, amounts, success rates, and additional metrics  
✅ **Visual Analytics**: Interactive charts with Recharts library  
✅ **Payments List View**: Paginated table using `charges` query  
✅ **Advanced Filtering**: Date range, status, and other payment attributes  
✅ **Payment Details**: Detailed view with routing to single payment page  
✅ **Loading States**: Comprehensive loading and error handling  
✅ **GraphQL Integration**: Apollo Client with proper query structure  
✅ **TypeScript**: Full type safety throughout the application  
✅ **Responsive Design**: Material-UI components for all screen sizes  

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the MONEI API endpoint is accessible: `https://mo-graphql.microapps-staging.com`
   - Check API key is correct: `pk_test_4a140607778e1217f56ccb8b50540f91`
   - Ensure network connectivity and CORS is handled properly

2. **GraphQL Query Errors**
   - Check browser console for detailed GraphQL validation errors
   - Verify query structure matches the actual API schema
   - Use Apollo Studio Sandbox for query testing: studio.apollographql.com

3. **Build Errors**
   - Clear node_modules and reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript configuration and all imports are correct
   - Ensure all required dependencies are installed

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live data updates
- **Export Functionality**: CSV/PDF export for payment data
- **Advanced Analytics**: More sophisticated charts and metrics
- **User Authentication**: Secure user login and role-based access
- **Mobile App**: React Native version for mobile devices

## Support

For technical support or questions about this implementation, please refer to the project documentation or contact the development team.

## License

This project is created for assessment purposes. Please refer to the project requirements for usage guidelines.