# Contributing

## Setting Up a Local Copy

1. Clone the repo with git clone https://github.com/jwebcoder/funfunz
2. Run `npm` in the root funfunz folder.

## Commands

* `npm install` - Install all the project dependencies.
* `DB_PASSWORD=mysqlPassword npm run dev` - Runs the application in development mode, the mysqlPassword can be found inside `docker-compose.yml`file. 
* `npm run docker-compose:up` - Creates two docker containers, one for MySQL and another for MongoDB, these containers are to be used for the DEV environment.
* `npm run docker-compose:down` - Destroys the docker containers.
* `npm run questions` - Runs the Wizard to setup the settings and configuration files needed to connect with a database.
* `npm run build` - Builds a local Funfunz that can be used inside an ExpressJS application.
* `npm run docs` - Run a local version of the online docs.
