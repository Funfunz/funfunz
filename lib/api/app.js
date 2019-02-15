"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _types = require("./types");

var _debug = _interopRequireDefault(require("debug"));

var _db = _interopRequireDefault(require("./db"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug.default)('cpmbg:setup');
/** Class representing the express server instance. */

var App =
/**
* Create an express server instance.
*/
function App() {
  _classCallCheck(this, App);

  _defineProperty(this, "server", void 0);

  debug('start');

  _db.default.initDB();

  this.server = (0, _express.default)();
  this.server.use((0, _cors.default)()); // view ngine setup

  this.server.set('views', _path.default.join(__dirname, 'views'));
  this.server.set('view engine', 'jade'); // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

  this.server.use((0, _morgan.default)('dev'));
  this.server.use(_bodyParser.default.json());
  this.server.use(_bodyParser.default.urlencoded({
    extended: false
  }));
  this.server.use(_bodyParser.default.json());
  this.server.use(_bodyParser.default.urlencoded({
    extended: false
  })); // this.server.use(fileUpload())

  this.server.use((0, _cookieParser.default)());
  this.server.use(_express.default.static(_path.default.join(__dirname, '../public')));
  var indexRouter = new _routes.default();
  this.server.use('/', indexRouter.getRouter()); // catch 404 and forward to error handler

  this.server.use(function (req, res, next) {
    var err = new _types.HttpException(404, 'Not Found');
    err.status = 404;
    next(err);
  }); // error handler

  var erroHandler = function erroHandler(err, req, res) {
    res.status(err.status || 500);
    res.json({
      message: err.message
    });
  };

  this.server.use(erroHandler);
  debug('end');
};

var _default = App;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvYXBwLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiQXBwIiwiZGF0YWJhc2UiLCJpbml0REIiLCJzZXJ2ZXIiLCJ1c2UiLCJzZXQiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImJvZHlQYXJzZXIiLCJqc29uIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwiZXhwcmVzcyIsInN0YXRpYyIsImluZGV4Um91dGVyIiwiSW5kZXhSb3V0ZXIiLCJnZXRSb3V0ZXIiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZXJyIiwiSHR0cEV4Y2VwdGlvbiIsInN0YXR1cyIsImVycm9IYW5kbGVyIiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQU1BOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxvQkFBTSxhQUFOLENBQWQ7QUFFQTs7SUFDTUMsRztBQUNKOzs7QUFLQSxlQUFlO0FBQUE7O0FBQUE7O0FBQ2JELEVBQUFBLEtBQUssQ0FBQyxPQUFELENBQUw7O0FBQ0FFLGNBQVNDLE1BQVQ7O0FBQ0EsT0FBS0MsTUFBTCxHQUFjLHVCQUFkO0FBRUEsT0FBS0EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLG9CQUFoQixFQUxhLENBT2I7O0FBQ0EsT0FBS0QsTUFBTCxDQUFZRSxHQUFaLENBQWdCLE9BQWhCLEVBQXlCQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsT0FBckIsQ0FBekI7QUFDQSxPQUFLTCxNQUFMLENBQVlFLEdBQVosQ0FBZ0IsYUFBaEIsRUFBK0IsTUFBL0IsRUFUYSxDQVdiO0FBQ0E7O0FBQ0EsT0FBS0YsTUFBTCxDQUFZQyxHQUFaLENBQWdCLHFCQUFPLEtBQVAsQ0FBaEI7QUFDQSxPQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0JLLG9CQUFXQyxJQUFYLEVBQWhCO0FBQ0EsT0FBS1AsTUFBTCxDQUFZQyxHQUFaLENBQWdCSyxvQkFBV0UsVUFBWCxDQUFzQjtBQUFFQyxJQUFBQSxRQUFRLEVBQUU7QUFBWixHQUF0QixDQUFoQjtBQUNBLE9BQUtULE1BQUwsQ0FBWUMsR0FBWixDQUFnQkssb0JBQVdDLElBQVgsRUFBaEI7QUFDQSxPQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0JLLG9CQUFXRSxVQUFYLENBQXNCO0FBQUVDLElBQUFBLFFBQVEsRUFBRTtBQUFaLEdBQXRCLENBQWhCLEVBakJhLENBa0JiOztBQUNBLE9BQUtULE1BQUwsQ0FBWUMsR0FBWixDQUFnQiw0QkFBaEI7QUFDQSxPQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0JTLGlCQUFRQyxNQUFSLENBQWVSLGNBQUtDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixXQUFyQixDQUFmLENBQWhCO0FBRUEsTUFBTU8sV0FBVyxHQUFHLElBQUlDLGVBQUosRUFBcEI7QUFDQSxPQUFLYixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUJXLFdBQVcsQ0FBQ0UsU0FBWixFQUFyQixFQXZCYSxDQXlCYjs7QUFDQSxPQUFLZCxNQUFMLENBQVlDLEdBQVosQ0FDRSxVQUFDYyxHQUFELEVBQU1DLEdBQU4sRUFBV0MsSUFBWCxFQUFvQjtBQUNsQixRQUFNQyxHQUFHLEdBQUcsSUFBSUMsb0JBQUosQ0FBa0IsR0FBbEIsRUFBdUIsV0FBdkIsQ0FBWjtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLE1BQUosR0FBYSxHQUFiO0FBQ0FILElBQUFBLElBQUksQ0FBQ0MsR0FBRCxDQUFKO0FBQ0QsR0FMSCxFQTFCYSxDQWtDYjs7QUFDQSxNQUFNRyxXQUF3QyxHQUFHLFNBQTNDQSxXQUEyQyxDQUFDSCxHQUFELEVBQU1ILEdBQU4sRUFBV0MsR0FBWCxFQUFtQjtBQUNsRUEsSUFBQUEsR0FBRyxDQUFDSSxNQUFKLENBQVdGLEdBQUcsQ0FBQ0UsTUFBSixJQUFjLEdBQXpCO0FBQ0FKLElBQUFBLEdBQUcsQ0FBQ1QsSUFBSixDQUFTO0FBQ1BlLE1BQUFBLE9BQU8sRUFBRUosR0FBRyxDQUFDSTtBQUROLEtBQVQ7QUFHRCxHQUxEOztBQU9BLE9BQUt0QixNQUFMLENBQVlDLEdBQVosQ0FBZ0JvQixXQUFoQjtBQUNBekIsRUFBQUEsS0FBSyxDQUFDLEtBQUQsQ0FBTDtBQUNELEM7O2VBR1lDLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnXG4vLyBpbXBvcnQgZmF2aWNvbiBmcm9tICdzZXJ2ZS1mYXZpY29uJ1xuaW1wb3J0IGxvZ2dlciBmcm9tICdtb3JnYW4nXG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcidcbmltcG9ydCBjb29raWVQYXJzZXIgZnJvbSAnY29va2llLXBhcnNlcidcbi8vIGltcG9ydCBmaWxlVXBsb2FkIGZyb20gJ2V4cHJlc3MtZmlsZXVwbG9hZCdcbmltcG9ydCB7IEh0dHBFeGNlcHRpb24gfSBmcm9tICdAcm9vdC9hcGkvdHlwZXMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcblxuLy8gcm91dGVzXG5pbXBvcnQgaW5kZXggZnJvbSAnQHJvb3QvYXBpL3JvdXRlcydcblxuLy8gZGF0YWJhc2VcbmltcG9ydCBkYXRhYmFzZSBmcm9tICdAcm9vdC9hcGkvZGInXG5pbXBvcnQgSW5kZXhSb3V0ZXIgZnJvbSAnQHJvb3QvYXBpL3JvdXRlcyc7XG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2NwbWJnOnNldHVwJylcblxuLyoqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgZXhwcmVzcyBzZXJ2ZXIgaW5zdGFuY2UuICovXG5jbGFzcyBBcHAge1xuICAvKipcbiAgKiBDcmVhdGUgYW4gZXhwcmVzcyBzZXJ2ZXIgaW5zdGFuY2UuXG4gICovXG5cbiAgc2VydmVyOiBleHByZXNzLkV4cHJlc3NcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIGRlYnVnKCdzdGFydCcpXG4gICAgZGF0YWJhc2UuaW5pdERCKClcbiAgICB0aGlzLnNlcnZlciA9IGV4cHJlc3MoKVxuXG4gICAgdGhpcy5zZXJ2ZXIudXNlKGNvcnMoKSlcblxuICAgIC8vIHZpZXcgbmdpbmUgc2V0dXBcbiAgICB0aGlzLnNlcnZlci5zZXQoJ3ZpZXdzJywgcGF0aC5qb2luKF9fZGlybmFtZSwgJ3ZpZXdzJykpXG4gICAgdGhpcy5zZXJ2ZXIuc2V0KCd2aWV3IGVuZ2luZScsICdqYWRlJylcblxuICAgIC8vIHVuY29tbWVudCBhZnRlciBwbGFjaW5nIHlvdXIgZmF2aWNvbiBpbiAvcHVibGljXG4gICAgLy8gYXBwLnVzZShmYXZpY29uKHBhdGguam9pbihfX2Rpcm5hbWUsICdwdWJsaWMnLCAnZmF2aWNvbi5pY28nKSkpO1xuICAgIHRoaXMuc2VydmVyLnVzZShsb2dnZXIoJ2RldicpKVxuICAgIHRoaXMuc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oKSlcbiAgICB0aGlzLnNlcnZlci51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuICAgIHRoaXMuc2VydmVyLnVzZShib2R5UGFyc2VyLmpzb24oKSlcbiAgICB0aGlzLnNlcnZlci51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKVxuICAgIC8vIHRoaXMuc2VydmVyLnVzZShmaWxlVXBsb2FkKCkpXG4gICAgdGhpcy5zZXJ2ZXIudXNlKGNvb2tpZVBhcnNlcigpKVxuICAgIHRoaXMuc2VydmVyLnVzZShleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vcHVibGljJykpKVxuXG4gICAgY29uc3QgaW5kZXhSb3V0ZXIgPSBuZXcgSW5kZXhSb3V0ZXIoKVxuICAgIHRoaXMuc2VydmVyLnVzZSgnLycsIGluZGV4Um91dGVyLmdldFJvdXRlcigpKVxuXG4gICAgLy8gY2F0Y2ggNDA0IGFuZCBmb3J3YXJkIHRvIGVycm9yIGhhbmRsZXJcbiAgICB0aGlzLnNlcnZlci51c2UoXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEh0dHBFeGNlcHRpb24oNDA0LCAnTm90IEZvdW5kJylcbiAgICAgICAgZXJyLnN0YXR1cyA9IDQwNFxuICAgICAgICBuZXh0KGVycilcbiAgICAgIH1cbiAgICApXG5cbiAgICAvLyBlcnJvciBoYW5kbGVyXG4gICAgY29uc3QgZXJyb0hhbmRsZXI6IGV4cHJlc3MuRXJyb3JSZXF1ZXN0SGFuZGxlciA9IChlcnIsIHJlcSwgcmVzKSA9PiB7XG4gICAgICByZXMuc3RhdHVzKGVyci5zdGF0dXMgfHwgNTAwKVxuICAgICAgcmVzLmpzb24oe1xuICAgICAgICBtZXNzYWdlOiBlcnIubWVzc2FnZSxcbiAgICAgIH0pXG4gICAgfVxuICBcbiAgICB0aGlzLnNlcnZlci51c2UoZXJyb0hhbmRsZXIpXG4gICAgZGVidWcoJ2VuZCcpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwXG4iXX0=