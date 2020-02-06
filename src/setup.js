const fs = require('fs')
const path = require('path')
const APP_ROOT = require('app-root-path')
const { logData, setLogs, get } = require('jsutils')
const buildAliases = require('./buildAliases')
const buildConstants = require('./buildConstants')
const getAppConfig = require('./getAppConfig')
const contentResolver = require('./contentResolver')

setLogs(process.env.LOG, `log`, `[ Tap Resolver ]`)

/**
 * Setups up the project to load the tap
 * @param {string} kegPath - Path to the keg root
 * @param {Object} kegConfig - keg app.json config file
 * @param {function} contentResolver - Function to help resolve file paths
 *
 * @return {Object} - Alias map to load files
 */
module.exports = (kegPath, kegConfig, contentResolver, tapPath, tapConfig) => {
  kegPath = kegPath || APP_ROOT
  kegConfig = kegConfig || getAppConfig(kegPath)
  
  const {
    ALIASES,
    APP_CONFIG,
    APP_CONFIG_PATH,
    BASE_CONTENT,
    BASE_PATH,
    DYNAMIC_CONTENT,
    EXTENSIONS,
    HAS_TAP
  } = buildConstants(kegPath, kegConfig, tapPath, tapConfig)

  const aliasesBuilder = buildAliases(
    APP_CONFIG,
    contentResolver,
    { ...ALIASES },
    {
      base: BASE_CONTENT,
      basePath: BASE_PATH,
      dynamic: DYNAMIC_CONTENT,
      tap: HAS_TAP,
      extensions: EXTENSIONS
    }
  )

  return {
    EXTENSIONS,
    buildAliases: aliasesBuilder,
  }
}