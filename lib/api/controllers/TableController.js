"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _types = require("../types");

var _utils = require("../utils");

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug.default)('funfunzmc:controller-table');

var TableController =
/*#__PURE__*/
function () {
  function TableController() {
    _classCallCheck(this, TableController);

    _defineProperty(this, "settings", void 0);

    debug('Created');
    this.settings = (0, _configLoader.default)().settings;
  }

  _createClass(TableController, [{
    key: "getTableData",
    value: function getTableData(req, res, next) {
      if (_db.default.db) {
        _db.default.db.select('*').from(req.params.table).offset((req.query.page || 0) * 10).limit(10).then(function (results) {
          (0, _utils.addToResponse)(res, results, 'results');
          return (0, _utils.nextAndReturn)(next)(results);
        });
      } else {
        (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      }
    }
  }, {
    key: "insertRow",
    value: function insertRow(req, res, next) {
      if (_db.default.db) {
        _db.default.db(req.params.table).insert(req.body.data).then(function (results) {
          (0, _utils.addToResponse)(res, results, 'results');
          return (0, _utils.nextAndReturn)(next)(results);
        });
      } else {
        (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      }
    }
  }, {
    key: "updateRow",
    value: function updateRow(req, res, next) {
      if (_db.default.db) {
        _db.default.db(req.body.table).where('id', req.body.id).update(req.body.data).then(function (results) {
          (0, _utils.addToResponse)(res, results, 'results');
          return (0, _utils.nextAndReturn)(next)(results);
        });
      } else {
        (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      }
    }
  }, {
    key: "deleteRow",
    value: function deleteRow(req, res, next) {
      if (_db.default.db) {
        _db.default.db(req.params.table).where('id', req.params.id).del().then(function (results) {
          (0, _utils.addToResponse)(res, results, 'results');
          return (0, _utils.nextAndReturn)(next)(results);
        });
      } else {
        (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      }
    }
  }]);

  return TableController;
}();

var _default = TableController;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiVGFibGVDb250cm9sbGVyIiwic2V0dGluZ3MiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZGF0YWJhc2UiLCJkYiIsInNlbGVjdCIsImZyb20iLCJwYXJhbXMiLCJ0YWJsZSIsIm9mZnNldCIsInF1ZXJ5IiwicGFnZSIsImxpbWl0IiwidGhlbiIsInJlc3VsdHMiLCJIdHRwRXhjZXB0aW9uIiwiaW5zZXJ0IiwiYm9keSIsImRhdGEiLCJ3aGVyZSIsImlkIiwidXBkYXRlIiwiZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxvQkFBTSw0QkFBTixDQUFkOztJQUVNQyxlOzs7QUFFSiw2QkFBZTtBQUFBOztBQUFBOztBQUNiRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7OztpQ0FFWUMsRyxFQUFjQyxHLEVBQWlCQyxJLEVBQW9CO0FBQzlELFVBQUlDLFlBQVNDLEVBQWIsRUFBaUI7QUFDZkQsb0JBQVNDLEVBQVQsQ0FBWUMsTUFBWixDQUFtQixHQUFuQixFQUF3QkMsSUFBeEIsQ0FBNkJOLEdBQUcsQ0FBQ08sTUFBSixDQUFXQyxLQUF4QyxFQUErQ0MsTUFBL0MsQ0FBc0QsQ0FBQ1QsR0FBRyxDQUFDVSxLQUFKLENBQVVDLElBQVYsSUFBa0IsQ0FBbkIsSUFBd0IsRUFBOUUsRUFBa0ZDLEtBQWxGLENBQXdGLEVBQXhGLEVBQTRGQyxJQUE1RixDQUNFLFVBQUFDLE9BQU8sRUFBSTtBQUNULG9DQUFjYixHQUFkLEVBQW1CYSxPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjWixJQUFkLEVBQW9CWSxPQUFwQixDQUFQO0FBQ0QsU0FKSDtBQU1ELE9BUEQsTUFPTztBQUNMLG9DQUFnQlosSUFBaEIsRUFBc0IsSUFBSWEsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7OEJBRVNmLEcsRUFBY0MsRyxFQUFpQkMsSSxFQUFvQjtBQUMzRCxVQUFJQyxZQUFTQyxFQUFiLEVBQWlCO0FBQ2ZELG9CQUFTQyxFQUFULENBQVlKLEdBQUcsQ0FBQ08sTUFBSixDQUFXQyxLQUF2QixFQUE4QlEsTUFBOUIsQ0FBcUNoQixHQUFHLENBQUNpQixJQUFKLENBQVNDLElBQTlDLEVBQW9ETCxJQUFwRCxDQUNFLFVBQUFDLE9BQU8sRUFBSTtBQUNULG9DQUFjYixHQUFkLEVBQW1CYSxPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjWixJQUFkLEVBQW9CWSxPQUFwQixDQUFQO0FBQ0QsU0FKSDtBQU1ELE9BUEQsTUFPTztBQUNMLG9DQUFnQlosSUFBaEIsRUFBc0IsSUFBSWEsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7OEJBRVNmLEcsRUFBY0MsRyxFQUFpQkMsSSxFQUFvQjtBQUMzRCxVQUFJQyxZQUFTQyxFQUFiLEVBQWlCO0FBQ2ZELG9CQUFTQyxFQUFULENBQVlKLEdBQUcsQ0FBQ2lCLElBQUosQ0FBU1QsS0FBckIsRUFBNEJXLEtBQTVCLENBQWtDLElBQWxDLEVBQXdDbkIsR0FBRyxDQUFDaUIsSUFBSixDQUFTRyxFQUFqRCxFQUFxREMsTUFBckQsQ0FBNERyQixHQUFHLENBQUNpQixJQUFKLENBQVNDLElBQXJFLEVBQTJFTCxJQUEzRSxDQUNFLFVBQUFDLE9BQU8sRUFBSTtBQUNULG9DQUFjYixHQUFkLEVBQW1CYSxPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjWixJQUFkLEVBQW9CWSxPQUFwQixDQUFQO0FBQ0QsU0FKSDtBQU1ELE9BUEQsTUFPTztBQUNMLG9DQUFnQlosSUFBaEIsRUFBc0IsSUFBSWEsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7OEJBRVNmLEcsRUFBY0MsRyxFQUFpQkMsSSxFQUFvQjtBQUMzRCxVQUFJQyxZQUFTQyxFQUFiLEVBQWlCO0FBQ2ZELG9CQUFTQyxFQUFULENBQVlKLEdBQUcsQ0FBQ08sTUFBSixDQUFXQyxLQUF2QixFQUE4QlcsS0FBOUIsQ0FBb0MsSUFBcEMsRUFBMENuQixHQUFHLENBQUNPLE1BQUosQ0FBV2EsRUFBckQsRUFBeURFLEdBQXpELEdBQStEVCxJQUEvRCxDQUNFLFVBQUFDLE9BQU8sRUFBSTtBQUNULG9DQUFjYixHQUFkLEVBQW1CYSxPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjWixJQUFkLEVBQW9CWSxPQUFwQixDQUFQO0FBQ0QsU0FKSDtBQU1ELE9BUEQsTUFPTztBQUNMLG9DQUFnQlosSUFBaEIsRUFBc0IsSUFBSWEsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7Ozs7ZUFHWWpCLGUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBNQ1Jlc3BvbnNlLCBIdHRwRXhjZXB0aW9uIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgY2F0Y2hNaWRkbGV3YXJlLCBhZGRUb1Jlc3BvbnNlLCBuZXh0QW5kUmV0dXJuIH0gZnJvbSAnQHJvb3QvYXBpL3V0aWxzJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICdAcm9vdC9hcGkvdXRpbHMvY29uZmlnTG9hZGVyJ1xuaW1wb3J0IGRhdGFiYXNlIGZyb20gJ0Byb290L2FwaS9kYi9pbmRleCdcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmNvbnRyb2xsZXItdGFibGUnKVxuXG5jbGFzcyBUYWJsZUNvbnRyb2xsZXIge1xuICBzZXR0aW5nczogQXJyYXk8YW55PlxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgZGVidWcoJ0NyZWF0ZWQnKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBjb25maWcoKS5zZXR0aW5nc1xuICB9XG5cbiAgZ2V0VGFibGVEYXRhKHJlcTogUmVxdWVzdCwgcmVzOiBNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoZGF0YWJhc2UuZGIpIHtcbiAgICAgIGRhdGFiYXNlLmRiLnNlbGVjdCgnKicpLmZyb20ocmVxLnBhcmFtcy50YWJsZSkub2Zmc2V0KChyZXEucXVlcnkucGFnZSB8fCAwKSAqIDEwKS5saW1pdCgxMCkudGhlbihcbiAgICAgICAgcmVzdWx0cyA9PiB7XG4gICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMsICdyZXN1bHRzJylcbiAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgIH1cbiAgfVxuXG4gIGluc2VydFJvdyhyZXE6IFJlcXVlc3QsIHJlczogTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICBkYXRhYmFzZS5kYihyZXEucGFyYW1zLnRhYmxlKS5pbnNlcnQocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgcmVzdWx0cyA9PiB7XG4gICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMsICdyZXN1bHRzJylcbiAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICBkYXRhYmFzZS5kYihyZXEuYm9keS50YWJsZSkud2hlcmUoJ2lkJywgcmVxLmJvZHkuaWQpLnVwZGF0ZShyZXEuYm9keS5kYXRhKS50aGVuKFxuICAgICAgICByZXN1bHRzID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgZGVsZXRlUm93KHJlcTogUmVxdWVzdCwgcmVzOiBNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoZGF0YWJhc2UuZGIpIHtcbiAgICAgIGRhdGFiYXNlLmRiKHJlcS5wYXJhbXMudGFibGUpLndoZXJlKCdpZCcsIHJlcS5wYXJhbXMuaWQpLmRlbCgpLnRoZW4oXG4gICAgICAgIHJlc3VsdHMgPT4ge1xuICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCByZXN1bHRzLCAncmVzdWx0cycpXG4gICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkocmVzdWx0cylcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFibGVDb250cm9sbGVyXG4iXX0=