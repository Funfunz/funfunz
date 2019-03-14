"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startServer;

var _configLoader = _interopRequireDefault(require("./utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug.default)('funfunzjs:http-server');

function startServer(app) {
  var PORT = (0, _configLoader.default)().config.server.port;
  /**
   * Create HTTP server.
   */

  var server = _http.default.createServer(app);
  /**
   * Listen on provided port, on all network interfaces.
   */


  server.listen(PORT);
  server.on('error', onError);
  server.on('listening', onListening);
  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT; // handle specific listen errors with friendly messages

    switch (error.code) {
      case 'EACCES':
        debug(bind + ' requires elevated privileges');
        process.exit(1);
        break;

      case 'EADDRINUSE':
        debug(bind + ' is already in use');
        process.exit(1);
        break;

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
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaHR0cFNlcnZlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsInN0YXJ0U2VydmVyIiwiYXBwIiwiUE9SVCIsImNvbmZpZyIsInNlcnZlciIsInBvcnQiLCJodHRwIiwiY3JlYXRlU2VydmVyIiwibGlzdGVuIiwib24iLCJvbkVycm9yIiwib25MaXN0ZW5pbmciLCJlcnJvciIsInN5c2NhbGwiLCJiaW5kIiwiY29kZSIsInByb2Nlc3MiLCJleGl0IiwiYWRkciIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxvQkFBTSx1QkFBTixDQUFkOztBQUVlLFNBQVNDLFdBQVQsQ0FBcUJDLEdBQXJCLEVBQXFEO0FBQ2xFLE1BQU1DLElBQUksR0FBRyw2QkFBU0MsTUFBVCxDQUFnQkMsTUFBaEIsQ0FBdUJDLElBQXBDO0FBQ0E7Ozs7QUFHQSxNQUFNRCxNQUFNLEdBQUdFLGNBQUtDLFlBQUwsQ0FBa0JOLEdBQWxCLENBQWY7QUFFQTs7Ozs7QUFHQUcsRUFBQUEsTUFBTSxDQUFDSSxNQUFQLENBQWNOLElBQWQ7QUFDQUUsRUFBQUEsTUFBTSxDQUFDSyxFQUFQLENBQVUsT0FBVixFQUFtQkMsT0FBbkI7QUFDQU4sRUFBQUEsTUFBTSxDQUFDSyxFQUFQLENBQVUsV0FBVixFQUF1QkUsV0FBdkI7QUFFQTs7OztBQUdBLFdBQVNELE9BQVQsQ0FBaUJFLEtBQWpCLEVBQTZCO0FBQzNCLFFBQUlBLEtBQUssQ0FBQ0MsT0FBTixLQUFrQixRQUF0QixFQUFnQztBQUM5QixZQUFNRCxLQUFOO0FBQ0Q7O0FBRUQsUUFBTUUsSUFBSSxHQUFHLE9BQU9aLElBQVAsS0FBZ0IsUUFBaEIsR0FDVCxVQUFVQSxJQURELEdBRVQsVUFBVUEsSUFGZCxDQUwyQixDQVMzQjs7QUFDQSxZQUFRVSxLQUFLLENBQUNHLElBQWQ7QUFDQSxXQUFLLFFBQUw7QUFDRWhCLFFBQUFBLEtBQUssQ0FBQ2UsSUFBSSxHQUFHLCtCQUFSLENBQUw7QUFDQUUsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsQ0FBYjtBQUNBOztBQUNGLFdBQUssWUFBTDtBQUNFbEIsUUFBQUEsS0FBSyxDQUFDZSxJQUFJLEdBQUcsb0JBQVIsQ0FBTDtBQUNBRSxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxDQUFiO0FBQ0E7O0FBQ0Y7QUFDRSxjQUFNTCxLQUFOO0FBVkY7QUFZRDtBQUVEOzs7OztBQUdBLFdBQVNELFdBQVQsR0FBdUI7QUFDckIsUUFBTU8sSUFBSSxHQUFHZCxNQUFNLENBQUNlLE9BQVAsRUFBYjtBQUNBLFFBQU1MLElBQUksR0FBRyxPQUFPSSxJQUFQLEtBQWdCLFFBQWhCLEdBQ1QsVUFBVUEsSUFERCxHQUVULFVBQVVBLElBQUksQ0FBQ2IsSUFGbkI7QUFHQU4sSUFBQUEsS0FBSyxDQUFDLGtCQUFrQmUsSUFBbkIsQ0FBTDtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGh0dHAgZnJvbSAnaHR0cCdcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuempzOmh0dHAtc2VydmVyJylcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnRTZXJ2ZXIoYXBwOiBleHByZXNzLkFwcGxpY2F0aW9uKTogdm9pZCB7XG4gIGNvbnN0IFBPUlQgPSBjb25maWcoKS5jb25maWcuc2VydmVyLnBvcnRcbiAgLyoqXG4gICAqIENyZWF0ZSBIVFRQIHNlcnZlci5cbiAgICovXG4gIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcClcblxuICAvKipcbiAgICogTGlzdGVuIG9uIHByb3ZpZGVkIHBvcnQsIG9uIGFsbCBuZXR3b3JrIGludGVyZmFjZXMuXG4gICAqL1xuICBzZXJ2ZXIubGlzdGVuKFBPUlQpXG4gIHNlcnZlci5vbignZXJyb3InLCBvbkVycm9yKVxuICBzZXJ2ZXIub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxuXG4gIC8qKlxuICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJlcnJvclwiIGV2ZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gb25FcnJvcihlcnJvcjogYW55KSB7XG4gICAgaWYgKGVycm9yLnN5c2NhbGwgIT09ICdsaXN0ZW4nKSB7XG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cblxuICAgIGNvbnN0IGJpbmQgPSB0eXBlb2YgUE9SVCA9PT0gJ3N0cmluZydcbiAgICAgID8gJ1BpcGUgJyArIFBPUlRcbiAgICAgIDogJ1BvcnQgJyArIFBPUlRcblxuICAgIC8vIGhhbmRsZSBzcGVjaWZpYyBsaXN0ZW4gZXJyb3JzIHdpdGggZnJpZW5kbHkgbWVzc2FnZXNcbiAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICBjYXNlICdFQUNDRVMnOlxuICAgICAgZGVidWcoYmluZCArICcgcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlcycpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnRUFERFJJTlVTRSc6XG4gICAgICBkZWJ1ZyhiaW5kICsgJyBpcyBhbHJlYWR5IGluIHVzZScpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImxpc3RlbmluZ1wiIGV2ZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gb25MaXN0ZW5pbmcoKSB7XG4gICAgY29uc3QgYWRkciA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBjb25zdCBiaW5kID0gdHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnXG4gICAgICA/ICdwaXBlICcgKyBhZGRyXG4gICAgICA6ICdwb3J0ICcgKyBhZGRyLnBvcnRcbiAgICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKVxuICB9XG59XG4iXX0=