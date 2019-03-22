"use strict";

var _configGenerator = require("./configGenerator");

var _describeTable = _interopRequireDefault(require("./describeTable"));

var _listTables = _interopRequireDefault(require("./listTables"));

var _enquirer = require("enquirer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var question = [{
  type: 'select',
  name: 'DBType',
  message: 'What is your database?',
  limit: 5,
  choices: ['mysql', 'pgsql', 'mongoDB']
}, {
  type: 'input',
  name: 'DBHost',
  message: 'Database hostname?',
  initial: 'localhost'
}, {
  type: 'input',
  name: 'DBName',
  message: 'Database name?',
  initial: 'example_database'
}, {
  type: 'input',
  name: 'DBUser',
  message: 'Database user?',
  initial: 'root'
}, {
  type: 'password',
  name: 'DBPassword',
  message: 'Database password?',
  initial: ''
}];
(0, _enquirer.prompt)(question).then(function (answers) {
  var compiledAnswers = {
    DBType: answers.DBType,
    DBHost: answers.DBHost,
    DBName: answers.DBName,
    DBUser: answers.DBUser,
    DBPassword: answers.DBPassword
  };
  process.env = _objectSpread({}, process.env, compiledAnswers);
  Promise.all([(0, _configGenerator.generateConfig)(compiledAnswers), (0, _listTables.default)()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        config = _ref2[0],
        tablesNames = _ref2[1];

    (0, _describeTable.default)(tablesNames).then(function (results) {
      console.log(results);
      (0, _configGenerator.generateSettings)(results);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJxdWVzdGlvbiIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImxpbWl0IiwiY2hvaWNlcyIsImluaXRpYWwiLCJ0aGVuIiwiYW5zd2VycyIsImNvbXBpbGVkQW5zd2VycyIsIkRCVHlwZSIsIkRCSG9zdCIsIkRCTmFtZSIsIkRCVXNlciIsIkRCUGFzc3dvcmQiLCJwcm9jZXNzIiwiZW52IiwiUHJvbWlzZSIsImFsbCIsImNvbmZpZyIsInRhYmxlc05hbWVzIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSxJQUFNQSxRQUFRLEdBQUcsQ0FDZjtBQUNFQyxFQUFBQSxJQUFJLEVBQUUsUUFEUjtBQUVFQyxFQUFBQSxJQUFJLEVBQUUsUUFGUjtBQUdFQyxFQUFBQSxPQUFPLEVBQUUsd0JBSFg7QUFJRUMsRUFBQUEsS0FBSyxFQUFFLENBSlQ7QUFLRUMsRUFBQUEsT0FBTyxFQUFFLENBQ1AsT0FETyxFQUVQLE9BRk8sRUFHUCxTQUhPO0FBTFgsQ0FEZSxFQVlmO0FBQ0VKLEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxRQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSxvQkFIWDtBQUlFRyxFQUFBQSxPQUFPLEVBQUU7QUFKWCxDQVplLEVBa0JmO0FBQ0VMLEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxRQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSxnQkFIWDtBQUlFRyxFQUFBQSxPQUFPLEVBQUU7QUFKWCxDQWxCZSxFQXdCZjtBQUNFTCxFQUFBQSxJQUFJLEVBQUUsT0FEUjtBQUVFQyxFQUFBQSxJQUFJLEVBQUUsUUFGUjtBQUdFQyxFQUFBQSxPQUFPLEVBQUUsZ0JBSFg7QUFJRUcsRUFBQUEsT0FBTyxFQUFFO0FBSlgsQ0F4QmUsRUE4QmY7QUFDRUwsRUFBQUEsSUFBSSxFQUFFLFVBRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFlBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLG9CQUhYO0FBSUVHLEVBQUFBLE9BQU8sRUFBRTtBQUpYLENBOUJlLENBQWpCO0FBc0NBLHNCQUFPTixRQUFQLEVBQWlCTyxJQUFqQixDQUNFLFVBQUNDLE9BQUQsRUFBa0I7QUFDaEIsTUFBTUMsZUFBNkIsR0FBRztBQUNwQ0MsSUFBQUEsTUFBTSxFQUFFRixPQUFPLENBQUNFLE1BRG9CO0FBRXBDQyxJQUFBQSxNQUFNLEVBQUVILE9BQU8sQ0FBQ0csTUFGb0I7QUFHcENDLElBQUFBLE1BQU0sRUFBRUosT0FBTyxDQUFDSSxNQUhvQjtBQUlwQ0MsSUFBQUEsTUFBTSxFQUFFTCxPQUFPLENBQUNLLE1BSm9CO0FBS3BDQyxJQUFBQSxVQUFVLEVBQUVOLE9BQU8sQ0FBQ007QUFMZ0IsR0FBdEM7QUFRQUMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLHFCQUNLRCxPQUFPLENBQUNDLEdBRGIsRUFFS1AsZUFGTDtBQUlBUSxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxDQUNWLHFDQUFlVCxlQUFmLENBRFUsRUFFViwwQkFGVSxDQUFaLEVBR0dGLElBSEgsQ0FJRSxnQkFBMkI7QUFBQTtBQUFBLFFBQXpCWSxNQUF5QjtBQUFBLFFBQWpCQyxXQUFpQjs7QUFDekIsZ0NBQVNBLFdBQVQsRUFBc0JiLElBQXRCLENBQ0UsVUFBQ2MsT0FBRCxFQUFhO0FBQ1hDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixPQUFaO0FBQ0EsNkNBQWlCQSxPQUFqQjtBQUNELEtBSkg7QUFNRCxHQVhIO0FBYUQsQ0EzQkgiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBnZXQgdGhlIGNsaWVudFxuaW1wb3J0IHsgZ2VuZXJhdGVDb25maWcsIGdlbmVyYXRlU2V0dGluZ3MgfSBmcm9tICdAcm9vdC9jb25maWdHZW5lcmF0b3InXG5pbXBvcnQgZGVzY3JpYmUgZnJvbSAnQHJvb3QvZGVzY3JpYmVUYWJsZSdcbmltcG9ydCB0YWJsZXMgZnJvbSAnQHJvb3QvbGlzdFRhYmxlcydcbmltcG9ydCB7IHByb21wdCB9IGZyb20gJ2VucXVpcmVyJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElUeXBlQW5zd2VycyB7XG4gIERCVHlwZTogc3RyaW5nLFxuICBEQkhvc3Q6IHN0cmluZyxcbiAgREJOYW1lOiBzdHJpbmcsXG4gIERCVXNlcjogc3RyaW5nLFxuICBEQlBhc3N3b3JkOiBzdHJpbmdcbn1cblxuY29uc3QgcXVlc3Rpb24gPSBbXG4gIHtcbiAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICBuYW1lOiAnREJUeXBlJyxcbiAgICBtZXNzYWdlOiAnV2hhdCBpcyB5b3VyIGRhdGFiYXNlPycsXG4gICAgbGltaXQ6IDUsXG4gICAgY2hvaWNlczogW1xuICAgICAgJ215c3FsJyxcbiAgICAgICdwZ3NxbCcsXG4gICAgICAnbW9uZ29EQicsXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgbmFtZTogJ0RCSG9zdCcsXG4gICAgbWVzc2FnZTogJ0RhdGFiYXNlIGhvc3RuYW1lPycsXG4gICAgaW5pdGlhbDogJ2xvY2FsaG9zdCcsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIG5hbWU6ICdEQk5hbWUnLFxuICAgIG1lc3NhZ2U6ICdEYXRhYmFzZSBuYW1lPycsXG4gICAgaW5pdGlhbDogJ2V4YW1wbGVfZGF0YWJhc2UnLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnREJVc2VyJyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgdXNlcj8nLFxuICAgIGluaXRpYWw6ICdyb290JyxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgbmFtZTogJ0RCUGFzc3dvcmQnLFxuICAgIG1lc3NhZ2U6ICdEYXRhYmFzZSBwYXNzd29yZD8nLFxuICAgIGluaXRpYWw6ICcnLFxuICB9LFxuXTtcblxucHJvbXB0KHF1ZXN0aW9uKS50aGVuKFxuICAoYW5zd2VyczogYW55KSA9PiB7XG4gICAgY29uc3QgY29tcGlsZWRBbnN3ZXJzOiBJVHlwZUFuc3dlcnMgPSB7XG4gICAgICBEQlR5cGU6IGFuc3dlcnMuREJUeXBlLFxuICAgICAgREJIb3N0OiBhbnN3ZXJzLkRCSG9zdCxcbiAgICAgIERCTmFtZTogYW5zd2Vycy5EQk5hbWUsXG4gICAgICBEQlVzZXI6IGFuc3dlcnMuREJVc2VyLFxuICAgICAgREJQYXNzd29yZDogYW5zd2Vycy5EQlBhc3N3b3JkLFxuICAgIH1cblxuICAgIHByb2Nlc3MuZW52ID0ge1xuICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAuLi5jb21waWxlZEFuc3dlcnMsXG4gICAgfVxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIGdlbmVyYXRlQ29uZmlnKGNvbXBpbGVkQW5zd2VycyksXG4gICAgICB0YWJsZXMoKSxcbiAgICBdKS50aGVuKFxuICAgICAgKFtjb25maWcsIHRhYmxlc05hbWVzXSkgPT4ge1xuICAgICAgICBkZXNjcmliZSh0YWJsZXNOYW1lcykudGhlbihcbiAgICAgICAgICAocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cylcbiAgICAgICAgICAgIGdlbmVyYXRlU2V0dGluZ3MocmVzdWx0cylcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIH1cbiAgICApXG4gIH1cbilcbiJdfQ==