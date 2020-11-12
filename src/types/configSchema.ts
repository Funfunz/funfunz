/* istanbul ignore file */
export default {
  type: 'object',
  required: [
    'connectors',
    'server',
  ],
  properties: {
    connectors: {
      type: 'object',
    },
    server: {
      type: 'object',
      properties: {
        port: {
          oneOf: [
            {type: 'string'},
            {type: 'number'},
          ],
        },
      },
      required: [
        'port',
      ],
    },
  },
}
