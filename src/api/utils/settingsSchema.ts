export default {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {type: 'string'},
      pk: {type: 'string'},
      columns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {type: 'string'},
            verbose: {type: 'string'},
            type: {type: 'string'},
            allowNull: {type: 'boolean'},
          },
        },
      },
    },
  },
}
