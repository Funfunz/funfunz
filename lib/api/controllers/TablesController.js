"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _utils = require("../utils");

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlci50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlRhYmxlc0NvbnRyb2xsZXIiLCJzZXR0aW5ncyIsInJlcSIsInJlcyIsIm5leHQiLCJsZW5ndGgiLCJ0YWJsZXMiLCJtYXAiLCJ0YWJsZSIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLDZCQUFOLENBQWQ7O0lBRU1DLGdCOzs7QUFFSiw4QkFBZTtBQUFBOztBQUFBOztBQUNiRCxJQUFBQSxLQUFLLENBQUMsU0FBRCxDQUFMO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQiw2QkFBU0EsUUFBekI7QUFDRDs7Ozs4QkFFVUMsRyxFQUFjQyxHLEVBQWlCQyxJLEVBQW9CO0FBQzVELFVBQUksQ0FBQyxLQUFLSCxRQUFOLElBQWtCLEtBQUtBLFFBQUwsQ0FBY0ksTUFBZCxLQUF5QixDQUEvQyxFQUFrRDtBQUNoRCxjQUFNLHVCQUFXLGtCQUFYLEVBQStCLEdBQS9CLENBQU47QUFDRCxPQUZELE1BRU87QUFDTCxZQUFNQyxNQUFNLEdBQUcsS0FBS0wsUUFBTCxDQUFjTSxHQUFkLENBQ2IsVUFBQUMsS0FBSztBQUFBLGlCQUFJQSxLQUFLLENBQUNDLElBQVY7QUFBQSxTQURRLENBQWY7QUFHQSxrQ0FBY04sR0FBZCxFQUFtQkcsTUFBbkIsRUFBMkIsUUFBM0I7QUFDQSxlQUFPLDBCQUFjRixJQUFkLEVBQW9CRSxNQUFwQixDQUFQO0FBQ0Q7QUFDRjs7Ozs7O2VBR1lOLGdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IHsgTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcyc7XG5pbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCB7IGJ1aWxkRXJyb3IsIGFkZFRvUmVzcG9uc2UsIG5leHRBbmRSZXR1cm4gfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29uZmlnIGZyb20gJ0Byb290L2FwaS91dGlscy9jb25maWdMb2FkZXInXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnptYzpjb250cm9sbGVyLXRhYmxlcycpXG5cbmNsYXNzIFRhYmxlc0NvbnRyb2xsZXIge1xuICBzZXR0aW5nczogQXJyYXk8YW55PlxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgZGVidWcoJ0NyZWF0ZWQnKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBjb25maWcoKS5zZXR0aW5nc1xuICB9XG5cbiAgZ2V0VGFibGVzIChyZXE6IFJlcXVlc3QsIHJlczogTUNSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBidWlsZEVycm9yKCdUYWJsZXMgbm90IGZvdW5kJywgNDA0KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YWJsZXMgPSB0aGlzLnNldHRpbmdzLm1hcChcbiAgICAgICAgdGFibGUgPT4gdGFibGUubmFtZVxuICAgICAgKVxuICAgICAgYWRkVG9SZXNwb25zZShyZXMsIHRhYmxlcywgJ3RhYmxlcycpXG4gICAgICByZXR1cm4gbmV4dEFuZFJldHVybihuZXh0KSh0YWJsZXMpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhYmxlc0NvbnRyb2xsZXJcbiJdfQ==