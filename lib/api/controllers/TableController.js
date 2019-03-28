"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../db"));

var _types = require("../types");

var _utils = require("../utils");

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var debug = (0, _debug.default)('funfunzmc:controller-table');

var TableController =
/*#__PURE__*/
function () {
  function TableController() {
    _classCallCheck(this, TableController);

    debug('Created');
  }

  _createClass(TableController, [{
    key: "getTableConfig",
    value: function getTableConfig(req, res, next) {
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      var TABLE_CONFIG = (0, _utils.getTableConfig)(req.params.table);

      if ((0, _utils.hasAuthorization)(TABLE_CONFIG.roles, userRoles)) {
        (0, _utils.addToResponse)(res, 'results')(TABLE_CONFIG.columns);
        return (0, _utils.nextAndReturn)(next)(TABLE_CONFIG.columns);
      } else {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      }
    }
  }, {
    key: "getTableData",
    value: function getTableData(req, res, next) {
      var PAGE_NUMBER = req.query.page;
      var LIMIT = 10;
      var TABLE_NAME = req.params.table;
      var TABLE_CONFIG = (0, _utils.getTableConfig)(TABLE_NAME);
      var COLUMNS = (0, _utils.filterTableColumns)(TABLE_CONFIG, 'main');
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      if (!(0, _utils.hasAuthorization)(TABLE_CONFIG.roles, userRoles)) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      } else {
        if (!_db.default.db) {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
        } else {
          return _db.default.db.select(COLUMNS).from(TABLE_NAME).offset((PAGE_NUMBER || 0) * LIMIT).limit(LIMIT).then(function (results) {
            (0, _utils.runHook)(TABLE_CONFIG, 'getTableData', 'after', req, res, _db.default.db, results).then((0, _utils.addToResponse)(res, 'results')).then((0, _utils.nextAndReturn)(next));
          });
        }
      }
    }
  }, {
    key: "getTableCount",
    value: function getTableCount(req, res, next) {
      var TABLE_NAME = req.params.table;
      var TABLE_CONFIG = (0, _utils.getTableConfig)(TABLE_NAME);
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      if (!(0, _utils.hasAuthorization)(TABLE_CONFIG.roles, userRoles)) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      } else {
        if (!_db.default.db) {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
        } else {
          return _db.default.db.select('*').from(TABLE_NAME).then(function (results) {
            (0, _utils.runHook)(TABLE_CONFIG, 'getTableCount', 'after', req, res, _db.default.db, results).then((0, _utils.addToResponse)(res, 'count')).then((0, _utils.nextAndReturn)(next));
          });
        }
      }
    }
  }, {
    key: "getRow",
    value: function getRow(req, res, next) {
      var _this = this;

      var TABLE_NAME = req.params.table;
      var TABLE_CONFIG = (0, _utils.getTableConfig)(TABLE_NAME);
      var userRoles = [];

      if (req.user && req.user.roles) {
        userRoles = req.user.roles;
      }

      if (!(0, _utils.hasAuthorization)(TABLE_CONFIG.roles, userRoles)) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(401, 'Not authorized'));
      } else {
        if (!_db.default.db) {
          return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
        } else {
          var requestedColumns = (0, _utils.filterTableColumns)(TABLE_CONFIG, 'detail');

          var query = _db.default.db.select(requestedColumns).from("".concat(req.params.table)).where("id", req.params.id);

          return query.then(function (results) {
            var relationQueries = [];

            if (req.query.includeRelations) {
              relationQueries = _this.getRelationQueries(TABLE_CONFIG, results[0].id);
            }

            if (relationQueries.length) {
              return Promise.all([results[0]].concat(_toConsumableArray(relationQueries)));
            }

            return Promise.all([results[0]]);
          }).then(this.mergeRelatedData).then((0, _utils.addToResponse)(res, 'result')).then((0, _utils.nextAndReturn)(next));
        }
      }
    }
  }, {
    key: "insertRow",
    value: function insertRow(req, res, next) {
      if (!_db.default.db) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      } else {
        return _db.default.db(req.params.table).insert(req.body.data).then((0, _utils.addToResponse)(res, 'results')).then((0, _utils.nextAndReturn)(next));
      }
    }
  }, {
    key: "updateRow",
    value: function updateRow(req, res, next) {
      if (!_db.default.db) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      } else {
        return _db.default.db(req.body.table).where('id', req.body.id).update(req.body.data).then((0, _utils.addToResponse)(res, 'results')).then((0, _utils.nextAndReturn)(next));
      }
    }
  }, {
    key: "deleteRow",
    value: function deleteRow(req, res, next) {
      if (!_db.default.db) {
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(500, 'No database'));
      } else {
        return _db.default.db(req.params.table).where('id', req.params.id).del().then((0, _utils.addToResponse)(res, 'results')).then((0, _utils.nextAndReturn)(next));
      }
    }
  }, {
    key: "getRelationQueries",
    value: function getRelationQueries(TABLE_CONFIG, parentId) {
      var _this2 = this;

      var relationQueries = [];

      if (TABLE_CONFIG.relations && TABLE_CONFIG.relations.manyToOne) {
        var MANY_TO_ONE = TABLE_CONFIG.relations.manyToOne;
        var KEYS = Object.keys(MANY_TO_ONE);
        KEYS.forEach(function (tableName) {
          relationQueries.push(_this2.getRelatedRow(tableName, MANY_TO_ONE[tableName], parentId));
        });
      }

      return relationQueries;
    }
  }, {
    key: "getRelatedRow",
    value: function getRelatedRow(tableName, columnName, parentId) {
      if (!_db.default.db) {
        throw new _types.HttpException(500, 'No database');
      }

      var TABLE_NAME = tableName;
      var TABLE_CONFIG = (0, _utils.getTableConfig)(TABLE_NAME);
      var requestedColumns = (0, _utils.filterTableColumns)(TABLE_CONFIG, 'detail');
      return _db.default.db.select(requestedColumns).from(tableName).where(columnName, parentId).then(function (results) {
        return {
          results: results,
          tableName: tableName
        };
      });
    }
  }, {
    key: "mergeRelatedData",
    value: function mergeRelatedData(_ref) {
      var _ref2 = _toArray(_ref),
          results = _ref2[0],
          relations = _ref2.slice(1);

      if (relations && relations.length) {
        relations.forEach(function (relation) {
          results[relation.tableName] = relation.results;
        });
      }

      return results;
    }
  }]);

  return TableController;
}();

