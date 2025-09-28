// GraphQL Types for the Payment Dashboard

export interface Charge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  description?: string;
  providerReferenceId?: string;
  customer?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  paymentMethod?: {
    method?: string;
    card?: {
      brand?: string;
      type?: string;
      last4?: string;
    };
  };
}

export interface ChargesResponse {
  charges: {
    items: Charge[];
    total: number;
  };
}

// Note: ChargesDateRangeKPI interface removed since the query doesn't exist in the actual API
// KPIs will be calculated client-side from charges data

export interface PaymentFilters {
  status?: string;
  dateFrom?: number;
  dateTo?: number;
  size?: number;
  from?: number;
}

export interface KPI {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}
