const path = require('path')

const kegPath = path.join(__dirname, '../../')
const basePath = path.join(__dirname, './base')
const webResolverPath = path.join(__dirname, './base/webResolver')
const tapPath = path.join(__dirname, './taps/test')

module.exports = {
  kegPath,
  basePath,
  tapPath,
  webResolverPath
}
