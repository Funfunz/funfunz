export default {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'name',
      'pk',
      'columns',
      'roles',
    ],
    properties: {
      name: {type: 'string'},
      pk: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
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
      roles: {
        type: 'object',
        required: [
          'read',
          'write',
        ],
        properties: {
          read: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          write: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}
