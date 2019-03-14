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

  return app.server;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaW5kZXgudHMiXSwibmFtZXMiOlsiY29uZmlncyIsImRlYnVnIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb25maWdLZXkiLCJDT05GSUciLCJzZXJ2ZXIiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJhcHAiLCJBcHAiLCJwbHVnaW4iLCJ0aGVuIiwibW9kdWxlIiwiZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7QUFFZSxrQkFBU0EsT0FBVCxFQUF1QjtBQUNwQyxNQUFNQyxLQUFLLEdBQUcsb0JBQU0sa0JBQU4sQ0FBZDtBQUVBQyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWUgsT0FBWixFQUFxQkksT0FBckIsQ0FDRSxVQUFDQyxTQUFELEVBQWU7QUFDYixpQ0FBVUwsT0FBTyxDQUFDSyxTQUFELENBQWpCLEVBQThCQSxTQUE5QjtBQUNELEdBSEg7QUFNQSxNQUFNQyxNQUFNLEdBQUcsNEJBQWY7QUFFQUwsRUFBQUEsS0FBSyxDQUFDLCtDQUFELENBQUw7QUFDQUEsRUFBQUEsS0FBSyxDQUFDLG9CQUFELEVBQXVCSyxNQUFNLENBQUNDLE1BQTlCLENBQUw7QUFDQU4sRUFBQUEsS0FBSyxDQUFDLFVBQUQsRUFBYU8sT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQXpCLENBQUw7QUFDQVQsRUFBQUEsS0FBSyxDQUFDLCtDQUFELENBQUw7QUFFQSxNQUFNVSxHQUFHLEdBQUcsSUFBSUMsWUFBSixFQUFaO0FBRUE7Ozs7QUFJQSxNQUFJLENBQUNOLE1BQU0sQ0FBQ08sTUFBWixFQUFvQjtBQUNsQjtBQUFBO0FBQUEsT0FBK0JDLElBQS9CLENBQ0UsVUFBQ0MsTUFBRCxFQUFZO0FBQ1YsYUFBT0EsTUFBTSxDQUFDQyxPQUFQLENBQWVMLEdBQUcsQ0FBQ0osTUFBbkIsQ0FBUDtBQUNELEtBSEg7QUFLRDs7QUFDRCxTQUFPSSxHQUFHLENBQUNKLE1BQVg7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHAgZnJvbSAnQHJvb3QvYXBpL2FwcCdcbmltcG9ydCBjb25maWcsIHsgc2V0Q29uZmlnIH0gZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29uZmlnczogYW55KSB7XG4gIGNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnptYzpzZXJ2ZXInKVxuXG4gIE9iamVjdC5rZXlzKGNvbmZpZ3MpLmZvckVhY2goXG4gICAgKGNvbmZpZ0tleSkgPT4ge1xuICAgICAgc2V0Q29uZmlnKGNvbmZpZ3NbY29uZmlnS2V5XSwgY29uZmlnS2V5KVxuICAgIH1cbiAgKVxuXG4gIGNvbnN0IENPTkZJRyA9IGNvbmZpZygpXG5cbiAgZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gIGRlYnVnKCdJTklUIFBBUkFNRVRFUlM6XFxuJywgQ09ORklHLnNlcnZlcilcbiAgZGVidWcoJ05PREVfRU5WJywgcHJvY2Vzcy5lbnYuTk9ERV9FTlYpXG4gIGRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgSFRUUCBzZXJ2ZXIgaWYgbm90IGxvYWRlZCBoYXMgYSBwbHVnaW4uXG4gICAqL1xuXG4gIGlmICghQ09ORklHLnBsdWdpbikge1xuICAgIGltcG9ydCgnQHJvb3QvYXBpL2h0dHBTZXJ2ZXInKS50aGVuKFxuICAgICAgKG1vZHVsZSkgPT4ge1xuICAgICAgICByZXR1cm4gbW9kdWxlLmRlZmF1bHQoYXBwLnNlcnZlcilcbiAgICAgIH1cbiAgICApXG4gIH1cbiAgcmV0dXJuIGFwcC5zZXJ2ZXJcbn1cbiJdfQ==