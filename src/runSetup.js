const fs = require('fs')
const path = require('path')
const APP_ROOT = require('app-root-path')
const { logData, setLogs, get } = require('jsutils')
const buildAliases = require('./builders/buildAliases')
const buildConstants = require('./builders/buildConstants')
const getAppConfig = require('./resolvers/getAppConfig')
const defContentResolver = require('./resolvers/contentResolver')

setLogs(process.env.LOG, `log`, `[ Tap Resolver ]`)

/**
 * Setups up the project to load the tap
 * @param {Object} options - Settings to built the babel config
 * @param {Object} options.config - Joined Tap and Keg configs
 * @param {string} options.tapPath - Path to the tap
 * @param {string} options.kegPath - Path to the keg
 * @param {function} contentResolver - Function to help resolve file paths
 *
 * @return {Object} - Alias map to load files
 */
module.exports = (options, contentResolver) => {

  contentResolver = contentResolver || defContentResolver

  const {
    ALIASES,
    APP_CONFIG,
    APP_CONFIG_PATH,
    BASE_CONTENT,
    BASE_PATH,
    DYNAMIC_CONTENT,
    EXTENSIONS,
    HAS_TAP
  } = buildConstants(options)

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