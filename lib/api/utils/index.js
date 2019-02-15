"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchMiddleware = catchMiddleware;
exports.buildError = buildError;
exports.addToResponse = addToResponse;
exports.nextAndReturn = nextAndReturn;

var _debug = _interopRequireDefault(require("debug"));

var _types = require("../types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug.default)('holiday-payments-server:utils');

function catchMiddleware(next) {
  return function (err) {
    if (next) {
      next(err);
    }

    return {
      error: err
    };
  };
}

function buildError(message, status) {
  var err = new _types.HttpException(status, message);
  return err;
}

function addToResponse(res, data, target) {
  if (res) {
    res.data = _objectSpread({}, res.data, _defineProperty({}, target, data));
    return res;
  }

  throw buildError('Response object not valid', 500);
}

function nextAndReturn(next) {
  return function (data) {
    if (next) {
      next();
    }

    return data;
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOlsiZGVidWciLCJjYXRjaE1pZGRsZXdhcmUiLCJuZXh0IiwiZXJyIiwiZXJyb3IiLCJidWlsZEVycm9yIiwibWVzc2FnZSIsInN0YXR1cyIsIkh0dHBFeGNlcHRpb24iLCJhZGRUb1Jlc3BvbnNlIiwicmVzIiwiZGF0YSIsInRhcmdldCIsIm5leHRBbmRSZXR1cm4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFHQSxJQUFNQSxLQUFLLEdBQUcsb0JBQU0sK0JBQU4sQ0FBZDs7QUFFTyxTQUFTQyxlQUFULENBQTBCQyxJQUExQixFQUE4QztBQUNuRCxTQUFPLFVBQVVDLEdBQVYsRUFBOEI7QUFDbkMsUUFBSUQsSUFBSixFQUFVO0FBQ1JBLE1BQUFBLElBQUksQ0FBQ0MsR0FBRCxDQUFKO0FBQ0Q7O0FBQ0QsV0FBTztBQUNMQyxNQUFBQSxLQUFLLEVBQUVEO0FBREYsS0FBUDtBQUdELEdBUEQ7QUFRRDs7QUFFTSxTQUFTRSxVQUFULENBQXFCQyxPQUFyQixFQUFzQ0MsTUFBdEMsRUFBc0Q7QUFDM0QsTUFBTUosR0FBRyxHQUFHLElBQUlLLG9CQUFKLENBQWtCRCxNQUFsQixFQUEwQkQsT0FBMUIsQ0FBWjtBQUNBLFNBQU9ILEdBQVA7QUFDRDs7QUFFTSxTQUFTTSxhQUFULENBQXdCQyxHQUF4QixFQUF5Q0MsSUFBekMsRUFBb0RDLE1BQXBELEVBQW9FO0FBQ3pFLE1BQUlGLEdBQUosRUFBUztBQUNQQSxJQUFBQSxHQUFHLENBQUNDLElBQUoscUJBQ0tELEdBQUcsQ0FBQ0MsSUFEVCxzQkFFR0MsTUFGSCxFQUVZRCxJQUZaO0FBSUEsV0FBT0QsR0FBUDtBQUNEOztBQUNELFFBQU1MLFVBQVUsQ0FBQywyQkFBRCxFQUE4QixHQUE5QixDQUFoQjtBQUNEOztBQUVNLFNBQVNRLGFBQVQsQ0FBd0JYLElBQXhCLEVBQTRDO0FBQ2pELFNBQU8sVUFBVVMsSUFBVixFQUFxQjtBQUMxQixRQUFJVCxJQUFKLEVBQVU7QUFDUkEsTUFBQUEsSUFBSTtBQUNMOztBQUNELFdBQU9TLElBQVA7QUFDRCxHQUxEO0FBTUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBIdHRwRXhjZXB0aW9uLCBNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xuXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdob2xpZGF5LXBheW1lbnRzLXNlcnZlcjp1dGlscycpXG5cbmV4cG9ydCBmdW5jdGlvbiBjYXRjaE1pZGRsZXdhcmUgKG5leHQ6IE5leHRGdW5jdGlvbikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVycjogSHR0cEV4Y2VwdGlvbikge1xuICAgIGlmIChuZXh0KSB7XG4gICAgICBuZXh0KGVycilcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yOiBlcnIsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEVycm9yIChtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyKSB7XG4gIGNvbnN0IGVyciA9IG5ldyBIdHRwRXhjZXB0aW9uKHN0YXR1cywgbWVzc2FnZSlcbiAgcmV0dXJuIGVyclxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9SZXNwb25zZSAocmVzOiBNQ1Jlc3BvbnNlLCBkYXRhOiBhbnksIHRhcmdldDogc3RyaW5nKSB7XG4gIGlmIChyZXMpIHtcbiAgICByZXMuZGF0YSA9IHtcbiAgICAgIC4uLnJlcy5kYXRhLFxuICAgICAgW3RhcmdldF06IGRhdGEsXG4gICAgfVxuICAgIHJldHVybiByZXNcbiAgfVxuICB0aHJvdyBidWlsZEVycm9yKCdSZXNwb25zZSBvYmplY3Qgbm90IHZhbGlkJywgNTAwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dEFuZFJldHVybiAobmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZGF0YTogYW55KSB7XG4gICAgaWYgKG5leHQpIHtcbiAgICAgIG5leHQoKVxuICAgIH1cbiAgICByZXR1cm4gZGF0YVxuICB9XG59XG4iXX0=