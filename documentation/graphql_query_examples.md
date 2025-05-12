# GraphQL Query Examples

Este documento es para demostración de ejemplos en consultas GraphQL.

## 1. Get Electric Balance Data

Esta query recupera los datos generales del balance eléctrico.

```graphql
query GetElectricBalance {
  electricBalance {
    type
    attributes {
      title
      last_update
      description
    }
    energy_balance {
      type
      attributes {
        title
        color
        composite
        last_update
      }
      content {
        type
        attributes {
          title
          color
          magnitude
          composite
          last_update
        }
        value {
          value
          percentage
          datetime
        }
      }
    }
  }
}
```

## 2. Get Electric Balance Data by Date

  Esta query recupera los datos del balance eléctrico filtrados por una fecha específica. Reemplaza `"YYYY-MM-DDTHH:MM:SSZ"` con la fecha y hora deseadas.

```graphql
query GetElectricBalanceByDate($date: String!) {
  electricBalanceByDate(date: $date) {
    # Same structure as electricBalance query
    # Adjust fields as needed
    type
    attributes {
      title
      last_update
      description
    }
    energy_balance {
      type
      attributes {
        title
        color
        composite
        last_update
      }
      content {
        type
        attributes {
          title
          color
          magnitude
          composite
          last_update
        }
        value {
          value
          percentage
          datetime
        }
      }
    }
  }
}
```

**Example Variables:**
```json
{
  "date": "2023-10-26T10:00:00Z"
}
```

## 3. Get Monthly Sum by Type

Esta query recupera la suma mensual de los datos de energía, agrupados por tipo. Reemplaza `"YYYY-MM-DD"` con las fechas de inicio y fin para el mes deseado.

```graphql
query GetMonthlySumByType($startDate: String!, $endDate: String!, $type: String!) {
  monthlySumByType(startDate: $startDate, endDate: $endDate, type: $type) {
    type
    total
  }
}
```

**Example Variables:**
```json
{
  "startDate": "2023-10-01",
  "endDate": "2023-10-31",
  "type": "Renovable"
}
```
