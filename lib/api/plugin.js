#!/usr/bin/env node

/**
 * Module dependencies.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("./app"));

var _debug = _interopRequireDefault(require("debug"));

var _configLoader = require("./utils/configLoader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import database from 'db'
// boot
function _default(configs) {
  var debug = (0, _debug.default)('funfunzmc:server');

  _dotenv.default.config();

  var params = {
    SERVER_PORT: process.env.MC_PORT,
    NOVE_ENV: process.env.NODE_ENV
  };
  Object.keys(configs).forEach(function (configKey) {
    (0, _configLoader.setConfig)(configs[configKey], configKey);
  });
  console.log('---------------------------------------------');
  console.log('INIT PARAMETERS:\n', params);
  console.log('---------------------------------------------');
  /**
   * Get port from environment and store in Express.
   */

  var app = new _app.default();
  var port = normalizePort(process.env.MC_PORT || '3000');
  app.server.set('port', port);
  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  return app.server;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvcGx1Z2luLnRzIl0sIm5hbWVzIjpbImNvbmZpZ3MiLCJkZWJ1ZyIsImRvdGVudiIsImNvbmZpZyIsInBhcmFtcyIsIlNFUlZFUl9QT1JUIiwicHJvY2VzcyIsImVudiIsIk1DX1BPUlQiLCJOT1ZFX0VOViIsIk5PREVfRU5WIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb25maWdLZXkiLCJjb25zb2xlIiwibG9nIiwiYXBwIiwiQXBwIiwicG9ydCIsIm5vcm1hbGl6ZVBvcnQiLCJzZXJ2ZXIiLCJzZXQiLCJ2YWwiLCJwYXJzZUludCIsImlzTmFOIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7Ozs7OztBQUlBOztBQUNBOztBQUVBOztBQUdBOzs7O0FBSkE7QUFHQTtBQUdlLGtCQUFVQSxPQUFWLEVBQXdCO0FBQ3JDLE1BQU1DLEtBQUssR0FBRyxvQkFBTSxrQkFBTixDQUFkOztBQUNBQyxrQkFBT0MsTUFBUDs7QUFFQSxNQUFJQyxNQUFNLEdBQUc7QUFDWEMsSUFBQUEsV0FBVyxFQUFFQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsT0FEZDtBQUVYQyxJQUFBQSxRQUFRLEVBQUVILE9BQU8sQ0FBQ0MsR0FBUixDQUFZRztBQUZYLEdBQWI7QUFLQUMsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlaLE9BQVosRUFBcUJhLE9BQXJCLENBQ0UsVUFBQUMsU0FBUyxFQUFJO0FBQ1gsaUNBQVVkLE9BQU8sQ0FBQ2MsU0FBRCxDQUFqQixFQUE4QkEsU0FBOUI7QUFDRCxHQUhIO0FBTUFDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLCtDQUFaO0FBQ0FELEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9CQUFaLEVBQWtDWixNQUFsQztBQUNBVyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSwrQ0FBWjtBQUVBOzs7O0FBSUEsTUFBSUMsR0FBRyxHQUFHLElBQUlDLFlBQUosRUFBVjtBQUVBLE1BQUlDLElBQUksR0FBR0MsYUFBYSxDQUFDZCxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsT0FBWixJQUF1QixNQUF4QixDQUF4QjtBQUNBUyxFQUFBQSxHQUFHLENBQUNJLE1BQUosQ0FBV0MsR0FBWCxDQUFlLE1BQWYsRUFBdUJILElBQXZCO0FBRUE7Ozs7QUFJQSxXQUFTQyxhQUFULENBQXdCRyxHQUF4QixFQUFxQztBQUNuQyxRQUFNSixJQUFJLEdBQUdLLFFBQVEsQ0FBQ0QsR0FBRCxFQUFNLEVBQU4sQ0FBckI7O0FBRUEsUUFBSUUsS0FBSyxDQUFDTixJQUFELENBQVQsRUFBaUI7QUFDZjtBQUNBLGFBQU9JLEdBQVA7QUFDRDs7QUFFRCxRQUFJSixJQUFJLElBQUksQ0FBWixFQUFlO0FBQ2I7QUFDQSxhQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBT0YsR0FBRyxDQUFDSSxNQUFYO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcbmltcG9ydCBBcHAgZnJvbSAnQHJvb3QvYXBpL2FwcCdcbi8vIGltcG9ydCBkYXRhYmFzZSBmcm9tICdkYidcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcblxuLy8gYm9vdFxuaW1wb3J0IHsgc2V0Q29uZmlnIH0gZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjb25maWdzOiBhbnkpIHtcbiAgY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOnNlcnZlcicpXG4gIGRvdGVudi5jb25maWcoKVxuICBcbiAgbGV0IHBhcmFtcyA9IHtcbiAgICBTRVJWRVJfUE9SVDogcHJvY2Vzcy5lbnYuTUNfUE9SVCxcbiAgICBOT1ZFX0VOVjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYsXG4gIH1cblxuICBPYmplY3Qua2V5cyhjb25maWdzKS5mb3JFYWNoKFxuICAgIGNvbmZpZ0tleSA9PiB7XG4gICAgICBzZXRDb25maWcoY29uZmlnc1tjb25maWdLZXldLCBjb25maWdLZXkpXG4gICAgfVxuICApXG4gIFxuICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgY29uc29sZS5sb2coJ0lOSVQgUEFSQU1FVEVSUzpcXG4nLCBwYXJhbXMpXG4gIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBcbiAgLyoqXG4gICAqIEdldCBwb3J0IGZyb20gZW52aXJvbm1lbnQgYW5kIHN0b3JlIGluIEV4cHJlc3MuXG4gICAqL1xuICBcbiAgdmFyIGFwcCA9IG5ldyBBcHAoKVxuICBcbiAgdmFyIHBvcnQgPSBub3JtYWxpemVQb3J0KHByb2Nlc3MuZW52Lk1DX1BPUlQgfHwgJzMwMDAnKVxuICBhcHAuc2VydmVyLnNldCgncG9ydCcsIHBvcnQpXG4gIFxuICAvKipcbiAgICogTm9ybWFsaXplIGEgcG9ydCBpbnRvIGEgbnVtYmVyLCBzdHJpbmcsIG9yIGZhbHNlLlxuICAgKi9cbiAgXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVBvcnQgKHZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9ydCA9IHBhcnNlSW50KHZhbCwgMTApXG4gIFxuICAgIGlmIChpc05hTihwb3J0KSkge1xuICAgICAgLy8gbmFtZWQgcGlwZVxuICAgICAgcmV0dXJuIHZhbFxuICAgIH1cbiAgXG4gICAgaWYgKHBvcnQgPj0gMCkge1xuICAgICAgLy8gcG9ydCBudW1iZXJcbiAgICAgIHJldHVybiBwb3J0XG4gICAgfVxuICBcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiBhcHAuc2VydmVyXG59XG4iXX0=