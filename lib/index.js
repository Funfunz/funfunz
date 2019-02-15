"use strict";

var _listTables = _interopRequireDefault(require("./listTables"));

var _describeTable = _interopRequireDefault(require("./describeTable"));

var _configGenerator = require("./configGenerator");

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
      (0, _configGenerator.generateSettings)(results);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJxdWVzdGlvbiIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImxpbWl0IiwiY2hvaWNlcyIsImluaXRpYWwiLCJ0aGVuIiwiYW5zd2VycyIsImNvbXBpbGVkQW5zd2VycyIsIkRCVHlwZSIsIkRCSG9zdCIsIkRCTmFtZSIsIkRCVXNlciIsIkRCUGFzc3dvcmQiLCJwcm9jZXNzIiwiZW52IiwiUHJvbWlzZSIsImFsbCIsImNvbmZpZyIsInRhYmxlc05hbWVzIiwicmVzdWx0cyJdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQVVBLElBQU1BLFFBQVEsR0FBRyxDQUNmO0FBQ0VDLEVBQUFBLElBQUksRUFBRSxRQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxRQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSx3QkFIWDtBQUlFQyxFQUFBQSxLQUFLLEVBQUUsQ0FKVDtBQUtFQyxFQUFBQSxPQUFPLEVBQUUsQ0FDUCxPQURPLEVBRVAsT0FGTyxFQUdQLFNBSE87QUFMWCxDQURlLEVBWWY7QUFDRUosRUFBQUEsSUFBSSxFQUFFLE9BRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFFBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLG9CQUhYO0FBSUVHLEVBQUFBLE9BQU8sRUFBRTtBQUpYLENBWmUsRUFrQmY7QUFDRUwsRUFBQUEsSUFBSSxFQUFFLE9BRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFFBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLGdCQUhYO0FBSUVHLEVBQUFBLE9BQU8sRUFBRTtBQUpYLENBbEJlLEVBd0JmO0FBQ0VMLEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxRQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSxnQkFIWDtBQUlFRyxFQUFBQSxPQUFPLEVBQUU7QUFKWCxDQXhCZSxFQThCZjtBQUNFTCxFQUFBQSxJQUFJLEVBQUUsVUFEUjtBQUVFQyxFQUFBQSxJQUFJLEVBQUUsWUFGUjtBQUdFQyxFQUFBQSxPQUFPLEVBQUUsb0JBSFg7QUFJRUcsRUFBQUEsT0FBTyxFQUFFO0FBSlgsQ0E5QmUsQ0FBakI7QUFzQ0Esc0JBQU9OLFFBQVAsRUFBaUJPLElBQWpCLENBQ0UsVUFBQ0MsT0FBRCxFQUFrQjtBQUNoQixNQUFNQyxlQUE0QixHQUFHO0FBQ25DQyxJQUFBQSxNQUFNLEVBQUVGLE9BQU8sQ0FBQ0UsTUFEbUI7QUFFbkNDLElBQUFBLE1BQU0sRUFBRUgsT0FBTyxDQUFDRyxNQUZtQjtBQUduQ0MsSUFBQUEsTUFBTSxFQUFFSixPQUFPLENBQUNJLE1BSG1CO0FBSW5DQyxJQUFBQSxNQUFNLEVBQUVMLE9BQU8sQ0FBQ0ssTUFKbUI7QUFLbkNDLElBQUFBLFVBQVUsRUFBRU4sT0FBTyxDQUFDTTtBQUxlLEdBQXJDO0FBUUFDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixxQkFDS0QsT0FBTyxDQUFDQyxHQURiLEVBRUtQLGVBRkw7QUFJQVEsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksQ0FDVixxQ0FBZVQsZUFBZixDQURVLEVBRVYsMEJBRlUsQ0FBWixFQUdHRixJQUhILENBSUUsZ0JBQTJCO0FBQUE7QUFBQSxRQUF6QlksTUFBeUI7QUFBQSxRQUFqQkMsV0FBaUI7O0FBQ3pCLGdDQUFTQSxXQUFULEVBQXNCYixJQUF0QixDQUNFLFVBQUFjLE9BQU8sRUFBSTtBQUNULDZDQUFpQkEsT0FBakI7QUFDRCxLQUhIO0FBS0QsR0FWSDtBQVlELENBMUJIIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZ2V0IHRoZSBjbGllbnRcbmltcG9ydCB0YWJsZXMgZnJvbSAnQHJvb3QvbGlzdFRhYmxlcydcbmltcG9ydCBkZXNjcmliZSBmcm9tICdAcm9vdC9kZXNjcmliZVRhYmxlJ1xuaW1wb3J0IHsgZ2VuZXJhdGVTZXR0aW5ncywgZ2VuZXJhdGVDb25maWcgfSBmcm9tICdAcm9vdC9jb25maWdHZW5lcmF0b3InXG5pbXBvcnQgeyBwcm9tcHQgfSBmcm9tICdlbnF1aXJlcidcblxuZXhwb3J0IHR5cGUgdHlwZUFuc3dlcnMgPSB7XG4gIERCVHlwZTogc3RyaW5nLFxuICBEQkhvc3Q6IHN0cmluZyxcbiAgREJOYW1lOiBzdHJpbmcsXG4gIERCVXNlcjogc3RyaW5nLFxuICBEQlBhc3N3b3JkOiBzdHJpbmdcbn1cblxuY29uc3QgcXVlc3Rpb24gPSBbXG4gIHtcbiAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICBuYW1lOiAnREJUeXBlJyxcbiAgICBtZXNzYWdlOiAnV2hhdCBpcyB5b3VyIGRhdGFiYXNlPycsXG4gICAgbGltaXQ6IDUsXG4gICAgY2hvaWNlczogW1xuICAgICAgJ215c3FsJyxcbiAgICAgICdwZ3NxbCcsXG4gICAgICAnbW9uZ29EQicsXG4gICAgXVxuICB9LFxuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnREJIb3N0JyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgaG9zdG5hbWU/JyxcbiAgICBpbml0aWFsOiAnbG9jYWxob3N0J1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnREJOYW1lJyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgbmFtZT8nLFxuICAgIGluaXRpYWw6ICdleGFtcGxlX2RhdGFiYXNlJ1xuICB9LFxuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnREJVc2VyJyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgdXNlcj8nLFxuICAgIGluaXRpYWw6ICdyb290J1xuICB9LFxuICB7XG4gICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICBuYW1lOiAnREJQYXNzd29yZCcsXG4gICAgbWVzc2FnZTogJ0RhdGFiYXNlIHBhc3N3b3JkPycsXG4gICAgaW5pdGlhbDogJydcbiAgfSxcbl07XG4gXG5wcm9tcHQocXVlc3Rpb24pLnRoZW4oXG4gIChhbnN3ZXJzOiBhbnkpID0+IHtcbiAgICBjb25zdCBjb21waWxlZEFuc3dlcnM6IHR5cGVBbnN3ZXJzID0ge1xuICAgICAgREJUeXBlOiBhbnN3ZXJzLkRCVHlwZSxcbiAgICAgIERCSG9zdDogYW5zd2Vycy5EQkhvc3QsXG4gICAgICBEQk5hbWU6IGFuc3dlcnMuREJOYW1lLFxuICAgICAgREJVc2VyOiBhbnN3ZXJzLkRCVXNlcixcbiAgICAgIERCUGFzc3dvcmQ6IGFuc3dlcnMuREJQYXNzd29yZFxuICAgIH1cblxuICAgIHByb2Nlc3MuZW52ID0ge1xuICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAuLi5jb21waWxlZEFuc3dlcnNcbiAgICB9XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgZ2VuZXJhdGVDb25maWcoY29tcGlsZWRBbnN3ZXJzKSxcbiAgICAgIHRhYmxlcygpLFxuICAgIF0pLnRoZW4oXG4gICAgICAoW2NvbmZpZywgdGFibGVzTmFtZXNdKSA9PiB7XG4gICAgICAgIGRlc2NyaWJlKHRhYmxlc05hbWVzKS50aGVuKFxuICAgICAgICAgIHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZ2VuZXJhdGVTZXR0aW5ncyhyZXN1bHRzKVxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIClcbiAgfVxuKVxuIl19