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
  this.server.use((0, _cors.default)()); // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

  this.server.use((0, _morgan.default)('dev'));
  this.server.use(_express.default.json());
  this.server.use(_express.default.urlencoded({
    extended: true
  })); // this.server.use(fileUpload())

  this.server.use((0, _cookieParser.default)());
  this.server.use('/', _express.default.static(_path.default.join(__dirname, './public')));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvYXBwLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiQXBwIiwiZGF0YWJhc2UiLCJpbml0REIiLCJzZXJ2ZXIiLCJ1c2UiLCJleHByZXNzIiwianNvbiIsInVybGVuY29kZWQiLCJleHRlbmRlZCIsInN0YXRpYyIsInBhdGgiLCJqb2luIiwiX19kaXJuYW1lIiwiaW5kZXhSb3V0ZXIiLCJJbmRleFJvdXRlciIsImdldFJvdXRlciIsInJlcSIsInJlcyIsIm5leHQiLCJlcnIiLCJIdHRwRXhjZXB0aW9uIiwic3RhdHVzIiwiZXJyb3JIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLG9CQUFNLGdCQUFOLENBQWQ7QUFFQTs7SUFDTUMsRztBQUNKOzs7QUFLQSxlQUFjO0FBQUE7O0FBQUE7O0FBQ1pELEVBQUFBLEtBQUssQ0FBQyxPQUFELENBQUw7O0FBQ0FFLGNBQVNDLE1BQVQ7O0FBQ0EsT0FBS0MsTUFBTCxHQUFjLHVCQUFkO0FBRUEsT0FBS0EsTUFBTCxDQUFZQyxHQUFaLENBQWdCLG9CQUFoQixFQUxZLENBT1o7QUFDQTs7QUFDQSxPQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IscUJBQU8sS0FBUCxDQUFoQjtBQUNBLE9BQUtELE1BQUwsQ0FBWUMsR0FBWixDQUFnQkMsaUJBQVFDLElBQVIsRUFBaEI7QUFDQSxPQUFLSCxNQUFMLENBQVlDLEdBQVosQ0FBZ0JDLGlCQUFRRSxVQUFSLENBQW1CO0FBQUVDLElBQUFBLFFBQVEsRUFBRTtBQUFaLEdBQW5CLENBQWhCLEVBWFksQ0FZWjs7QUFDQSxPQUFLTCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsNEJBQWhCO0FBQ0EsT0FBS0QsTUFBTCxDQUFZQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCQyxpQkFBUUksTUFBUixDQUFlQyxjQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsVUFBckIsQ0FBZixDQUFyQjtBQUNBLE1BQU1DLFdBQVcsR0FBRyxJQUFJQyxlQUFKLEVBQXBCO0FBQ0EsT0FBS1gsTUFBTCxDQUFZQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCUyxXQUFXLENBQUNFLFNBQVosRUFBckIsRUFoQlksQ0FrQlo7O0FBQ0EsT0FBS1osTUFBTCxDQUFZQyxHQUFaLENBQ0UsVUFBQ1ksR0FBRCxFQUFNQyxHQUFOLEVBQVdDLElBQVgsRUFBb0I7QUFDbEIsUUFBTUMsR0FBRyxHQUFHLElBQUlDLG9CQUFKLENBQWtCLEdBQWxCLEVBQXVCLFdBQXZCLENBQVo7QUFDQUQsSUFBQUEsR0FBRyxDQUFDRSxNQUFKLEdBQWEsR0FBYjtBQUNBSCxJQUFBQSxJQUFJLENBQUNDLEdBQUQsQ0FBSjtBQUNELEdBTEg7QUFRQSxPQUFLaEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCa0IsbUJBQWhCO0FBQ0F2QixFQUFBQSxLQUFLLENBQUMsS0FBRCxDQUFMO0FBQ0QsQzs7ZUFHWUMsRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYXRhYmFzZSBmcm9tICdAcm9vdC9hcGkvZGInXG5pbXBvcnQgSW5kZXhSb3V0ZXIgZnJvbSAnQHJvb3QvYXBpL3JvdXRlcydcbi8vIGltcG9ydCBmaWxlVXBsb2FkIGZyb20gJ2V4cHJlc3MtZmlsZXVwbG9hZCdcbmltcG9ydCB7IEh0dHBFeGNlcHRpb24gfSBmcm9tICdAcm9vdC9hcGkvdHlwZXMnXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tICdAcm9vdC9hcGkvdXRpbHMnXG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gJ2Nvb2tpZS1wYXJzZXInXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJ1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcydcbi8vIGltcG9ydCBmYXZpY29uIGZyb20gJ3NlcnZlLWZhdmljb24nXG5pbXBvcnQgbG9nZ2VyIGZyb20gJ21vcmdhbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IGRlYnVnID0gRGVidWcoJ2Z1bmZ1bnptYzppbml0JylcblxuLyoqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgZXhwcmVzcyBzZXJ2ZXIgaW5zdGFuY2UuICovXG5jbGFzcyBBcHAge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIGV4cHJlc3Mgc2VydmVyIGluc3RhbmNlLlxuICAgKi9cblxuICBwdWJsaWMgc2VydmVyOiBleHByZXNzLkV4cHJlc3NcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgZGVidWcoJ3N0YXJ0JylcbiAgICBkYXRhYmFzZS5pbml0REIoKVxuICAgIHRoaXMuc2VydmVyID0gZXhwcmVzcygpXG5cbiAgICB0aGlzLnNlcnZlci51c2UoY29ycygpKVxuXG4gICAgLy8gdW5jb21tZW50IGFmdGVyIHBsYWNpbmcgeW91ciBmYXZpY29uIGluIC9wdWJsaWNcbiAgICAvLyBhcHAudXNlKGZhdmljb24ocGF0aC5qb2luKF9fZGlybmFtZSwgJ3B1YmxpYycsICdmYXZpY29uLmljbycpKSk7XG4gICAgdGhpcy5zZXJ2ZXIudXNlKGxvZ2dlcignZGV2JykpXG4gICAgdGhpcy5zZXJ2ZXIudXNlKGV4cHJlc3MuanNvbigpKVxuICAgIHRoaXMuc2VydmVyLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSlcbiAgICAvLyB0aGlzLnNlcnZlci51c2UoZmlsZVVwbG9hZCgpKVxuICAgIHRoaXMuc2VydmVyLnVzZShjb29raWVQYXJzZXIoKSlcbiAgICB0aGlzLnNlcnZlci51c2UoJy8nLCBleHByZXNzLnN0YXRpYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9wdWJsaWMnKSkpXG4gICAgY29uc3QgaW5kZXhSb3V0ZXIgPSBuZXcgSW5kZXhSb3V0ZXIoKVxuICAgIHRoaXMuc2VydmVyLnVzZSgnLycsIGluZGV4Um91dGVyLmdldFJvdXRlcigpKVxuXG4gICAgLy8gY2F0Y2ggNDA0IGFuZCBmb3J3YXJkIHRvIGVycm9yIGhhbmRsZXJcbiAgICB0aGlzLnNlcnZlci51c2UoXG4gICAgICAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IEh0dHBFeGNlcHRpb24oNDA0LCAnTm90IEZvdW5kJylcbiAgICAgICAgZXJyLnN0YXR1cyA9IDQwNFxuICAgICAgICBuZXh0KGVycilcbiAgICAgIH1cbiAgICApXG5cbiAgICB0aGlzLnNlcnZlci51c2UoZXJyb3JIYW5kbGVyKVxuICAgIGRlYnVnKCdlbmQnKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFxuIl19