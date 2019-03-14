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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvcm91dGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbIkluZGV4Um91dGVyIiwicm91dGVyIiwidGFibGVzQ29udHJvbGxlciIsIlRhYmxlc0NvbnRyb2xsZXIiLCJ0YWJsZUNvbnRyb2xsZXIiLCJUYWJsZUNvbnRyb2xsZXIiLCJnZXQiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZ2V0VGFibGVzIiwiZ2V0VGFibGVEYXRhIiwicHV0IiwidXBkYXRlUm93IiwicG9zdCIsImluc2VydFJvdyIsImRlbGV0ZSIsImRlbGV0ZVJvdyIsImZzIiwicmVhZEZpbGUiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImVyciIsImRhdGEiLCJzdGF0dXMiLCJzZW5kIiwiZXJyb3IiLCJzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLFc7OztBQUVKLHVCQUFZQyxNQUFaLEVBQTZCO0FBQUE7O0FBQUE7O0FBQzNCLFFBQU1DLGdCQUFnQixHQUFHLElBQUlDLHlCQUFKLEVBQXpCO0FBQ0EsUUFBTUMsZUFBZSxHQUFHLElBQUlDLHdCQUFKLEVBQXhCO0FBRUEsU0FBS0osTUFBTCxHQUFjQSxNQUFNLElBQUksc0JBQXhCO0FBQ0EsU0FBS0EsTUFBTCxDQUFZSyxHQUFaLENBQWdCLFNBQWhCLEVBQ0UsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDbEJQLE1BQUFBLGdCQUFnQixDQUFDUSxTQUFqQixDQUEyQkgsR0FBM0IsRUFBZ0NDLEdBQWhDLEVBQXFDQyxJQUFyQztBQUNELEtBSEgsRUFJRSx3QkFBUyxRQUFULENBSkY7QUFNQSxTQUFLUixNQUFMLENBQVlLLEdBQVosQ0FBZ0IsZUFBaEIsRUFDRSxVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQkwsTUFBQUEsZUFBZSxDQUFDTyxZQUFoQixDQUE2QkosR0FBN0IsRUFBa0NDLEdBQWxDLEVBQXVDQyxJQUF2QztBQUNELEtBSEgsRUFJRSx3QkFBUyxTQUFULENBSkY7QUFNQSxTQUFLUixNQUFMLENBQVlXLEdBQVosQ0FBZ0IsR0FBaEIsRUFDRSxVQUFDTCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQkwsTUFBQUEsZUFBZSxDQUFDUyxTQUFoQixDQUEwQk4sR0FBMUIsRUFBK0JDLEdBQS9CLEVBQW9DQyxJQUFwQztBQUNELEtBSEgsRUFJRSx3QkFBUyxTQUFULENBSkY7QUFNQSxTQUFLUixNQUFMLENBQVlhLElBQVosQ0FBaUIsU0FBakIsRUFDRSxVQUFDUCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQkwsTUFBQUEsZUFBZSxDQUFDVyxTQUFoQixDQUEwQlIsR0FBMUIsRUFBK0JDLEdBQS9CLEVBQW9DQyxJQUFwQztBQUNELEtBSEgsRUFJRSx3QkFBUyxTQUFULENBSkY7QUFNQSxTQUFLUixNQUFMLENBQVllLE1BQVosQ0FBbUIsYUFBbkIsRUFDRSxVQUFDVCxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQkwsTUFBQUEsZUFBZSxDQUFDYSxTQUFoQixDQUEwQlYsR0FBMUIsRUFBK0JDLEdBQS9CLEVBQW9DQyxJQUFwQztBQUNELEtBSEgsRUFJRSx3QkFBUyxTQUFULENBSkY7QUFPQSxTQUFLUixNQUFMLENBQVlLLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CO0FBQ3RDVSxrQkFBR0MsUUFBSCxDQUFZQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsc0JBQXJCLENBQVosRUFBMEQsVUFBU0MsR0FBVCxFQUFjQyxJQUFkLEVBQW9CO0FBQzVFLFlBQUlELEdBQUosRUFBUztBQUNQZixVQUFBQSxHQUFHLENBQUNpQixNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEIsQ0FBcUI7QUFBQ0MsWUFBQUEsS0FBSyxFQUFFO0FBQVIsV0FBckI7QUFDRCxTQUZELE1BRU87QUFDTG5CLFVBQUFBLEdBQUcsQ0FBQ29CLEdBQUosQ0FBUSxjQUFSLEVBQXdCLFdBQXhCO0FBQ0FwQixVQUFBQSxHQUFHLENBQUNrQixJQUFKLENBQVNGLElBQVQ7QUFDRDtBQUNGLE9BUEQ7QUFRRCxLQVREO0FBVUQ7Ozs7Z0NBRTBCO0FBQ3pCLGFBQU8sS0FBS3ZCLE1BQVo7QUFDRDs7Ozs7O2VBR1lELFciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFibGVDb250cm9sbGVyIGZyb20gJ0Byb290L2FwaS9jb250cm9sbGVycy9UYWJsZUNvbnRyb2xsZXInXG5pbXBvcnQgVGFibGVzQ29udHJvbGxlciBmcm9tICdAcm9vdC9hcGkvY29udHJvbGxlcnMvVGFibGVzQ29udHJvbGxlcidcbmltcG9ydCB7IHNlbmRKU09OIH0gZnJvbSAnQHJvb3QvYXBpL21pZGRsZXdhcmUvcmVzcG9uc2UnXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuY2xhc3MgSW5kZXhSb3V0ZXIge1xuICBwdWJsaWMgcm91dGVyOiBSb3V0ZXJcbiAgY29uc3RydWN0b3Iocm91dGVyPzogUm91dGVyKSB7XG4gICAgY29uc3QgdGFibGVzQ29udHJvbGxlciA9IG5ldyBUYWJsZXNDb250cm9sbGVyKClcbiAgICBjb25zdCB0YWJsZUNvbnRyb2xsZXIgPSBuZXcgVGFibGVDb250cm9sbGVyKClcblxuICAgIHRoaXMucm91dGVyID0gcm91dGVyIHx8IFJvdXRlcigpXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvdGFibGVzJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZXNDb250cm9sbGVyLmdldFRhYmxlcyhyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigndGFibGVzJylcbiAgICApXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvdGFibGUvOnRhYmxlJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIuZ2V0VGFibGVEYXRhKHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCdyZXN1bHRzJylcbiAgICApXG4gICAgdGhpcy5yb3V0ZXIucHV0KCcvJyxcbiAgICAgIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICB0YWJsZUNvbnRyb2xsZXIudXBkYXRlUm93KHJlcSwgcmVzLCBuZXh0KVxuICAgICAgfSxcbiAgICAgIHNlbmRKU09OKCdyZXN1bHRzJylcbiAgICApXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLzp0YWJsZScsXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgdGFibGVDb250cm9sbGVyLmluc2VydFJvdyhyZXEsIHJlcywgbmV4dClcbiAgICAgIH0sXG4gICAgICBzZW5kSlNPTigncmVzdWx0cycpXG4gICAgKVxuICAgIHRoaXMucm91dGVyLmRlbGV0ZSgnLzp0YWJsZS86aWQnLFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIHRhYmxlQ29udHJvbGxlci5kZWxldGVSb3cocmVxLCByZXMsIG5leHQpXG4gICAgICB9LFxuICAgICAgc2VuZEpTT04oJ3Jlc3VsdHMnKVxuICAgIClcblxuICAgIHRoaXMucm91dGVyLmdldCgnKicsIGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgICBmcy5yZWFkRmlsZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vcHVibGljL2luZGV4Lmh0bWwnKSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCh7ZXJyb3I6ICdObyBodG1sIGF2YWlsYWJsZSd9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcy5zZXQoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L2h0bWwnKVxuICAgICAgICAgIHJlcy5zZW5kKGRhdGEpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBnZXRSb3V0ZXIoKTogUm91dGVyIHtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbmRleFJvdXRlclxuIl19