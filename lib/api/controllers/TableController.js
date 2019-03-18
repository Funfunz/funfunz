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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiVGFibGVDb250cm9sbGVyIiwic2V0dGluZ3MiLCJyZXEiLCJyZXMiLCJuZXh0IiwibGVuZ3RoIiwidXNlclJvbGVzIiwidXNlciIsInJvbGVzIiwidGFibGUiLCJmaWx0ZXIiLCJ0YWJsZUl0ZW0iLCJuYW1lIiwicGFyYW1zIiwiY29sdW1ucyIsIkh0dHBFeGNlcHRpb24iLCJkYXRhYmFzZSIsImRiIiwic2VsZWN0IiwiZnJvbSIsIm9mZnNldCIsInF1ZXJ5IiwicGFnZSIsImxpbWl0IiwidGhlbiIsInJlc3VsdHMiLCJob29rcyIsImdldFRhYmxlRGF0YSIsImFmdGVyIiwicmVzdWx0c0JlZm9yZUdldCIsImdldFRhYmxlQ291bnQiLCJjb3VudCIsImluc2VydCIsImJvZHkiLCJkYXRhIiwid2hlcmUiLCJpZCIsInVwZGF0ZSIsImRlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7Ozs7Ozs7QUFHQSxJQUFNQSxLQUFLLEdBQUcsb0JBQU0sNEJBQU4sQ0FBZDs7SUFFTUMsZTs7O0FBRUosNkJBQWM7QUFBQTs7QUFBQTs7QUFDWkQsSUFBQUEsS0FBSyxDQUFDLFNBQUQsQ0FBTDtBQUNBLFNBQUtFLFFBQUwsR0FBZ0IsNkJBQVNBLFFBQXpCO0FBQ0Q7Ozs7bUNBRXFCQyxHLEVBQWlCQyxHLEVBQWtCQyxJLEVBQW9CO0FBQzNFLFVBQUksQ0FBQyxLQUFLSCxRQUFOLElBQWtCLEtBQUtBLFFBQUwsQ0FBY0ksTUFBZCxLQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxjQUFNLHVCQUFXLGlCQUFYLEVBQThCLEdBQTlCLENBQU47QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJQyxTQUFtQixHQUFHLEVBQTFCOztBQUNBLFlBQUlKLEdBQUcsQ0FBQ0ssSUFBSixJQUFZTCxHQUFHLENBQUNLLElBQUos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QUosQ0FBV3VCLEVBQXJELEVBQXlERSxHQUF6RCxHQUErRGQsSUFBL0QsQ0FDRSxVQUFDQyxPQUFELEVBQWE7QUFDWCxvQ0FBY3RCLEdBQWQsRUFBbUJzQixPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjckIsSUFBZCxFQUFvQnFCLE9BQXBCLENBQVA7QUFDRCxTQUpIO0FBTUQsT0FQRCxNQU9PO0FBQ0wsb0NBQWdCckIsSUFBaEIsRUFBc0IsSUFBSVcsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7Ozs7ZUFHWWYsZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhYmFzZSBmcm9tICdAcm9vdC9hcGkvZGInXG5pbXBvcnQgeyBIdHRwRXhjZXB0aW9uLCBJTUNSZXF1ZXN0LCBJTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcyc7XG5pbXBvcnQgeyBhZGRUb1Jlc3BvbnNlLCBidWlsZEVycm9yLCBjYXRjaE1pZGRsZXdhcmUsIGhhc0F1dGhvcml6YXRpb24sIG5leHRBbmRSZXR1cm4gfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgeyBJVGFibGVJbmZvIH0gZnJvbSAnQHJvb3QvY29uZmlnR2VuZXJhdG9yJ1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmNvbnRyb2xsZXItdGFibGUnKVxuXG5jbGFzcyBUYWJsZUNvbnRyb2xsZXIge1xuICBwdWJsaWMgc2V0dGluZ3M6IElUYWJsZUluZm9bXVxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBkZWJ1ZygnQ3JlYXRlZCcpXG4gICAgdGhpcy5zZXR0aW5ncyA9IGNvbmZpZygpLnNldHRpbmdzXG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVDb25maWcocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IGJ1aWxkRXJyb3IoJ1RhYmxlIG5vdCBmb3VuZCcsIDQwNClcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHVzZXJSb2xlczogc3RyaW5nW10gPSBbXVxuICAgICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICAgIHVzZXJSb2xlcyA9IHJlcS51c2VyLnJvbGVzXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRhYmxlID0gdGhpcy5zZXR0aW5ncy5maWx0ZXIoXG4gICAgICAgICh0YWJsZUl0ZW0pID0+IHRhYmxlSXRlbS5uYW1lID09PSByZXEucGFyYW1zLnRhYmxlXG4gICAgICApWzBdXG5cbiAgICAgIGlmIChoYXNBdXRob3JpemF0aW9uKHRhYmxlLnJvbGVzLCB1c2VyUm9sZXMpKSB7XG4gICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCB0YWJsZS5jb2x1bW5zLCAncmVzdWx0cycpXG4gICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHRhYmxlLmNvbHVtbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDQwMSwgJ05vdCBhdXRob3JpemVkJykpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFRhYmxlRGF0YShyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgYnVpbGRFcnJvcignVGFibGUgbm90IGZvdW5kJywgNDA0KVxuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlID0gdGhpcy5zZXR0aW5ncy5maWx0ZXIoXG4gICAgICAodGFibGVJdGVtKSA9PiB0YWJsZUl0ZW0ubmFtZSA9PT0gcmVxLnBhcmFtcy50YWJsZVxuICAgIClbMF1cblxuICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICBpZiAocmVxLnVzZXIgJiYgcmVxLnVzZXIucm9sZXMpIHtcbiAgICAgIHVzZXJSb2xlcyA9IHJlcS51c2VyLnJvbGVzXG4gICAgfVxuXG4gICAgaWYgKCFoYXNBdXRob3JpemF0aW9uKHRhYmxlLnJvbGVzLCB1c2VyUm9sZXMpKSB7XG4gICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDQwMSwgJ05vdCBhdXRob3JpemVkJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZGF0YWJhc2UuZGIpIHtcbiAgICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRhdGFiYXNlLmRiLnNlbGVjdCgnKicpLmZyb20ocmVxLnBhcmFtcy50YWJsZSkub2Zmc2V0KChyZXEucXVlcnkucGFnZSB8fCAwKSAqIDEwKS5saW1pdCgxMCkudGhlbihcbiAgICAgICAgICAocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgaWYgKHRhYmxlLmhvb2tzICYmIHRhYmxlLmhvb2tzLmdldFRhYmxlRGF0YSAmJiB0YWJsZS5ob29rcy5nZXRUYWJsZURhdGEuYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLmhvb2tzLmdldFRhYmxlRGF0YS5hZnRlcihyZXEsIHJlcywgZGF0YWJhc2UuZGIsIHRhYmxlLm5hbWUsIHJlc3VsdHMpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAocmVzdWx0c0JlZm9yZUdldCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0c0JlZm9yZUdldCwgJ3Jlc3VsdHMnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShyZXN1bHRzQmVmb3JlR2V0KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHMsICdyZXN1bHRzJylcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkocmVzdWx0cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVDb3VudChyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgYnVpbGRFcnJvcignVGFibGUgbm90IGZvdW5kJywgNDA0KVxuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlID0gdGhpcy5zZXR0aW5ncy5maWx0ZXIoXG4gICAgICAodGFibGVJdGVtKSA9PiB0YWJsZUl0ZW0ubmFtZSA9PT0gcmVxLnBhcmFtcy50YWJsZVxuICAgIClbMF1cblxuICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICBpZiAocmVxLnVzZXIgJiYgcmVxLnVzZXIucm9sZXMpIHtcbiAgICAgIHVzZXJSb2xlcyA9IHJlcS51c2VyLnJvbGVzXG4gICAgfVxuXG4gICAgaWYgKCFoYXNBdXRob3JpemF0aW9uKHRhYmxlLnJvbGVzLCB1c2VyUm9sZXMpKSB7XG4gICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDQwMSwgJ05vdCBhdXRob3JpemVkJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZGF0YWJhc2UuZGIpIHtcbiAgICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRhdGFiYXNlLmRiLnNlbGVjdCgnKicpLmZyb20ocmVxLnBhcmFtcy50YWJsZSkudGhlbihcbiAgICAgICAgICAocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgaWYgKHRhYmxlLmhvb2tzICYmIHRhYmxlLmhvb2tzLmdldFRhYmxlQ291bnQgJiYgdGFibGUuaG9va3MuZ2V0VGFibGVDb3VudC5hZnRlcikge1xuICAgICAgICAgICAgICBpZiAoZGF0YWJhc2UuZGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFibGUuaG9va3MuZ2V0VGFibGVDb3VudC5hZnRlcihyZXEsIHJlcywgZGF0YWJhc2UuZGIsIHRhYmxlLm5hbWUsIHJlc3VsdHMpLnRoZW4oXG4gICAgICAgICAgICAgICAgICAoY291bnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIGNvdW50LCAnY291bnQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KShjb3VudClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCByZXN1bHRzLmxlbmd0aCwgJ2NvdW50JylcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkocmVzdWx0cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0Um93KHJlcTogUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICBkYXRhYmFzZS5kYihyZXEucGFyYW1zLnRhYmxlKS5pbnNlcnQocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLmJvZHkudGFibGUpLndoZXJlKCdpZCcsIHJlcS5ib2R5LmlkKS51cGRhdGUocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRlbGV0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLnBhcmFtcy50YWJsZSkud2hlcmUoJ2lkJywgcmVxLnBhcmFtcy5pZCkuZGVsKCkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlQ29udHJvbGxlclxuIl19