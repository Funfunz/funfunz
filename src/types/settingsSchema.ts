/* istanbul ignore file */
export default {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'name',
      'properties',
      'roles',
    ],
    properties: {
      name: {type: 'string'},
      properties: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'name',
            'model',
          ],
          properties: {
            name: {type: 'string'},
            model: {
              type: 'object',
              required: [
                'type',
                'allowNull',
              ],
              properties: {
                type: {type: 'string'},
                allowNull: {type: 'boolean'},
              },
            },
          },
        },
      },
      roles: {
        type: 'object',
        required: [
          'read',
          'create',
          'update',
          'delete',
        ],
        properties: {
          read: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          create: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          update: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          delete: {
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
