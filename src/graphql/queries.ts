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

export const GET_CHARGES_DATE_RANGE_KPI = gql`
  query GetChargesDateRangeKPI($start: Int!, $end: Int!, $interval: Interval, $timezone: String, $currency: Currencies) {
    chargesDateRangeKPI(start: $start, end: $end, interval: $interval, timezone: $timezone, currency: $currency) {
      currency
      total {
        succeededAmount
        succeededCount
        canceledAmount
        canceledCount
        failedAmount
        failedCount
        capturedAmount
        capturedCount
        refundedAmount
        refundedCount
      }
      data {
        timestamp
        succeededAmount
        succeededCount
        canceledAmount
        canceledCount
        failedAmount
        failedCount
        capturedAmount
        capturedCount
        refundedAmount
        refundedCount
      }
    }
  }
`;
