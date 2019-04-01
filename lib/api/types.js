"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpException = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HttpException =
/*#__PURE__*/
function (_Error) {
  _inherits(HttpException, _Error);

  function HttpException(status, message) {
    var _this;

    _classCallCheck(this, HttpException);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HttpException).call(this, message));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "status", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "message", void 0);

    _this.status = status;
    _this.message = message;
    return _this;
  }

  return HttpException;
}(_wrapNativeSuper(Error));

exports.HttpException = HttpException;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvdHlwZXMudHMiXSwibmFtZXMiOlsiSHR0cEV4Y2VwdGlvbiIsInN0YXR1cyIsIm1lc3NhZ2UiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxhOzs7OztBQUdYLHlCQUFZQyxNQUFaLEVBQTRCQyxPQUE1QixFQUE2QztBQUFBOztBQUFBOztBQUMzQyx1RkFBTUEsT0FBTjs7QUFEMkM7O0FBQUE7O0FBRTNDLFVBQUtELE1BQUwsR0FBY0EsTUFBZDtBQUNBLFVBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUgyQztBQUk1Qzs7O21CQVBnQ0MsSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnXG5cbmV4cG9ydCBjbGFzcyBIdHRwRXhjZXB0aW9uIGV4dGVuZHMgRXJyb3Ige1xuICBwdWJsaWMgc3RhdHVzOiBudW1iZXI7XG4gIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHN0YXR1czogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXIge1xuICBba2V5OiBzdHJpbmddOiBhbnksXG4gIHJvbGVzOiBBcnJheTx7XG4gICAgaWQ6IG51bWJlcixcbiAgICBuYW1lOiBzdHJpbmcsXG4gIH0+LFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNQ1Jlc3BvbnNlIGV4dGVuZHMgZXhwcmVzcy5SZXNwb25zZSB7XG4gIGRhdGE/OiBhbnlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTUNSZXF1ZXN0IGV4dGVuZHMgZXhwcmVzcy5SZXF1ZXN0IHtcbiAgdXNlcj86IElVc2VyO1xufVxuIl19