// GraphQL Types for the Payment Dashboard

export interface Charge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  description?: string;
  reference?: string;
  metadata?: Record<string, any>;
  customer?: {
    id: string;
    email?: string;
    name?: string;
  };
  paymentMethod?: {
    id: string;
    type: string;
    last4?: string;
    brand?: string;
  };
}

export interface ChargesResponse {
  charges: {
    data: Charge[];
    hasMore: boolean;
    totalCount: number;
  };
}

// Note: ChargesDateRangeKPI interface removed since the query doesn't exist in the actual API
// KPIs will be calculated client-side from charges data

export interface PaymentFilters {
  status?: string;
  dateFrom?: number;
  dateTo?: number;
  limit?: number;
  offset?: number;
}

export interface KPI {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}
