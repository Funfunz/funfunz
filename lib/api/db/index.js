"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Database = exports.default = void 0;

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

var _knex = _interopRequireDefault(require("knex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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
          connection: _objectSpread({}, configuration.mysql)
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

exports.Database = Database;
var database = new Database();
var _default = database;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvZGIvaW5kZXgudHMiXSwibmFtZXMiOlsiZGVidWciLCJEYXRhYmFzZSIsImRiIiwiY29uZmlndXJhdGlvbiIsImNvbmZpZyIsIm15c3FsIiwiY2xpZW50IiwiY29ubmVjdGlvbiIsImRhdGFiYXNlTmFtZSIsInVzZXIiLCJwYXNzd29yZCIsImhvc3QiLCJkaWFsZWN0IiwibG9nIiwiZGF0YWJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsb0JBQU0sb0JBQU4sQ0FBZDs7SUFFTUMsUTs7O0FBRUosc0JBQWM7QUFBQTs7QUFBQTs7QUFDWixTQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNEOzs7OzZCQUNlO0FBQ2QsVUFBTUMsYUFBYSxHQUFHLDZCQUFTQyxNQUEvQjs7QUFDQSxVQUFJRCxhQUFhLENBQUNFLEtBQWxCLEVBQXlCO0FBQ3ZCLGFBQUtILEVBQUwsR0FBVSxtQkFBSztBQUNiSSxVQUFBQSxNQUFNLEVBQUUsUUFESztBQUViQyxVQUFBQSxVQUFVLG9CQUNMSixhQUFhLENBQUNFLEtBRFQ7QUFGRyxTQUFMLENBQVY7QUFNRCxPQVRhLENBV2Q7OztBQVhjLGlDQW1CVkYsYUFBYSxDQUFDRSxLQW5CSjtBQUFBLFVBYVpHLFlBYlksd0JBYVpBLFlBYlk7QUFBQSxVQWNaQyxJQWRZLHdCQWNaQSxJQWRZO0FBQUEsVUFlWkMsUUFmWSx3QkFlWkEsUUFmWTtBQUFBLFVBZ0JaQyxJQWhCWSx3QkFnQlpBLElBaEJZO0FBQUEsdURBaUJaQyxPQWpCWTtBQUFBLFVBaUJaQSxPQWpCWSxzQ0FpQkYsUUFqQkU7QUFBQSxVQWtCWkMsR0FsQlksd0JBa0JaQSxHQWxCWTtBQW9CZGIsTUFBQUEsS0FBSyxDQUFDLE9BQUQsQ0FBTDtBQUNBQSxNQUFBQSxLQUFLLENBQUMsU0FBRCxFQUFZUSxZQUFaLENBQUw7QUFDQVIsTUFBQUEsS0FBSyxDQUFDLFNBQUQsRUFBWVMsSUFBWixDQUFMO0FBQ0FULE1BQUFBLEtBQUssQ0FBQyxhQUFELEVBQWdCVSxRQUFoQixDQUFMO0FBQ0FWLE1BQUFBLEtBQUssQ0FBQyxTQUFELEVBQVlXLElBQVosQ0FBTDtBQUNBWCxNQUFBQSxLQUFLLENBQUMsWUFBRCxFQUFlWSxPQUFmLENBQUw7QUFDQVosTUFBQUEsS0FBSyxDQUFDLEtBQUQsRUFBUWEsR0FBUixDQUFMO0FBQ0FiLE1BQUFBLEtBQUssQ0FBQyxLQUFELENBQUw7QUFDRDs7Ozs7OztBQUdILElBQU1jLFFBQVEsR0FBRyxJQUFJYixRQUFKLEVBQWpCO2VBRWVhLFEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQga25leCBmcm9tICdrbmV4J1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdmdW5mdW56bWM6ZGF0YWJhc2UnKVxuXG5jbGFzcyBEYXRhYmFzZSB7XG4gIHB1YmxpYyBkYjoga25leCB8IG51bGxcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kYiA9IG51bGxcbiAgfVxuICBwdWJsaWMgaW5pdERCKCkge1xuICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSBjb25maWcoKS5jb25maWdcbiAgICBpZiAoY29uZmlndXJhdGlvbi5teXNxbCkge1xuICAgICAgdGhpcy5kYiA9IGtuZXgoe1xuICAgICAgICBjbGllbnQ6ICdteXNxbDInLFxuICAgICAgICBjb25uZWN0aW9uOiB7XG4gICAgICAgICAgLi4uY29uZmlndXJhdGlvbi5teXNxbCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlcyBhIG5ldyBzZXF1ZWxpemUgaW5zdGFuY2VcbiAgICBjb25zdCB7XG4gICAgICBkYXRhYmFzZU5hbWUsXG4gICAgICB1c2VyLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBob3N0LFxuICAgICAgZGlhbGVjdCA9ICdteXNxbDInLFxuICAgICAgbG9nLFxuICAgIH0gPSBjb25maWd1cmF0aW9uLm15c3FsXG4gICAgZGVidWcoJ1N0YXJ0JylcbiAgICBkZWJ1ZygnREJfTkFNRScsIGRhdGFiYXNlTmFtZSlcbiAgICBkZWJ1ZygnREJfVVNFUicsIHVzZXIpXG4gICAgZGVidWcoJ0RCX1BBU1NXT1JEJywgcGFzc3dvcmQpXG4gICAgZGVidWcoJ0RCX0hPU1QnLCBob3N0KVxuICAgIGRlYnVnKCdEQl9ESUFMRUNUJywgZGlhbGVjdClcbiAgICBkZWJ1ZygnbG9nJywgbG9nKVxuICAgIGRlYnVnKCdFbmQnKVxuICB9XG59XG5cbmNvbnN0IGRhdGFiYXNlID0gbmV3IERhdGFiYXNlKClcblxuZXhwb3J0IGRlZmF1bHQgZGF0YWJhc2VcblxuZXhwb3J0IHtcbiAgRGF0YWJhc2Vcbn1cbiJdfQ==