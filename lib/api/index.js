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
  debug('INIT PARAMETERS:\n', CONFIG.server);
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
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaW5kZXgudHMiXSwibmFtZXMiOlsiY29uZmlncyIsImRlYnVnIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb25maWdLZXkiLCJDT05GSUciLCJzZXJ2ZXIiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJhcHAiLCJBcHAiLCJwbHVnaW4iLCJ0aGVuIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxrQkFBU0EsT0FBVCxFQUF1QjtBQUNwQyxNQUFNQyxLQUFLLEdBQUcsb0JBQU0sa0JBQU4sQ0FBZDtBQUVBQyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUgsT0FBWixFQUFxQkksT0FBckIsQ0FDRSxVQUFDQyxTQUFELEVBQWU7QUFDYixpQ0FBVUwsT0FBTyxDQUFDSyxTQUFELENBQWpCLEVBQThCQSxTQUE5QjtBQUNELEdBSEg7QUFNQSxNQUFNQyxNQUFNLEdBQUcsNEJBQWY7QUFFQUwsRUFBQUEsS0FBSyxDQUFDLCtDQUFELENBQUw7QUFDQUEsRUFBQUEsS0FBSyxDQUFDLG9CQUFELEVBQXVCSyxNQUFNLENBQUNDLE1BQTlCLENBQUw7QUFDQU4sRUFBQUEsS0FBSyxDQUFDLFVBQUQsRUFBYU8sT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQXpCLENBQUw7QUFDQVQsRUFBQUEsS0FBSyxDQUFDLCtDQUFELENBQUw7QUFFQSxNQUFNVSxHQUFHLEdBQUcsSUFBSUMsWUFBSixFQUFaO0FBRUE7Ozs7QUFJQSxNQUFJLENBQUNOLE1BQU0sQ0FBQ08sTUFBWixFQUFvQjtBQUNsQjtBQUFBO0FBQUEsT0FBK0JDLElBQS9CLENBQ0UsVUFBQ0MsTUFBRCxFQUFZO0FBQ1YsYUFBT0EsTUFBTSxDQUFDQyxPQUFQLENBQWVMLEdBQUcsQ0FBQ0osTUFBbkIsQ0FBUDtBQUNELEtBSEg7QUFLRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFwcCBmcm9tICdAcm9vdC9hcGkvYXBwJ1xuaW1wb3J0IGNvbmZpZywgeyBzZXRDb25maWcgfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMvY29uZmlnTG9hZGVyJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb25maWdzOiBhbnkpIHtcbiAgY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOnNlcnZlcicpXG5cbiAgT2JqZWN0LmtleXMoY29uZmlncykuZm9yRWFjaChcbiAgICAoY29uZmlnS2V5KSA9PiB7XG4gICAgICBzZXRDb25maWcoY29uZmlnc1tjb25maWdLZXldLCBjb25maWdLZXkpXG4gICAgfVxuICApXG5cbiAgY29uc3QgQ09ORklHID0gY29uZmlnKClcblxuICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgZGVidWcoJ0lOSVQgUEFSQU1FVEVSUzpcXG4nLCBDT05GSUcuc2VydmVyKVxuICBkZWJ1ZygnTk9ERV9FTlYnLCBwcm9jZXNzLmVudi5OT0RFX0VOVilcbiAgZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG5cbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBIVFRQIHNlcnZlciBpZiBub3QgbG9hZGVkIGhhcyBhIHBsdWdpbi5cbiAgICovXG5cbiAgaWYgKCFDT05GSUcucGx1Z2luKSB7XG4gICAgaW1wb3J0KCdAcm9vdC9hcGkvaHR0cFNlcnZlcicpLnRoZW4oXG4gICAgICAobW9kdWxlKSA9PiB7XG4gICAgICAgIHJldHVybiBtb2R1bGUuZGVmYXVsdChhcHAuc2VydmVyKVxuICAgICAgfVxuICAgIClcbiAgfVxufVxuIl19