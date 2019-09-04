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
          required: [
            'name',
            'verbose',
            'type',
            'allowNull',
            'input',
          ],
          properties: {
            name: {type: 'string'},
            verbose: {type: 'string'},
            type: {type: 'string'},
            allowNull: {type: 'boolean'},
            input: {
              type: 'object',
              required: [
                'type',
              ],
              properties: {
                type: {type: 'string'},
              },
            },
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
