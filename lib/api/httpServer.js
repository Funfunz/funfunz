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
  var PORT = (0, _configLoader.default)().server.port;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvaHR0cFNlcnZlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsInN0YXJ0U2VydmVyIiwiYXBwIiwiUE9SVCIsInNlcnZlciIsInBvcnQiLCJodHRwIiwiY3JlYXRlU2VydmVyIiwibGlzdGVuIiwib24iLCJvbkVycm9yIiwib25MaXN0ZW5pbmciLCJlcnJvciIsInN5c2NhbGwiLCJiaW5kIiwiY29kZSIsInByb2Nlc3MiLCJleGl0IiwiYWRkciIsImFkZHJlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxvQkFBTSx1QkFBTixDQUFkOztBQUVlLFNBQVNDLFdBQVQsQ0FBcUJDLEdBQXJCLEVBQXFEO0FBQ2xFLE1BQU1DLElBQUksR0FBRyw2QkFBU0MsTUFBVCxDQUFnQkMsSUFBN0I7QUFDQTs7OztBQUdBLE1BQU1ELE1BQU0sR0FBR0UsY0FBS0MsWUFBTCxDQUFrQkwsR0FBbEIsQ0FBZjtBQUVBOzs7OztBQUdBRSxFQUFBQSxNQUFNLENBQUNJLE1BQVAsQ0FBY0wsSUFBZDtBQUNBQyxFQUFBQSxNQUFNLENBQUNLLEVBQVAsQ0FBVSxPQUFWLEVBQW1CQyxPQUFuQjtBQUNBTixFQUFBQSxNQUFNLENBQUNLLEVBQVAsQ0FBVSxXQUFWLEVBQXVCRSxXQUF2QjtBQUVBOzs7O0FBR0EsV0FBU0QsT0FBVCxDQUFpQkUsS0FBakIsRUFBNkI7QUFDM0IsUUFBSUEsS0FBSyxDQUFDQyxPQUFOLEtBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLFlBQU1ELEtBQU47QUFDRDs7QUFFRCxRQUFNRSxJQUFJLEdBQUcsT0FBT1gsSUFBUCxLQUFnQixRQUFoQixHQUNULFVBQVVBLElBREQsR0FFVCxVQUFVQSxJQUZkLENBTDJCLENBUzNCOztBQUNBLFlBQVFTLEtBQUssQ0FBQ0csSUFBZDtBQUNBLFdBQUssUUFBTDtBQUNFZixRQUFBQSxLQUFLLENBQUNjLElBQUksR0FBRywrQkFBUixDQUFMO0FBQ0FFLFFBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLENBQWI7QUFDQTs7QUFDRixXQUFLLFlBQUw7QUFDRWpCLFFBQUFBLEtBQUssQ0FBQ2MsSUFBSSxHQUFHLG9CQUFSLENBQUw7QUFDQUUsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsQ0FBYjtBQUNBOztBQUNGO0FBQ0UsY0FBTUwsS0FBTjtBQVZGO0FBWUQ7QUFFRDs7Ozs7QUFHQSxXQUFTRCxXQUFULEdBQXVCO0FBQ3JCLFFBQU1PLElBQUksR0FBR2QsTUFBTSxDQUFDZSxPQUFQLEVBQWI7QUFDQSxRQUFNTCxJQUFJLEdBQUcsT0FBT0ksSUFBUCxLQUFnQixRQUFoQixHQUNULFVBQVVBLElBREQsR0FFVCxVQUFVQSxJQUFJLENBQUNiLElBRm5CO0FBR0FMLElBQUFBLEtBQUssQ0FBQyxrQkFBa0JjLElBQW5CLENBQUw7QUFDRDtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICdAcm9vdC9hcGkvdXRpbHMvY29uZmlnTG9hZGVyJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbmltcG9ydCBodHRwIGZyb20gJ2h0dHAnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnpqczpodHRwLXNlcnZlcicpXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXJ0U2VydmVyKGFwcDogZXhwcmVzcy5BcHBsaWNhdGlvbik6IHZvaWQge1xuICBjb25zdCBQT1JUID0gY29uZmlnKCkuc2VydmVyLnBvcnRcbiAgLyoqXG4gICAqIENyZWF0ZSBIVFRQIHNlcnZlci5cbiAgICovXG4gIGNvbnN0IHNlcnZlciA9IGh0dHAuY3JlYXRlU2VydmVyKGFwcClcblxuICAvKipcbiAgICogTGlzdGVuIG9uIHByb3ZpZGVkIHBvcnQsIG9uIGFsbCBuZXR3b3JrIGludGVyZmFjZXMuXG4gICAqL1xuICBzZXJ2ZXIubGlzdGVuKFBPUlQpXG4gIHNlcnZlci5vbignZXJyb3InLCBvbkVycm9yKVxuICBzZXJ2ZXIub24oJ2xpc3RlbmluZycsIG9uTGlzdGVuaW5nKVxuXG4gIC8qKlxuICAgKiBFdmVudCBsaXN0ZW5lciBmb3IgSFRUUCBzZXJ2ZXIgXCJlcnJvclwiIGV2ZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gb25FcnJvcihlcnJvcjogYW55KSB7XG4gICAgaWYgKGVycm9yLnN5c2NhbGwgIT09ICdsaXN0ZW4nKSB7XG4gICAgICB0aHJvdyBlcnJvclxuICAgIH1cblxuICAgIGNvbnN0IGJpbmQgPSB0eXBlb2YgUE9SVCA9PT0gJ3N0cmluZydcbiAgICAgID8gJ1BpcGUgJyArIFBPUlRcbiAgICAgIDogJ1BvcnQgJyArIFBPUlRcblxuICAgIC8vIGhhbmRsZSBzcGVjaWZpYyBsaXN0ZW4gZXJyb3JzIHdpdGggZnJpZW5kbHkgbWVzc2FnZXNcbiAgICBzd2l0Y2ggKGVycm9yLmNvZGUpIHtcbiAgICBjYXNlICdFQUNDRVMnOlxuICAgICAgZGVidWcoYmluZCArICcgcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlcycpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnRUFERFJJTlVTRSc6XG4gICAgICBkZWJ1ZyhiaW5kICsgJyBpcyBhbHJlYWR5IGluIHVzZScpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IGVycm9yXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGxpc3RlbmVyIGZvciBIVFRQIHNlcnZlciBcImxpc3RlbmluZ1wiIGV2ZW50LlxuICAgKi9cbiAgZnVuY3Rpb24gb25MaXN0ZW5pbmcoKSB7XG4gICAgY29uc3QgYWRkciA9IHNlcnZlci5hZGRyZXNzKClcbiAgICBjb25zdCBiaW5kID0gdHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnXG4gICAgICA/ICdwaXBlICcgKyBhZGRyXG4gICAgICA6ICdwb3J0ICcgKyBhZGRyLnBvcnRcbiAgICBkZWJ1ZygnTGlzdGVuaW5nIG9uICcgKyBiaW5kKVxuICB9XG59XG4iXX0=