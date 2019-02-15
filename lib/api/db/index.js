"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _knex = _interopRequireDefault(require("knex"));

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

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


      var _process$env = process.env,
          DB_NAME = _process$env.DB_NAME,
          DB_USER = _process$env.DB_USER,
          DB_PASSWORD = _process$env.DB_PASSWORD,
          DB_HOST = _process$env.DB_HOST,
          DB_DIALECT = _process$env.DB_DIALECT,
          DB_LOG = _process$env.DB_LOG;
      debug('Start');
      debug('DB_NAME', DB_NAME);
      debug('DB_USER', DB_USER);
      debug('DB_PASSWORD', DB_PASSWORD);
      debug('DB_HOST', DB_HOST);
      debug('DB_DIALECT', DB_DIALECT);
      debug('End');
    }
  }]);

  return Database;
}();

var database = new Database();
var _default = database;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvZGIvaW5kZXgudHMiXSwibmFtZXMiOlsiZGVidWciLCJEYXRhYmFzZSIsImRiIiwiY29uZmlndXJhdGlvbiIsImNvbmZpZyIsIm15c3FsIiwiY2xpZW50IiwiY29ubmVjdGlvbiIsImhvc3QiLCJ1c2VyIiwicGFzc3dvcmQiLCJkYXRhYmFzZSIsInByb2Nlc3MiLCJlbnYiLCJEQl9OQU1FIiwiREJfVVNFUiIsIkRCX1BBU1NXT1JEIiwiREJfSE9TVCIsIkRCX0RJQUxFQ1QiLCJEQl9MT0ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLG9CQUFOLENBQWQ7O0lBRU1DLFE7OztBQUVKLHNCQUFlO0FBQUE7O0FBQUE7O0FBQ2IsU0FBS0MsRUFBTCxHQUFVLElBQVY7QUFDRDs7Ozs2QkFDUztBQUNSLFVBQU1DLGFBQWEsR0FBRyw2QkFBU0MsTUFBL0I7O0FBQ0EsVUFBSUQsYUFBYSxDQUFDRSxLQUFsQixFQUF5QjtBQUN2QixhQUFLSCxFQUFMLEdBQVUsbUJBQUs7QUFDYkksVUFBQUEsTUFBTSxFQUFFLFFBREs7QUFFYkMsVUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFlBQUFBLElBQUksRUFBR0wsYUFBYSxDQUFDRSxLQUFkLENBQW9CRyxJQURqQjtBQUVWQyxZQUFBQSxJQUFJLEVBQUdOLGFBQWEsQ0FBQ0UsS0FBZCxDQUFvQkksSUFGakI7QUFHVkMsWUFBQUEsUUFBUSxFQUFHUCxhQUFhLENBQUNFLEtBQWQsQ0FBb0JLLFFBSHJCO0FBSVZDLFlBQUFBLFFBQVEsRUFBR1IsYUFBYSxDQUFDRSxLQUFkLENBQW9CTTtBQUpyQjtBQUZDLFNBQUwsQ0FBVjtBQVNELE9BWk8sQ0FjUjs7O0FBZFEseUJBdUJKQyxPQUFPLENBQUNDLEdBdkJKO0FBQUEsVUFnQk5DLE9BaEJNLGdCQWdCTkEsT0FoQk07QUFBQSxVQWlCTkMsT0FqQk0sZ0JBaUJOQSxPQWpCTTtBQUFBLFVBa0JOQyxXQWxCTSxnQkFrQk5BLFdBbEJNO0FBQUEsVUFtQk5DLE9BbkJNLGdCQW1CTkEsT0FuQk07QUFBQSxVQW9CTkMsVUFwQk0sZ0JBb0JOQSxVQXBCTTtBQUFBLFVBcUJOQyxNQXJCTSxnQkFxQk5BLE1BckJNO0FBd0JSbkIsTUFBQUEsS0FBSyxDQUFDLE9BQUQsQ0FBTDtBQUNBQSxNQUFBQSxLQUFLLENBQUMsU0FBRCxFQUFZYyxPQUFaLENBQUw7QUFDQWQsTUFBQUEsS0FBSyxDQUFDLFNBQUQsRUFBWWUsT0FBWixDQUFMO0FBQ0FmLE1BQUFBLEtBQUssQ0FBQyxhQUFELEVBQWdCZ0IsV0FBaEIsQ0FBTDtBQUNBaEIsTUFBQUEsS0FBSyxDQUFDLFNBQUQsRUFBWWlCLE9BQVosQ0FBTDtBQUNBakIsTUFBQUEsS0FBSyxDQUFDLFlBQUQsRUFBZWtCLFVBQWYsQ0FBTDtBQUVBbEIsTUFBQUEsS0FBSyxDQUFDLEtBQUQsQ0FBTDtBQUNEOzs7Ozs7QUFHSCxJQUFNVyxRQUFRLEdBQUcsSUFBSVYsUUFBSixFQUFqQjtlQUVlVSxRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGtuZXggZnJvbSAna25leCdcbmltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmRhdGFiYXNlJylcblxuY2xhc3MgRGF0YWJhc2Uge1xuICBkYjoga25leCB8IG51bGxcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuZGIgPSBudWxsXG4gIH1cbiAgaW5pdERCICgpIHtcbiAgICBjb25zdCBjb25maWd1cmF0aW9uID0gY29uZmlnKCkuY29uZmlnXG4gICAgaWYgKGNvbmZpZ3VyYXRpb24ubXlzcWwpIHtcbiAgICAgIHRoaXMuZGIgPSBrbmV4KHtcbiAgICAgICAgY2xpZW50OiAnbXlzcWwyJyxcbiAgICAgICAgY29ubmVjdGlvbjoge1xuICAgICAgICAgIGhvc3QgOiBjb25maWd1cmF0aW9uLm15c3FsLmhvc3QsXG4gICAgICAgICAgdXNlciA6IGNvbmZpZ3VyYXRpb24ubXlzcWwudXNlcixcbiAgICAgICAgICBwYXNzd29yZCA6IGNvbmZpZ3VyYXRpb24ubXlzcWwucGFzc3dvcmQsXG4gICAgICAgICAgZGF0YWJhc2UgOiBjb25maWd1cmF0aW9uLm15c3FsLmRhdGFiYXNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyBhIG5ldyBzZXF1ZWxpemUgaW5zdGFuY2VcbiAgICBjb25zdCB7XG4gICAgICBEQl9OQU1FLFxuICAgICAgREJfVVNFUixcbiAgICAgIERCX1BBU1NXT1JELFxuICAgICAgREJfSE9TVCxcbiAgICAgIERCX0RJQUxFQ1QsXG4gICAgICBEQl9MT0csXG4gICAgICAvLyBEQl9JTlNUQU5DRSxcbiAgICB9ID0gcHJvY2Vzcy5lbnZcbiAgICBkZWJ1ZygnU3RhcnQnKVxuICAgIGRlYnVnKCdEQl9OQU1FJywgREJfTkFNRSlcbiAgICBkZWJ1ZygnREJfVVNFUicsIERCX1VTRVIpXG4gICAgZGVidWcoJ0RCX1BBU1NXT1JEJywgREJfUEFTU1dPUkQpXG4gICAgZGVidWcoJ0RCX0hPU1QnLCBEQl9IT1NUKVxuICAgIGRlYnVnKCdEQl9ESUFMRUNUJywgREJfRElBTEVDVClcbiAgICBcbiAgICBkZWJ1ZygnRW5kJylcbiAgfVxufVxuXG5jb25zdCBkYXRhYmFzZSA9IG5ldyBEYXRhYmFzZSgpXG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFiYXNlXG4iXX0=