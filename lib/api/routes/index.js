"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TableController = _interopRequireDefault(require("../controllers/TableController"));

var _TablesController = _interopRequireDefault(require("../controllers/TablesController"));

var _response = require("../middleware/response");

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
    this.router.put('/', function (req, res, next) {
      tableController.updateRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.post('/:table', function (req, res, next) {
      tableController.insertRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
    this.router.delete('/:table/:id', function (req, res, next) {
      tableController.deleteRow(req, res, next);
    }, (0, _response.sendJSON)('results'));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbIkluZGV4Um91dGVyIiwicm91dGVyIiwidGFibGVzQ29udHJvbGxlciIsIlRhYmxlc0NvbnRyb2xsZXIiLCJ0YWJsZUNvbnRyb2xsZXIiLCJUYWJsZUNvbnRyb2xsZXIiLCJnZXQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZ2V0VGFibGVzIiwiZ2V0VGFibGVDb25maWciLCJnZXRUYWJsZUNvdW50IiwiZ2V0VGFibGVEYXRhIiwicHV0IiwidXBkYXRlUm93IiwicG9zdCIsImluc2VydFJvdyIsImRlbGV0ZSIsImRlbGV0ZVJvdyIsImZzIiwicmVhZEZpbGUiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImVyciIsImRhdGEiLCJzdGF0dXMiLCJzZW5kIiwiZXJyb3IiLCJzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLFc7OztBQUVKLHVCQUFZQyxNQUFaLEVBQTZCO0FBQUE7O0FBQUE7O0FBQzNCLFFBQU1DLGdCQUFnQixHQUFHLElBQUlDLHlCQUFKLEVBQXpCO0FBQ0EsUUFBTUMsZUFBZSxHQUFHLElBQUlDLHdCQUFKLEVBQXhCO0FBRUEsU0FBS0osTUFBTCxHQUFjQSxNQUFNLElBQUksc0JBQXhCO0FBQ0EsU0FBS0EsTUFBTCxDQUFZSyxHQUFaLENBQWdCLFNBQWhCLEVBQ0UsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDbEJQLE1BQUFBLGdCQUFnQixDQUFDUSxTQUFqQixDQUEyQkgsR0FBM0IsRUFBZ0NDLEdBQWhDLEVBQXFDQyxJQUFyQztBQUNELEtBSEgsRUFJRSx3QkFBUyxRQUFULENBSkY7QUFNQSxTQUFLUixNQUFMLENBQVlLLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQ0UsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDbEJMLE1BQUFBLGVBQWUsQ0FBQ08sY0FBaEIsQ0FBK0JKLEdBQS9CLEVBQW9DQyxHQUFwQyxFQUF5Q0MsSUFBekM7QUFDRCxLQUhILEVBSUUsd0JBQVMsU0FBVCxDQUpGO0FBTUEsU0FBS1IsTUFBTCxDQUFZSyxHQUFaLENBQWdCLHFCQUFoQixFQUNBLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNRLGFBQWhCLENBQThCTCxHQUE5QixFQUFtQ0MsR0FBbkMsRUFBd0NDLElBQXhDO0FBQ0QsS0FIRCxFQUlBLHdCQUFTLE9BQVQsQ0FKQTtBQU1BLFNBQUtSLE1BQUwsQ0FBWUssR0FBWixDQUFnQixlQUFoQixFQUNFLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNTLFlBQWhCLENBQTZCTixHQUE3QixFQUFrQ0MsR0FBbEMsRUFBdUNDLElBQXZDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWWEsR0FBWixDQUFnQixHQUFoQixFQUNFLFVBQUNQLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNXLFNBQWhCLENBQTBCUixHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLElBQXBDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWWUsSUFBWixDQUFpQixTQUFqQixFQUNFLFVBQUNULEdBQUQsRUFBTUMsR0FBTixFQUFXQyxJQUFYLEVBQW9CO0FBQ2xCTCxNQUFBQSxlQUFlLENBQUNhLFNBQWhCLENBQTBCVixHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLElBQXBDO0FBQ0QsS0FISCxFQUlFLHdCQUFTLFNBQVQsQ0FKRjtBQU1BLFNBQUtSLE1BQUwsQ0FBWWlCLE1BQVosQ0FBbUIsYUFBbkIsRUFDRSxVQUFDWCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQkwsTUFBQUEsZUFBZSxDQUFDZSxTQUFoQixDQUEwQlosR0FBMUIsRUFBK0JDLEdBQS9CLEVBQW9DQyxJQUFwQztBQUNELEtBSEgsRUFJRSx3QkFBUyxTQUFULENBSkY7QUFPQSxTQUFLUixNQUFMLENBQVlLLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CO0FBQ3RDWSxrQkFBR0MsUUFBSCxDQUFZQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsc0JBQXJCLENBQVosRUFBMEQsVUFBU0MsR0FBVCxFQUFjQyxJQUFkLEVBQW9CO0FBQzVFLFlBQUlELEdBQUosRUFBUztBQUNQakIsVUFBQUEsR0FBRyxDQUFDbUIsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLENBQXFCO0FBQUNDLFlBQUFBLEtBQUssRUFBRTtBQUFSLFdBQXJCO0FBQ0QsU0FGRCxNQUVPO0FBQ0xyQixVQUFBQSxHQUFHLENBQUNzQixHQUFKLENBQVEsY0FBUixFQUF3QixXQUF4QjtBQUNBdEIsVUFBQUEsR0FBRyxDQUFDb0IsSUFBSixDQUFTRixJQUFUO0FBQ0Q7QUFDRixPQVBEO0FBUUQsS0FURDtBQVVEOzs7O2dDQUUwQjtBQUN6QixhQUFPLEtBQUt6QixNQUFaO0FBQ0Q7Ozs7OztlQUdZRCxXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhYmxlQ29udHJvbGxlciBmcm9tICdAcm9vdC9hcGkvY29udHJvbGxlcnMvVGFibGVDb250cm9sbGVyJ1xuaW1wb3J0IFRhYmxlc0NvbnRyb2xsZXIgZnJvbSAnQHJvb3QvYXBpL2NvbnRyb2xsZXJzL1RhYmxlc0NvbnRyb2xsZXInXG5pbXBvcnQgeyBzZW5kSlNPTiB9IGZyb20gJ0Byb290L2FwaS9taWRkbGV3YXJlL3Jlc3BvbnNlJ1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnZXhwcmVzcydcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNsYXNzIEluZGV4Um91dGVyIHtcbiAgcHVibGljIHJvdXRlcjogUm91dGVyXG4gIGNvbnN0cnVjdG9yKHJvdXRlcj86IFJvdXRlcikge1xuICAgIGNvbnN0IHRhYmxlc0NvbnRyb2xsZXIgPSBuZXcgVGFibGVzQ29udHJvbGxlcigpXG4gICAgY29uc3QgdGFibGVDb250cm9sbGVyID0gbmV3IFRhYmxlQ29udHJvbGxlcigpXG5cbiAgICB0aGlzLnJvdXRlciA9IHJvdXRlciB8fCBSb3V0ZXIoKVxuICAgIHRoaXMucm91dGVyLmdldCgnL3RhYmxlcycsXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgdGFibGVzQ29udHJvbGxlci5nZXRUYWJsZXMocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3RhYmxlcycpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLmdldCgnL3RhYmxlLzp0YWJsZS9jb25maWcnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci5nZXRUYWJsZUNvbmZpZyhyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigncmVzdWx0cycpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLmdldCgnL3RhYmxlLzp0YWJsZS9jb3VudCcsXG4gICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICB0YWJsZUNvbnRyb2xsZXIuZ2V0VGFibGVDb3VudChyZXEsIHJlcywgbmV4dClcbiAgICB9LFxuICAgIHNlbmRKU09OKCdjb3VudCcpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLmdldCgnL3RhYmxlLzp0YWJsZScsXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgdGFibGVDb250cm9sbGVyLmdldFRhYmxlRGF0YShyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigncmVzdWx0cycpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLnB1dCgnLycsXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgdGFibGVDb250cm9sbGVyLnVwZGF0ZVJvdyhyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigncmVzdWx0cycpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLnBvc3QoJy86dGFibGUnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci5pbnNlcnRSb3cocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcbiAgICB0aGlzLnJvdXRlci5kZWxldGUoJy86dGFibGUvOmlkJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIuZGVsZXRlUm93KHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCdyZXN1bHRzJylcbiAgICApXG5cbiAgICB0aGlzLnJvdXRlci5nZXQoJyonLCBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgICAgZnMucmVhZEZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3B1YmxpYy9pbmRleC5odG1sJyksIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoe2Vycm9yOiAnTm8gaHRtbCBhdmFpbGFibGUnfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXMuc2V0KCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sJylcbiAgICAgICAgICByZXMuc2VuZChkYXRhKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgZ2V0Um91dGVyKCk6IFJvdXRlciB7XG4gICAgcmV0dXJuIHRoaXMucm91dGVyXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW5kZXhSb3V0ZXJcbiJdfQ==