var _default = TableController;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiVGFibGVDb250cm9sbGVyIiwicmVxIiwicmVzIiwibmV4dCIsInVzZXJSb2xlcyIsInVzZXIiLCJyb2xlcyIsIlRBQkxFX0NPTkZJRyIsInBhcmFtcyIsInRhYmxlIiwiY29sdW1ucyIsIkh0dHBFeGNlcHRpb24iLCJQQUdFX05VTUJFUiIsInF1ZXJ5IiwicGFnZSIsIkxJTUlUIiwiVEFCTEVfTkFNRSIsIkNPTFVNTlMiLCJkYXRhYmFzZSIsImRiIiwic2VsZWN0IiwiZnJvbSIsIm9mZnNldCIsImxpbWl0IiwidGhlbiIsInJlc3VsdHMiLCJyZXF1ZXN0ZWRDb2x1bW5zIiwid2hlcmUiLCJpZCIsInJlbGF0aW9uUXVlcmllcyIsImluY2x1ZGVSZWxhdGlvbnMiLCJnZXRSZWxhdGlvblF1ZXJpZXMiLCJsZW5ndGgiLCJQcm9taXNlIiwiYWxsIiwibWVyZ2VSZWxhdGVkRGF0YSIsImluc2VydCIsImJvZHkiLCJkYXRhIiwidXBkYXRlIiwiZGVsIiwicGFyZW50SWQiLCJyZWxhdGlvbnMiLCJtYW55VG9PbmUiLCJNQU5ZX1RPX09ORSIsIktFWVMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInRhYmxlTmFtZSIsInB1c2giLCJnZXRSZWxhdGVkUm93IiwiY29sdW1uTmFtZSIsInJlbGF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBV0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLEtBQUssR0FBRyxvQkFBTSw0QkFBTixDQUFkOztJQUVNQyxlOzs7QUFDSiw2QkFBYztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0Q7Ozs7bUNBRXFCRSxHLEVBQWlCQyxHLEVBQWtCQyxJLEVBQW9CO0FBQzNFLFVBQUlDLFNBQW1CLEdBQUcsRUFBMUI7O0FBQ0EsVUFBSUgs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T1osZUFBUDtBQUNEOzs7a0NBRXFCb0IsUyxFQUFtQkcsVSxFQUFvQlgsUSxFQUFlO0FBQzFFLFVBQUksQ0FBQ3ZCLFlBQVNDLEVBQWQsRUFBa0I7QUFDaEIsY0FBTSxJQUFJUixvQkFBSixDQUFrQixHQUFsQixFQUF1QixhQUF2QixDQUFOO0FBQ0Q7O0FBQ0QsVUFBTUssVUFBVSxHQUFHaUMsU0FBbkI7QUFDQSxVQUFNMUMsWUFBWSxHQUFHLDJCQUFlUyxVQUFmLENBQXJCO0FBRUEsVUFBTVUsZ0JBQWdCLEdBQUcsK0JBQW1CbkIsWUFBbkIsRUFBaUMsUUFBakMsQ0FBekI7QUFDQSxhQUFPVyxZQUFTQyxFQUFULENBQVlDLE1BQVosQ0FBbUJNLGdCQUFuQixFQUNKTCxJQURJLENBQ0M0QixTQURELEVBRUp0QixLQUZJLENBRUV5QixVQUZGLEVBRWNYLFFBRmQsRUFFd0JqQixJQUZ4QixDQUdILFVBQUNDLE9BQUQ7QUFBQSxlQUFjO0FBQ1pBLFVBQUFBLE9BQU8sRUFBUEEsT0FEWTtBQUVad0IsVUFBQUEsU0FBUyxFQUFUQTtBQUZZLFNBQWQ7QUFBQSxPQUhHLENBQVA7QUFRRDs7OzJDQUVzRDtBQUFBO0FBQUEsVUFBN0J4QixPQUE2QjtBQUFBLFVBQWpCaUIsU0FBaUI7O0FBQ3JELFVBQUlBLFNBQVMsSUFBSUEsU0FBUyxDQUFDVixNQUEzQixFQUFtQztBQUNqQ1UsUUFBQUEsU0FBUyxDQUFDTSxPQUFWLENBQ0UsVUFBQ0ssUUFBRCxFQUFtRDtBQUNqRDVCLFVBQUFBLE9BQU8sQ0FBQzRCLFFBQVEsQ0FBQ0osU0FBVixDQUFQLEdBQThCSSxRQUFRLENBQUM1QixPQUF2QztBQUNELFNBSEg7QUFLRDs7QUFFRCxhQUFPQSxPQUFQO0FBQ0Q7Ozs7OztlQUdZekIsZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhYmFzZSBmcm9tICdAcm9vdC9hcGkvZGInXG5pbXBvcnQgeyBIdHRwRXhjZXB0aW9uLCBJTUNSZXF1ZXN0LCBJTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcydcbmltcG9ydCB7XG4gIGFkZFRvUmVzcG9uc2UsXG4gIGNhdGNoTWlkZGxld2FyZSxcbiAgZmlsdGVyVGFibGVDb2x1bW5zLFxuICBnZXRUYWJsZUNvbmZpZyxcbiAgaGFzQXV0aG9yaXphdGlvbixcbiAgbmV4dEFuZFJldHVybixcbiAgcnVuSG9va1xufSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgeyBJVGFibGVJbmZvIH0gZnJvbSAnQHJvb3QvY29uZmlnR2VuZXJhdG9yJ1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmNvbnRyb2xsZXItdGFibGUnKVxuXG5jbGFzcyBUYWJsZUNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBkZWJ1ZygnQ3JlYXRlZCcpXG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVDb25maWcocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBsZXQgdXNlclJvbGVzOiBzdHJpbmdbXSA9IFtdXG4gICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgIH1cblxuICAgIGNvbnN0IFRBQkxFX0NPTkZJRyA9IGdldFRhYmxlQ29uZmlnKHJlcS5wYXJhbXMudGFibGUpXG5cbiAgICBpZiAoaGFzQXV0aG9yaXphdGlvbihUQUJMRV9DT05GSUcucm9sZXMsIHVzZXJSb2xlcykpIHtcbiAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCAncmVzdWx0cycpKFRBQkxFX0NPTkZJRy5jb2x1bW5zKVxuICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkoVEFCTEVfQ09ORklHLmNvbHVtbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDAxLCAnTm90IGF1dGhvcml6ZWQnKSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVEYXRhKHJlcTogSU1DUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgUEFHRV9OVU1CRVIgPSByZXEucXVlcnkucGFnZVxuICAgIGNvbnN0IExJTUlUID0gMTBcbiAgICBjb25zdCBUQUJMRV9OQU1FID0gcmVxLnBhcmFtcy50YWJsZVxuXG4gICAgY29uc3QgVEFCTEVfQ09ORklHID0gZ2V0VGFibGVDb25maWcoVEFCTEVfTkFNRSlcblxuICAgIGNvbnN0IENPTFVNTlMgPSBmaWx0ZXJUYWJsZUNvbHVtbnMoVEFCTEVfQ09ORklHLCAnbWFpbicpXG5cbiAgICBsZXQgdXNlclJvbGVzOiBzdHJpbmdbXSA9IFtdXG4gICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgIH1cblxuICAgIGlmICghaGFzQXV0aG9yaXphdGlvbihUQUJMRV9DT05GSUcucm9sZXMsIHVzZXJSb2xlcykpIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDAxLCAnTm90IGF1dGhvcml6ZWQnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFkYXRhYmFzZS5kYikge1xuICAgICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZGF0YWJhc2UuZGIuc2VsZWN0KENPTFVNTlMpLmZyb20oVEFCTEVfTkFNRSkub2Zmc2V0KChQQUdFX05VTUJFUiB8fCAwKSAqIExJTUlUKS5saW1pdChMSU1JVCkudGhlbihcbiAgICAgICAgICAocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgcnVuSG9vayhUQUJMRV9DT05GSUcsICdnZXRUYWJsZURhdGEnLCAnYWZ0ZXInLCByZXEsIHJlcywgZGF0YWJhc2UuZGIsIHJlc3VsdHMpLnRoZW4oXG4gICAgICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCAncmVzdWx0cycpXG4gICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgIG5leHRBbmRSZXR1cm4obmV4dClcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVDb3VudChyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGNvbnN0IFRBQkxFX05BTUUgPSByZXEucGFyYW1zLnRhYmxlXG4gICAgY29uc3QgVEFCTEVfQ09ORklHID0gZ2V0VGFibGVDb25maWcoVEFCTEVfTkFNRSlcblxuICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICBpZiAocmVxLnVzZXIgJiYgcmVxLnVzZXIucm9sZXMpIHtcbiAgICAgIHVzZXJSb2xlcyA9IHJlcS51c2VyLnJvbGVzXG4gICAgfVxuXG4gICAgaWYgKCFoYXNBdXRob3JpemF0aW9uKFRBQkxFX0NPTkZJRy5yb2xlcywgdXNlclJvbGVzKSkge1xuICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig0MDEsICdOb3QgYXV0aG9yaXplZCcpKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWRhdGFiYXNlLmRiKSB7XG4gICAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkYXRhYmFzZS5kYi5zZWxlY3QoJyonKS5mcm9tKFRBQkxFX05BTUUpLnRoZW4oXG4gICAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIHJ1bkhvb2soVEFCTEVfQ09ORklHLCAnZ2V0VGFibGVDb3VudCcsICdhZnRlcicsIHJlcSwgcmVzLCBkYXRhYmFzZS5kYiwgcmVzdWx0cykudGhlbihcbiAgICAgICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsICdjb3VudCcpXG4gICAgICAgICAgICApLnRoZW4oXG4gICAgICAgICAgICAgIG5leHRBbmRSZXR1cm4obmV4dClcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0Um93KHJlcTogSU1DUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgVEFCTEVfTkFNRSA9IHJlcS5wYXJhbXMudGFibGVcbiAgICBjb25zdCBUQUJMRV9DT05GSUcgPSBnZXRUYWJsZUNvbmZpZyhUQUJMRV9OQU1FKVxuXG4gICAgbGV0IHVzZXJSb2xlczogc3RyaW5nW10gPSBbXVxuICAgIGlmIChyZXEudXNlciAmJiByZXEudXNlci5yb2xlcykge1xuICAgICAgdXNlclJvbGVzID0gcmVxLnVzZXIucm9sZXNcbiAgICB9XG5cbiAgICBpZiAoIWhhc0F1dGhvcml6YXRpb24oVEFCTEVfQ09ORklHLnJvbGVzLCB1c2VyUm9sZXMpKSB7XG4gICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDQwMSwgJ05vdCBhdXRob3JpemVkJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZGF0YWJhc2UuZGIpIHtcbiAgICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVxdWVzdGVkQ29sdW1ucyA9IGZpbHRlclRhYmxlQ29sdW1ucyhUQUJMRV9DT05GSUcsICdkZXRhaWwnKVxuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gZGF0YWJhc2UuZGIuc2VsZWN0KHJlcXVlc3RlZENvbHVtbnMpXG4gICAgICAgICAgLmZyb20oYCR7cmVxLnBhcmFtcy50YWJsZX1gKVxuICAgICAgICAgIC53aGVyZShgaWRgLCByZXEucGFyYW1zLmlkKVxuXG4gICAgICAgIHJldHVybiBxdWVyeS50aGVuKFxuICAgICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVsYXRpb25RdWVyaWVzOiBBcnJheTxCbHVlYmlyZDx7fT4+ID0gW11cbiAgICAgICAgICAgIGlmIChyZXEucXVlcnkuaW5jbHVkZVJlbGF0aW9ucykge1xuICAgICAgICAgICAgICByZWxhdGlvblF1ZXJpZXMgPSB0aGlzLmdldFJlbGF0aW9uUXVlcmllcyhUQUJMRV9DT05GSUcsIHJlc3VsdHNbMF0uaWQpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWxhdGlvblF1ZXJpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgICAgcmVzdWx0c1swXSxcbiAgICAgICAgICAgICAgICAuLi5yZWxhdGlvblF1ZXJpZXMsXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAgIHJlc3VsdHNbMF0sXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIH1cbiAgICAgICAgKS50aGVuKFxuICAgICAgICAgIHRoaXMubWVyZ2VSZWxhdGVkRGF0YVxuICAgICAgICApLnRoZW4oXG4gICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsICdyZXN1bHQnKVxuICAgICAgICApLnRoZW4oXG4gICAgICAgICAgbmV4dEFuZFJldHVybihuZXh0KVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc2VydFJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghZGF0YWJhc2UuZGIpIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGFiYXNlLmRiKHJlcS5wYXJhbXMudGFibGUpLmluc2VydChyZXEuYm9keS5kYXRhKS50aGVuKFxuICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgJ3Jlc3VsdHMnKVxuICAgICAgKS50aGVuKFxuICAgICAgICBuZXh0QW5kUmV0dXJuKG5leHQpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghZGF0YWJhc2UuZGIpIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGFiYXNlLmRiKHJlcS5ib2R5LnRhYmxlKS53aGVyZSgnaWQnLCByZXEuYm9keS5pZCkudXBkYXRlKHJlcS5ib2R5LmRhdGEpLnRoZW4oXG4gICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCAncmVzdWx0cycpXG4gICAgICApLnRoZW4oXG4gICAgICAgIG5leHRBbmRSZXR1cm4obmV4dClcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGVsZXRlUm93KHJlcTogUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKCFkYXRhYmFzZS5kYikge1xuICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGF0YWJhc2UuZGIocmVxLnBhcmFtcy50YWJsZSkud2hlcmUoJ2lkJywgcmVxLnBhcmFtcy5pZCkuZGVsKCkudGhlbihcbiAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsICdyZXN1bHRzJylcbiAgICAgICkudGhlbihcbiAgICAgICAgbmV4dEFuZFJldHVybihuZXh0KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVsYXRpb25RdWVyaWVzKFRBQkxFX0NPTkZJRzogSVRhYmxlSW5mbywgcGFyZW50SWQ6IGFueSkge1xuICAgIGNvbnN0IHJlbGF0aW9uUXVlcmllczogQXJyYXk8Qmx1ZWJpcmQ8e30+PiA9IFtdXG4gICAgaWYgKFRBQkxFX0NPTkZJRy5yZWxhdGlvbnMgJiYgVEFCTEVfQ09ORklHLnJlbGF0aW9ucy5tYW55VG9PbmUpIHtcbiAgICAgIGNvbnN0IE1BTllfVE9fT05FID0gVEFCTEVfQ09ORklHLnJlbGF0aW9ucy5tYW55VG9PbmVcbiAgICAgIGNvbnN0IEtFWVM6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoTUFOWV9UT19PTkUpXG4gICAgICBLRVlTLmZvckVhY2goXG4gICAgICAgICh0YWJsZU5hbWUpID0+IHtcbiAgICAgICAgICByZWxhdGlvblF1ZXJpZXMucHVzaChcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVsYXRlZFJvdyhcbiAgICAgICAgICAgICAgdGFibGVOYW1lLFxuICAgICAgICAgICAgICBNQU5ZX1RPX09ORVt0YWJsZU5hbWVdLFxuICAgICAgICAgICAgICBwYXJlbnRJZFxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiByZWxhdGlvblF1ZXJpZXNcbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVsYXRlZFJvdyh0YWJsZU5hbWU6IHN0cmluZywgY29sdW1uTmFtZTogc3RyaW5nLCBwYXJlbnRJZDogYW55KSB7XG4gICAgaWYgKCFkYXRhYmFzZS5kYikge1xuICAgICAgdGhyb3cgbmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKVxuICAgIH1cbiAgICBjb25zdCBUQUJMRV9OQU1FID0gdGFibGVOYW1lXG4gICAgY29uc3QgVEFCTEVfQ09ORklHID0gZ2V0VGFibGVDb25maWcoVEFCTEVfTkFNRSlcblxuICAgIGNvbnN0IHJlcXVlc3RlZENvbHVtbnMgPSBmaWx0ZXJUYWJsZUNvbHVtbnMoVEFCTEVfQ09ORklHLCAnZGV0YWlsJylcbiAgICByZXR1cm4gZGF0YWJhc2UuZGIuc2VsZWN0KHJlcXVlc3RlZENvbHVtbnMpXG4gICAgICAuZnJvbSh0YWJsZU5hbWUpXG4gICAgICAud2hlcmUoY29sdW1uTmFtZSwgcGFyZW50SWQpLnRoZW4oXG4gICAgICAgIChyZXN1bHRzKSA9PiAoe1xuICAgICAgICAgIHJlc3VsdHMsXG4gICAgICAgICAgdGFibGVOYW1lLFxuICAgICAgICB9KVxuICAgICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBtZXJnZVJlbGF0ZWREYXRhKFtyZXN1bHRzLCAuLi5yZWxhdGlvbnNdOiBhbnkpIHtcbiAgICBpZiAocmVsYXRpb25zICYmIHJlbGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJlbGF0aW9ucy5mb3JFYWNoKFxuICAgICAgICAocmVsYXRpb246IHt0YWJsZU5hbWU6IHN0cmluZywgcmVzdWx0czogYW55W119KSA9PiB7XG4gICAgICAgICAgcmVzdWx0c1tyZWxhdGlvbi50YWJsZU5hbWVdID0gcmVsYXRpb24ucmVzdWx0c1xuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHNcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYWJsZUNvbnRyb2xsZXJcbiJdfQ==