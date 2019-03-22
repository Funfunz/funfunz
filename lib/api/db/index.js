"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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

var database = new Database();
var _default = database;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvZGIvaW5kZXgudHMiXSwibmFtZXMiOlsiZGVidWciLCJEYXRhYmFzZSIsImRiIiwiY29uZmlndXJhdGlvbiIsImNvbmZpZyIsIm15c3FsIiwiY2xpZW50IiwiY29ubmVjdGlvbiIsImRhdGFiYXNlTmFtZSIsInVzZXIiLCJwYXNzd29yZCIsImhvc3QiLCJkaWFsZWN0IiwibG9nIiwiZGF0YWJhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxLQUFLLEdBQUcsb0JBQU0sb0JBQU4sQ0FBZDs7SUFFTUMsUTs7O0FBRUosc0JBQWM7QUFBQTs7QUFBQTs7QUFDWixTQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNEOzs7OzZCQUNlO0FBQ2QsVUFBTUMsYUFBYSxHQUFHLDZCQUFTQyxNQUEvQjs7QUFDQSxVQUFJRCxhQUFhLENBQUNFLEtBQWxCLEVBQXlCO0FBQ3ZCLGFBQUtILEVBQUwsR0FBVSxtQkFBSztBQUNiSSxVQUFBQSxNQUFNLEVBQUUsUUFESztBQUViQyxVQUFBQSxVQUFVLG9CQUNMSixhQUFhLENBQUNFLEtBRFQ7QUFGRyxTQUFMLENBQVY7QUFNRCxPQVRhLENBV2Q7OztBQVhjLGlDQW1CVkYsYUFBYSxDQUFDRSxLQW5CSjtBQUFBLFVBYVpHLFlBYlksd0JBYVpBLFlBYlk7QUFBQSxVQWNaQyxJQWRZLHdCQWNaQSxJQWRZO0FBQUEsVUFlWkMsUUFmWSx3QkFlWkEsUUFmWTtBQUFBLFVBZ0JaQyxJQWhCWSx3QkFnQlpBLElBaEJZO0FBQUEsdURBaUJaQyxPQWpCWTtBQUFBLFVBaUJaQSxPQWpCWSxzQ0FpQkYsUUFqQkU7QUFBQSxVQWtCWkMsR0FsQlksd0JBa0JaQSxHQWxCWTtBQW9CZGIsTUFBQUEsS0FBSyxDQUFDLE9BQUQsQ0FBTDtBQUNBQSxNQUFBQSxLQUFLLENBQUMsU0FBRCxFQUFZUSxZQUFaLENBQUw7QUFDQVIsTUFBQUEsS0FBSyxDQUFDLFNBQUQsRUFBWVMsSUFBWixDQUFMO0FBQ0FULE1BQUFBLEtBQUssQ0FBQyxhQUFELEVBQWdCVSxRQUFoQixDQUFMO0FBQ0FWLE1BQUFBLEtBQUssQ0FBQyxTQUFELEVBQVlXLElBQVosQ0FBTDtBQUNBWCxNQUFBQSxLQUFLLENBQUMsWUFBRCxFQUFlWSxPQUFmLENBQUw7QUFDQVosTUFBQUEsS0FBSyxDQUFDLEtBQUQsRUFBUWEsR0FBUixDQUFMO0FBQ0FiLE1BQUFBLEtBQUssQ0FBQyxLQUFELENBQUw7QUFDRDs7Ozs7O0FBR0gsSUFBTWMsUUFBUSxHQUFHLElBQUliLFFBQUosRUFBakI7ZUFFZWEsUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBrbmV4IGZyb20gJ2tuZXgnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnptYzpkYXRhYmFzZScpXG5cbmNsYXNzIERhdGFiYXNlIHtcbiAgcHVibGljIGRiOiBrbmV4IHwgbnVsbFxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRiID0gbnVsbFxuICB9XG4gIHB1YmxpYyBpbml0REIoKSB7XG4gICAgY29uc3QgY29uZmlndXJhdGlvbiA9IGNvbmZpZygpLmNvbmZpZ1xuICAgIGlmIChjb25maWd1cmF0aW9uLm15c3FsKSB7XG4gICAgICB0aGlzLmRiID0ga25leCh7XG4gICAgICAgIGNsaWVudDogJ215c3FsMicsXG4gICAgICAgIGNvbm5lY3Rpb246IHtcbiAgICAgICAgICAuLi5jb25maWd1cmF0aW9uLm15c3FsLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBjcmVhdGVzIGEgbmV3IHNlcXVlbGl6ZSBpbnN0YW5jZVxuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFiYXNlTmFtZSxcbiAgICAgIHVzZXIsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGhvc3QsXG4gICAgICBkaWFsZWN0ID0gJ215c3FsMicsXG4gICAgICBsb2csXG4gICAgfSA9IGNvbmZpZ3VyYXRpb24ubXlzcWxcbiAgICBkZWJ1ZygnU3RhcnQnKVxuICAgIGRlYnVnKCdEQl9OQU1FJywgZGF0YWJhc2VOYW1lKVxuICAgIGRlYnVnKCdEQl9VU0VSJywgdXNlcilcbiAgICBkZWJ1ZygnREJfUEFTU1dPUkQnLCBwYXNzd29yZClcbiAgICBkZWJ1ZygnREJfSE9TVCcsIGhvc3QpXG4gICAgZGVidWcoJ0RCX0RJQUxFQ1QnLCBkaWFsZWN0KVxuICAgIGRlYnVnKCdsb2cnLCBsb2cpXG4gICAgZGVidWcoJ0VuZCcpXG4gIH1cbn1cblxuY29uc3QgZGF0YWJhc2UgPSBuZXcgRGF0YWJhc2UoKVxuXG5leHBvcnQgZGVmYXVsdCBkYXRhYmFzZVxuIl19