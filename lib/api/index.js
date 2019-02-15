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

var _http = _interopRequireDefault(require("http"));

var _boot = _interopRequireDefault(require("./boot"));

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
   * Create HTTP server.
   */

  var server = _http.default.createServer(app.server);
  /**
   * Listen on provided port, on all network interfaces.
   */

  /* database.getDB().sync({ force: process.env.NODE_ENV === 'development' }).then(
    () => {
      server.listen(port)
    }
  ) */


  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
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
  /**
   * Event listener for HTTP server "error" event.
   */


  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port; // handle specific listen errors with friendly messages

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);

      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);

      default:
        throw error;
    }
  }
  /**
   * Event listener for HTTP server "listening" event.
   */


  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
    (0, _boot.default)();
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaW5kZXgudHMiXSwibmFtZXMiOlsiY29uZmlncyIsImRlYnVnIiwiZG90ZW52IiwiY29uZmlnIiwicGFyYW1zIiwiU0VSVkVSX1BPUlQiLCJwcm9jZXNzIiwiZW52IiwiTUNfUE9SVCIsIk5PVkVfRU5WIiwiTk9ERV9FTlYiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImNvbmZpZ0tleSIsImNvbnNvbGUiLCJsb2ciLCJhcHAiLCJBcHAiLCJwb3J0Iiwibm9ybWFsaXplUG9ydCIsInNlcnZlciIsInNldCIsImh0dHAiLCJjcmVhdGVTZXJ2ZXIiLCJsaXN0ZW4iLCJvbiIsIm9uRXJyb3IiLCJvbkxpc3RlbmluZyIsInZhbCIsInBhcnNlSW50IiwiaXNOYU4iLCJlcnJvciIsInN5c2NhbGwiLCJiaW5kIiwiY29kZSIsImV4aXQiLCJhZGRyIiwiYWRkcmVzcyJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7Ozs7Ozs7QUFJQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFHQTs7QUFDQTs7OztBQU5BO0FBSUE7QUFJZSxrQkFBVUEsT0FBVixFQUF3QjtBQUNyQyxNQUFNQyxLQUFLLEdBQUcsb0JBQU0sa0JBQU4sQ0FBZDs7QUFDQUMsa0JBQU9DLE1BQVA7O0FBRUEsTUFBSUMsTUFBTSxHQUFHO0FBQ1hDLElBQUFBLFdBQVcsRUFBRUMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLE9BRGQ7QUFFWEMsSUFBQUEsUUFBUSxFQUFFSCxPQUFPLENBQUNDLEdBQVIsQ0FBWUc7QUFGWCxHQUFiO0FBS0FDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZWixPQUFaLEVBQXFCYSxPQUFyQixDQUNFLFVBQUFDLFNBQVMsRUFBSTtBQUNYLGlDQUFVZCxPQUFPLENBQUNjLFNBQUQsQ0FBakIsRUFBOEJBLFNBQTlCO0FBQ0QsR0FISDtBQU1BQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSwrQ0FBWjtBQUNBRCxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQ1osTUFBbEM7QUFDQVcsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksK0NBQVo7QUFFQTs7OztBQUlBLE1BQUlDLEdBQUcsR0FBRyxJQUFJQyxZQUFKLEVBQVY7QUFFQSxNQUFJQyxJQUFJLEdBQUdDLGFBQWEsQ0FBQ2QsT0FBTyxDQUFDQyxHQUFSLENBQVlDLE9BQVosSUFBdUIsTUFBeEIsQ0FBeEI7QUFDQVMsRUFBQUEsR0FBRyxDQUFDSSxNQUFKLENBQVdDLEdBQVgsQ0FBZSxNQUFmLEVBQXVCSCxJQUF2QjtBQUVBOzs7O0FBSUEsTUFBTUUsTUFBTSxHQUFHRSxjQUFLQyxZQUFMLENBQWtCUCxHQUFHLENBQUNJLE1BQXRCLENBQWY7QUFFQTs7OztBQUlBOzs7Ozs7O0FBTUFBLEVBQUFBLE1BQU0sQ0FBQ0ksTUFBUCxDQUFjTixJQUFkO0FBRUFFLEVBQUFBLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLE9BQVYsRUFBbUJDLE9BQW5CO0FBQ0FOLEVBQUFBLE1BQU0sQ0FBQ0ssRUFBUCxDQUFVLFdBQVYsRUFBdUJFLFdBQXZCO0FBRUE7Ozs7QUFJQSxXQUFTUixhQUFULENBQXdCUyxHQUF4QixFQUFxQztBQUNuQyxRQUFNVixJQUFJLEdBQUdXLFFBQVEsQ0FBQ0QsR0FBRCxFQUFNLEVBQU4sQ0FBckI7O0FBRUEsUUFBSUUsS0FBSyxDQUFDWixJQUFELENBQVQsRUFBaUI7QUFDZjtBQUNBLGFBQU9VLEdBQVA7QUFDRDs7QUFFRCxRQUFJVixJQUFJLElBQUksQ0FBWixFQUFlO0FBQ2I7QUFDQSxhQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsV0FBTyxLQUFQO0FBQ0Q7QUFFRDs7Ozs7QUFJQSxXQUFTUSxPQUFULENBQWtCSyxLQUFsQixFQUE4QjtBQUM1QixRQUFJQSxLQUFLLENBQUNDLE9BQU4sS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsWUFBTUQsS0FBTjtBQUNEOztBQUVELFFBQU1FLElBQUksR0FBRyxPQUFPZixJQUFQLEtBQWdCLFFBQWhCLEdBQ1QsVUFBVUEsSUFERCxHQUVULFVBQVVBLElBRmQsQ0FMNEIsQ0FTNUI7O0FBQ0EsWUFBUWEsS0FBSyxDQUFDRyxJQUFkO0FBQ0UsV0FBSyxRQUFMO0FBQ0VwQixRQUFBQSxPQUFPLENBQUNpQixLQUFSLENBQWNFLElBQUksR0FBRywrQkFBckI7QUFDQTVCLFFBQUFBLE9BQU8sQ0FBQzhCLElBQVIsQ0FBYSxDQUFiOztBQUNGLFdBQUssWUFBTDtBQUNFckIsUUFBQUEsT0FBTyxDQUFDaUIsS0FBUixDQUFjRSxJQUFJLEdBQUcsb0JBQXJCO0FBQ0E1QixRQUFBQSxPQUFPLENBQUM4QixJQUFSLENBQWEsQ0FBYjs7QUFDRjtBQUNFLGNBQU1KLEtBQU47QUFSSjtBQVVEO0FBRUQ7Ozs7O0FBSUEsV0FBU0osV0FBVCxHQUF3QjtBQUN0QixRQUFNUyxJQUFJLEdBQUdoQixNQUFNLENBQUNpQixPQUFQLEVBQWI7QUFDQSxRQUFNSixJQUFJLEdBQUcsT0FBT0csSUFBUCxLQUFnQixRQUFoQixHQUNULFVBQVVBLElBREQsR0FFVCxVQUFVQSxJQUFJLENBQUNsQixJQUZuQjtBQUdBbEIsSUFBQUEsS0FBSyxDQUFDLGtCQUFrQmlDLElBQW5CLENBQUw7QUFDQTtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcbmltcG9ydCBBcHAgZnJvbSAnQHJvb3QvYXBpL2FwcCdcbi8vIGltcG9ydCBkYXRhYmFzZSBmcm9tICdkYidcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnXG5cbi8vIGJvb3RcbmltcG9ydCBib290IGZyb20gJ0Byb290L2FwaS9ib290J1xuaW1wb3J0IHsgc2V0Q29uZmlnIH0gZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjb25maWdzOiBhbnkpIHtcbiAgY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOnNlcnZlcicpXG4gIGRvdGVudi5jb25maWcoKVxuICBcbiAgbGV0IHBhcmFtcyA9IHtcbiAgICBTRVJWRVJfUE9SVDogcHJvY2Vzcy5lbnYuTUNfUE9SVCxcbiAgICBOT1ZFX0VOVjogcHJvY2Vzcy5lbnYuTk9ERV9FTlYsXG4gIH1cblxuICBPYmplY3Qua2V5cyhjb25maWdzKS5mb3JFYWNoKFxuICAgIGNvbmZpZ0tleSA9PiB7XG4gICAgICBzZXRDb25maWcoY29uZmlnc1tjb25maWdLZXldLCBjb25maWdLZXkpXG4gICAgfVxuICApXG4gIFxuICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgY29uc29sZS5sb2coJ0lOSVQgUEFSQU1FVEVSUzpcXG4nLCBwYXJhbXMpXG4gIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKVxuICBcbiAgLyoqXG4gICAqIEdldCBwb3J0IGZyb20gZW52aXJvbm1lbnQgYW5kIHN0b3JlIGluIEV4cHJlc3MuXG4gICAqL1xuICBcbiAgdmFyIGFwcCA9IG5ldyBBcHAoKVxuICBcbiAgdmFyIHBvcnQgPSBub3JtYWxpemVQb3J0KHByb2Nlc3MuZW52Lk1DX1BPUlQgfHwgJzMwMDAnKVxuICBhcHAuc2VydmVyLnNldCgncG9ydCcsIHBvcnQpXG4gIFxuICAvKipcbiAgICogQ3JlYXRlIEhUVFAgc2VydmVyLlxuICAgKi9cbiAgXG4gIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcC5zZXJ2ZXIpXG4gIFxuICAvKipcbiAgICogTGlzdGVuIG9uIHByb3ZpZGVkIHBvcnQsIG9uIGFsbCBuZXR3b3JrIGludGVyZmFjZXMuXG4gICAqL1xuICBcbiAgLyogZGF0YWJhc2UuZ2V0REIoKS5zeW5jKHsgZm9yY2U6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnIH0pLnRoZW4oXG4gICAgKCkgPT4ge1xuICAgICAgc2VydmVyLmxpc3Rlbihwb3J0KVxuICAgIH1cbiAgKSAqL1xuICBcbiAgc2VydmVyLmxpc3Rlbihwb3J0KVxuICBcbiAgc2VydmVyLm9uKCdlcnJvcicsIG9uRXJyb3IpXG4gIHNlcnZlci5vbignbGlzdGVuaW5nJywgb25MaXN0ZW5pbmcpXG4gIFxuICAvKipcbiAgICogTm9ybWFsaXplIGEgcG9ydCBpbnRvIGEgbnVtYmVyLCBzdHJpbmcsIG9yIGZhbHNlLlxuICAgKi9cbiAgXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVBvcnQgKHZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgcG9ydCA9IHBhcnNlSW50KHZhbCwgMTApXG4gIFxuICAgIGlmIChpc05hTihwb3J0KSkge1xuICAgICAgLy8gbmFtZWQgcGlwZVxuICAgICAgcmV0dXJuIHZhbFxuICAgIH1cbiAgXG4gICAgaWYgKHBvcnQgPj0gMCkge1xuICAgICAgLy8gcG9ydCBudW1iZXJcbiAgICAgIHJldHVybiBwb3J0XG4gICAgfVxuICBcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBcbiAgLyoqXG4gICAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImVycm9yXCIgZXZlbnQuXG4gICAqL1xuICBcbiAgZnVuY3Rpb24gb25FcnJvciAoZXJyb3I6IGFueSkge1xuICAgIGlmIChlcnJvci5zeXNjYWxsICE9PSAnbGlzdGVuJykge1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIFxuICAgIGNvbnN0IGJpbmQgPSB0eXBlb2YgcG9ydCA9PT0gJ3N0cmluZydcbiAgICAgID8gJ1BpcGUgJyArIHBvcnRcbiAgICAgIDogJ1BvcnQgJyArIHBvcnRcbiAgXG4gICAgLy8gaGFuZGxlIHNwZWNpZmljIGxpc3RlbiBlcnJvcnMgd2l0aCBmcmllbmRseSBtZXNzYWdlc1xuICAgIHN3aXRjaCAoZXJyb3IuY29kZSkge1xuICAgICAgY2FzZSAnRUFDQ0VTJzpcbiAgICAgICAgY29uc29sZS5lcnJvcihiaW5kICsgJyByZXF1aXJlcyBlbGV2YXRlZCBwcml2aWxlZ2VzJylcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICAgICBjYXNlICdFQUREUklOVVNFJzpcbiAgICAgICAgY29uc29sZS5lcnJvcihiaW5kICsgJyBpcyBhbHJlYWR5IGluIHVzZScpXG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJsaXN0ZW5pbmdcIiBldmVudC5cbiAgICovXG4gIFxuICBmdW5jdGlvbiBvbkxpc3RlbmluZyAoKSB7XG4gICAgY29uc3QgYWRkciA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBjb25zdCBiaW5kID0gdHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnXG4gICAgICA/ICdwaXBlICcgKyBhZGRyXG4gICAgICA6ICdwb3J0ICcgKyBhZGRyLnBvcnRcbiAgICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKVxuICAgIGJvb3QoKVxuICB9ICBcbn1cbiJdfQ==