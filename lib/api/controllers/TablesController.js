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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlRhYmxlc0NvbnRyb2xsZXIiLCJzZXR0aW5ncyIsInJlcSIsInJlcyIsIm5leHQiLCJsZW5ndGgiLCJ1c2VyUm9sZXMiLCJ1c2VyIiwicm9sZXMiLCJ0YWJsZXMiLCJtYXAiLCJ0YWJsZSIsImlzQXV0aG9yaXplZCIsInZpc2libGUiLCJ1bmRlZmluZWQiLCJuYW1lIiwidmVyYm9zZSIsImZpbHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFHQSxJQUFNQSxLQUFLLEdBQUcsb0JBQU0sNkJBQU4sQ0FBZDs7SUFFTUMsZ0I7OztBQUVKLDhCQUFjO0FBQUE7O0FBQUE7O0FBQ1pELElBQUFBLEtBQUssQ0FBQyxTQUFELENBQUw7QUFDQSxTQUFLRSxRQUFMLEdBQWdCLDZCQUFTQSxRQUF6QjtBQUNEOzs7OzhCQUVnQkMsRyxFQUFpQkMsRyxFQUFrQkMsSSxFQUFvQjtBQUN0RSxVQUFJLENBQUMsS0FBS0gsUUFBTixJQUFrQixLQUFLQSxRQUFMLENBQWNJLE1BQWQsS0FBeUIsQ0FBL0MsRUFBa0Q7QUFDaEQsY0FBTSx1QkFBVyxrQkFBWCxFQUErQixHQUEvQixDQUFOO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSUMsU0FBbUIsR0FBRyxFQUExQjs7QUFDQSxZQUFJSixHQUFHLENBQUNLLElBQUosSUFBWUwsR0FBRyxDQUFDSyxJQUFKLENBQVNDLEtBQXpCLEVBQWdDO0FBQzlCRixVQUFBQSxTQUFTLEdBQUdKLEdBQUcsQ0FBQ0ssSUFBSixDQUFTQyxLQUFyQjtBQUNEOztBQUNELFlBQU1DLE1BQU0sR0FBRyxLQUFLUixRQUFMLENBQWNTLEdBQWQsQ0FDYixVQUFDQyxLQUFELEVBQXVCO0FBQ3JCLGNBQUlDLFlBQXFCLEdBQUcsSUFBNUI7O0FBQ0EsY0FBSSxDQUFDRCxLQUFLLENBQUNFLE9BQVgsRUFBb0I7QUFDbEIsbUJBQU9DLFNBQVA7QUFDRDs7QUFDRCxjQUFJSCxLQUFLLENBQUNILEtBQU4sSUFBZUcsS0FBSyxDQUFDSCxLQUFOLENBQVlILE1BQS9CLEVBQXVDO0FBQ3JDTyxZQUFBQSxZQUFZLEdBQUcsNkJBQWlCRCxLQUFLLENBQUNILEtBQXZCLEVBQThCRixTQUE5QixDQUFmO0FBQ0Q7O0FBQ0QsY0FBSU0sWUFBSixFQUFrQjtBQUNoQixtQkFBTztBQUNMRyxjQUFBQSxJQUFJLEVBQUVKLEtBQUssQ0FBQ0ksSUFEUDtBQUVMQyxjQUFBQSxPQUFPLEVBQUVMLEtBQUssQ0FBQ0s7QUFGVixhQUFQO0FBSUQ7O0FBQ0QsaUJBQU9GLFNBQVA7QUFDRCxTQWhCWSxFQWlCYkcsTUFqQmEsQ0FrQmIsVUFBQ04sS0FBRDtBQUFBLGlCQUFXQSxLQUFYO0FBQUEsU0FsQmEsQ0FBZjtBQW9CQSxrQ0FBY1IsR0FBZCxFQUFtQk0sTUFBbkIsRUFBMkIsUUFBM0I7QUFDQSxlQUFPLDBCQUFjTCxJQUFkLEVBQW9CSyxNQUFwQixDQUFQO0FBQ0Q7QUFDRjs7Ozs7O2VBR1lULGdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1DUmVxdWVzdCwgSU1DUmVzcG9uc2UgfSBmcm9tICdAcm9vdC9hcGkvdHlwZXMnO1xuaW1wb3J0IHsgYWRkVG9SZXNwb25zZSwgYnVpbGRFcnJvciwgaGFzQXV0aG9yaXphdGlvbiwgbmV4dEFuZFJldHVybiB9IGZyb20gJ0Byb290L2FwaS91dGlscydcbmltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCB7IElUYWJsZUluZm8gfSBmcm9tICdAcm9vdC9jb25maWdHZW5lcmF0b3InXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJ1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdmdW5mdW56bWM6Y29udHJvbGxlci10YWJsZXMnKVxuXG5jbGFzcyBUYWJsZXNDb250cm9sbGVyIHtcbiAgcHVibGljIHNldHRpbmdzOiBJVGFibGVJbmZvW11cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZGVidWcoJ0NyZWF0ZWQnKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBjb25maWcoKS5zZXR0aW5nc1xuICB9XG5cbiAgcHVibGljIGdldFRhYmxlcyhyZXE6IElNQ1JlcXVlc3QsIHJlczogSU1DUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xuICAgIGlmICghdGhpcy5zZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgYnVpbGRFcnJvcignVGFibGVzIG5vdCBmb3VuZCcsIDQwNClcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHVzZXJSb2xlczogc3RyaW5nW10gPSBbXVxuICAgICAgaWYgKHJlcS51c2VyICYmIHJlcS51c2VyLnJvbGVzKSB7XG4gICAgICAgIHVzZXJSb2xlcyA9IHJlcS51c2VyLnJvbGVzXG4gICAgICB9XG4gICAgICBjb25zdCB0YWJsZXMgPSB0aGlzLnNldHRpbmdzLm1hcChcbiAgICAgICAgKHRhYmxlOiBJVGFibGVJbmZvKSA9PiB7XG4gICAgICAgICAgbGV0IGlzQXV0aG9yaXplZDogYm9vbGVhbiA9IHRydWVcbiAgICAgICAgICBpZiAoIXRhYmxlLnZpc2libGUpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRhYmxlLnJvbGVzICYmIHRhYmxlLnJvbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaXNBdXRob3JpemVkID0gaGFzQXV0aG9yaXphdGlvbih0YWJsZS5yb2xlcywgdXNlclJvbGVzKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNBdXRob3JpemVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBuYW1lOiB0YWJsZS5uYW1lLFxuICAgICAgICAgICAgICB2ZXJib3NlOiB0YWJsZS52ZXJib3NlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgICkuZmlsdGVyKFxuICAgICAgICAodGFibGUpID0+IHRhYmxlXG4gICAgICApXG4gICAgICBhZGRUb1Jlc3BvbnNlKHJlcywgdGFibGVzLCAndGFibGVzJylcbiAgICAgIHJldHVybiBuZXh0QW5kUmV0dXJuKG5leHQpKHRhYmxlcylcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGFibGVzQ29udHJvbGxlclxuIl19