"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("../types");

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
        return (0, _utils.catchMiddleware)(next)(new _types.HttpException(404, 'Tables not found'));
      } else {
        var tables = this.settings.map(function (table) {
          var isAuthorized = true;

          if (!table.visible) {
            return undefined;
          }

          if (table.roles && table.roles.length) {
            isAuthorized = (0, _utils.hasAuthorization)(table.roles, req.user);
          }

          if (isAuthorized) {
            return {
              name: table.name,
              verbose: table.verbose
            };
          }

          return undefined;
        }).filter(function (table) {
          return table;
        });
        (0, _utils.addToResponse)(res, 'tables')(tables);
        return (0, _utils.nextAndReturn)(next)(tables);
      }
    }
  }]);

  return TablesController;
}();

var _default = TablesController;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlRhYmxlc0NvbnRyb2xsZXIiLCJzZXR0aW5ncyIsInJlcSIsInJlcyIsIm5leHQiLCJsZW5ndGgiLCJIdHRwRXhjZXB0aW9uIiwidGFibGVzIiwibWFwIiwidGFibGUiLCJpc0F1dGhvcml6ZWQiLCJ2aXNpYmxlIiwidW5kZWZpbmVkIiwicm9sZXMiLCJ1c2VyIiwibmFtZSIsInZlcmJvc2UiLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBR0EsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLDZCQUFOLENBQWQ7O0lBRU1DLGdCOzs7QUFFSiw4QkFBYztBQUFBOztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7Ozs4QkFFZ0JDLEcsRUFBaUJDLEcsRUFBa0JDLEksRUFBb0I7QUFDdEUsVUFBSSxDQUFDLEtBQUtILFFBQU4sSUFBa0IsS0FBS0EsUUFBTCxDQUFjSSxNQUFkLEtBQXlCLENBQS9DLEVBQWtEO0FBQ2hELGVBQU8sNEJBQWdCRCxJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixrQkFBdkIsQ0FBdEIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQU1DLE1BQU0sR0FBRyxLQUFLTixRQUFMLENBQWNPLEdBQWQsQ0FDYixVQUFDQyxLQUFELEVBQXVCO0FBQ3JCLGNBQUlDLFlBQXFCLEdBQUcsSUFBNUI7O0FBQ0EsY0FBSSxDQUFDRCxLQUFLLENBQUNFLE9BQVgsRUFBb0I7QUFDbEIsbUJBQU9DLFNBQVA7QUFDRDs7QUFDRCxjQUFJSCxLQUFLLENBQUNJLEtBQU4sSUFBZUosS0FBSyxDQUFDSSxLQUFOLENBQVlSLE1BQS9CLEVBQXVDO0FBQ3JDSyxZQUFBQSxZQUFZLEdBQUcsNkJBQWlCRCxLQUFLLENBQUNJLEtBQXZCLEVBQThCWCxHQUFHLENBQUNZLElBQWxDLENBQWY7QUFDRDs7QUFDRCxjQUFJSixZQUFKLEVBQWtCO0FBQ2hCLG1CQUFPO0FBQ0xLLGNBQUFBLElBQUksRUFBRU4sS0FBSyxDQUFDTSxJQURQO0FBRUxDLGNBQUFBLE9BQU8sRUFBRVAsS0FBSyxDQUFDTztBQUZWLGFBQVA7QUFJRDs7QUFDRCxpQkFBT0osU0FBUDtBQUNELFNBaEJZLEVBaUJiSyxNQWpCYSxDQWtCYixVQUFDUixLQUFEO0FBQUEsaUJBQVdBLEtBQVg7QUFBQSxTQWxCYSxDQUFmO0FBb0JBLGtDQUFjTixHQUFkLEVBQW1CLFFBQW5CLEVBQTZCSSxNQUE3QjtBQUNBLGVBQU8sMEJBQWNILElBQWQsRUFBb0JHLE1BQXBCLENBQVA7QUFDRDtBQUNGOzs7Ozs7ZUFHWVAsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwRXhjZXB0aW9uLCBJTUNSZXF1ZXN0LCBJTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcyc7XG5pbXBvcnQgeyBhZGRUb1Jlc3BvbnNlLCBjYXRjaE1pZGRsZXdhcmUsIGhhc0F1dGhvcml6YXRpb24sIG5leHRBbmRSZXR1cm4gfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgeyBJVGFibGVJbmZvIH0gZnJvbSAnQHJvb3QvY29uZmlnR2VuZXJhdG9yJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmNvbnRyb2xsZXItdGFibGVzJylcblxuY2xhc3MgVGFibGVzQ29udHJvbGxlciB7XG4gIHB1YmxpYyBzZXR0aW5nczogSVRhYmxlSW5mb1tdXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGRlYnVnKCdDcmVhdGVkJylcbiAgICB0aGlzLnNldHRpbmdzID0gY29uZmlnKCkuc2V0dGluZ3NcbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWJsZXMocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBjYXRjaE1pZGRsZXdhcmUobmV4dCkobmV3IEh0dHBFeGNlcHRpb24oNDA0LCAnVGFibGVzIG5vdCBmb3VuZCcpKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YWJsZXMgPSB0aGlzLnNldHRpbmdzLm1hcChcbiAgICAgICAgKHRhYmxlOiBJVGFibGVJbmZvKSA9PiB7XG4gICAgICAgICAgbGV0IGlzQXV0aG9yaXplZDogYm9vbGVhbiA9IHRydWVcbiAgICAgICAgICBpZiAoIXRhYmxlLnZpc2libGUpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRhYmxlLnJvbGVzICYmIHRhYmxlLnJvbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaXNBdXRob3JpemVkID0gaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgcmVxLnVzZXIpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpc0F1dGhvcml6ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIG5hbWU6IHRhYmxlLm5hbWUsXG4gICAgICAgICAgICAgIHZlcmJvc2U6IHRhYmxlLnZlcmJvc2UsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgKS5maWx0ZXIoXG4gICAgICAgICh0YWJsZSkgPT4gdGFibGVcbiAgICAgIClcbiAgICAgIGFkZFRvUmVzcG9uc2UocmVzLCAndGFibGVzJykodGFibGVzKVxuICAgICAgcmV0dXJuIG5leHRBbmRSZXR1cm4obmV4dCkodGFibGVzKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYWJsZXNDb250cm9sbGVyXG4iXX0=