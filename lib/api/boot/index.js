"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug.default)('cpmbg:boot');
/* server boot script
** this will run everytime the server is started
*/

function _default() {
  debug('Start');
  Promise.all([]).then(function () {
    debug('End');
  }).catch(function (err) {
    debug('End');
    console.log('err', err);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvYm9vdC9pbmRleC50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlByb21pc2UiLCJhbGwiLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsb0JBQU0sWUFBTixDQUFkO0FBRUE7Ozs7QUFHZSxvQkFBWTtBQUN6QkEsRUFBQUEsS0FBSyxDQUFDLE9BQUQsQ0FBTDtBQUNBQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxFQUFaLEVBQWdCQyxJQUFoQixDQUNFLFlBQU07QUFDSkgsSUFBQUEsS0FBSyxDQUFDLEtBQUQsQ0FBTDtBQUNELEdBSEgsRUFJRUksS0FKRixDQUtFLFVBQUFDLEdBQUcsRUFBSTtBQUNMTCxJQUFBQSxLQUFLLENBQUMsS0FBRCxDQUFMO0FBQ0FNLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQVosRUFBbUJGLEdBQW5CO0FBQ0QsR0FSSDtBQVVEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdjcG1iZzpib290JylcblxuLyogc2VydmVyIGJvb3Qgc2NyaXB0XG4qKiB0aGlzIHdpbGwgcnVuIGV2ZXJ5dGltZSB0aGUgc2VydmVyIGlzIHN0YXJ0ZWRcbiovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoKSB7XG4gIGRlYnVnKCdTdGFydCcpXG4gIFByb21pc2UuYWxsKFtdKS50aGVuKFxuICAgICgpID0+IHtcbiAgICAgIGRlYnVnKCdFbmQnKVxuICAgIH1cbiAgKS5jYXRjaChcbiAgICBlcnIgPT4ge1xuICAgICAgZGVidWcoJ0VuZCcpXG4gICAgICBjb25zb2xlLmxvZygnZXJyJywgZXJyKVxuICAgIH1cbiAgKVxufVxuIl19