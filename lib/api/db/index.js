"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

var _knex = _interopRequireDefault(require("knex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug.default)('funfunzmc:database');

var Database =
/*#__PURE__*/
function () {
  function Database() {
    _classCallCheck(this, Database);

    _defineProperty(this, "db", void 0);

    this.db = null;
  }

  _createClass(Database, [{
    key: "initDB",
    value: function initDB() {
      var configuration = (0, _configLoader.default)().config;

      if (configuration.mysql) {
        this.db = (0, _knex.default)({
          client: 'mysql2',
          connection: {
            host: configuration.mysql.host,
            user: configuration.mysql.user,
            password: configuration.mysql.password,
            database: configuration.mysql.database
          }
        });
      } // creates a new sequelize instance


      var _configuration$mysql = configuration.mysql,
          databaseName = _configuration$mysql.databaseName,
          user = _configuration$mysql.user,
          password = _configuration$mysql.password,
          host = _configuration$mysql.host,
          _configuration$mysql$ = _configuration$mysql.dialect,
          dialect = _configuration$mysql$ === void 0 ? 'mysql2' : _configuration$mysql$,
          log = _configuration$mysql.log;
      debug('Start');
      debug('DB_NAME', databaseName);
      debug('DB_USER', user);
      debug('DB_PASSWORD', password);
      debug('DB_HOST', host);
      debug('DB_DIALECT', dialect);
      debug('log', log);
      debug('End');
    }
  }]);

  return Database;
}();

var database = new Database();
var _default = database;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvZGIvaW5kZXgudHMiXSwibmFtZXMiOlsiZGVidWciLCJEYXRhYmFzZSIsImRiIiwiY29uZmlndXJhdGlvbiIsImNvbmZpZyIsIm15c3FsIiwiY2xpZW50IiwiY29ubmVjdGlvbiIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsImRhdGFiYXNlTmFtZSIsImRpYWxlY3QiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLG9CQUFOLENBQWQ7O0lBRU1DLFE7OztBQUVKLHNCQUFjO0FBQUE7O0FBQUE7O0FBQ1osU0FBS0MsRUFBTCxHQUFVLElBQVY7QUFDRDs7Ozs2QkFDZTtBQUNkLFVBQU1DLGFBQWEsR0FBRyw2QkFBU0MsTUFBL0I7O0FBQ0EsVUFBSUQsYUFBYSxDQUFDRSxLQUFsQixFQUF5QjtBQUN2QixhQUFLSCxFQUFMLEdBQVUsbUJBQUs7QUFDYkksVUFBQUEsTUFBTSxFQUFFLFFBREs7QUFFYkMsVUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFlBQUFBLElBQUksRUFBR0wsYUFBYSxDQUFDRSxLQUFkLENBQW9CRyxJQURqQjtBQUVWQyxZQUFBQSxJQUFJLEVBQUdOLGFBQWEsQ0FBQ0UsS0FBZCxDQUFvQkksSUFGakI7QUFHVkMsWUFBQUEsUUFBUSxFQUFHUCxhQUFhLENBQUNFLEtBQWQsQ0FBb0JLLFFBSHJCO0FBSVZDLFlBQUFBLFFBQVEsRUFBR1IsYUFBYSxDQUFDRSxLQUFkLENBQW9CTTtBQUpyQjtBQUZDLFNBQUwsQ0FBVjtBQVNELE9BWmEsQ0FjZDs7O0FBZGMsaUNBc0JWUixhQUFhLENBQUNFLEtBdEJKO0FBQUEsVUFnQlpPLFlBaEJZLHdCQWdCWkEsWUFoQlk7QUFBQSxVQWlCWkgsSUFqQlksd0JBaUJaQSxJQWpCWTtBQUFBLFVBa0JaQyxRQWxCWSx3QkFrQlpBLFFBbEJZO0FBQUEsVUFtQlpGLElBbkJZLHdCQW1CWkEsSUFuQlk7QUFBQSx1REFvQlpLLE9BcEJZO0FBQUEsVUFvQlpBLE9BcEJZLHNDQW9CRixRQXBCRTtBQUFBLFVBcUJaQyxHQXJCWSx3QkFxQlpBLEdBckJZO0FBdUJkZCxNQUFBQSxLQUFLLENBQUMsT0FBRCxDQUFMO0FBQ0FBLE1BQUFBLEtBQUssQ0FBQyxTQUFELEVBQVlZLFlBQVosQ0FBTDtBQUNBWixNQUFBQSxLQUFLLENBQUMsU0FBRCxFQUFZUyxJQUFaLENBQUw7QUFDQVQsTUFBQUEsS0FBSyxDQUFDLGFBQUQsRUFBZ0JVLFFBQWhCLENBQUw7QUFDQVYsTUFBQUEsS0FBSyxDQUFDLFNBQUQsRUFBWVEsSUFBWixDQUFMO0FBQ0FSLE1BQUFBLEtBQUssQ0FBQyxZQUFELEVBQWVhLE9BQWYsQ0FBTDtBQUNBYixNQUFBQSxLQUFLLENBQUMsS0FBRCxFQUFRYyxHQUFSLENBQUw7QUFDQWQsTUFBQUEsS0FBSyxDQUFDLEtBQUQsQ0FBTDtBQUNEOzs7Ozs7QUFHSCxJQUFNVyxRQUFRLEdBQUcsSUFBSVYsUUFBSixFQUFqQjtlQUVlVSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICdAcm9vdC9hcGkvdXRpbHMvY29uZmlnTG9hZGVyJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGtuZXggZnJvbSAna25leCdcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmRhdGFiYXNlJylcblxuY2xhc3MgRGF0YWJhc2Uge1xuICBwdWJsaWMgZGI6IGtuZXggfCBudWxsXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGIgPSBudWxsXG4gIH1cbiAgcHVibGljIGluaXREQigpIHtcbiAgICBjb25zdCBjb25maWd1cmF0aW9uID0gY29uZmlnKCkuY29uZmlnXG4gICAgaWYgKGNvbmZpZ3VyYXRpb24ubXlzcWwpIHtcbiAgICAgIHRoaXMuZGIgPSBrbmV4KHtcbiAgICAgICAgY2xpZW50OiAnbXlzcWwyJyxcbiAgICAgICAgY29ubmVjdGlvbjoge1xuICAgICAgICAgIGhvc3QgOiBjb25maWd1cmF0aW9uLm15c3FsLmhvc3QsXG4gICAgICAgICAgdXNlciA6IGNvbmZpZ3VyYXRpb24ubXlzcWwudXNlcixcbiAgICAgICAgICBwYXNzd29yZCA6IGNvbmZpZ3VyYXRpb24ubXlzcWwucGFzc3dvcmQsXG4gICAgICAgICAgZGF0YWJhc2UgOiBjb25maWd1cmF0aW9uLm15c3FsLmRhdGFiYXNlLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVzIGEgbmV3IHNlcXVlbGl6ZSBpbnN0YW5jZVxuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFiYXNlTmFtZSxcbiAgICAgIHVzZXIsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGhvc3QsXG4gICAgICBkaWFsZWN0ID0gJ215c3FsMicsXG4gICAgICBsb2csXG4gICAgfSA9IGNvbmZpZ3VyYXRpb24ubXlzcWxcbiAgICBkZWJ1ZygnU3RhcnQnKVxuICAgIGRlYnVnKCdEQl9OQU1FJywgZGF0YWJhc2VOYW1lKVxuICAgIGRlYnVnKCdEQl9VU0VSJywgdXNlcilcbiAgICBkZWJ1ZygnREJfUEFTU1dPUkQnLCBwYXNzd29yZClcbiAgICBkZWJ1ZygnREJfSE9TVCcsIGhvc3QpXG4gICAgZGVidWcoJ0RCX0RJQUxFQ1QnLCBkaWFsZWN0KVxuICAgIGRlYnVnKCdsb2cnLCBsb2cpXG4gICAgZGVidWcoJ0VuZCcpXG4gIH1cbn1cblxuY29uc3QgZGF0YWJhc2UgPSBuZXcgRGF0YWJhc2UoKVxuXG5leHBvcnQgZGVmYXVsdCBkYXRhYmFzZVxuIl19