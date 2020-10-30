# End goals

This project is intended to be developed in 2 different repositories.

- **@funfunz/main**
- **@funfunz/frontend**

## @funfunz/main

Will contain the command line interface responsible to generate all the configuration files and a middleware to be use inside express applications.

The middleware will deliver a full CRUD Graphql API to handle all the changes of database data.

This layer will also have a set of configuration files so that the developer can define the access to all the data.

## @funfunz/backoffice

The Backoffice project will be a fully functional react application that is prepared to consume the @funfunz/main Graphql API to manage all the database data.

## @funfunz/template

This repository will contain a template project that uses @funfunz/main and @funfunz/backoffice to ease a new project setup
