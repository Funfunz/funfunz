# Quickstart
---

## Project setup

```
npm init
npm i funfunz
```
---

## Generate configurations

```
node_modules/.bin/funfunz
```
---

## Running the application

You can run the application in standalone or plugin mode.

### Standalone

Please see the [standalone project](standalone.md) for further details.

This mode will start the application without the need of any other package, the only requirements are the configuration files.

### Plugin

Please see the [plugin project](plugin.md) for further details.

Running the application in plugin mode will make Funfunz to return an expressJS middleware that you can use inside your expressJS applications.