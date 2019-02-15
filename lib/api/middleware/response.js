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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvbWlkZGxld2FyZS9yZXNwb25zZS50cyJdLCJuYW1lcyI6WyJzZW5kSlNPTiIsInRhcmdldCIsInJlcSIsInJlcyIsImRhdGEiLCJqc29uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7QUFDTyxTQUFTQSxRQUFULENBQW1CQyxNQUFuQixFQUFtQztBQUN4QyxTQUFPLFVBQUNDLEdBQUQsRUFBdUJDLEdBQXZCLEVBQTJDO0FBQ2hELFFBQUlBLEdBQUcsQ0FBQ0MsSUFBUixFQUFjO0FBQ1osVUFBSUgsTUFBSixFQUFZO0FBQ1ZFLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTRixHQUFHLENBQUNDLElBQUosQ0FBU0gsTUFBVCxDQUFUO0FBQ0QsT0FGRCxNQUVPO0FBQ0xFLFFBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTRixHQUFHLENBQUNDLElBQWI7QUFDRDtBQUNGLEtBTkQsTUFNTztBQUNMRCxNQUFBQSxHQUFHLENBQUNFLElBQUosQ0FBUyxFQUFUO0FBQ0Q7QUFDRixHQVZEO0FBV0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNQ1Jlc3BvbnNlIH0gZnJvbSAnQHJvb3QvYXBpL3R5cGVzJ1xuXG4vLyBtaWRkbGV3YXJlIHRoYXQgcGlja3MgdGhlIHByb3BlcnR5IFwiZGF0YVwiIG9uIHRoZSByZXNwb25zZSBhbmQgc2VuZHMgaXQgaGFzIGEganNvblxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRKU09OICh0YXJnZXQ6IHN0cmluZykge1xuICByZXR1cm4gKHJlcTogRXhwcmVzcy5SZXF1ZXN0LCByZXM6IE1DUmVzcG9uc2UpID0+IHtcbiAgICBpZiAocmVzLmRhdGEpIHtcbiAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgcmVzLmpzb24ocmVzLmRhdGFbdGFyZ2V0XSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5qc29uKHJlcy5kYXRhKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMuanNvbih7fSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==