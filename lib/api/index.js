"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _app = _interopRequireDefault(require("./app"));

var _configLoader = _interopRequireWildcard(require("./utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _default(configs) {
  var debug = (0, _debug.default)('funfunzmc:server');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaW5kZXgudHMiXSwibmFtZXMiOlsiY29uZmlncyIsImRlYnVnIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb25maWdLZXkiLCJDT05GSUciLCJjb25maWciLCJzZXJ2ZXIiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJhcHAiLCJBcHAiLCJwbHVnaW4iLCJ0aGVuIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxrQkFBU0EsT0FBVCxFQUF1QjtBQUNwQyxNQUFNQyxLQUFLLEdBQUcsb0JBQU0sa0JBQU4sQ0FBZDtBQUNBQyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUgsT0FBWixFQUFxQkksT0FBckIsQ0FDRSxVQUFDQyxTQUFELEVBQWU7QUFDYixpQ0FBVUwsT0FBTyxDQUFDSyxTQUFELENBQWpCLEVBQThCQSxTQUE5QjtBQUNELEdBSEg7QUFNQSxNQUFNQyxNQUFNLEdBQUcsNEJBQWY7QUFFQUwsRUFBQUEsS0FBSyxDQUFDLCtDQUFELENBQUw7QUFDQUEsRUFBQUEsS0FBSyxDQUFDLG9CQUFELEVBQXVCSyxNQUFNLENBQUNDLE1BQVAsQ0FBY0MsTUFBckMsQ0FBTDtBQUNBUCxFQUFBQSxLQUFLLENBQUMsVUFBRCxFQUFhUSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBekIsQ0FBTDtBQUNBVixFQUFBQSxLQUFLLENBQUMsK0NBQUQsQ0FBTDtBQUVBLE1BQU1XLEdBQUcsR0FBRyxJQUFJQyxZQUFKLEVBQVo7QUFFQTs7OztBQUlBLE1BQUksQ0FBQ1AsTUFBTSxDQUFDUSxNQUFaLEVBQW9CO0FBQ2xCO0FBQUE7QUFBQSxPQUErQkMsSUFBL0IsQ0FDRSxVQUFDQyxNQUFELEVBQVk7QUFDVixhQUFPQSxNQUFNLENBQUNDLE9BQVAsQ0FBZUwsR0FBRyxDQUFDSixNQUFuQixDQUFQO0FBQ0QsS0FISDtBQUtEOztBQUNELFNBQU9JLEdBQUcsQ0FBQ0osTUFBWDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFwcCBmcm9tICdAcm9vdC9hcGkvYXBwJ1xuaW1wb3J0IGNvbmZpZywgeyBzZXRDb25maWcgfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMvY29uZmlnTG9hZGVyJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb25maWdzOiBhbnkpIHtcbiAgY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOnNlcnZlcicpXG4gIE9iamVjdC5rZXlzKGNvbmZpZ3MpLmZvckVhY2goXG4gICAgKGNvbmZpZ0tleSkgPT4ge1xuICAgICAgc2V0Q29uZmlnKGNvbmZpZ3NbY29uZmlnS2V5XSwgY29uZmlnS2V5KVxuICAgIH1cbiAgKVxuXG4gIGNvbnN0IENPTkZJRyA9IGNvbmZpZygpXG5cbiAgZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGRlYnVnKCdJTklUIFBBUkFNRVRFUlM6XFxuJywgQ09ORklHLmNvbmZpZy5zZXJ2ZXIpXG4gIGRlYnVnKCdOT0RFX0VOVicsIHByb2Nlc3MuZW52Lk5PREVfRU5WKVxuICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcblxuICBjb25zdCBhcHAgPSBuZXcgQXBwKClcblxuICAvKipcbiAgICogQ3JlYXRlIEhUVFAgc2VydmVyIGlmIG5vdCBsb2FkZWQgaGFzIGEgcGx1Z2luLlxuICAgKi9cblxuICBpZiAoIUNPTkZJRy5wbHVnaW4pIHtcbiAgICBpbXBvcnQoJ0Byb290L2FwaS9odHRwU2VydmVyJykudGhlbihcbiAgICAgIChtb2R1bGUpID0+IHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZS5kZWZhdWx0KGFwcC5zZXJ2ZXIpXG4gICAgICB9XG4gICAgKVxuICB9XG4gIHJldHVybiBhcHAuc2VydmVyXG59XG4iXX0=