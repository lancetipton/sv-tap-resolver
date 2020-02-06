const path = require('path')

const kegPath = path.join(__dirname, '../../')
const basePath = path.join(__dirname, './base')
const tapPath = path.join(__dirname, './taps/test')

module.exports = {
  kegPath,
  basePath,
  tapPath
}
