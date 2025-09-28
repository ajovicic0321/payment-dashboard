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

export interface ChargesDateRangeKPIRow {
  timestamp: number;
  succeededAmount: number;
  succeededCount: number;
  canceledAmount: number;
  canceledCount: number;
  failedAmount: number;
  failedCount: number;
  capturedAmount: number;
  capturedCount: number;
  refundedAmount: number;
  refundedCount: number;
}

export interface ChargesDateRangeKPITotal {
  succeededAmount: number;
  succeededCount: number;
  canceledAmount: number;
  canceledCount: number;
  failedAmount: number;
  failedCount: number;
  capturedAmount: number;
  capturedCount: number;
  refundedAmount: number;
  refundedCount: number;
}

export interface ChargesDateRangeKPIResponse {
  chargesDateRangeKPI: {
    currency: string;
    total: ChargesDateRangeKPITotal;
    data: ChargesDateRangeKPIRow[];
  };
}

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
