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
        var userRoles = [];

        if (req.user && req.user.roles) {
          userRoles = req.user.roles;
        }

        var tables = this.settings.map(function (table) {
          var isAuthorized = true;

          if (!table.visible) {
            return undefined;
          }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlRhYmxlc0NvbnRyb2xsZXIiLCJzZXR0aW5ncyIsInJlcSIsInJlcyIsIm5leHQiLCJsZW5ndGgiLCJIdHRwRXhjZXB0aW9uIiwidXNlclJvbGVzIiwidXNlciIsInJvbGVzIiwidGFibGVzIiwibWFwIiwidGFibGUiLCJpc0F1dGhvcml6ZWQiLCJ2aXNpYmxlIiwidW5kZWZpbmVkIiwibmFtZSIsInZlcmJvc2UiLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBR0EsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLDZCQUFOLENBQWQ7O0lBRU1DLGdCOzs7QUFFSiw4QkFBYztBQUFBOztBQUFBOztBQUNaRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7Ozs4QkFFZ0JDLEcsRUFBaUJDLEcsRUFBa0JDLEksRUFBb0I7QUFDdEUsVUFBSSxDQUFDLEtBQUtILFFBQU4sSUFBa0IsS0FBS0EsUUFBTCxDQUFjSSxNQUFkLEtBQXlCLENBQS9DLEVBQWtEO0FBQ2hELGVBQU8sNEJBQWdCRCxJQUFoQixFQUFzQixJQUFJRSxvQkFBSixDQUFrQixHQUFsQixFQUF1QixrQkFBdkIsQ0FBdEIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLFlBQUlDLFNBQW1CLEdBQUcsRUFBMUI7O0FBQ0EsWUFBSUwsR0FBRyxDQUFDTSxJQUFKLElBQVlOLEdBQUcsQ0FBQ00sSUFBSixDQUFTQyxLQUF6QixFQUFnQztBQUM5QkYsVUFBQUEsU0FBUyxHQUFHTCxHQUFHLENBQUNNLElBQUosQ0FBU0MsS0FBckI7QUFDRDs7QUFDRCxZQUFNQyxNQUFNLEdBQUcsS0FBS1QsUUFBTCxDQUFjVSxHQUFkLENBQ2IsVUFBQ0MsS0FBRCxFQUF1QjtBQUNyQixjQUFJQyxZQUFxQixHQUFHLElBQTVCOztBQUNBLGNBQUksQ0FBQ0QsS0FBSyxDQUFDRSxPQUFYLEVBQW9CO0FBQ2xCLG1CQUFPQyxTQUFQO0FBQ0Q7O0FBQ0QsY0FBSUgsS0FBSyxDQUFDSCxLQUFOLElBQWVHLEtBQUssQ0FBQ0gsS0FBTixDQUFZSixNQUEvQixFQUF1QztBQUNyQ1EsWUFBQUEsWUFBWSxHQUFHLDZCQUFpQkQsS0FBSyxDQUFDSCxLQUF2QixFQUE4QkYsU0FBOUIsQ0FBZjtBQUNEOztBQUNELGNBQUlNLFlBQUosRUFBa0I7QUFDaEIsbUJBQU87QUFDTEcsY0FBQUEsSUFBSSxFQUFFSixLQUFLLENBQUNJLElBRFA7QUFFTEMsY0FBQUEsT0FBTyxFQUFFTCxLQUFLLENBQUNLO0FBRlYsYUFBUDtBQUlEOztBQUNELGlCQUFPRixTQUFQO0FBQ0QsU0FoQlksRUFpQmJHLE1BakJhLENBa0JiLFVBQUNOLEtBQUQ7QUFBQSxpQkFBV0EsS0FBWDtBQUFBLFNBbEJhLENBQWY7QUFvQkEsa0NBQWNULEdBQWQsRUFBbUJPLE1BQW5CLEVBQTJCLFFBQTNCO0FBQ0EsZUFBTywwQkFBY04sSUFBZCxFQUFvQk0sTUFBcEIsQ0FBUDtBQUNEO0FBQ0Y7Ozs7OztlQUdZVixnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBFeGNlcHRpb24sIElNQ1JlcXVlc3QsIElNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IGFkZFRvUmVzcG9uc2UsIGNhdGNoTWlkZGxld2FyZSwgaGFzQXV0aG9yaXphdGlvbiwgbmV4dEFuZFJldHVybiB9IGZyb20gJ0Byb290L2FwaS91dGlscydcbmltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCB7IElUYWJsZUluZm8gfSBmcm9tICdAcm9vdC9jb25maWdHZW5lcmF0b3InXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdmdW5mdW56bWM6Y29udHJvbGxlci10YWJsZXMnKVxuXG5jbGFzcyBUYWJsZXNDb250cm9sbGVyIHtcbiAgcHVibGljIHNldHRpbmdzOiBJVGFibGVJbmZvW11cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZGVidWcoJ0NyZWF0ZWQnKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBjb25maWcoKS5zZXR0aW5nc1xuICB9XG5cbiAgcHVibGljIGdldFRhYmxlcyhyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNhdGNoTWlkZGxld2FyZShuZXh0KShuZXcgSHR0cEV4Y2VwdGlvbig0MDQsICdUYWJsZXMgbm90IGZvdW5kJykpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB1c2VyUm9sZXM6IHN0cmluZ1tdID0gW11cbiAgICAgIGlmIChyZXEudXNlciAmJiByZXEudXNlci5yb2xlcykge1xuICAgICAgICB1c2VyUm9sZXMgPSByZXEudXNlci5yb2xlc1xuICAgICAgfVxuICAgICAgY29uc3QgdGFibGVzID0gdGhpcy5zZXR0aW5ncy5tYXAoXG4gICAgICAgICh0YWJsZTogSVRhYmxlSW5mbykgPT4ge1xuICAgICAgICAgIGxldCBpc0F1dGhvcml6ZWQ6IGJvb2xlYW4gPSB0cnVlXG4gICAgICAgICAgaWYgKCF0YWJsZS52aXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0YWJsZS5yb2xlcyAmJiB0YWJsZS5yb2xlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlzQXV0aG9yaXplZCA9IGhhc0F1dGhvcml6YXRpb24odGFibGUucm9sZXMsIHVzZXJSb2xlcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzQXV0aG9yaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgbmFtZTogdGFibGUubmFtZSxcbiAgICAgICAgICAgICAgdmVyYm9zZTogdGFibGUudmVyYm9zZSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICApLmZpbHRlcihcbiAgICAgICAgKHRhYmxlKSA9PiB0YWJsZVxuICAgICAgKVxuICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHRhYmxlcywgJ3RhYmxlcycpXG4gICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KSh0YWJsZXMpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlc0NvbnRyb2xsZXJcbiJdfQ==