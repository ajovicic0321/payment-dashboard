import { gql } from '@apollo/client';

export const GET_CHARGES = gql`
  query GetCharges($size: Int, $from: Int, $filter: SearchableChargeFilterInput) {
    charges(size: $size, from: $from, filter: $filter) {
      items {
        id
        amount
        currency
        status
        createdAt
        updatedAt
        description
        providerReferenceId
        customer {
          email
          name
          phone
        }
        paymentMethod {
          method
          card {
            brand
            type
            last4
          }
        }
      }
      total
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
      providerReferenceId
      customer {
        email
        name
        phone
      }
      paymentMethod {
        method
        card {
          brand
          type
          last4
        }
      }
    }
  }
`;

// Note: The chargesDateRangeKPI query is not available in the actual API
// We'll calculate KPIs from the charges query data instead
