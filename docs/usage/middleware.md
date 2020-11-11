# Middleware

## Usage

```typescript
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
