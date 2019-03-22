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
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(404, 'Table not found'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiVGFibGVDb250cm9sbGVyIiwic2V0dGluZ3MiLCJyZXEiLCJyZXMiLCJuZXh0IiwibGVuZ3RoIiwiSHR0cEV4Y2VwdGlvbiIsInVzZXJSb2xlcyIsInVzZXIiLCJyb2xlcyIsInRhYmxlIiwiZmlsdGVyIiwidGFibGVJdGVtIiwibmFtZSIsInBhcmFtcyIsImNvbHVtbnMiLCJkYXRhYmFzZSIsImRiIiwic2VsZWN0IiwiZnJvbSIsIm9mZnNldCIsInF1ZXJ5IiwicGFnZSIsImxpbWl0IiwidGhlbiIsInJlc3VsdHMiLCJob29rcyIsImdldFRhYmxlRGF0YSIsImFmdGVyIiwicmVzdWx0c0JlZm9yZUdldCIsImdldFRhYmxlQ291bnQiLCJjb3VudCIsInJlcXVlc3RlZENvbHVtbnMiLCJjb2x1bW4iLCJ2aXNpYmxlIiwiZGV0YWlsIiwibWFwIiwid2hlcmUiLCJpZCIsImluc2VydCIsImJvZHkiLCJkYXRhIiwidXBkYXRlIiwiZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLEtBQUssR0FBRyxvQkFBTSw0QkFBTixDQUFkOztJQUVNQyxlOzs7QUFFSiw2QkFBYztBQUFBOztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7OzttQ0FFcUJDLEcsRUFBaUJDLEcsRUFBa0JDLEksRUFBb0I7QUFDM0UsVUFBSSxDQUFDLEtBQUtILFFBQU4sSUFBa0IsS0FBS0EsUUFBTCxDQUFjSSxNQUFkLEtBQXlCLENBQS9DLEVBQWtEO0FBQ2hELGVBQU8sNEJBQWdCRCxJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixpQkFBdkIsQ0FBdEIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUlDLFNBQW1CLEdBQUcsRUFBMUI7O0FBQ0EsWUFBSUwsR0FBRyxDQUFDTSxJQUFKLElBQVlOLEdBQUcsQ0FBQ00sSUFBSixDQUFTQyxLQUF6QixFQUFnQztBQUM5QkYsVUFBQUEsU0FBUyxHQUFHTCxHQUFHLENBQUNNLElBQUosQ0FBU0MsS0FBckI7QUFDRDs7QUFFRCxZQUFNQyxLQUFLLEdBQUcsS0FBS1QsUUFBTCxDQUFjVSxNQUFkLENBQ1osVUFBQ0MsU0FBRDtBQUFBLGlCQUFlQSxTQUFTLENBQUNDLElBQVYsS0FBbUJYLEdBQUcsQ0FBQ1ksTUFBSixDQUFXSixLQUE3QztBQUFBLFNBRFksRUFFWixDQUZZLENBQWQ7O0FBSUEsWUFBSSw2QkFBaUJBLEtBQUssQ0FBQ0QsS0FBdkIsRUFBOEJGLFNBQTlCLENBQUosRUFBOEM7QUFDNUMsb0NBQWNKLEdBQWQsRUFBbUJPLEtBQUssQ0FBQ0ssT0FBekIsRUFBa0MsU0FBbEM7QUFDQSxpQkFBTywwQkFBY1gsSUFBZCxFQUFvQk0sS0FBSyxDQUFDSyxPQUExQixDQUFQO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsaUJBQU8sNEJBQWdCWCxJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixnQkFBdkIsQ0FBdEIsQ0FBUDtBQUNEO0FBQ0Y7QUFDRjs7O2lDQUVtQkosRyxFQUFpQkMsRyxFQUFrQkMsSSxFQUFvQjtBQUN6RSxVQUFJLENBQUMsS0FBS0gsUUFBTixJQUFrQixLQUFLQSxRQUFMLENBQWNJLE1BQWQsS0FBeUIsQ0FBL0MsRUFBa0Q7QUFDaEQsY0FBTSx1QkFBVyxpQkFBWCxFQUE4QixHQUE5QixDQUFOO0FBQ0Q7O0FBRUQsVUFBTUssS0FBSyxHQUFHLEtBQUtULFFBQUwsQ0FBY1UsTUFBZCxDQUNaLFVBQUNDLFNBQUQ7QUFBQSxlQUFlQSxTQUFTLENBQUNDLElBQVYsS0FBbUJYLEdBQUcsQ0FBQ1ksTUFBSixDQUFXSixLQUE3QztBQUFBLE9BRFksRUFFWixDQUZZLENBQWQ7QUFJQSxVQUFJSCxTQUFtQixHQUFHLEVBQTFCOztBQUNBLFVBQUlMLEdBQUcsQ0FBQ00sSUFBSixJQUFZTixHQUFHLENBQUNNLElBQUosQ0FBU0MsS0FBekIsRUFBZ0M7QUFDOUJGLFFBQUFBLFNBQVMsR0FBR0wsR0FBRyxDQUFDTSxJQUFKLENBQVNDLEtBQXJCO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDLDZCQUFpQkMsS0FBSyxDQUFDRCxLQUF2QixFQUE4QkYsU0FBOUIsQ0FBTCxFQUErQztBQUM3QyxlQUFPLDRCQUFnQkgsSUFBaEIsRUFBc0IsSUFBSUUsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsZ0JBQXZCLENBQXRCLENBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJLENBQUNVLFlBQVNDLEVBQWQsRUFBa0I7QUFDaEIsaUJBQU8sNEJBQWdCYixJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixhQUF2QixDQUF0QixDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU9VLFlBQVNDLEVBQVQsQ0FBWUMsTUFBWixDQUFtQixHQUFuQixFQUF3QkMsSUFBeEIsQ0FBNkJqQixHQUFHLENBQUNZLE1BQUosQ0FBV0osS0FBeEMsRUFBK0NVLE1BQS9DLENBQXNELENBQUNsQixHQUFHLENBQUNtQixLQUFKLENBQVVDLElBQVYsSUFBa0IsQ0FBbkIsSUFBd0IsRUFBOUUsRUFBa0ZDLEtBQWxGLENBQXdGLEVBQXhGLEVBQTRGQyxJQUE1RixDQUNMLFVBQUNDLE9BQUQsRUFBYTtBQUNYLGdCQUFJZixLQUFLLENBQUNnQixLQUFOLElBQWVoQixLQUFLLENBQUNnQixLQUFOLENBQVlDLFlBQTNCLElBQTJDakIsS0FBSyxDQUFDZ0IsS0FBTixDQUFZQyxZQUFaLENBQXlCQyxLQUF4RSxFQUErRTtBQUM3RSxrQkFBSVosWUFBU0MsRUFBYixFQUFpQjtBQUNmLHVCQUFPUCxLQUFLLENBQUNnQixLQUFOLENBQVlDLFlBQVosQ0FBeUJDLEtBQXpCLENBQStCMUIsR0FBL0IsRUFBb0NDLEdBQXBDLEVBQXlDYSxZQUFTQyxFQUFsRCxFQUFzRFAsS0FBSyxDQUFDRyxJQUE1RCxFQUFrRVksT0FBbEUsRUFBMkVELElBQTNFLENBQ0wsVUFBQ0ssZ0JBQUQsRUFBc0I7QUFDcEIsNENBQWMxQixHQUFkLEVBQW1CMEIsZ0JBQW5CLEVBQXFDLFNBQXJDO0FBQ0EseUJBQU8sMEJBQWN6QixJQUFkLEVBQW9CeUIsZ0JBQXBCLENBQVA7QUFDRCxpQkFKSSxDQUFQO0FBTUQ7QUFDRixhQVRELE1BU087QUFDTCx3Q0FBYzFCLEdBQWQsRUFBbUJzQixPQUFuQixFQUE0QixTQUE1QjtBQUNBLHFCQUFPLDBCQUFjckIsSUFBZCxFQUFvQnFCLE9BQXBCLENBQVA7QUFDRDtBQUNGLFdBZkksQ0FBUDtBQWlCRDtBQUNGO0FBQ0Y7OztrQ0FFb0J2QixHLEVBQWlCQyxHLEVBQWtCQyxJLEVBQW9CO0FBQzFFLFVBQUksQ0FBQyxLQUFLSCxRQUFOLElBQWtCLEtBQUtBLFFBQUwsQ0FBY0ksTUFBZCxLQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxjQUFNLHVCQUFXLGlCQUFYLEVBQThCLEdBQTlCLENBQU47QUFDRDs7QUFFRCxVQUFNSyxLQUFLLEdBQUcsS0FBS1QsUUFBTCxDQUFjVSxNQUFkLENBQ1osVUFBQ0MsU0FBRDtBQUFBLGVBQWVBLFNBQVMsQ0FBQ0MsSUFBVixLQUFtQlgsR0FBRyxDQUFDWSxNQUFKLENBQVdKLEtBQTdDO0FBQUEsT0FEWSxFQUVaLENBRlksQ0FBZDtBQUlBLFVBQUlILFNBQW1CLEdBQUcsRUFBMUI7O0FBQ0EsVUFBSUwsR0FBRyxDQUFDTSxJQUFKLElBQVlOLEdBQUcsQ0FBQ00sSUFBSixDQUFTQyxLQUF6QixFQUFnQztBQUM5QkYsUUFBQUEsU0FBUyxHQUFHTCxHQUFHLENBQUNNLElBQUosQ0FBU0MsS0FBckI7QUFDRDs7QUFFRCxVQUFJLENBQUMsNkJBQWlCQyxLQUFLLENBQUNELEtBQXZCLEVBQThCRixTQUE5QixDQUFMLEVBQStDO0FBQzdDLGVBQU8sNEJBQWdCSCxJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixnQkFBdkIsQ0FBdEIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksQ0FBQ1UsWUFBU0MsRUFBZCxFQUFrQjtBQUNoQixpQkFBTyw0QkFBZ0JiLElBQWhCLEVBQXNCLElBQUlFLG9CQUFKLENBQWtCLEdBQWxCLEVBQXVCLGFBQXZCLENBQXRCLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBT1UsWUFBU0MsRUFBVCxDQUFZQyxNQUFaLENBQW1CLEdBQW5CLEVBQXdCQyxJQUF4QixDQUE2QmpCLEdBQUcsQ0FBQ1ksTUFBSixDQUFXSixLQUF4QyxFQUErQ2MsSUFBL0MsQ0FDTCxVQUFDQyxPQUFELEVBQWE7QUFDWCxnQkFBSWYsS0FBSyxDQUFDZ0IsS0FBTixJQUFlaEIsS0FBSyxDQUFDZ0IsS0FBTixDQUFZSSxhQUEzQixJQUE0Q3BCLEtBQUssQ0FBQ2dCLEtBQU4sQ0FBWUksYUFBWixDQUEwQkYsS0FBMUUsRUFBaUY7QUFDL0Usa0JBQUlaLFlBQVNDLEVBQWIsRUFBaUI7QUFDZix1QkFBT1AsS0FBSyxDQUFDZ0IsS0FBTixDQUFZSSxhQUFaLENBQTBCRixLQUExQixDQUFnQzFCLEdBQWhDLEVBQXFDQyxHQUFyQyxFQUEwQ2EsWUFBU0MsRUFBbkQsRUFBdURQLEtBQUssQ0FBQ0csSUFBN0QsRUFBbUVZLE9BQW5FLEVBQTRFRCxJQUE1RSxDQUNMLFVBQUNPLEtBQUQsRUFBVztBQUNULDRDQUFjNUIsR0FBZCxFQUFtQjRCLEtBQW5CLEVBQTBCLE9BQTFCO0FBQ0EseUJBQU8sMEJBQWMzQixJQUFkLEVBQW9CMkIsS0FBcEIsQ0FBUDtBQUNELGlCQUpJLENBQVA7QUFNRDtBQUNGLGFBVEQsTUFTTztBQUNMLHdDQUFjNUIsR0FBZCxFQUFtQnNCLE9BQU8sQ0FBQ3BCLE1BQTNCLEVBQW1DLE9BQW5DO0FBQ0EscUJBQU8sMEJBQWNELElBQWQsRUFBb0JxQixPQUFwQixDQUFQO0FBQ0Q7QUFDRixXQWZJLENBQVA7QUFpQkQ7QUFDRjtBQUNGOzs7MkJBRWF2QixHLEVBQWlCQyxHLEVBQWtCQyxJLEVBQW9CO0FBQ25FLFVBQUksQ0FBQyxLQUFLSCxRQUFOLElBQWtCLEtBQUtBLFFBQUwsQ0FBY0ksTUFBZCxLQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxjQUFNLHVCQUFXLGlCQUFYLEVBQThCLEdBQTlCLENBQU47QUFDRDs7QUFFRCxVQUFNSyxLQUFLLEdBQUcsS0FBS1QsUUFBTCxDQUFjVSxNQUFkLENBQ1osVUFBQ0MsU0FBRDtBQUFBLGVBQWVBLFNBQVMsQ0FBQ0MsSUFBVixLQUFtQlgsR0FBRyxDQUFDWSxNQUFKLENBQVdKLEtBQTdDO0FBQUEsT0FEWSxFQUVaLENBRlksQ0FBZDtBQUlBLFVBQUlILFNBQW1CLEdBQUcsRUFBMUI7O0FBQ0EsVUFBSUwsR0FBRyxDQUFDTSxJQUFKLElBQVlOLEdBQUcsQ0FBQ00sSUFBSixDQUFTQyxLQUF6QixFQUFnQztBQUM5QkYsUUFBQUEsU0FBUyxHQUFHTCxHQUFHLENBQUNNLElBQUosQ0FBU0MsS0FBckI7QUFDRDs7QUFFRCxVQUFJLENBQUMsNkJBQWlCQyxLQUFLLENBQUNELEtBQXZCLEVBQThCRixTQUE5QixDQUFMLEVBQStDO0FBQzdDLGVBQU8sNEJBQWdCSCxJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixnQkFBdkIsQ0FBdEIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUksQ0FBQ1UsWUFBU0MsRUFBZCxFQUFrQjtBQUNoQixpQkFBTyw0QkFBZ0JiLElBQWhCLEVBQXNCLElBQUlFLG9CQUFKLENBQWtCLEdBQWxCLEVBQXVCLGFBQXZCLENBQXRCLENBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFNMEIsZ0JBQWdCLEdBQUd0QixLQUFLLENBQUNLLE9BQU4sQ0FBY0osTUFBZCxDQUN2QixVQUFDc0IsTUFBRDtBQUFBLG1CQUFZQSxNQUFNLENBQUNDLE9BQVAsQ0FBZUMsTUFBM0I7QUFBQSxXQUR1QixFQUV2QkMsR0FGdUIsQ0FHdkIsVUFBQ0gsTUFBRDtBQUFBLG1CQUFZQSxNQUFNLENBQUNwQixJQUFuQjtBQUFBLFdBSHVCLENBQXpCO0FBS0EsaUJBQU9HLFlBQVNDLEVBQVQsQ0FBWUMsTUFBWixDQUFtQmMsZ0JBQW5CLEVBQ0piLElBREksQ0FDQ2pCLEdBQUcsQ0FBQ1ksTUFBSixDQUFXSixLQURaLEVBRUoyQixLQUZJLENBRUUsSUFGRixFQUVRbkMsR0FBRyxDQUFDWSxNQUFKLENBQVd3QixFQUZuQixFQUdOZCxJQUhNLENBSUwsVUFBQ0MsT0FBRCxFQUFhO0FBQ1gsc0NBQWN0QixHQUFkLEVBQW1Cc0IsT0FBTyxDQUFDLENBQUQsQ0FBMUIsRUFBK0IsUUFBL0I7QUFDQSxtQkFBTywwQkFBY3JCLElBQWQsRUFBb0JxQixPQUFPLENBQUMsQ0FBRCxDQUEzQixDQUFQO0FBQ0QsV0FQSSxDQUFQO0FBU0Q7QUFDRjtBQUNGOzs7OEJBRWdCdkIsRyxFQUFjQyxHLEVBQWtCQyxJLEVBQW9CO0FBQ25FLFVBQUlZLFlBQVNDLEVBQWIsRUFBaUI7QUFDZkQsb0JBQVNDLEVBQVQsQ0FBWWYsR0FBRyxDQUFDWSxNQUFKLENBQVdKLEtBQXZCLEVBQThCNkIsTUFBOUIsQ0FBcUNyQyxHQUFHLENBQUNzQyxJQUFKLENBQVNDLElBQTlDLEVBQW9EakIsSUFBcEQsQ0FDRSxVQUFDQyxPQUFELEVBQWE7QUFDWCxvQ0FBY3RCLEdBQWQsRUFBbUJzQixPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjckIsSUFBZCxFQUFvQnFCLE9BQXBCLENBQVA7QUFDRCxTQUpIO0FBTUQsT0FQRCxNQU9PO0FBQ0wsb0NBQWdCckIsSUFBaEIsRUFBc0IsSUFBSUUsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7OEJBRWdCSixHLEVBQWNDLEcsRUFBa0JDLEksRUFBb0I7QUFDbkUsVUFBSVksWUFBU0MsRUFBYixFQUFpQjtBQUNmRCxvQkFBU0MsRUFBVCxDQUFZZixHQUFHLENBQUNzQyxJQUFKLENBQVM5QixLQUFyQixFQUE0QjJCLEtBQTVCLENBQWtDLElBQWxDLEVBQXdDbkMsR0FBRyxDQUFDc0MsSUFBSixDQUFTRixFQUFqRCxFQUFxREksTUFBckQsQ0FBNER4QyxHQUFHLENBQUNzQyxJQUFKLENBQVNDLElBQXJFLEVBQTJFakIsSUFBM0UsQ0FDRSxVQUFDQyxPQUFELEVBQWE7QUFDWCxvQ0FBY3RCLEdBQWQsRUFBbUJzQixPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjckIsSUFBZCxFQUFvQnFCLE9BQXBCLENBQVA7QUFDRCxTQUpIO0FBTUQsT0FQRCxNQU9PO0FBQ0wsb0NBQWdCckIsSUFBaEIsRUFBc0IsSUFBSUUsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7OEJBRWdCSixHLEVBQWNDLEcsRUFBa0JDLEksRUFBb0I7QUFDbkUsVUFBSVksWUFBU0MsRUFBYixFQUFpQjtBQUNmRCxvQkFBU0MsRUFBVCxDQUFZZixHQUFHLENBQUNZLE1BQUosQ0FBV0osS0FBdkIsRUFBOEIyQixLQUE5QixDQUFvQyxJQUFwQyxFQUEwQ25DLEdBQUcsQ0FBQ1ksTUFBSixDQUFXd0IsRUFBckQsRUFBeURLLEdBQXpELEdBQStEbkIsSUFBL0QsQ0FDRSxVQUFDQyxPQUFELEVBQWE7QUFDWCxvQ0FBY3RCLEdBQWQsRUFBbUJzQixPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjckIsSUFBZCxFQUFvQnFCLE9BQXBCLENBQVA7QUFDRCxTQUpIO0FBTUQsT0FQRCxNQU9PO0FBQ0wsb0NBQWdCckIsSUFBaEIsRUFBc0IsSUFBSUUsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7Ozs7ZUFHWU4sZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhYmFzZSBmcm9tICdAcm9vdC9hcGkvZGInXG5pbXBvcnQgeyBIdHRwRXhjZXB0aW9uLCBJTUNSZXF1ZXN0LCBJTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcyc7XG5pbXBvcnQgeyBhZGRUb1Jlc3BvbnNlLCBidWlsZEVycm9yLCBjYXRjaE1pZGRsZXdhcmUsIGhhc0F1dGhvcml6YXRpb24sIG5leHRBbmRSZXR1cm4gfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgeyBJVGFibGVJbmZvIH0gZnJvbSAnQHJvb3QvY29uZmlnR2VuZXJhdG9yJ1xuaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmNvbnRyb2xsZXItdGFibGUnKVxuXG5jbGFzcyBUYWJsZUNvbnRyb2xsZXIge1xuICBwdWJsaWMgc2V0dGluZ3M6IElUYWJsZUluZm9bXVxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBkZWJ1ZygnQ3JlYXRlZCcpXG4gICAgdGhpcy5zZXR0aW5ncyA9IGNvbmZpZygpLnNldHRpbmdzXG4gIH1cblxuICBwdWJsaWMgZ2V0VGFibGVDb25maWcocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDA0LCAnVGFibGUgbm90IGZvdW5kJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICAgIGlmIChyZXEudXNlciAmJiByZXEudXNlci5yb2xlcykge1xuICAgICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0YWJsZSA9IHRoaXMuc2V0dGluZ3MuZmlsdGVyKFxuICAgICAgICAodGFibGVJdGVtKSA9PiB0YWJsZUl0ZW0ubmFtZSA9PT0gcmVxLnBhcmFtcy50YWJsZVxuICAgICAgKVswXVxuXG4gICAgICBpZiAoaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgdXNlclJvbGVzKSkge1xuICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgdGFibGUuY29sdW1ucywgJ3Jlc3VsdHMnKVxuICAgICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KSh0YWJsZS5jb2x1bW5zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig0MDEsICdOb3QgYXV0aG9yaXplZCcpKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWJsZURhdGEocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IGJ1aWxkRXJyb3IoJ1RhYmxlIG5vdCBmb3VuZCcsIDQwNClcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZSA9IHRoaXMuc2V0dGluZ3MuZmlsdGVyKFxuICAgICAgKHRhYmxlSXRlbSkgPT4gdGFibGVJdGVtLm5hbWUgPT09IHJlcS5wYXJhbXMudGFibGVcbiAgICApWzBdXG5cbiAgICBsZXQgdXNlclJvbGVzOiBzdHJpbmdbXSA9IFtdXG4gICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgIH1cblxuICAgIGlmICghaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgdXNlclJvbGVzKSkge1xuICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig0MDEsICdOb3QgYXV0aG9yaXplZCcpKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWRhdGFiYXNlLmRiKSB7XG4gICAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkYXRhYmFzZS5kYi5zZWxlY3QoJyonKS5mcm9tKHJlcS5wYXJhbXMudGFibGUpLm9mZnNldCgocmVxLnF1ZXJ5LnBhZ2UgfHwgMCkgKiAxMCkubGltaXQoMTApLnRoZW4oXG4gICAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGlmICh0YWJsZS5ob29rcyAmJiB0YWJsZS5ob29rcy5nZXRUYWJsZURhdGEgJiYgdGFibGUuaG9va3MuZ2V0VGFibGVEYXRhLmFmdGVyKSB7XG4gICAgICAgICAgICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZS5ob29rcy5nZXRUYWJsZURhdGEuYWZ0ZXIocmVxLCByZXMsIGRhdGFiYXNlLmRiLCB0YWJsZS5uYW1lLCByZXN1bHRzKS50aGVuKFxuICAgICAgICAgICAgICAgICAgKHJlc3VsdHNCZWZvcmVHZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHNCZWZvcmVHZXQsICdyZXN1bHRzJylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkocmVzdWx0c0JlZm9yZUdldClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCByZXN1bHRzLCAncmVzdWx0cycpXG4gICAgICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFRhYmxlQ291bnQocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IGJ1aWxkRXJyb3IoJ1RhYmxlIG5vdCBmb3VuZCcsIDQwNClcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZSA9IHRoaXMuc2V0dGluZ3MuZmlsdGVyKFxuICAgICAgKHRhYmxlSXRlbSkgPT4gdGFibGVJdGVtLm5hbWUgPT09IHJlcS5wYXJhbXMudGFibGVcbiAgICApWzBdXG5cbiAgICBsZXQgdXNlclJvbGVzOiBzdHJpbmdbXSA9IFtdXG4gICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgIH1cblxuICAgIGlmICghaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgdXNlclJvbGVzKSkge1xuICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig0MDEsICdOb3QgYXV0aG9yaXplZCcpKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWRhdGFiYXNlLmRiKSB7XG4gICAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkYXRhYmFzZS5kYi5zZWxlY3QoJyonKS5mcm9tKHJlcS5wYXJhbXMudGFibGUpLnRoZW4oXG4gICAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgIGlmICh0YWJsZS5ob29rcyAmJiB0YWJsZS5ob29rcy5nZXRUYWJsZUNvdW50ICYmIHRhYmxlLmhvb2tzLmdldFRhYmxlQ291bnQuYWZ0ZXIpIHtcbiAgICAgICAgICAgICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLmhvb2tzLmdldFRhYmxlQ291bnQuYWZ0ZXIocmVxLCByZXMsIGRhdGFiYXNlLmRiLCB0YWJsZS5uYW1lLCByZXN1bHRzKS50aGVuKFxuICAgICAgICAgICAgICAgICAgKGNvdW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCBjb3VudCwgJ2NvdW50JylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkoY291bnQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cy5sZW5ndGgsICdjb3VudCcpXG4gICAgICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFJvdyhyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgYnVpbGRFcnJvcignVGFibGUgbm90IGZvdW5kJywgNDA0KVxuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlID0gdGhpcy5zZXR0aW5ncy5maWx0ZXIoXG4gICAgICAodGFibGVJdGVtKSA9PiB0YWJsZUl0ZW0ubmFtZSA9PT0gcmVxLnBhcmFtcy50YWJsZVxuICAgIClbMF1cblxuICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICBpZiAocmVxLnVzZXIgJiYgcmVxLnVzZXIucm9sZXMpIHtcbiAgICAgIHVzZXJSb2xlcyA9IHJlcS51c2VyLnJvbGVzXG4gICAgfVxuXG4gICAgaWYgKCFoYXNBdXRob3JpemF0aW9uKHRhYmxlLnJvbGVzLCB1c2VyUm9sZXMpKSB7XG4gICAgICByZXR1cm4gY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDQwMSwgJ05vdCBhdXRob3JpemVkJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghZGF0YWJhc2UuZGIpIHtcbiAgICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig1MDAsICdObyBkYXRhYmFzZScpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVxdWVzdGVkQ29sdW1ucyA9IHRhYmxlLmNvbHVtbnMuZmlsdGVyKFxuICAgICAgICAgIChjb2x1bW4pID0+IGNvbHVtbi52aXNpYmxlLmRldGFpbFxuICAgICAgICApLm1hcChcbiAgICAgICAgICAoY29sdW1uKSA9PiBjb2x1bW4ubmFtZVxuICAgICAgICApXG4gICAgICAgIHJldHVybiBkYXRhYmFzZS5kYi5zZWxlY3QocmVxdWVzdGVkQ29sdW1ucylcbiAgICAgICAgICAuZnJvbShyZXEucGFyYW1zLnRhYmxlKVxuICAgICAgICAgIC53aGVyZSgnaWQnLCByZXEucGFyYW1zLmlkKVxuICAgICAgICAudGhlbihcbiAgICAgICAgICAocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHJlc3VsdHNbMF0sICdyZXN1bHQnKVxuICAgICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkocmVzdWx0c1swXSlcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0Um93KHJlcTogUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICBkYXRhYmFzZS5kYihyZXEucGFyYW1zLnRhYmxlKS5pbnNlcnQocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLmJvZHkudGFibGUpLndoZXJlKCdpZCcsIHJlcS5ib2R5LmlkKS51cGRhdGUocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRlbGV0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLnBhcmFtcy50YWJsZSkud2hlcmUoJ2lkJywgcmVxLnBhcmFtcy5pZCkuZGVsKCkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlQ29udHJvbGxlclxuIl19