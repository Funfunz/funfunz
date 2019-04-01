"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = _default;

var _app = _interopRequireDefault(require("./app"));

var _configLoader = _interopRequireWildcard(require("./utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default(configs) {
  var debug = (0, _debug.default)('funfunzmc:server');
  (0, _configLoader.setConfig)(true, 'defaultInterface');
  Object.keys(configs).forEach(function (configKey) {
    (0, _configLoader.setConfig)(configs[configKey], configKey);
  });
  var CONFIG = (0, _configLoader.default)();
  debug('---------------------------------------------');
  debug('INIT PARAMETERS:\n', CONFIG.config.server);
  debug('NODE_ENV', process.env.NODE_ENV);
  debug('---------------------------------------------');
  var app = new _app.default();
  /**
   * Create HTTP server if not loaded has a plugin.
   */

  if (!CONFIG.plugin) {
    Promise.resolve().then(function () {
      return _interopRequireWildcard(require("./httpServer"));
    }).then(function (module) {
      return module.default(app.server);
    });
  }

  return app.server;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaW5kZXgudHMiXSwibmFtZXMiOlsiY29uZmlncyIsImRlYnVnIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb25maWdLZXkiLCJDT05GSUciLCJjb25maWciLCJzZXJ2ZXIiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJhcHAiLCJBcHAiLCJwbHVnaW4iLCJ0aGVuIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFvQ0E7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7OztBQWxDZSxrQkFBU0EsT0FBVCxFQUF1QjtBQUNwQyxNQUFNQyxLQUFLLEdBQUcsb0JBQU0sa0JBQU4sQ0FBZDtBQUVBLCtCQUFVLElBQVYsRUFBZ0Isa0JBQWhCO0FBRUFDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZSCxPQUFaLEVBQXFCSSxPQUFyQixDQUNFLFVBQUNDLFNBQUQsRUFBZTtBQUNiLGlDQUFVTCxPQUFPLENBQUNLLFNBQUQsQ0FBakIsRUFBOEJBLFNBQTlCO0FBQ0QsR0FISDtBQU1BLE1BQU1DLE1BQU0sR0FBRyw0QkFBZjtBQUVBTCxFQUFBQSxLQUFLLENBQUMsK0NBQUQsQ0FBTDtBQUNBQSxFQUFBQSxLQUFLLENBQUMsb0JBQUQsRUFBdUJLLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjQyxNQUFyQyxDQUFMO0FBQ0FQLEVBQUFBLEtBQUssQ0FBQyxVQUFELEVBQWFRLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUF6QixDQUFMO0FBQ0FWLEVBQUFBLEtBQUssQ0FBQywrQ0FBRCxDQUFMO0FBRUEsTUFBTVcsR0FBRyxHQUFHLElBQUlDLFlBQUosRUFBWjtBQUVBOzs7O0FBSUEsTUFBSSxDQUFDUCxNQUFNLENBQUNRLE1BQVosRUFBb0I7QUFDbEI7QUFBQTtBQUFBLE9BQStCQyxJQUEvQixDQUNFLFVBQUNDLE1BQUQsRUFBWTtBQUNWLGFBQU9BLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlTCxHQUFHLENBQUNKLE1BQW5CLENBQVA7QUFDRCxLQUhIO0FBS0Q7O0FBQ0QsU0FBT0ksR0FBRyxDQUFDSixNQUFYO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBwIGZyb20gJ0Byb290L2FwaS9hcHAnXG5pbXBvcnQgY29uZmlnLCB7IHNldENvbmZpZyB9IGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNvbmZpZ3M6IGFueSkge1xuICBjb25zdCBkZWJ1ZyA9IERlYnVnKCdmdW5mdW56bWM6c2VydmVyJylcblxuICBzZXRDb25maWcodHJ1ZSwgJ2RlZmF1bHRJbnRlcmZhY2UnKVxuXG4gIE9iamVjdC5rZXlzKGNvbmZpZ3MpLmZvckVhY2goXG4gICAgKGNvbmZpZ0tleSkgPT4ge1xuICAgICAgc2V0Q29uZmlnKGNvbmZpZ3NbY29uZmlnS2V5XSwgY29uZmlnS2V5KVxuICAgIH1cbiAgKVxuXG4gIGNvbnN0IENPTkZJRyA9IGNvbmZpZygpXG5cbiAgZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGRlYnVnKCdJTklUIFBBUkFNRVRFUlM6XFxuJywgQ09ORklHLmNvbmZpZy5zZXJ2ZXIpXG4gIGRlYnVnKCdOT0RFX0VOVicsIHByb2Nlc3MuZW52Lk5PREVfRU5WKVxuICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcblxuICBjb25zdCBhcHAgPSBuZXcgQXBwKClcblxuICAvKipcbiAgICogQ3JlYXRlIEhUVFAgc2VydmVyIGlmIG5vdCBsb2FkZWQgaGFzIGEgcGx1Z2luLlxuICAgKi9cblxuICBpZiAoIUNPTkZJRy5wbHVnaW4pIHtcbiAgICBpbXBvcnQoJ0Byb290L2FwaS9odHRwU2VydmVyJykudGhlbihcbiAgICAgIChtb2R1bGUpID0+IHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZS5kZWZhdWx0KGFwcC5zZXJ2ZXIpXG4gICAgICB9XG4gICAgKVxuICB9XG4gIHJldHVybiBhcHAuc2VydmVyXG59XG5cbmV4cG9ydCAqIGZyb20gJy4vdHlwZXMnXG4iXX0=