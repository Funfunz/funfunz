"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TableController = _interopRequireDefault(require("../controllers/TableController"));

var _TablesController = _interopRequireDefault(require("../controllers/TablesController"));

var _response = require("../middleware/response");

var _express = require("express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var IndexRouter =
/*#__PURE__*/
function () {
  function IndexRouter(router) {
    _classCallCheck(this, IndexRouter);

    _defineProperty(this, "router", void 0);

    var tablesController = new _TablesController.default();
    var tableController = new _TableController.default();
    this.router = router || (0, _express.Router)();
    this.router.get('/tables', function (req, res, next) {
      tablesController.getTables(req, res, next);
    }, (0, _response.sendJSON)('tables'));
    this.router.get('/table/:table', function (req, res, next) {
      tableController.getTableData(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.put('/', function (req, res, next) {
      tableController.updateRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.post('/:table', function (req, res, next) {
      tableController.insertRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.delete('/:table/:id', function (req, res, next) {
      tableController.deleteRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
  }

  _createClass(IndexRouter, [{
    key: "getRouter",
    value: function getRouter() {
      return this.router;
    }
  }]);

  return IndexRouter;
}();

var _default = IndexRouter;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbIkluZGV4Um91dGVyIiwicm91dGVyIiwidGFibGVzQ29udHJvbGxlciIsIlRhYmxlc0NvbnRyb2xsZXIiLCJ0YWJsZUNvbnRyb2xsZXIiLCJUYWJsZUNvbnRyb2xsZXIiLCJnZXQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZ2V0VGFibGVzIiwiZ2V0VGFibGVEYXRhIiwicHV0IiwidXBkYXRlUm93IiwicG9zdCIsImluc2VydFJvdyIsImRlbGV0ZSIsImRlbGV0ZVJvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsVzs7O0FBRUosdUJBQVlDLE1BQVosRUFBNkI7QUFBQTs7QUFBQTs7QUFDM0IsUUFBTUMsZ0JBQWdCLEdBQUcsSUFBSUMseUJBQUosRUFBekI7QUFDQSxRQUFNQyxlQUFlLEdBQUcsSUFBSUMsd0JBQUosRUFBeEI7QUFFQSxTQUFLSixNQUFMLEdBQWNBLE1BQU0sSUFBSSxzQkFBeEI7QUFDQSxTQUFLQSxNQUFMLENBQVlLLEdBQVosQ0FBZ0IsU0FBaEIsRUFDRSxVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQlAsTUFBQUEsZ0JBQWdCLENBQUNRLFNBQWpCLENBQTJCSCxHQUEzQixFQUFnQ0MsR0FBaEMsRUFBcUNDLElBQXJDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFFBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWUssR0FBWixDQUFnQixlQUFoQixFQUNFLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNPLFlBQWhCLENBQTZCSixHQUE3QixFQUFrQ0MsR0FBbEMsRUFBdUNDLElBQXZDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWVcsR0FBWixDQUFnQixHQUFoQixFQUNFLFVBQUNMLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNTLFNBQWhCLENBQTBCTixHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLElBQXBDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWWEsSUFBWixDQUFpQixTQUFqQixFQUNFLFVBQUNQLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNXLFNBQWhCLENBQTBCUixHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLElBQXBDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWWUsTUFBWixDQUFtQixhQUFuQixFQUNFLFVBQUNULEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNhLFNBQWhCLENBQTBCVixHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLElBQXBDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1EOzs7O2dDQUUwQjtBQUN6QixhQUFPLEtBQUtSLE1BQVo7QUFDRDs7Ozs7O2VBR1lELFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFibGVDb250cm9sbGVyIGZyb20gJ0Byb290L2FwaS9jb250cm9sbGVycy9UYWJsZUNvbnRyb2xsZXInXG5pbXBvcnQgVGFibGVzQ29udHJvbGxlciBmcm9tICdAcm9vdC9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlcidcbmltcG9ydCB7IHNlbmRKU09OIH0gZnJvbSAnQHJvb3QvYXBpL21pZGRsZXdhcmUvcmVzcG9uc2UnXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJ1xuXG5jbGFzcyBJbmRleFJvdXRlciB7XG4gIHB1YmxpYyByb3V0ZXI6IFJvdXRlclxuICBjb25zdHJ1Y3Rvcihyb3V0ZXI/OiBSb3V0ZXIpIHtcbiAgICBjb25zdCB0YWJsZXNDb250cm9sbGVyID0gbmV3IFRhYmxlc0NvbnRyb2xsZXIoKVxuICAgIGNvbnN0IHRhYmxlQ29udHJvbGxlciA9IG5ldyBUYWJsZUNvbnRyb2xsZXIoKVxuXG4gICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXIgfHwgUm91dGVyKClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy90YWJsZXMnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlc0NvbnRyb2xsZXIuZ2V0VGFibGVzKHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCd0YWJsZXMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy90YWJsZS86dGFibGUnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci5nZXRUYWJsZURhdGEocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5wdXQoJy8nLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci51cGRhdGVSb3cocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5wb3N0KCcvOnRhYmxlJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIuaW5zZXJ0Um93KHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCdyZXN1bHRzJylcbiAgICApXG4gICAgdGhpcy5yb3V0ZXIuZGVsZXRlKCcvOnRhYmxlLzppZCcsXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgdGFibGVDb250cm9sbGVyLmRlbGV0ZVJvdyhyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigncmVzdWx0cycpXG4gICAgKVxuICB9XG5cbiAgcHVibGljIGdldFJvdXRlcigpOiBSb3V0ZXIge1xuICAgIHJldHVybiB0aGlzLnJvdXRlclxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEluZGV4Um91dGVyXG4iXX0=