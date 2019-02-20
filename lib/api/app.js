"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("./db"));

var _routes = _interopRequireDefault(require("./routes"));

var _types = require("./types");

var _utils = require("./utils");

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _debug = _interopRequireDefault(require("debug"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug.default)('funfunzmc:init');
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
  this.server.use(_express.default.json());
  this.server.use(_express.default.urlencoded()); // this.server.use(fileUpload())

  this.server.use((0, _cookieParser.default)());
  this.server.use(_express.default.static(_path.default.join(__dirname, '../public')));
  var indexRouter = new _routes.default();
  this.server.use('/', indexRouter.getRouter()); // catch 404 and forward to error handler

  this.server.use(function (req, res, next) {
    var err = new _types.HttpException(404, 'Not Found');
    err.status = 404;
    next(err);
  });
  this.server.use(_utils.errorHandler);
  debug('end');
};

var _default = App;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvYXBwLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiQXBwIiwiZGF0YWJhc2UiLCJpbml0REIiLCJzZXJ2ZXIiLCJ1c2UiLCJzZXQiLCJwYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsImV4cHJlc3MiLCJqc29uIiwidXJsZW5jb2RlZCIsInN0YXRpYyIsImluZGV4Um91dGVyIiwiSW5kZXhSb3V0ZXIiLCJnZXRSb3V0ZXIiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZXJyIiwiSHR0cEV4Y2VwdGlvbiIsInN0YXR1cyIsImVycm9ySGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyxvQkFBTSxnQkFBTixDQUFkO0FBRUE7O0lBQ01DLEc7QUFDSjs7O0FBS0EsZUFBYztBQUFBOztBQUFBOztBQUNaRCxFQUFBQSxLQUFLLENBQUMsT0FBRCxDQUFMOztBQUNBRSxjQUFTQyxNQUFUOztBQUNBLE9BQUtDLE1BQUwsR0FBYyx1QkFBZDtBQUVBLE9BQUtBLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixvQkFBaEIsRUFMWSxDQU9aOztBQUNBLE9BQUtELE1BQUwsQ0FBWUUsR0FBWixDQUFnQixPQUFoQixFQUF5QkMsY0FBS0MsSUFBTCxDQUFVQyxTQUFWLEVBQXFCLE9BQXJCLENBQXpCO0FBQ0EsT0FBS0wsTUFBTCxDQUFZRSxHQUFaLENBQWdCLGFBQWhCLEVBQStCLE1BQS9CLEVBVFksQ0FXWjtBQUNBOztBQUNBLE9BQUtGLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixxQkFBTyxLQUFQLENBQWhCO0FBQ0EsT0FBS0QsTUFBTCxDQUFZQyxHQUFaLENBQWdCSyxpQkFBUUMsSUFBUixFQUFoQjtBQUNBLE9BQUtQLE1BQUwsQ0FBWUMsR0FBWixDQUFnQkssaUJBQVFFLFVBQVIsRUFBaEIsRUFmWSxDQWdCWjs7QUFDQSxPQUFLUixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsNEJBQWhCO0FBQ0EsT0FBS0QsTUFBTCxDQUFZQyxHQUFaLENBQWdCSyxpQkFBUUcsTUFBUixDQUFlTixjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsV0FBckIsQ0FBZixDQUFoQjtBQUVBLE1BQU1LLFdBQVcsR0FBRyxJQUFJQyxlQUFKLEVBQXBCO0FBQ0EsT0FBS1gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCUyxXQUFXLENBQUNFLFNBQVosRUFBckIsRUFyQlksQ0F1Qlo7O0FBQ0EsT0FBS1osTUFBTCxDQUFZQyxHQUFaLENBQ0UsVUFBQ1ksR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDbEIsUUFBTUMsR0FBRyxHQUFHLElBQUlDLG9CQUFKLENBQWtCLEdBQWxCLEVBQXVCLFdBQXZCLENBQVo7QUFDQUQsSUFBQUEsR0FBRyxDQUFDRSxNQUFKLEdBQWEsR0FBYjtBQUNBSCxJQUFBQSxJQUFJLENBQUNDLEdBQUQsQ0FBSjtBQUNELEdBTEg7QUFRQSxPQUFLaEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCa0IsbUJBQWhCO0FBQ0F2QixFQUFBQSxLQUFLLENBQUMsS0FBRCxDQUFMO0FBQ0QsQzs7ZUFHWUMsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhYmFzZSBmcm9tICdAcm9vdC9hcGkvZGInXG5pbXBvcnQgSW5kZXhSb3V0ZXIgZnJvbSAnQHJvb3QvYXBpL3JvdXRlcydcbi8vIGltcG9ydCBmaWxlVXBsb2FkIGZyb20gJ2V4cHJlc3MtZmlsZXVwbG9hZCdcbmltcG9ydCB7IEh0dHBFeGNlcHRpb24gfSBmcm9tICdAcm9vdC9hcGkvdHlwZXMnXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gJ2Nvb2tpZS1wYXJzZXInXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbi8vIGltcG9ydCBmYXZpY29uIGZyb20gJ3NlcnZlLWZhdmljb24nXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ21vcmdhbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnptYzppbml0JylcblxuLyoqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgZXhwcmVzcyBzZXJ2ZXIgaW5zdGFuY2UuICovXG5jbGFzcyBBcHAge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIGV4cHJlc3Mgc2VydmVyIGluc3RhbmNlLlxuICAgKi9cblxuICBwdWJsaWMgc2VydmVyOiBleHByZXNzLkV4cHJlc3NcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZGVidWcoJ3N0YXJ0JylcbiAgICBkYXRhYmFzZS5pbml0REIoKVxuICAgIHRoaXMuc2VydmVyID0gZXhwcmVzcygpXG5cbiAgICB0aGlzLnNlcnZlci51c2UoY29ycygpKVxuXG4gICAgLy8gdmlldyBuZ2luZSBzZXR1cFxuICAgIHRoaXMuc2VydmVyLnNldCgndmlld3MnLCBwYXRoLmpvaW4oX19kaXJuYW1lLCAndmlld3MnKSlcbiAgICB0aGlzLnNlcnZlci5zZXQoJ3ZpZXcgZW5naW5lJywgJ2phZGUnKVxuXG4gICAgLy8gdW5jb21tZW50IGFmdGVyIHBsYWNpbmcgeW91ciBmYXZpY29uIGluIC9wdWJsaWNcbiAgICAvLyBhcHAudXNlKGZhdmljb24ocGF0aC5qb2luKF9fZGlybmFtZSwgJ3B1YmxpYycsICdmYXZpY29uLmljbycpKSk7XG4gICAgdGhpcy5zZXJ2ZXIudXNlKGxvZ2dlcignZGV2JykpXG4gICAgdGhpcy5zZXJ2ZXIudXNlKGV4cHJlc3MuanNvbigpKVxuICAgIHRoaXMuc2VydmVyLnVzZShleHByZXNzLnVybGVuY29kZWQoKSlcbiAgICAvLyB0aGlzLnNlcnZlci51c2UoZmlsZVVwbG9hZCgpKVxuICAgIHRoaXMuc2VydmVyLnVzZShjb29raWVQYXJzZXIoKSlcbiAgICB0aGlzLnNlcnZlci51c2UoZXhwcmVzcy5zdGF0aWMocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL3B1YmxpYycpKSlcblxuICAgIGNvbnN0IGluZGV4Um91dGVyID0gbmV3IEluZGV4Um91dGVyKClcbiAgICB0aGlzLnNlcnZlci51c2UoJy8nLCBpbmRleFJvdXRlci5nZXRSb3V0ZXIoKSlcblxuICAgIC8vIGNhdGNoIDQwNCBhbmQgZm9yd2FyZCB0byBlcnJvciBoYW5kbGVyXG4gICAgdGhpcy5zZXJ2ZXIudXNlKFxuICAgICAgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IGVyciA9IG5ldyBIdHRwRXhjZXB0aW9uKDQwNCwgJ05vdCBGb3VuZCcpXG4gICAgICAgIGVyci5zdGF0dXMgPSA0MDRcbiAgICAgICAgbmV4dChlcnIpXG4gICAgICB9XG4gICAgKVxuXG4gICAgdGhpcy5zZXJ2ZXIudXNlKGVycm9ySGFuZGxlcilcbiAgICBkZWJ1ZygnZW5kJylcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBcHBcbiJdfQ==