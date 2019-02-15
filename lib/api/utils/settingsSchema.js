"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      pk: {
        type: 'string'
      },
      columns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            verbose: {
              type: 'string'
            },
            type: {
              type: 'string'
            },
            allowNull: {
              type: 'boolean'
            }
          }
        }
      }
    }
  }
};
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvdXRpbHMvc2V0dGluZ3NTY2hlbWEudHMiXSwibmFtZXMiOlsidHlwZSIsIml0ZW1zIiwicHJvcGVydGllcyIsIm5hbWUiLCJwayIsImNvbHVtbnMiLCJ2ZXJib3NlIiwiYWxsb3dOdWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7ZUFBZTtBQUNiQSxFQUFBQSxJQUFJLEVBQUUsT0FETztBQUViQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEQsSUFBQUEsSUFBSSxFQUFFLFFBREQ7QUFFTEUsSUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLE1BQUFBLElBQUksRUFBRTtBQUFDSCxRQUFBQSxJQUFJLEVBQUU7QUFBUCxPQURJO0FBRVZJLE1BQUFBLEVBQUUsRUFBRTtBQUFDSixRQUFBQSxJQUFJLEVBQUU7QUFBUCxPQUZNO0FBR1ZLLE1BQUFBLE9BQU8sRUFBRTtBQUNQTCxRQUFBQSxJQUFJLEVBQUUsT0FEQztBQUVQQyxRQUFBQSxLQUFLLEVBQUU7QUFDTEQsVUFBQUEsSUFBSSxFQUFFLFFBREQ7QUFFTEUsVUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFlBQUFBLElBQUksRUFBRTtBQUFDSCxjQUFBQSxJQUFJLEVBQUU7QUFBUCxhQURJO0FBRVZNLFlBQUFBLE9BQU8sRUFBRTtBQUFDTixjQUFBQSxJQUFJLEVBQUU7QUFBUCxhQUZDO0FBR1ZBLFlBQUFBLElBQUksRUFBRTtBQUFDQSxjQUFBQSxJQUFJLEVBQUU7QUFBUCxhQUhJO0FBSVZPLFlBQUFBLFNBQVMsRUFBRTtBQUFDUCxjQUFBQSxJQUFJLEVBQUU7QUFBUDtBQUpEO0FBRlA7QUFGQTtBQUhDO0FBRlA7QUFGTSxDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICB0eXBlOiAnYXJyYXknLFxuICBpdGVtczoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG5hbWU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICBwazoge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgIGNvbHVtbnM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBuYW1lOiB7dHlwZTogJ3N0cmluZyd9LFxuICAgICAgICAgICAgdmVyYm9zZToge3R5cGU6ICdzdHJpbmcnfSxcbiAgICAgICAgICAgIHR5cGU6IHt0eXBlOiAnc3RyaW5nJ30sXG4gICAgICAgICAgICBhbGxvd051bGw6IHt0eXBlOiAnYm9vbGVhbid9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19