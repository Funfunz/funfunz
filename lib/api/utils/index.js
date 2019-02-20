"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchMiddleware = catchMiddleware;
exports.buildError = buildError;
exports.addToResponse = addToResponse;
exports.nextAndReturn = nextAndReturn;
exports.errorHandler = void 0;

var _types = require("../types");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
} // error handler


var errorHandler = function errorHandler(err, req, res) {
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
};

exports.errorHandler = errorHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOlsiY2F0Y2hNaWRkbGV3YXJlIiwibmV4dCIsImVyciIsImVycm9yIiwiYnVpbGRFcnJvciIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJIdHRwRXhjZXB0aW9uIiwiYWRkVG9SZXNwb25zZSIsInJlcyIsImRhdGEiLCJ0YXJnZXQiLCJuZXh0QW5kUmV0dXJuIiwiZXJyb3JIYW5kbGVyIiwicmVxIiwianNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR08sU0FBU0EsZUFBVCxDQUF5QkMsSUFBekIsRUFBNkM7QUFDbEQsU0FBTyxVQUFDQyxHQUFELEVBQXdCO0FBQzdCLFFBQUlELElBQUosRUFBVTtBQUNSQSxNQUFBQSxJQUFJLENBQUNDLEdBQUQsQ0FBSjtBQUNEOztBQUNELFdBQU87QUFDTEMsTUFBQUEsS0FBSyxFQUFFRDtBQURGLEtBQVA7QUFHRCxHQVBEO0FBUUQ7O0FBRU0sU0FBU0UsVUFBVCxDQUFvQkMsT0FBcEIsRUFBcUNDLE1BQXJDLEVBQXFEO0FBQzFELE1BQU1KLEdBQUcsR0FBRyxJQUFJSyxvQkFBSixDQUFrQkQsTUFBbEIsRUFBMEJELE9BQTFCLENBQVo7QUFDQSxTQUFPSCxHQUFQO0FBQ0Q7O0FBRU0sU0FBU00sYUFBVCxDQUF1QkMsR0FBdkIsRUFBeUNDLElBQXpDLEVBQW9EQyxNQUFwRCxFQUFvRTtBQUN6RSxNQUFJRixHQUFKLEVBQVM7QUFDUEEsSUFBQUEsR0FBRyxDQUFDQyxJQUFKLHFCQUNLRCxHQUFHLENBQUNDLElBRFQsc0JBRUdDLE1BRkgsRUFFWUQsSUFGWjtBQUlBLFdBQU9ELEdBQVA7QUFDRDs7QUFDRCxRQUFNTCxVQUFVLENBQUMsMkJBQUQsRUFBOEIsR0FBOUIsQ0FBaEI7QUFDRDs7QUFFTSxTQUFTUSxhQUFULENBQXVCWCxJQUF2QixFQUEyQztBQUNoRCxTQUFPLFVBQVNTLElBQVQsRUFBb0I7QUFDekIsUUFBSVQsSUFBSixFQUFVO0FBQ1JBLE1BQUFBLElBQUk7QUFDTDs7QUFDRCxXQUFPUyxJQUFQO0FBQ0QsR0FMRDtBQU1ELEMsQ0FFRDs7O0FBQ08sSUFBTUcsWUFBaUMsR0FBRyxTQUFwQ0EsWUFBb0MsQ0FBQ1gsR0FBRCxFQUFNWSxHQUFOLEVBQVdMLEdBQVgsRUFBbUI7QUFDbEVBLEVBQUFBLEdBQUcsQ0FBQ0gsTUFBSixDQUFXSixHQUFHLENBQUNJLE1BQUosSUFBYyxHQUF6QjtBQUNBRyxFQUFBQSxHQUFHLENBQUNNLElBQUosQ0FBUztBQUNQVixJQUFBQSxPQUFPLEVBQUVILEdBQUcsQ0FBQ0c7QUFETixHQUFUO0FBR0QsQ0FMTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBFeGNlcHRpb24sIElNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IEVycm9yUmVxdWVzdEhhbmRsZXIsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmV4cG9ydCBmdW5jdGlvbiBjYXRjaE1pZGRsZXdhcmUobmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gIHJldHVybiAoZXJyOiBIdHRwRXhjZXB0aW9uKSA9PiB7XG4gICAgaWYgKG5leHQpIHtcbiAgICAgIG5leHQoZXJyKVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3I6IGVycixcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRXJyb3IobWVzc2FnZTogc3RyaW5nLCBzdGF0dXM6IG51bWJlcikge1xuICBjb25zdCBlcnIgPSBuZXcgSHR0cEV4Y2VwdGlvbihzdGF0dXMsIG1lc3NhZ2UpXG4gIHJldHVybiBlcnJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvUmVzcG9uc2UocmVzOiBJTUNSZXNwb25zZSwgZGF0YTogYW55LCB0YXJnZXQ6IHN0cmluZykge1xuICBpZiAocmVzKSB7XG4gICAgcmVzLmRhdGEgPSB7XG4gICAgICAuLi5yZXMuZGF0YSxcbiAgICAgIFt0YXJnZXRdOiBkYXRhLFxuICAgIH1cbiAgICByZXR1cm4gcmVzXG4gIH1cbiAgdGhyb3cgYnVpbGRFcnJvcignUmVzcG9uc2Ugb2JqZWN0IG5vdCB2YWxpZCcsIDUwMClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHRBbmRSZXR1cm4obmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbihkYXRhOiBhbnkpIHtcbiAgICBpZiAobmV4dCkge1xuICAgICAgbmV4dCgpXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG4gIH1cbn1cblxuLy8gZXJyb3IgaGFuZGxlclxuZXhwb3J0IGNvbnN0IGVycm9ySGFuZGxlcjogRXJyb3JSZXF1ZXN0SGFuZGxlciA9IChlcnIsIHJlcSwgcmVzKSA9PiB7XG4gIHJlcy5zdGF0dXMoZXJyLnN0YXR1cyB8fCA1MDApXG4gIHJlcy5qc29uKHtcbiAgICBtZXNzYWdlOiBlcnIubWVzc2FnZSxcbiAgfSlcbn1cbiJdfQ==