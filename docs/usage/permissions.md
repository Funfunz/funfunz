# Permissions

Funfunz gives you the possibility to inject information for each GraphQL request, this can be achieved by creating fields on the request object before calling the Funfunz middleware.

## Usage

A very simple example creating a `user` object on the `req` object

```js

import express, { Express } from 'express'
import { Funfunz } from 'funfunz'
import config from 'someConfig'
import settings from 'someSettings'
import http from 'http'

const funfunz = new Funfunz({
  config,
  settings,
})

const app = express()
app.use((req, res, next) => {
  req.user = {
    id: 1,
    email: 'jwebcoder@mymail.com',
    name: 'João Moura',
    roles: [
      { id: 1, name: 'aunthenticated' },
      { id: 2, name: 'member' },
      { id: 3, name: 'admin' },
    ],
  }
  next()
})
app.use(funfunz)
const server = http.createServer(app)
server.listen(3000)
```

The `req.user` object will then be injected on the Funfunz middleware and can be accessed through the Hooks system:

```js
export default {
  name: 'mytable',
  ...
  hooks: {
    all: {
      async beforeResolver(props: IHookProps<unknown>) {
        if (!props.req?.user?.roles?.find(r => r.name === 'admin')) {
          throw new Error('Not authorized')
        }
      }
    }
  }
}
```