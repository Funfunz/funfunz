"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TableController = _interopRequireDefault(require("../controllers/TableController"));

var _TablesController = _interopRequireDefault(require("../controllers/TablesController"));

var _response = require("../middleware/response");

var _configLoader = _interopRequireDefault(require("../utils/configLoader"));

var _express = require("express");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

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
    this.router.get('/table/:table/config', function (req, res, next) {
      tableController.getTableConfig(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.get('/table/:table/count', function (req, res, next) {
      tableController.getTableCount(req, res, next);
    }, (0, _response.sendJSON)('count'));
    this.router.get('/table/:table', function (req, res, next) {
      tableController.getTableData(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.get('/:table/:id', function (req, res, next) {
      tableController.getRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.put('/:table/:id', function (req, res, next) {
      tableController.updateRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.post('/:table', function (req, res, next) {
      tableController.insertRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.delete('/:table/:id', function (req, res, next) {
      tableController.deleteRow(req, res, next);
    }, (0, _response.sendJSON)('results'));

    if ((0, _configLoader.default)().defaultInterface) {
      this.router.get('*', function (req, res) {
        _fs.default.readFile(_path.default.join(__dirname, '../public/index.html'), function (err, data) {
          if (err) {
            res.status(500).send({
              error: 'No html available'
            });
          } else {
            res.set('Content-Type', 'text/html');
            res.send(data);
          }
        });
      });
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbIkluZGV4Um91dGVyIiwicm91dGVyIiwidGFibGVzQ29udHJvbGxlciIsIlRhYmxlc0NvbnRyb2xsZXIiLCJ0YWJsZUNvbnRyb2xsZXIiLCJUYWJsZUNvbnRyb2xsZXIiLCJnZXQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZ2V0VGFibGVzIiwiZ2V0VGFibGVDb25maWciLCJnZXRUYWJsZUNvdW50IiwiZ2V0VGFibGVEYXRhIiwiZ2V0Um93IiwicHV0IiwidXBkYXRlUm93IiwicG9zdCIsImluc2VydFJvdyIsImRlbGV0ZSIsImRlbGV0ZVJvdyIsImRlZmF1bHRJbnRlcmZhY2UiLCJmcyIsInJlYWRGaWxlIiwicGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJlcnIiLCJkYXRhIiwic3RhdHVzIiwic2VuZCIsImVycm9yIiwic2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxXOzs7QUFFSix1QkFBWUMsTUFBWixFQUE2QjtBQUFBOztBQUFBOztBQUMzQixRQUFNQyxnQkFBZ0IsR0FBRyxJQUFJQyx5QkFBSixFQUF6QjtBQUNBLFFBQU1DLGVBQWUsR0FBRyxJQUFJQyx3QkFBSixFQUF4QjtBQUVBLFNBQUtKLE1BQUwsR0FBY0EsTUFBTSxJQUFJLHNCQUF4QjtBQUNBLFNBQUtBLE1BQUwsQ0FBWUssR0FBWixDQUFnQixTQUFoQixFQUNFLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCUCxNQUFBQSxnQkFBZ0IsQ0FBQ1EsU0FBakIsQ0FBMkJILEdBQTNCLEVBQWdDQyxHQUFoQyxFQUFxQ0MsSUFBckM7QUFDRCxLQUhILEVBSUUsd0JBQVMsUUFBVCxDQUpGO0FBTUEsU0FBS1IsTUFBTCxDQUFZSyxHQUFaLENBQWdCLHNCQUFoQixFQUNFLFVBQUNDLEdBQUQs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L2NvbnRyb2xsZXJzL1RhYmxlQ29udHJvbGxlcidcbmltcG9ydCBUYWJsZXNDb250cm9sbGVyIGZyb20gJ0Byb290L2FwaS9jb250cm9sbGVycy9UYWJsZXNDb250cm9sbGVyJ1xuaW1wb3J0IHsgc2VuZEpTT04gfSBmcm9tICdAcm9vdC9hcGkvbWlkZGxld2FyZS9yZXNwb25zZSdcbmltcG9ydCBjb25maWcgZnJvbSAnQHJvb3QvYXBpL3V0aWxzL2NvbmZpZ0xvYWRlcidcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2V4cHJlc3MnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5jbGFzcyBJbmRleFJvdXRlciB7XG4gIHB1YmxpYyByb3V0ZXI6IFJvdXRlclxuICBjb25zdHJ1Y3Rvcihyb3V0ZXI/OiBSb3V0ZXIpIHtcbiAgICBjb25zdCB0YWJsZXNDb250cm9sbGVyID0gbmV3IFRhYmxlc0NvbnRyb2xsZXIoKVxuICAgIGNvbnN0IHRhYmxlQ29udHJvbGxlciA9IG5ldyBUYWJsZUNvbnRyb2xsZXIoKVxuXG4gICAgdGhpcy5yb3V0ZXIgPSByb3V0ZXIgfHwgUm91dGVyKClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy90YWJsZXMnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlc0NvbnRyb2xsZXIuZ2V0VGFibGVzKHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCd0YWJsZXMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy90YWJsZS86dGFibGUvY29uZmlnJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIuZ2V0VGFibGVDb25maWcocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy90YWJsZS86dGFibGUvY291bnQnLFxuICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgdGFibGVDb250cm9sbGVyLmdldFRhYmxlQ291bnQocmVxLCByZXMsIG5leHQpXG4gICAgfSxcbiAgICBzZW5kSlNPTignY291bnQnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy90YWJsZS86dGFibGUnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci5nZXRUYWJsZURhdGEocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5nZXQoJy86dGFibGUvOmlkJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIuZ2V0Um93KHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCdyZXN1bHRzJylcbiAgICApXG4gICAgdGhpcy5yb3V0ZXIucHV0KCcvOnRhYmxlLzppZCcsXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgdGFibGVDb250cm9sbGVyLnVwZGF0ZVJvdyhyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigncmVzdWx0cycpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLnBvc3QoJy86dGFibGUnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci5pbnNlcnRSb3cocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5kZWxldGUoJy86dGFibGUvOmlkJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIuZGVsZXRlUm93KHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCdyZXN1bHRzJylcbiAgICApXG5cbiAgICBpZiAoY29uZmlnKCkuZGVmYXVsdEludGVyZmFjZSkge1xuICAgICAgdGhpcy5yb3V0ZXIuZ2V0KCcqJywgZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICAgICAgZnMucmVhZEZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3B1YmxpYy9pbmRleC5odG1sJyksIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKHtlcnJvcjogJ05vIGh0bWwgYXZhaWxhYmxlJ30pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKVxuICAgICAgICAgICAgcmVzLnNlbmQoZGF0YSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRSb3V0ZXIoKTogUm91dGVyIHtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbmRleFJvdXRlclxuIl19