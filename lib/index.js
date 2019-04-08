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
        tableNames = _ref2[1];

    (0, _describeTable.default)(tableNames).then(function (results) {
      (0, _configGenerator.generateSettings)(results);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJxdWVzdGlvbiIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImxpbWl0IiwiY2hvaWNlcyIsImluaXRpYWwiLCJ0aGVuIiwiYW5zd2VycyIsImNvbXBpbGVkQW5zd2VycyIsIkRCVHlwZSIsIkRCSG9zdCIsIkRCTmFtZSIsIkRCVXNlciIsIkRCUGFzc3dvcmQiLCJwcm9jZXNzIiwiZW52IiwiUHJvbWlzZSIsImFsbCIsImNvbmZpZyIsInRhYmxlTmFtZXMiLCJyZXN1bHRzIl0sIm1hcHBpbmdzIjoiOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBVUEsSUFBTUEsUUFBUSxHQUFHLENBQ2Y7QUFDRUMsRUFBQUEsSUFBSSxFQUFFLFFBRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFFBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLHdCQUhYO0FBSUVDLEVBQUFBLEtBQUssRUFBRSxDQUpUO0FBS0VDLEVBQUFBLE9BQU8sRUFBRSxDQUNQLE9BRE8sRUFFUCxPQUZPLEVBR1AsU0FITztBQUxYLENBRGUsRUFZZjtBQUNFSixFQUFBQSxJQUFJLEVBQUUsT0FEUjtBQUVFQyxFQUFBQSxJQUFJLEVBQUUsUUFGUjtBQUdFQyxFQUFBQSxPQUFPLEVBQUUsb0JBSFg7QUFJRUcsRUFBQUEsT0FBTyxFQUFFO0FBSlgsQ0FaZSxFQWtCZjtBQUNFTCxFQUFBQSxJQUFJLEVBQUUsT0FEUjtBQUVFQyxFQUFBQSxJQUFJLEVBQUUsUUFGUjtBQUdFQyxFQUFBQSxPQUFPLEVBQUUsZ0JBSFg7QUFJRUcsRUFBQUEsT0FBTyxFQUFFO0FBSlgsQ0FsQmUsRUF3QmY7QUFDRUwsRUFBQUEsSUFBSSxFQUFFLE9BRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFFBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLGdCQUhYO0FBSUVHLEVBQUFBLE9BQU8sRUFBRTtBQUpYLENBeEJlLEVBOEJmO0FBQ0VMLEVBQUFBLElBQUksRUFBRSxVQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxZQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSxvQkFIWDtBQUlFRyxFQUFBQSxPQUFPLEVBQUU7QUFKWCxDQTlCZSxDQUFqQjtBQXNDQSxzQkFBT04sUUFBUCxFQUFpQk8sSUFBakIsQ0FDRSxVQUFDQyxPQUFELEVBQWtCO0FBQ2hCLE1BQU1DLGVBQTZCLEdBQUc7QUFDcENDLElBQUFBLE1BQU0sRUFBRUYsT0FBTyxDQUFDRSxNQURvQjtBQUVwQ0MsSUFBQUEsTUFBTSxFQUFFSCxPQUFPLENBQUNHLE1BRm9CO0FBR3BDQyxJQUFBQSxNQUFNLEVBQUVKLE9BQU8sQ0FBQ0ksTUFIb0I7QUFJcENDLElBQUFBLE1BQU0sRUFBRUwsT0FBTyxDQUFDSyxNQUpvQjtBQUtwQ0MsSUFBQUEsVUFBVSxFQUFFTixPQUFPLENBQUNNO0FBTGdCLEdBQXRDO0FBUUFDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixxQkFDS0QsT0FBTyxDQUFDQyxHQURiLEVBRUtQLGVBRkw7QUFJQVEsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksQ0FDVixxQ0FBZVQsZUFBZixDQURVLEVBRVYsMEJBRlUsQ0FBWixFQUdHRixJQUhILENBSUUsZ0JBQTBCO0FBQUE7QUFBQSxRQUF4QlksTUFBd0I7QUFBQSxRQUFoQkMsVUFBZ0I7O0FBQ3hCLGdDQUFTQSxVQUFULEVBQXFCYixJQUFyQixDQUNFLFVBQUNjLE9BQUQsRUFBYTtBQUNYLDZDQUFpQkEsT0FBakI7QUFDRCxLQUhIO0FBS0QsR0FWSDtBQVlELENBMUJIIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZ2V0IHRoZSBjbGllbnRcbmltcG9ydCB7IGdlbmVyYXRlQ29uZmlnLCBnZW5lcmF0ZVNldHRpbmdzIH0gZnJvbSAnQHJvb3QvY29uZmlnR2VuZXJhdG9yJ1xuaW1wb3J0IGRlc2NyaWJlIGZyb20gJ0Byb290L2Rlc2NyaWJlVGFibGUnXG5pbXBvcnQgZ2V0VGFibGVMaXN0IGZyb20gJ0Byb290L2xpc3RUYWJsZXMnXG5pbXBvcnQgeyBwcm9tcHQgfSBmcm9tICdlbnF1aXJlcidcblxuZXhwb3J0IGludGVyZmFjZSBJVHlwZUFuc3dlcnMge1xuICBEQlR5cGU6IHN0cmluZyxcbiAgREJIb3N0OiBzdHJpbmcsXG4gIERCTmFtZTogc3RyaW5nLFxuICBEQlVzZXI6IHN0cmluZyxcbiAgREJQYXNzd29yZDogc3RyaW5nXG59XG5cbmNvbnN0IHF1ZXN0aW9uID0gW1xuICB7XG4gICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgbmFtZTogJ0RCVHlwZScsXG4gICAgbWVzc2FnZTogJ1doYXQgaXMgeW91ciBkYXRhYmFzZT8nLFxuICAgIGxpbWl0OiA1LFxuICAgIGNob2ljZXM6IFtcbiAgICAgICdteXNxbCcsXG4gICAgICAncGdzcWwnLFxuICAgICAgJ21vbmdvREInLFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIG5hbWU6ICdEQkhvc3QnLFxuICAgIG1lc3NhZ2U6ICdEYXRhYmFzZSBob3N0bmFtZT8nLFxuICAgIGluaXRpYWw6ICdsb2NhbGhvc3QnLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnREJOYW1lJyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgbmFtZT8nLFxuICAgIGluaXRpYWw6ICdleGFtcGxlX2RhdGFiYXNlJyxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgbmFtZTogJ0RCVXNlcicsXG4gICAgbWVzc2FnZTogJ0RhdGFiYXNlIHVzZXI/JyxcbiAgICBpbml0aWFsOiAncm9vdCcsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgIG5hbWU6ICdEQlBhc3N3b3JkJyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgcGFzc3dvcmQ/JyxcbiAgICBpbml0aWFsOiAnJyxcbiAgfSxcbl07XG5cbnByb21wdChxdWVzdGlvbikudGhlbihcbiAgKGFuc3dlcnM6IGFueSkgPT4ge1xuICAgIGNvbnN0IGNvbXBpbGVkQW5zd2VyczogSVR5cGVBbnN3ZXJzID0ge1xuICAgICAgREJUeXBlOiBhbnN3ZXJzLkRCVHlwZSxcbiAgICAgIERCSG9zdDogYW5zd2Vycy5EQkhvc3QsXG4gICAgICBEQk5hbWU6IGFuc3dlcnMuREJOYW1lLFxuICAgICAgREJVc2VyOiBhbnN3ZXJzLkRCVXNlcixcbiAgICAgIERCUGFzc3dvcmQ6IGFuc3dlcnMuREJQYXNzd29yZCxcbiAgICB9XG5cbiAgICBwcm9jZXNzLmVudiA9IHtcbiAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgLi4uY29tcGlsZWRBbnN3ZXJzLFxuICAgIH1cbiAgICBQcm9taXNlLmFsbChbXG4gICAgICBnZW5lcmF0ZUNvbmZpZyhjb21waWxlZEFuc3dlcnMpLFxuICAgICAgZ2V0VGFibGVMaXN0KCksXG4gICAgXSkudGhlbihcbiAgICAgIChbY29uZmlnLCB0YWJsZU5hbWVzXSkgPT4ge1xuICAgICAgICBkZXNjcmliZSh0YWJsZU5hbWVzKS50aGVuKFxuICAgICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBnZW5lcmF0ZVNldHRpbmdzKHJlc3VsdHMpXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgKVxuICB9XG4pXG4iXX0=