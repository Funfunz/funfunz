"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendJSON = sendJSON;

// middleware that picks the property "data" on the response and sends it has a json
function sendJSON(target) {
  return function (req, res) {
    if (res.data) {
      if (target) {
        res.json(res.data[target]);
      } else {
        res.json(res.data);
      }
    } else {
      res.json({});
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbWlkZGxld2FyZS9yZXNwb25zZS50cyJdLCJuYW1lcyI6WyJzZW5kSlNPTiIsInRhcmdldCIsInJlcSIsInJlcyIsImRhdGEiLCJqc29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7QUFDTyxTQUFTQSxRQUFULENBQW1CQyxNQUFuQixFQUFtQztBQUN4QyxTQUFPLFVBQUNDLEdBQUQsRUFBdUJDLEdBQXZCLEVBQTRDO0FBQ2pELFFBQUlBLEdBQUcsQ0FBQ0MsSUFBUixFQUFjO0FBQ1osVUFBSUgsTUFBSixFQUFZO0FBQ1ZFLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTRixHQUFHLENBQUNDLElBQUosQ0FBU0gsTUFBVCxDQUFUO0FBQ0QsT0FGRCxNQUVPO0FBQ0xFLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTRixHQUFHLENBQUNDLElBQWI7QUFDRDtBQUNGLEtBTkQsTUFNTztBQUNMRCxNQUFBQSxHQUFHLENBQUNFLElBQUosQ0FBUyxFQUFUO0FBQ0Q7QUFDRixHQVZEO0FBV0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTUNSZXNwb25zZSB9IGZyb20gJ0Byb290L2FwaS90eXBlcydcblxuLy8gbWlkZGxld2FyZSB0aGF0IHBpY2tzIHRoZSBwcm9wZXJ0eSBcImRhdGFcIiBvbiB0aGUgcmVzcG9uc2UgYW5kIHNlbmRzIGl0IGhhcyBhIGpzb25cbmV4cG9ydCBmdW5jdGlvbiBzZW5kSlNPTiAodGFyZ2V0OiBzdHJpbmcpIHtcbiAgcmV0dXJuIChyZXE6IEV4cHJlc3MuUmVxdWVzdCwgcmVzOiBJTUNSZXNwb25zZSkgPT4ge1xuICAgIGlmIChyZXMuZGF0YSkge1xuICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICByZXMuanNvbihyZXMuZGF0YVt0YXJnZXRdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLmpzb24ocmVzLmRhdGEpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy5qc29uKHt9KVxuICAgIH1cbiAgfVxufVxuIl19