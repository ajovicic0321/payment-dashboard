# Payment Dashboard

A comprehensive React TypeScript application for displaying payment analytics and managing payment records. This dashboard provides insights into payment data through interactive charts, detailed payment views, and advanced filtering capabilities.

## Features

### 🏠 Analytics Dashboard
- **Key Performance Indicators (KPIs)**: Total amount, payment count, average amount, and success rate
- **Interactive Charts**: Daily payment volume trends and status distribution
- **Real-time Data**: Fetches data from GraphQL API with automatic refresh capabilities
- **Responsive Design**: Optimized for desktop and mobile viewing

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

1. **`chargesDateRangeKPI`**: Fetches aggregated payment metrics for analytics
2. **`charges`**: Retrieves paginated list of payment records
3. **`charge`**: Gets detailed information for a specific payment

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

1. **Currency Formatting**: All amounts are assumed to be in cents and converted to euros for display
2. **Date Handling**: Unix timestamps are converted to human-readable formats
3. **API Schema**: GraphQL schema structure inferred from requirements
4. **Error States**: Graceful degradation when API data is unavailable
5. **Authentication**: API key authentication as specified in requirements

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

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the API endpoint is accessible
   - Check API key authentication
   - Ensure network connectivity

2. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript configuration
   - Verify all imports are correct

3. **Runtime Errors**
   - Check browser console for detailed error messages
   - Verify GraphQL query syntax
   - Ensure all required environment variables are set

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