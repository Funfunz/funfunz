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
        var userRoles = [];

        if (req.user && req.user.roles) {
          userRoles = req.user.roles;
        }

        var tables = this.settings.map(function (table) {
          var isAuthorized = true;

          if (table.roles && table.roles.length) {
            isAuthorized = (0, _utils.hasAuthorization)(table.roles, userRoles);
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
        (0, _utils.addToResponse)(res, tables, 'tables');
        return (0, _utils.nextAndReturn)(next)(tables);
      }
    }
  }]);

  return TablesController;
}();

var _default = TablesController;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlRhYmxlc0NvbnRyb2xsZXIiLCJzZXR0aW5ncyIsInJlcSIsInJlcyIsIm5leHQiLCJsZW5ndGgiLCJ1c2VyUm9sZXMiLCJ1c2VyIiwicm9sZXMiLCJ0YWJsZXMiLCJtYXAiLCJ0YWJsZSIsImlzQXV0aG9yaXplZCIsIm5hbWUiLCJ2ZXJib3NlIiwidW5kZWZpbmVkIiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLEtBQUssR0FBRyxvQkFBTSw2QkFBTixDQUFkOztJQUVNQyxnQjs7O0FBRUosOEJBQWM7QUFBQTs7QUFBQTs7QUFDWkQsSUFBQUEsS0FBSyxDQUFDLFNBQUQsQ0FBTDtBQUNBLFNBQUtFLFFBQUwsR0FBZ0IsNkJBQVNBLFFBQXpCO0FBQ0Q7Ozs7OEJBRWdCQyxHLEVBQWlCQyxHLEVBQWtCQyxJLEVBQW9CO0FBQ3RFLFVBQUksQ0FBQyxLQUFLSCxRQUFOLElBQWtCLEtBQUtBLFFBQUwsQ0FBY0ksTUFBZCxLQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxjQUFNLHVCQUFXLGtCQUFYLEVBQStCLEdBQS9CLENBQU47QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJQyxTQUFtQixHQUFHLEVBQTFCOztBQUNBLFlBQUlKLEdBQUcsQ0FBQ0ssSUFBSixJQUFZTCxHQUFHLENBQUNLLElBQUosQ0FBU0MsS0FBekIsRUFBZ0M7QUFDOUJGLFVBQUFBLFNBQVMsR0FBR0osR0FBRyxDQUFDSyxJQUFKLENBQVNDLEtBQXJCO0FBQ0Q7O0FBQ0QsWUFBTUMsTUFBTSxHQUFHLEtBQUtSLFFBQUwsQ0FBY1MsR0FBZCxDQUNiLFVBQUNDLEtBQUQsRUFBdUI7QUFDckIsY0FBSUMsWUFBcUIsR0FBRyxJQUE1Qjs7QUFDQSxjQUFJRCxLQUFLLENBQUNILEtBQU4sSUFBZUcsS0FBSyxDQUFDSCxLQUFOLENBQVlILE1BQS9CLEVBQXVDO0FBQ3JDTyxZQUFBQSxZQUFZLEdBQUcsNkJBQWlCRCxLQUFLLENBQUNILEtBQXZCLEVBQThCRixTQUE5QixDQUFmO0FBQ0Q7O0FBQ0QsY0FBSU0sWUFBSixFQUFrQjtBQUNoQixtQkFBTztBQUNMQyxjQUFBQSxJQUFJLEVBQUVGLEtBQUssQ0FBQ0UsSUFEUDtBQUVMQyxjQUFBQSxPQUFPLEVBQUVILEtBQUssQ0FBQ0c7QUFGVixhQUFQO0FBSUQ7O0FBQ0QsaUJBQU9DLFNBQVA7QUFDRCxTQWJZLEVBY2JDLE1BZGEsQ0FlYixVQUFDTCxLQUFEO0FBQUEsaUJBQVdBLEtBQVg7QUFBQSxTQWZhLENBQWY7QUFpQkEsa0NBQWNSLEdBQWQsRUFBbUJNLE1BQW5CLEVBQTJCLFFBQTNCO0FBQ0EsZUFBTywwQkFBY0wsSUFBZCxFQUFvQkssTUFBcEIsQ0FBUDtBQUNEO0FBQ0Y7Ozs7OztlQUdZVCxnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNQ1JlcXVlc3QsIElNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IGFkZFRvUmVzcG9uc2UsIGJ1aWxkRXJyb3IsIGhhc0F1dGhvcml6YXRpb24sIG5leHRBbmRSZXR1cm4gfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5pbXBvcnQgeyBJVGFibGVJbmZvIH0gZnJvbSAnQHJvb3QvY29uZmlnR2VuZXJhdG9yJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcydcblxuY29uc3QgZGVidWcgPSBEZWJ1ZygnZnVuZnVuem1jOmNvbnRyb2xsZXItdGFibGVzJylcblxuY2xhc3MgVGFibGVzQ29udHJvbGxlciB7XG4gIHB1YmxpYyBzZXR0aW5nczogSVRhYmxlSW5mb1tdXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGRlYnVnKCdDcmVhdGVkJylcbiAgICB0aGlzLnNldHRpbmdzID0gY29uZmlnKCkuc2V0dGluZ3NcbiAgfVxuXG4gIHB1YmxpYyBnZXRUYWJsZXMocmVxOiBJTUNSZXF1ZXN0LCByZXM6IElNQ1Jlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IGJ1aWxkRXJyb3IoJ1RhYmxlcyBub3QgZm91bmQnLCA0MDQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICAgIGlmIChyZXEudXNlciAmJiByZXEudXNlci5yb2xlcykge1xuICAgICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgICAgfVxuICAgICAgY29uc3QgdGFibGVzID0gdGhpcy5zZXR0aW5ncy5tYXAoXG4gICAgICAgICh0YWJsZTogSVRhYmxlSW5mbykgPT4ge1xuICAgICAgICAgIGxldCBpc0F1dGhvcml6ZWQ6IGJvb2xlYW4gPSB0cnVlXG4gICAgICAgICAgaWYgKHRhYmxlLnJvbGVzICYmIHRhYmxlLnJvbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaXNBdXRob3JpemVkID0gaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgdXNlclJvbGVzKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNBdXRob3JpemVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiB0YWJsZS5uYW1lLFxuICAgICAgICAgICAgICB2ZXJib3NlOiB0YWJsZS52ZXJib3NlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgICkuZmlsdGVyKFxuICAgICAgICAodGFibGUpID0+IHRhYmxlXG4gICAgICApXG4gICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgdGFibGVzLCAndGFibGVzJylcbiAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHRhYmxlcylcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFibGVzQ29udHJvbGxlclxuIl19