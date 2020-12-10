/* istanbul ignore file */
export default {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'name',
      'properties',
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
    },
  },
}
