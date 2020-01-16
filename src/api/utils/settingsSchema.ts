/* istanbul ignore file */
export default {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'name',
      'columns',
      'roles',
    ],
    properties: {
      name: {type: 'string'},
      columns: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'name',
            'visible',
            'model',
          ],
          properties: {
            name: {type: 'string'},
            visible: {
              type: 'object',
              required: [
                'list',
                'detail',
                'relation',
              ],
              properties: {
                list: {type: 'boolean'},
                detail: {type: 'boolean'},
                relation: {type: 'boolean'},
              },
            },
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
