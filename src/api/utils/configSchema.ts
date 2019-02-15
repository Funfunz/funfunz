export default {
  type: 'object',
  properties: {
    mysql: {
      type: 'object',
      properties: {
        host: {type: 'string'},
        database: {type: 'string'},
        user: {type: 'string'},
        password: {type: 'string'},
      },
    },
    server: {
      type: 'object',
      properties: {
        port: {type: 'number'},
      },
    },
  },
}
