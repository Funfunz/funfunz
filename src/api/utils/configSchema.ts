export default {
  type: 'object',
  required: [
    'mysql',
    'server',
  ],
  properties: {
    mysql: {
      type: 'object',
      properties: {
        host: {type: 'string'},
        database: {type: 'string'},
        user: {type: 'string'},
        password: {type: 'string'},
      },
      required: [
        'host',
        'database',
        'user',
        'password',
      ],
    },
    server: {
      type: 'object',
      properties: {
        port: {type: 'number'},
      },
      required: [
        'port',
      ],
    },
  },
}
