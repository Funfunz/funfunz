"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug.default)('funfunzmc:controller-tables');

var TablesController =
/*#__PURE__*/
function () {
  function TablesController() {
    _classCallCheck(this, TablesController);

    _defineProperty(this, "settings", void 0);

    debug('Created');
    this.settings = (0, _configLoader.default)().settings;
  }

  _createClass(TablesController, [{
    key: "getTables",
    value: function getTables(req, res, next) {
      if (!this.settings || this.settings.length === 0) {
        throw (0, _utils.buildError)('Tables not found', 404);
      } else {
        var tables = this.settings.map(function (table) {
          return table.name;
        });
        (0, _utils.addToResponse)(res, tables, 'tables');
        return (0, _utils.nextAndReturn)(next)(tables);
      }
    }
  }]);

  return TablesController;
}();

var _default = TablesController;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlRhYmxlc0NvbnRyb2xsZXIiLCJzZXR0aW5ncyIsInJlcSIsInJlcyIsIm5leHQiLCJsZW5ndGgiLCJ0YWJsZXMiLCJtYXAiLCJ0YWJsZSIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBR0EsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLDZCQUFOLENBQWQ7O0lBRU1DLGdCOzs7QUFFSiw4QkFBYztBQUFBOztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7Ozs4QkFFZ0JDLEcsRUFBY0MsRyxFQUFrQkMsSSxFQUFvQjtBQUNuRSxVQUFJLENBQUMsS0FBS0gsUUFBTixJQUFrQixLQUFLQSxRQUFMLENBQWNJLE1BQWQsS0FBeUIsQ0FBL0MsRUFBa0Q7QUFDaEQsY0FBTSx1QkFBVyxrQkFBWCxFQUErQixHQUEvQixDQUFOO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBTUMsTUFBTSxHQUFHLEtBQUtMLFFBQUwsQ0FBY00sR0FBZCxDQUNiLFVBQUNDLEtBQUQ7QUFBQSxpQkFBV0EsS0FBSyxDQUFDQyxJQUFqQjtBQUFBLFNBRGEsQ0FBZjtBQUdBLGtDQUFjTixHQUFkLEVBQW1CRyxNQUFuQixFQUEyQixRQUEzQjtBQUNBLGVBQU8sMEJBQWNGLElBQWQsRUFBb0JFLE1BQXBCLENBQVA7QUFDRDtBQUNGOzs7Ozs7ZUFHWU4sZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcyc7XG5pbXBvcnQgeyBhZGRUb1Jlc3BvbnNlLCBidWlsZEVycm9yLCBuZXh0QW5kUmV0dXJuIH0gZnJvbSAnQHJvb3QvYXBpL3V0aWxzJ1xuaW1wb3J0IGNvbmZpZyBmcm9tICdAcm9vdC9hcGkvdXRpbHMvY29uZmlnTG9hZGVyJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0IH0gZnJvbSAnZXhwcmVzcyc7XG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnptYzpjb250cm9sbGVyLXRhYmxlcycpXG5cbmNsYXNzIFRhYmxlc0NvbnRyb2xsZXIge1xuICBwdWJsaWMgc2V0dGluZ3M6IGFueVtdXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGRlYnVnKCdDcmVhdGVkJylcbiAgICB0aGlzLnNldHRpbmdzID0gY29uZmlnKCkuc2V0dGluZ3NcbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWJsZXMocmVxOiBSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IGJ1aWxkRXJyb3IoJ1RhYmxlcyBub3QgZm91bmQnLCA0MDQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRhYmxlcyA9IHRoaXMuc2V0dGluZ3MubWFwKFxuICAgICAgICAodGFibGUpID0+IHRhYmxlLm5hbWVcbiAgICAgIClcbiAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCB0YWJsZXMsICd0YWJsZXMnKVxuICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkodGFibGVzKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYWJsZXNDb250cm9sbGVyXG4iXX0=