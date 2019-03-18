"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchMiddleware = catchMiddleware;
exports.buildError = buildError;
exports.addToResponse = addToResponse;
exports.nextAndReturn = nextAndReturn;
exports.hasAuthorization = hasAuthorization;
exports.errorHandler = void 0;

var _types = require("../types");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function catchMiddleware(next) {
  return function (err) {
    if (next) {
      next(err);
    }

    return Promise.resolve({
      error: err
    });
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

    return Promise.resolve(data);
  };
} // error handler


var errorHandler = function errorHandler(err, req, res) {
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
};

exports.errorHandler = errorHandler;

function hasAuthorization(tableRoles, userRoles) {
  var isAuthorized = 'true';

  if (tableRoles && tableRoles.length) {
    isAuthorized = tableRoles.find(function (tableRole) {
      if (tableRole === 'all') {
        return true;
      }

      var userHasAuthorization = userRoles.find(function (userRole) {
        return userRole === tableRole;
      });
      return userHasAuthorization ? true : false;
    });
  }

  return isAuthorized ? true : false;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOlsiY2F0Y2hNaWRkbGV3YXJlIiwibmV4dCIsImVyciIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyb3IiLCJidWlsZEVycm9yIiwibWVzc2FnZSIsInN0YXR1cyIsIkh0dHBFeGNlcHRpb24iLCJhZGRUb1Jlc3BvbnNlIiwicmVzIiwiZGF0YSIsInRhcmdldCIsIm5leHRBbmRSZXR1cm4iLCJlcnJvckhhbmRsZXIiLCJyZXEiLCJqc29uIiwiaGFzQXV0aG9yaXphdGlvbiIsInRhYmxlUm9sZXMiLCJ1c2VyUm9sZXMiLCJpc0F1dGhvcml6ZWQiLCJsZW5ndGgiLCJmaW5kIiwidGFibGVSb2xlIiwidXNlckhhc0F1dGhvcml6YXRpb24iLCJ1c2VyUm9sZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdPLFNBQVNBLGVBQVQsQ0FBeUJDLElBQXpCLEVBQTZDO0FBQ2xELFNBQU8sVUFBQ0MsR0FBRCxFQUF3QjtBQUM3QixRQUFJRCxJQUFKLEVBQVU7QUFDUkEsTUFBQUEsSUFBSSxDQUFDQyxHQUFELENBQUo7QUFDRDs7QUFDRCxXQUFPQyxPQUFPLENBQUNDLE9BQVIsQ0FBZ0I7QUFDckJDLE1BQUFBLEtBQUssRUFBRUg7QUFEYyxLQUFoQixDQUFQO0FBR0QsR0FQRDtBQVFEOztBQUVNLFNBQVNJLFVBQVQsQ0FBb0JDLE9BQXBCLEVBQXFDQyxNQUFyQyxFQUFxRDtBQUMxRCxNQUFNTixHQUFHLEdBQUcsSUFBSU8sb0JBQUosQ0FBa0JELE1BQWxCLEVBQTBCRCxPQUExQixDQUFaO0FBQ0EsU0FBT0wsR0FBUDtBQUNEOztBQUVNLFNBQVNRLGFBQVQsQ0FBdUJDLEdBQXZCLEVBQXlDQyxJQUF6QyxFQUFvREMsTUFBcEQsRUFBb0U7QUFDekUsTUFBSUYsR0FBSixFQUFTO0FBQ1BBLElBQUFBLEdBQUcsQ0FBQ0MsSUFBSixxQkFDS0QsR0FBRyxDQUFDQyxJQURULHNCQUVHQyxNQUZILEVBRVlELElBRlo7QUFJQSxXQUFPRCxHQUFQO0FBQ0Q7O0FBQ0QsUUFBTUwsVUFBVSxDQUFDLDJCQUFELEVBQThCLEdBQTlCLENBQWhCO0FBQ0Q7O0FBRU0sU0FBU1EsYUFBVCxDQUF1QmIsSUFBdkIsRUFBMkM7QUFDaEQsU0FBTyxVQUFTVyxJQUFULEVBQW9CO0FBQ3pCLFFBQUlYLElBQUosRUFBVTtBQUNSQSxNQUFBQSxJQUFJO0FBQ0w7O0FBQ0QsV0FBT0UsT0FBTyxDQUFDQyxPQUFSLENBQWdCUSxJQUFoQixDQUFQO0FBQ0QsR0FMRDtBQU1ELEMsQ0FFRDs7O0FBQ08sSUFBTUcsWUFBaUMsR0FBRyxTQUFwQ0EsWUFBb0MsQ0FBQ2IsR0FBRCxFQUFNYyxHQUFOLEVBQVdMLEdBQVgsRUFBbUI7QUFDbEVBLEVBQUFBLEdBQUcsQ0FBQ0gsTUFBSixDQUFXTixHQUFHLENBQUNNLE1BQUosSUFBYyxHQUF6QjtBQUNBRyxFQUFBQSxHQUFHLENBQUNNLElBQUosQ0FBUztBQUNQVixJQUFBQSxPQUFPLEVBQUVMLEdBQUcsQ0FBQ0s7QUFETixHQUFUO0FBR0QsQ0FMTTs7OztBQU9BLFNBQVNXLGdCQUFULENBQTBCQyxVQUExQixFQUFnREMsU0FBaEQsRUFBOEU7QUFDbkYsTUFBSUMsWUFBZ0MsR0FBRyxNQUF2Qzs7QUFFQSxNQUFJRixVQUFVLElBQUlBLFVBQVUsQ0FBQ0csTUFBN0IsRUFBcUM7QUFDbkNELElBQUFBLFlBQVksR0FBR0YsVUFBVSxDQUFDSSxJQUFYLENBQ2IsVUFBQ0MsU0FBRCxFQUF1QjtBQUNyQixVQUFJQSxTQUFTLEtBQUssS0FBbEIsRUFBeUI7QUFDdkIsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0QsVUFBTUMsb0JBQW9CLEdBQUdMLFNBQVMsQ0FBQ0csSUFBVixDQUMzQixVQUFDRyxRQUFELEVBQXNCO0FBQ3BCLGVBQVFBLFFBQVEsS0FBS0YsU0FBckI7QUFDRCxPQUgwQixDQUE3QjtBQUtBLGFBQU9DLG9CQUFvQixHQUFHLElBQUgsR0FBVSxLQUFyQztBQUNELEtBWFksQ0FBZjtBQWFEOztBQUVELFNBQU9KLFlBQVksR0FBRyxJQUFILEdBQVUsS0FBN0I7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBFeGNlcHRpb24sIElNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJztcbmltcG9ydCB7IEVycm9yUmVxdWVzdEhhbmRsZXIsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnXG5cbmV4cG9ydCBmdW5jdGlvbiBjYXRjaE1pZGRsZXdhcmUobmV4dDogTmV4dEZ1bmN0aW9uKSB7XG4gIHJldHVybiAoZXJyOiBIdHRwRXhjZXB0aW9uKSA9PiB7XG4gICAgaWYgKG5leHQpIHtcbiAgICAgIG5leHQoZXJyKVxuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcbiAgICAgIGVycm9yOiBlcnIsXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRFcnJvcihtZXNzYWdlOiBzdHJpbmcsIHN0YXR1czogbnVtYmVyKSB7XG4gIGNvbnN0IGVyciA9IG5ldyBIdHRwRXhjZXB0aW9uKHN0YXR1cywgbWVzc2FnZSlcbiAgcmV0dXJuIGVyclxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9SZXNwb25zZShyZXM6IElNQ1Jlc3BvbnNlLCBkYXRhOiBhbnksIHRhcmdldDogc3RyaW5nKSB7XG4gIGlmIChyZXMpIHtcbiAgICByZXMuZGF0YSA9IHtcbiAgICAgIC4uLnJlcy5kYXRhLFxuICAgICAgW3RhcmdldF06IGRhdGEsXG4gICAgfVxuICAgIHJldHVybiByZXNcbiAgfVxuICB0aHJvdyBidWlsZEVycm9yKCdSZXNwb25zZSBvYmplY3Qgbm90IHZhbGlkJywgNTAwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dEFuZFJldHVybihuZXh0OiBOZXh0RnVuY3Rpb24pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGRhdGE6IGFueSkge1xuICAgIGlmIChuZXh0KSB7XG4gICAgICBuZXh0KClcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkYXRhKVxuICB9XG59XG5cbi8vIGVycm9yIGhhbmRsZXJcbmV4cG9ydCBjb25zdCBlcnJvckhhbmRsZXI6IEVycm9yUmVxdWVzdEhhbmRsZXIgPSAoZXJyLCByZXEsIHJlcykgPT4ge1xuICByZXMuc3RhdHVzKGVyci5zdGF0dXMgfHwgNTAwKVxuICByZXMuanNvbih7XG4gICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UsXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNBdXRob3JpemF0aW9uKHRhYmxlUm9sZXM6IHN0cmluZ1tdLCB1c2VyUm9sZXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIGxldCBpc0F1dGhvcml6ZWQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9ICd0cnVlJ1xuXG4gIGlmICh0YWJsZVJvbGVzICYmIHRhYmxlUm9sZXMubGVuZ3RoKSB7XG4gICAgaXNBdXRob3JpemVkID0gdGFibGVSb2xlcy5maW5kKFxuICAgICAgKHRhYmxlUm9sZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICh0YWJsZVJvbGUgPT09ICdhbGwnKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1c2VySGFzQXV0aG9yaXphdGlvbiA9IHVzZXJSb2xlcy5maW5kKFxuICAgICAgICAgICh1c2VyUm9sZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHVzZXJSb2xlID09PSB0YWJsZVJvbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gdXNlckhhc0F1dGhvcml6YXRpb24gPyB0cnVlIDogZmFsc2VcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICByZXR1cm4gaXNBdXRob3JpemVkID8gdHJ1ZSA6IGZhbHNlXG59XG4iXX0=