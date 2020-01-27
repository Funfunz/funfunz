# FunfunzMC Documentation

For the source code you can visit Github [funfunzmc](https://github.com/JWebCoder/funfunzmc).

## Overview

funfunzmc was created due the lack of a functional back office generator in the NodeJS community.

The goal is to generate a fully automated back office that can be used to directly handle all the database data.

**Current features:**

- CRUD operations
- Table filters
- MySQL parser and configurations generator
- Friendly name generator for table names and fields
- Simple role support to display or hide tables
- Configurable Hooks on all the requests to change any data on the backend side

## Installation

**Global installation**

```
npm install -g funfunzmc
```

**Project installation**
```
npm install funfunzmc
```

## CLI

* `funfunzmc questions` - Runs the Wizard to setup the settings and configuration files needed to connect with a database.
