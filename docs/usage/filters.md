# Filters

This is a list of all supported filters for each field

## Comparison

| Name | Description |
|-|-|
| _eq | Matches values that are equal to a specified value |
| __eq | Matches values that are not equal to a specified value |
| _lt | Matches values that are less than a specified value |
| _lte | Matches values that are less than or equal to a specified value |
| _gt | Matches values that are greater than a specified value |
| _gte | Matches values that are greater than or equal to a specified value |
| _in | Matches any of the values specified in an array |
| _nin | Matches none of the values specified in an array |
| _like | Matches values that contain the specified value |
| _like | Matches values that do not contain the specified value |
| _is_null | Matches values that are null |

## Logical

| Name | Description |
|-|-|
| _and | Joins query clauses with a logical AND returns all documents that match the conditions of both clauses |
| _or | Joins query clauses with a logical OR returns all documents that match the conditions of either clause |

## Example Queries

Match all families that the name contain either "Moura" or "Xavier"

```graphql
query {
  families (
    filter:{
      _or: [
        {
          name: {
            _like: "%Moura%"
          }
        },
        {
          name: {
            _like: "%Xavier%"
          }
        }
      ]
      
    }
  ){
    id
    name
  }
}
```

Match all families and include Products that the color is equal too yellow

```graphql
query {
  families {
    id
    name
    products (
      filter: {
        color: {
          _eq: "Yellow"
        }
      }
    ) {
      id
      name
      color
    }
  }
}
```