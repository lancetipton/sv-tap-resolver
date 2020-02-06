const path = require('path')

const appRoot = path.join(__dirname, '../../')
const basePath = path.join(__dirname, './base')
const tapPath = path.join(__dirname, './taps/test')
const tapConfig = path.join(__dirname, './taps/test/app.json')

module.exports = {
  appRoot,
  basePath,
  tapPath,
  tapConfig
}
