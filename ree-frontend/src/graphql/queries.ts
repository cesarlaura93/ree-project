import { gql } from '@apollo/client';

export const GET_REE_ENTITIES = gql`
  query ReeEntities {
    reeEntities {
      energyType
      deviceTypes
    }
  }
`;

export const GET_ELECTRIC_BALANCE = gql`
  query ElectricBalance($startDate: String!, $endDate: String!, $energyType: String) {
    electricBalance(startDate: $startDate, endDate: $endDate, energyType: $energyType) {
      energyType
      deviceType
      date
      value
      percentage
    }
  }
`;

export const GET_ELECTRIC_BALANCE_BY_DATE = gql`
  query ElectricBalanceByDate($date: String!) {
    electricBalanceByDate(date: $date) {
      energyType
      deviceType
      date
      value
      percentage
    }
  }
`;

export const GET_MONTHLY_SUM_BY_TYPE = gql`
  query MonthlySumByType($startYear: Float!, $startMonth: Float!, $endYear: Float!, $endMonth: Float!) {
    monthlySumByType(
      startYear: $startYear
      startMonth: $startMonth
      endYear: $endYear
      endMonth: $endMonth
    ) {
      energyType
      deviceType
      month
      year
      totalValue
    }
  }
`;