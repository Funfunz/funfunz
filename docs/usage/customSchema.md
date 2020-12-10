# Custom Schema

It is possible to augment the generated GraphQL schema with custom queries and mutations.

To do that, you can pass the properties `queries` and `mutations` to the Funfunz configuration.

The passed in queries and mutations will be added to the auto generated GraphQL Schema.

## Type definition

```js
interface IFunfunzConfig<QSource = unknown, QContext = unknown> {
  ...
  queries?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
  mutations?: Thunk<GraphQLFieldConfigMap<QSource, QContext>>
  ...
}
```

In the following example we will add a new query called `randomNumbers` that will return a list of random numbers.

We will also add two new mutations called `increaseRandomNumber` and `decreaseRandomNumber` that will increase/decrease the quantity of random numbers return by that query.

## Example

```js
const express = require('express')
const funfunzConfig = require('./config/funfunzConfig.json')
const funfunzSettings = require('./config/funfunzSettings,json')
const Funfunz = require('funfunz').Funfunz
const { GraphQLFloat, GraphQLInt, GraphQLList } = require('graphql')

const app = express()

/*
  ...
  Skipping the application setup
  ...
*/

let randomNumberCount = 4

app.use('/admin/api', new Funfunz({
  config: funfunzConfig,
  settings: funfunzSettings,
  queries: {
    randomNumbers: {
      type: new GraphQLList(GraphQLFloat),
      description: 'This will return a list of random numbers.',
      resolve: () => {
        return Array.from({length: randomNumberCount}, () => Math.random())
      },
    }
  },
  mutations: {
    increaseRandomNumber: {
      type: GraphQLInt,
      description: 'This will increase and return the quantity of random numbers.',
      resolve: () => {
        return randomNumberCount += 1
      },
    },
    decreaseRandomNumber: {
      type: GraphQLInt,
      description: 'This will decrease and return the quantity of random numbers.',
      resolve: () => {
        return randomNumberCount -= 1
      },
    }
  }
}).middleware)

// ...
```
