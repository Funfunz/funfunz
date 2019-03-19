"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _types = require("../types");

var _utils = require("../utils");

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

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
    key: "getTableConfig",
    value: function getTableConfig(req, res, next) {
      if (!this.settings || this.settings.length === 0) {
        throw (0, _utils.buildError)('Table not found', 404);
      } else {
        var userRoles = [];

        if (req.user && req.user.roles) {
          userRoles = req.user.roles;
        }

        var table = this.settings.filter(function (tableItem) {
          return tableItem.name === req.params.table;
        })[0];

        if ((0, _utils.hasAuthorization)(table.roles, userRoles)) {
          (0, _utils.addToResponse)(res, table.columns, 'results');
          return (0, _utils.nextAndReturn)(next)(table.columns);
        } else {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
        }
      }
    }
  }, {
    key: "getTableData",
    value: function getTableData(req, res, next) {
      if (!this.settings || this.settings.length === 0) {
        throw (0, _utils.buildError)('Table not found', 404);
      }

      var table = this.settings.filter(function (tableItem) {
        return tableItem.name === req.params.table;
      })[0];
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      if (!(0, _utils.hasAuthorization)(table.roles, userRoles)) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      } else {
        if (!_db.default.db) {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
        } else {
          return _db.default.db.select('*').from(req.params.table).offset((req.query.page || 0) * 10).limit(10).then(function (results) {
            if (table.hooks && table.hooks.getTableData && table.hooks.getTableData.after) {
              if (_db.default.db) {
                return table.hooks.getTableData.after(req, res, _db.default.db, table.name, results).then(function (resultsBeforeGet) {
                  (0, _utils.addToResponse)(res, resultsBeforeGet, 'results');
                  return (0, _utils.nextAndReturn)(next)(resultsBeforeGet);
                });
              }
            } else {
              (0, _utils.addToResponse)(res, results, 'results');
              return (0, _utils.nextAndReturn)(next)(results);
            }
          });
        }
      }
    }
  }, {
    key: "getTableCount",
    value: function getTableCount(req, res, next) {
      if (!this.settings || this.settings.length === 0) {
        throw (0, _utils.buildError)('Table not found', 404);
      }

      var table = this.settings.filter(function (tableItem) {
        return tableItem.name === req.params.table;
      })[0];
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      if (!(0, _utils.hasAuthorization)(table.roles, userRoles)) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      } else {
        if (!_db.default.db) {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
        } else {
          return _db.default.db.select('*').from(req.params.table).then(function (results) {
            if (table.hooks && table.hooks.getTableCount && table.hooks.getTableCount.after) {
              if (_db.default.db) {
                return table.hooks.getTableCount.after(req, res, _db.default.db, table.name, results).then(function (count) {
                  (0, _utils.addToResponse)(res, count, 'count');
                  return (0, _utils.nextAndReturn)(next)(count);
                });
              }
            } else {
              (0, _utils.addToResponse)(res, results.length, 'count');
              return (0, _utils.nextAndReturn)(next)(results);
            }
          });
        }
      }
    }
  }, {
    key: "getRow",
    value: function getRow(req, res, next) {
      if (!this.settings || this.settings.length === 0) {
        throw (0, _utils.buildError)('Table not found', 404);
      }

      var table = this.settings.filter(function (tableItem) {
        return tableItem.name === req.params.table;
      })[0];
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      if (!(0, _utils.hasAuthorization)(table.roles, userRoles)) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      } else {
        if (!_db.default.db) {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
        } else {
          var requestedColumns = table.columns.filter(function (column) {
            return column.visible.detail;
          }).map(function (column) {
            return column.name;
          });
          return _db.default.db.select(requestedColumns).from(req.params.table).where('id', req.params.id).then(function (results) {
            (0, _utils.addToResponse)(res, results[0], 'result');
            return (0, _utils.nextAndReturn)(next)(results[0]);
          });
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiVGFibGVDb250cm9sbGVyIiwic2V0dGluZ3MiLCJyZXEiLCJyZXMiLCJuZXh0IiwibGVuZ3RoIiwidXNlclJvbGVzIiwidXNlciIsInJvbGVzIiwidGFibGUiLCJmaWx0ZXIiLCJ0YWJsZUl0ZW0iLCJuYW1lIiwicGFyYW1zIiwiY29sdW1ucyIsIkh0dHBFeGNlcHRpb24iLCJkYXRhYmFzZSIsImRiIiwic2VsZWN0IiwiZnJvbSIsIm9mZnNldCIsInF1ZXJ5IiwicGFnZSIsImxpbWl0IiwidGhlbiIsInJlc3VsdHMiLCJob29rcyIsImdldFRhYmxlRGF0YSIsImFmdGVyIiwicmVzdWx0c0JlZm9yZUdldCIsImdldFRhYmxlQ291bnQiLCJjb3VudCIsInJlcXVlc3RlZENvbHVtbnMiLCJjb2x1bW4iLCJ2aXNpYmxlIiwiZGV0YWlsIiwibWFwIiwid2hlcmUiLCJpZCIsImluc2VydCIsImJvZHkiLCJkYXRhIiwidXBkYXRlIiwiZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLEtBQUssR0FBRyxvQkFBTSw0QkFBTixDQUFkOztJQUVNQyxlOzs7QUFFSiw2QkFBYztBQUFBOztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7OzttQ0FFcUJDLEcsRUFBaUJDLEcsRUFBa0JDLEksRUFBb0I7QUFDM0UsVUFBSSxDQUFDLEtBQUtILFFBQU4sSUFBa0IsS0FBS0EsUUFBTCxDQUFjSSxNQUFkLEtBQXlCLENBQS9DLEVBQWtEO0FBQ2hELGNBQU0sdUJBQVcsaUJBQVgsRUFBOEIsR0FBOUIsQ0FBTjtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUlDLFNBQW1CLEdBQUcsRUFB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QUE0RHhDLEdBQUcsQ0FBQ3NDLElBQUosQ0FBU0MsSUFBckUsRUFBMkVqQixJQUEzRSxDQUNFLFVBQUNDLE9BQUQsRUFBYTtBQUNYLG9DQUFjdEIsR0FBZCxFQUFtQnNCLE9BQW5CLEVBQTRCLFNBQTVCO0FBQ0EsaUJBQU8sMEJBQWNyQixJQUFkLEVBQW9CcUIsT0FBcEIsQ0FBUDtBQUNELFNBSkg7QUFNRCxPQVBELE1BT087QUFDTCxvQ0FBZ0JyQixJQUFoQixFQUFzQixJQUFJVyxvQkFBSixDQUFrQixHQUFsQixFQUF1QixhQUF2QixDQUF0QjtBQUNEO0FBQ0Y7Ozs4QkFFZ0JiLEcsRUFBY0MsRyxFQUFrQkMsSSxFQUFvQjtBQUNuRSxVQUFJWSxZQUFTQyxFQUFiLEVBQWlCO0FBQ2ZELG9CQUFTQyxFQUFULENBQVlmLEdBQUcsQ0FBQ1csTUFBSixDQUFXSixLQUF2QixFQUE4QjRCLEtBQTlCLENBQW9DLElBQXBDLEVBQTBDbkMsR0FBRyxDQUFDVyxNQUFKLENBQVd5QixFQUFyRCxFQUF5REssR0FBekQsR0FBK0RuQixJQUEvRCxDQUNFLFVBQUNDLE9BQUQsRUFBYTtBQUNYLG9DQUFjdEIsR0FBZCxFQUFtQnNCLE9BQW5CLEVBQTRCLFNBQTVCO0FBQ0EsaUJBQU8sMEJBQWNyQixJQUFkLEVBQW9CcUIsT0FBcEIsQ0FBUDtBQUNELFNBSkg7QUFNRCxPQVBELE1BT087QUFDTCxvQ0FBZ0JyQixJQUFoQixFQUFzQixJQUFJVyxvQkFBSixDQUFrQixHQUFsQixFQUF1QixhQUF2QixDQUF0QjtBQUNEO0FBQ0Y7Ozs7OztlQUdZZixlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRhdGFiYXNlIGZyb20gJ0Byb290L2FwaS9kYidcbmltcG9ydCB7IEh0dHBFeGNlcHRpb24sIElNQ1JlcXVlc3QsIElNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IGFkZFRvUmVzcG9uc2UsIGJ1aWxkRXJyb3IsIGNhdGNoTWlkZGxld2FyZSwgaGFzQXV0aG9yaXphdGlvbiwgbmV4dEFuZFJldHVybiB9IGZyb20gJ0Byb290L2FwaS91dGlscydcbmltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCB7IElUYWJsZUluZm8gfSBmcm9tICdAcm9vdC9jb25maWdHZW5lcmF0b3InXG5pbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QgfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdmdW5mdW56bWM6Y29udHJvbGxlci10YWJsZScpXG5cbmNsYXNzIFRhYmxlQ29udHJvbGxlciB7XG4gIHB1YmxpYyBzZXR0aW5nczogSVRhYmxlSW5mb1tdXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGRlYnVnKCdDcmVhdGVkJylcbiAgICB0aGlzLnNldHRpbmdzID0gY29uZmlnKCkuc2V0dGluZ3NcbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWJsZUNvbmZpZyhyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgYnVpbGRFcnJvcignVGFibGUgbm90IGZvdW5kJywgNDA0KVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdXNlclJvbGVzOiBzdHJpbmdbXSA9IFtdXG4gICAgICBpZiAocmVxLnVzZXIgJiYgcmVxLnVzZXIucm9sZXMpIHtcbiAgICAgICAgdXNlclJvbGVzID0gcmVxLnVzZXIucm9sZXNcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFibGUgPSB0aGlzLnNldHRpbmdzLmZpbHRlcihcbiAgICAgICAgKHRhYmxlSXRlbSkgPT4gdGFibGVJdGVtLm5hbWUgPT09IHJlcS5wYXJhbXMudGFibGVcbiAgICAgIClbMF1cblxuICAgICAgaWYgKGhhc0F1dGhvcml6YXRpb24odGFibGUucm9sZXMsIHVzZXJSb2xlcykpIHtcbiAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHRhYmxlLmNvbHVtbnMsICdyZXN1bHRzJylcbiAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkodGFibGUuY29sdW1ucylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDAxLCAnTm90IGF1dGhvcml6ZWQnKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVEYXRhKHJlcTogSU1DUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBidWlsZEVycm9yKCdUYWJsZSBub3QgZm91bmQnLCA0MDQpXG4gICAgfVxuXG4gICAgY29uc3QgdGFibGUgPSB0aGlzLnNldHRpbmdzLmZpbHRlcihcbiAgICAgICh0YWJsZUl0ZW0pID0+IHRhYmxlSXRlbS5uYW1lID09PSByZXEucGFyYW1zLnRhYmxlXG4gICAgKVswXVxuXG4gICAgbGV0IHVzZXJSb2xlczogc3RyaW5nW10gPSBbXVxuICAgIGlmIChyZXEudXNlciAmJiByZXEudXNlci5yb2xlcykge1xuICAgICAgdXNlclJvbGVzID0gcmVxLnVzZXIucm9sZXNcbiAgICB9XG5cbiAgICBpZiAoIWhhc0F1dGhvcml6YXRpb24odGFibGUucm9sZXMsIHVzZXJSb2xlcykpIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDAxLCAnTm90IGF1dGhvcml6ZWQnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFkYXRhYmFzZS5kYikge1xuICAgICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZGF0YWJhc2UuZGIuc2VsZWN0KCcqJykuZnJvbShyZXEucGFyYW1zLnRhYmxlKS5vZmZzZXQoKHJlcS5xdWVyeS5wYWdlIHx8IDApICogMTApLmxpbWl0KDEwKS50aGVuKFxuICAgICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGFibGUuaG9va3MgJiYgdGFibGUuaG9va3MuZ2V0VGFibGVEYXRhICYmIHRhYmxlLmhvb2tzLmdldFRhYmxlRGF0YS5hZnRlcikge1xuICAgICAgICAgICAgICBpZiAoZGF0YWJhc2UuZGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUuaG9va3MuZ2V0VGFibGVEYXRhLmFmdGVyKHJlcSwgcmVzLCBkYXRhYmFzZS5kYiwgdGFibGUubmFtZSwgcmVzdWx0cykudGhlbihcbiAgICAgICAgICAgICAgICAgIChyZXN1bHRzQmVmb3JlR2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCByZXN1bHRzQmVmb3JlR2V0LCAncmVzdWx0cycpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHNCZWZvcmVHZXQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWJsZUNvdW50KHJlcTogSU1DUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBidWlsZEVycm9yKCdUYWJsZSBub3QgZm91bmQnLCA0MDQpXG4gICAgfVxuXG4gICAgY29uc3QgdGFibGUgPSB0aGlzLnNldHRpbmdzLmZpbHRlcihcbiAgICAgICh0YWJsZUl0ZW0pID0+IHRhYmxlSXRlbS5uYW1lID09PSByZXEucGFyYW1zLnRhYmxlXG4gICAgKVswXVxuXG4gICAgbGV0IHVzZXJSb2xlczogc3RyaW5nW10gPSBbXVxuICAgIGlmIChyZXEudXNlciAmJiByZXEudXNlci5yb2xlcykge1xuICAgICAgdXNlclJvbGVzID0gcmVxLnVzZXIucm9sZXNcbiAgICB9XG5cbiAgICBpZiAoIWhhc0F1dGhvcml6YXRpb24odGFibGUucm9sZXMsIHVzZXJSb2xlcykpIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDAxLCAnTm90IGF1dGhvcml6ZWQnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFkYXRhYmFzZS5kYikge1xuICAgICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZGF0YWJhc2UuZGIuc2VsZWN0KCcqJykuZnJvbShyZXEucGFyYW1zLnRhYmxlKS50aGVuKFxuICAgICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBpZiAodGFibGUuaG9va3MgJiYgdGFibGUuaG9va3MuZ2V0VGFibGVDb3VudCAmJiB0YWJsZS5ob29rcy5nZXRUYWJsZUNvdW50LmFmdGVyKSB7XG4gICAgICAgICAgICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5ob29rcy5nZXRUYWJsZUNvdW50LmFmdGVyKHJlcSwgcmVzLCBkYXRhYmFzZS5kYiwgdGFibGUubmFtZSwgcmVzdWx0cykudGhlbihcbiAgICAgICAgICAgICAgICAgIChjb3VudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgY291bnQsICdjb3VudCcpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKGNvdW50KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMubGVuZ3RoLCAnY291bnQnKVxuICAgICAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRSb3cocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IGJ1aWxkRXJyb3IoJ1RhYmxlIG5vdCBmb3VuZCcsIDQwNClcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZSA9IHRoaXMuc2V0dGluZ3MuZmlsdGVyKFxuICAgICAgKHRhYmxlSXRlbSkgPT4gdGFibGVJdGVtLm5hbWUgPT09IHJlcS5wYXJhbXMudGFibGVcbiAgICApWzBdXG5cbiAgICBsZXQgdXNlclJvbGVzOiBzdHJpbmdbXSA9IFtdXG4gICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgIH1cblxuICAgIGlmICghaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgdXNlclJvbGVzKSkge1xuICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig0MDEsICdOb3QgYXV0aG9yaXplZCcpKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWRhdGFiYXNlLmRiKSB7XG4gICAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RlZENvbHVtbnMgPSB0YWJsZS5jb2x1bW5zLmZpbHRlcihcbiAgICAgICAgICAoY29sdW1uKSA9PiBjb2x1bW4udmlzaWJsZS5kZXRhaWxcbiAgICAgICAgKS5tYXAoXG4gICAgICAgICAgKGNvbHVtbikgPT4gY29sdW1uLm5hbWVcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gZGF0YWJhc2UuZGIuc2VsZWN0KHJlcXVlc3RlZENvbHVtbnMpXG4gICAgICAgICAgLmZyb20ocmVxLnBhcmFtcy50YWJsZSlcbiAgICAgICAgICAud2hlcmUoJ2lkJywgcmVxLnBhcmFtcy5pZClcbiAgICAgICAgLnRoZW4oXG4gICAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCByZXN1bHRzWzBdLCAncmVzdWx0JylcbiAgICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHNbMF0pXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc2VydFJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLnBhcmFtcy50YWJsZSkuaW5zZXJ0KHJlcS5ib2R5LmRhdGEpLnRoZW4oXG4gICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMsICdyZXN1bHRzJylcbiAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVSb3cocmVxOiBSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoZGF0YWJhc2UuZGIpIHtcbiAgICAgIGRhdGFiYXNlLmRiKHJlcS5ib2R5LnRhYmxlKS53aGVyZSgnaWQnLCByZXEuYm9keS5pZCkudXBkYXRlKHJlcS5ib2R5LmRhdGEpLnRoZW4oXG4gICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMsICdyZXN1bHRzJylcbiAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZWxldGVSb3cocmVxOiBSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoZGF0YWJhc2UuZGIpIHtcbiAgICAgIGRhdGFiYXNlLmRiKHJlcS5wYXJhbXMudGFibGUpLndoZXJlKCdpZCcsIHJlcS5wYXJhbXMuaWQpLmRlbCgpLnRoZW4oXG4gICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMsICdyZXN1bHRzJylcbiAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYWJsZUNvbnRyb2xsZXJcbiJdfQ==