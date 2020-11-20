# Quickstart

You can run the application using the template project or through the exported middleware

## Template project

Please see the [template project](https://github.com/Funfunz/funfunz-template) for further details

This is a template Express application that already has everything setup to start a new Funfunz ready backend

---

## Funfunz Middleware

Please see the [middleware](usage/middleware.md) for further details

The middleware is an express middleware so that you can use it inside ExpressJS or any other compatible system

### Project setup

```
npm init
npm i funfunz
```

### Generate configurations

**npx**
```
npx funfunz
```

**local installation**
```
node_modules/.bin/funfunz
```

### Usage

```js
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const mcConfig = require('./mc/MCconfig.json')
const mcSettings = require('./mc/MCsettings,json')
const Funfunz = require('funfunz')

const indexRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/admin/api', new Funfunz({
  config: mcConfig,
  settings: mcSettings
}).middleware)

// error handler
app.use(function(err, req, res) {
  res.send('error')
})

module.exports = app
```

