import { gql } from '@apollo/client';

export const GET_CHARGES = gql`
  query GetCharges($limit: Int, $offset: Int, $status: String, $dateFrom: Int, $dateTo: Int) {
    charges(limit: $limit, offset: $offset, status: $status, dateFrom: $dateFrom, dateTo: $dateTo) {
      data {
        id
        amount
        currency
        status
        createdAt
        updatedAt
        description
        reference
        metadata
        customer {
          id
          email
          name
        }
        paymentMethod {
          id
          type
          last4
          brand
        }
      }
      hasMore
      totalCount
    }
  }
`;

export const GET_CHARGE_BY_ID = gql`
  query GetChargeById($id: ID!) {
    charge(id: $id) {
      id
      amount
      currency
      status
      createdAt
      updatedAt
      description
      reference
      metadata
      customer {
        id
        email
        name
      }
      paymentMethod {
        id
        type
        last4
        brand
      }
    }
  }
`;

// Note: The chargesDateRangeKPI query is not available in the actual API
// We'll calculate KPIs from the charges query data instead
