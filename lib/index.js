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
      (0, _configGenerator.generateSettings)(results);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJxdWVzdGlvbiIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImxpbWl0IiwiY2hvaWNlcyIsImluaXRpYWwiLCJ0aGVuIiwiYW5zd2VycyIsImNvbXBpbGVkQW5zd2VycyIsIkRCVHlwZSIsIkRCSG9zdCIsIkRCTmFtZSIsIkRCVXNlciIsIkRCUGFzc3dvcmQiLCJwcm9jZXNzIiwiZW52IiwiUHJvbWlzZSIsImFsbCIsImNvbmZpZyIsInRhYmxlc05hbWVzIiwicmVzdWx0cyJdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQVVBLElBQU1BLFFBQVEsR0FBRyxDQUNmO0FBQ0VDLEVBQUFBLElBQUksRUFBRSxRQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxRQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSx3QkFIWDtBQUlFQyxFQUFBQSxLQUFLLEVBQUUsQ0FKVDtBQUtFQyxFQUFBQSxPQUFPLEVBQUUsQ0FDUCxPQURPLEVBRVAsT0FGTyxFQUdQLFNBSE87QUFMWCxDQURlLEVBWWY7QUFDRUosRUFBQUEsSUFBSSxFQUFFLE9BRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFFBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLG9CQUhYO0FBSUVHLEVBQUFBLE9BQU8sRUFBRTtBQUpYLENBWmUsRUFrQmY7QUFDRUwsRUFBQUEsSUFBSSxFQUFFLE9BRFI7QUFFRUMsRUFBQUEsSUFBSSxFQUFFLFFBRlI7QUFHRUMsRUFBQUEsT0FBTyxFQUFFLGdCQUhYO0FBSUVHLEVBQUFBLE9BQU8sRUFBRTtBQUpYLENBbEJlLEVBd0JmO0FBQ0VMLEVBQUFBLElBQUksRUFBRSxPQURSO0FBRUVDLEVBQUFBLElBQUksRUFBRSxRQUZSO0FBR0VDLEVBQUFBLE9BQU8sRUFBRSxnQkFIWDtBQUlFRyxFQUFBQSxPQUFPLEVBQUU7QUFKWCxDQXhCZSxFQThCZjtBQUNFTCxFQUFBQSxJQUFJLEVBQUUsVUFEUjtBQUVFQyxFQUFBQSxJQUFJLEVBQUUsWUFGUjtBQUdFQyxFQUFBQSxPQUFPLEVBQUUsb0JBSFg7QUFJRUcsRUFBQUEsT0FBTyxFQUFFO0FBSlgsQ0E5QmUsQ0FBakI7QUFzQ0Esc0JBQU9OLFFBQVAsRUFBaUJPLElBQWpCLENBQ0UsVUFBQ0MsT0FBRCxFQUFrQjtBQUNoQixNQUFNQyxlQUE2QixHQUFHO0FBQ3BDQyxJQUFBQSxNQUFNLEVBQUVGLE9BQU8sQ0FBQ0UsTUFEb0I7QUFFcENDLElBQUFBLE1BQU0sRUFBRUgsT0FBTyxDQUFDRyxNQUZvQjtBQUdwQ0MsSUFBQUEsTUFBTSxFQUFFSixPQUFPLENBQUNJLE1BSG9CO0FBSXBDQyxJQUFBQSxNQUFNLEVBQUVMLE9BQU8sQ0FBQ0ssTUFKb0I7QUFLcENDLElBQUFBLFVBQVUsRUFBRU4sT0FBTyxDQUFDTTtBQUxnQixHQUF0QztBQVFBQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIscUJBQ0tELE9BQU8sQ0FBQ0MsR0FEYixFQUVLUCxlQUZMO0FBSUFRLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLENBQ1YscUNBQWVULGVBQWYsQ0FEVSxFQUVWLDBCQUZVLENBQVosRUFHR0YsSUFISCxDQUlFLGdCQUEyQjtBQUFBO0FBQUEsUUFBekJZLE1BQXlCO0FBQUEsUUFBakJDLFdBQWlCOztBQUN6QixnQ0FBU0EsV0FBVCxFQUFzQmIsSUFBdEIsQ0FDRSxVQUFDYyxPQUFELEVBQWE7QUFDWCw2Q0FBaUJBLE9BQWpCO0FBQ0QsS0FISDtBQUtELEdBVkg7QUFZRCxDQTFCSCIsInNvdXJjZXNDb250ZW50IjpbIi8vIGdldCB0aGUgY2xpZW50XG5pbXBvcnQgeyBnZW5lcmF0ZUNvbmZpZywgZ2VuZXJhdGVTZXR0aW5ncyB9IGZyb20gJ0Byb290L2NvbmZpZ0dlbmVyYXRvcidcbmltcG9ydCBkZXNjcmliZSBmcm9tICdAcm9vdC9kZXNjcmliZVRhYmxlJ1xuaW1wb3J0IHRhYmxlcyBmcm9tICdAcm9vdC9saXN0VGFibGVzJ1xuaW1wb3J0IHsgcHJvbXB0IH0gZnJvbSAnZW5xdWlyZXInXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVR5cGVBbnN3ZXJzIHtcbiAgREJUeXBlOiBzdHJpbmcsXG4gIERCSG9zdDogc3RyaW5nLFxuICBEQk5hbWU6IHN0cmluZyxcbiAgREJVc2VyOiBzdHJpbmcsXG4gIERCUGFzc3dvcmQ6IHN0cmluZ1xufVxuXG5jb25zdCBxdWVzdGlvbiA9IFtcbiAge1xuICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgIG5hbWU6ICdEQlR5cGUnLFxuICAgIG1lc3NhZ2U6ICdXaGF0IGlzIHlvdXIgZGF0YWJhc2U/JyxcbiAgICBsaW1pdDogNSxcbiAgICBjaG9pY2VzOiBbXG4gICAgICAnbXlzcWwnLFxuICAgICAgJ3Bnc3FsJyxcbiAgICAgICdtb25nb0RCJyxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2lucHV0JyxcbiAgICBuYW1lOiAnREJIb3N0JyxcbiAgICBtZXNzYWdlOiAnRGF0YWJhc2UgaG9zdG5hbWU/JyxcbiAgICBpbml0aWFsOiAnbG9jYWxob3N0JyxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgbmFtZTogJ0RCTmFtZScsXG4gICAgbWVzc2FnZTogJ0RhdGFiYXNlIG5hbWU/JyxcbiAgICBpbml0aWFsOiAnZXhhbXBsZV9kYXRhYmFzZScsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIG5hbWU6ICdEQlVzZXInLFxuICAgIG1lc3NhZ2U6ICdEYXRhYmFzZSB1c2VyPycsXG4gICAgaW5pdGlhbDogJ3Jvb3QnLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICBuYW1lOiAnREJQYXNzd29yZCcsXG4gICAgbWVzc2FnZTogJ0RhdGFiYXNlIHBhc3N3b3JkPycsXG4gICAgaW5pdGlhbDogJycsXG4gIH0sXG5dO1xuXG5wcm9tcHQocXVlc3Rpb24pLnRoZW4oXG4gIChhbnN3ZXJzOiBhbnkpID0+IHtcbiAgICBjb25zdCBjb21waWxlZEFuc3dlcnM6IElUeXBlQW5zd2VycyA9IHtcbiAgICAgIERCVHlwZTogYW5zd2Vycy5EQlR5cGUsXG4gICAgICBEQkhvc3Q6IGFuc3dlcnMuREJIb3N0LFxuICAgICAgREJOYW1lOiBhbnN3ZXJzLkRCTmFtZSxcbiAgICAgIERCVXNlcjogYW5zd2Vycy5EQlVzZXIsXG4gICAgICBEQlBhc3N3b3JkOiBhbnN3ZXJzLkRCUGFzc3dvcmQsXG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYgPSB7XG4gICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgIC4uLmNvbXBpbGVkQW5zd2VycyxcbiAgICB9XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgZ2VuZXJhdGVDb25maWcoY29tcGlsZWRBbnN3ZXJzKSxcbiAgICAgIHRhYmxlcygpLFxuICAgIF0pLnRoZW4oXG4gICAgICAoW2NvbmZpZywgdGFibGVzTmFtZXNdKSA9PiB7XG4gICAgICAgIGRlc2NyaWJlKHRhYmxlc05hbWVzKS50aGVuKFxuICAgICAgICAgIChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICBnZW5lcmF0ZVNldHRpbmdzKHJlc3VsdHMpXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICB9XG4gICAgKVxuICB9XG4pXG4iXX0=