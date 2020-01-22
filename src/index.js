const buildAliases = require('./buildAliases')
const buildAssets = require('./buildAssets')
const buildConstants = require('./buildConstants')
const getAppConfig = require('./getAppConfig')
const contentResolver = require('./contentResolver')
const cacheInvalidator = require('./cacheInvalidator')
const setup = require('./setup')
const setupTap = require('./setupTap')
const webResolver = require('./webResolver')

exports = {
  buildAliases,
  buildAssets,
  buildConstants,
  getAppConfig,
  contentResolver,
  setup,
  setupTap,
  webResolver,
}