const { deepFreeze } = require('jsutils')
const FS = require('./fs')
const Rimraf = require('./rimraf')
const paths = require('./paths')
const appJson = require('./app.json')

module.exports = {
  FS,
  Rimraf,
  ...paths,
  appConfig: Object.freeze(appJson),
}
