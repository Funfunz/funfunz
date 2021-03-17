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
            'type',
          ],
          properties: {
            name: {type: 'string'},
            type: {type: 'string'},
            required: {type: 'boolean'},
          },
        },
      },
    },
  },
}
