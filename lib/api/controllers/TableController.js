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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiVGFibGVDb250cm9sbGVyIiwic2V0dGluZ3MiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZGF0YWJhc2UiLCJkYiIsInNlbGVjdCIsImZyb20iLCJwYXJhbXMiLCJ0YWJsZSIsIm9mZnNldCIsInF1ZXJ5IiwicGFnZSIsImxpbWl0IiwidGhlbiIsInJlc3VsdHMiLCJIdHRwRXhjZXB0aW9uIiwiaW5zZXJ0IiwiYm9keSIsImRhdGEiLCJ3aGVyZSIsImlkIiwidXBkYXRlIiwiZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLEtBQUssR0FBRyxvQkFBTSw0QkFBTixDQUFkOztJQUVNQyxlOzs7QUFFSiw2QkFBYztBQUFBOztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7OztpQ0FFbUJDLEcsRUFBY0MsRyxFQUFrQkMsSSxFQUFvQjtBQUN0RSxVQUFJQyxZQUFTQyxFQUFiLEVBQWlCO0FBQ2ZELG9CQUFTQyxFQUFULENBQVlDLE1BQVosQ0FBbUIsR0FBbkIsRUFBd0JDLElBQXhCLENBQTZCTixHQUFHLENBQUNPLE1BQUosQ0FBV0MsS0FBeEMsRUFBK0NDLE1BQS9DLENBQXNELENBQUNULEdBQUcsQ0FBQ1UsS0FBSixDQUFVQyxJQUFWLElBQWtCLENBQW5CLElBQXdCLEVBQTlFLEVBQWtGQyxLQUFsRixDQUF3RixFQUF4RixFQUE0RkMsSUFBNUYsQ0FDRSxVQUFDQyxPQUFELEVBQWE7QUFDWCxvQ0FBY2IsR0FBZCxFQUFtQmEsT0FBbkIsRUFBNEIsU0FBNUI7QUFDQSxpQkFBTywwQkFBY1osSUFBZCxFQUFvQlksT0FBcEIsQ0FBUDtBQUNELFNBSkg7QUFNRCxPQVBELE1BT087QUFDTCxvQ0FBZ0JaLElBQWhCLEVBQXNCLElBQUlhLG9CQUFKLENBQWtCLEdBQWxCLEVBQXVCLGFBQXZCLENBQXRCO0FBQ0Q7QUFDRjs7OzhCQUVnQmYsRyxFQUFjQyxHLEVBQWtCQyxJLEVBQW9CO0FBQ25FLFVBQUlDLFlBQVNDLEVBQWIsRUFBaUI7QUFDZkQsb0JBQVNDLEVBQVQsQ0FBWUosR0FBRyxDQUFDTyxNQUFKLENBQVdDLEtBQXZCLEVBQThCUSxNQUE5QixDQUFxQ2hCLEdBQUcsQ0FBQ2lCLElBQUosQ0FBU0MsSUFBOUMsRUFBb0RMLElBQXBELENBQ0UsVUFBQ0MsT0FBRCxFQUFhO0FBQ1gsb0NBQWNiLEdBQWQsRUFBbUJhLE9BQW5CLEVBQTRCLFNBQTVCO0FBQ0EsaUJBQU8sMEJBQWNaLElBQWQsRUFBb0JZLE9BQXBCLENBQVA7QUFDRCxTQUpIO0FBTUQsT0FQRCxNQU9PO0FBQ0wsb0NBQWdCWixJQUFoQixFQUFzQixJQUFJYSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixhQUF2QixDQUF0QjtBQUNEO0FBQ0Y7Ozs4QkFFZ0JmLEcsRUFBY0MsRyxFQUFrQkMsSSxFQUFvQjtBQUNuRSxVQUFJQyxZQUFTQyxFQUFiLEVBQWlCO0FBQ2ZELG9CQUFTQyxFQUFULENBQVlKLEdBQUcsQ0FBQ2lCLElBQUosQ0FBU1QsS0FBckIsRUFBNEJXLEtBQTVCLENBQWtDLElBQWxDLEVBQXdDbkIsR0FBRyxDQUFDaUIsSUFBSixDQUFTRyxFQUFqRCxFQUFxREMsTUFBckQsQ0FBNERyQixHQUFHLENBQUNpQixJQUFKLENBQVNDLElBQXJFLEVBQTJFTCxJQUEzRSxDQUNFLFVBQUNDLE9BQUQsRUFBYTtBQUNYLG9DQUFjYixHQUFkLEVBQW1CYSxPQUFuQixFQUE0QixTQUE1QjtBQUNBLGlCQUFPLDBCQUFjWixJQUFkLEVBQW9CWSxPQUFwQixDQUFQO0FBQ0QsU0FKSDtBQU1ELE9BUEQsTUFPTztBQUNMLG9DQUFnQlosSUFBaEIsRUFBc0IsSUFBSWEsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsYUFBdkIsQ0FBdEI7QUFDRDtBQUNGOzs7OEJBRWdCZixHLEVBQWNDLEcsRUFBa0JDLEksRUFBb0I7QUFDbkUsVUFBSUMsWUFBU0MsRUFBYixFQUFpQjtBQUNmRCxvQkFBU0MsRUFBVCxDQUFZSixHQUFHLENBQUNPLE1BQUosQ0FBV0MsS0FBdkIsRUFBOEJXLEtBQTlCLENBQW9DLElBQXBDLEVBQTBDbkIsR0FBRyxDQUFDTyxNQUFKLENBQVdhLEVBQXJELEVBQXlERSxHQUF6RCxHQUErRFQsSUFBL0QsQ0FDRSxVQUFDQyxPQUFELEVBQWE7QUFDWCxvQ0FBY2IsR0FBZCxFQUFtQmEsT0FBbkIsRUFBNEIsU0FBNUI7QUFDQSxpQkFBTywwQkFBY1osSUFBZCxFQUFvQlksT0FBcEIsQ0FBUDtBQUNELFNBSkg7QUFNRCxPQVBELE1BT087QUFDTCxvQ0FBZ0JaLElBQWhCLEVBQXNCLElBQUlhLG9CQUFKLENBQWtCLEdBQWxCLEVBQXVCLGFBQXZCLENBQXRCO0FBQ0Q7QUFDRjs7Ozs7O2VBR1lqQixlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRhdGFiYXNlIGZyb20gJ0Byb290L2FwaS9kYi9pbmRleCdcbmltcG9ydCB7IEh0dHBFeGNlcHRpb24sIElNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IGFkZFRvUmVzcG9uc2UsIGNhdGNoTWlkZGxld2FyZSwgbmV4dEFuZFJldHVybiB9IGZyb20gJ0Byb290L2FwaS91dGlscydcbmltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCB9IGZyb20gJ2V4cHJlc3MnO1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdmdW5mdW56bWM6Y29udHJvbGxlci10YWJsZScpXG5cbmNsYXNzIFRhYmxlQ29udHJvbGxlciB7XG4gIHB1YmxpYyBzZXR0aW5nczogYW55W11cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZGVidWcoJ0NyZWF0ZWQnKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBjb25maWcoKS5zZXR0aW5nc1xuICB9XG5cbiAgcHVibGljIGdldFRhYmxlRGF0YShyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIuc2VsZWN0KCcqJykuZnJvbShyZXEucGFyYW1zLnRhYmxlKS5vZmZzZXQoKHJlcS5xdWVyeS5wYWdlIHx8IDApICogMTApLmxpbWl0KDEwKS50aGVuKFxuICAgICAgICAocmVzdWx0cykgPT4ge1xuICAgICAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCByZXN1bHRzLCAncmVzdWx0cycpXG4gICAgICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkocmVzdWx0cylcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNTAwLCAnTm8gZGF0YWJhc2UnKSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zZXJ0Um93KHJlcTogUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKGRhdGFiYXNlLmRiKSB7XG4gICAgICBkYXRhYmFzZS5kYihyZXEucGFyYW1zLnRhYmxlKS5pbnNlcnQocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLmJvZHkudGFibGUpLndoZXJlKCdpZCcsIHJlcS5ib2R5LmlkKS51cGRhdGUocmVxLmJvZHkuZGF0YSkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRlbGV0ZVJvdyhyZXE6IFJlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmIChkYXRhYmFzZS5kYikge1xuICAgICAgZGF0YWJhc2UuZGIocmVxLnBhcmFtcy50YWJsZSkud2hlcmUoJ2lkJywgcmVxLnBhcmFtcy5pZCkuZGVsKCkudGhlbihcbiAgICAgICAgKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgcmVzdWx0cywgJ3Jlc3VsdHMnKVxuICAgICAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHJlc3VsdHMpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Y2hNaWRkbGV3YXJlKG5leHQpKG5ldyBIdHRwRXhjZXB0aW9uKDUwMCwgJ05vIGRhdGFiYXNlJykpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlQ29udHJvbGxlclxuIl19