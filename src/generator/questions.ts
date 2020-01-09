export const databaseTypeQuestion = {
  type: 'select',
  name: 'DBType',
  message: 'What is your database?',
  limit: 5,
  choices: [
    'mysql',
    'pgsql',
    'mongoDB',
  ],
}

export const databaseQuestions = {
  mysql: [
    {
      type: 'input',
      name: 'DBHost',
      message: 'Database hostname?',
      initial: 'localhost',
    },
    {
      type: 'input',
      name: 'DBName',
      message: 'Database name?',
      initial: 'example_database',
    },
    {
      type: 'input',
      name: 'DBUser',
      message: 'Database user?',
      initial: 'root',
    },
    {
      type: 'password',
      name: 'DBPassword',
      message: 'Database password?',
      initial: '',
    },
  ],
  mongoDB: [
    {
      type: 'input',
      name: 'DBHost',
      message: 'Database hostname?',
      initial: 'localhost',
    },
    {
      type: 'input',
      name: 'DBName',
      message: 'Database name?',
      initial: 'example_database',
    },
    {
      type: 'input',
      name: 'DBUser',
      message: 'Database user?',
      initial: 'root',
    },
    {
      type: 'password',
      name: 'DBPassword',
      message: 'Database password?',
      initial: '',
    },
  ],
}
