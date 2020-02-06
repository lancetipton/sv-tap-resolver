const path = require('path')
const appRootPath = require('app-root-path').path
const runSetup = require('./src/setup')
const getAppConfig = require('./src/getAppConfig')
const { get, isObj, isStr } = require('jsutils')
const { PLATFORM, NODE_ENV } = process.env

/**
 * Gets the platform data based on the PLATFORM ENV
 * If isWeb, tries to pull from conf.web; else pulls from conf.native else returns conf
 *
 * @param {Object} conf - object to pull config data from
 * @param {boolean} isWeb - if the PLATFORM ENV equals web
 * @returns
 */
const getPlatformData = (conf, isWeb) => {
  return !isObj(conf)
    ? {}
    : isWeb && isObj(conf.web)
      ? conf.web
      : isObj(conf.native)
        ? conf.native
        : conf
}
/**
 * Loads a resolver file from the app config if defined, or uses the default
 * @param {Object} kegConfig - default app.json config
 * @param {string} type - Type of resolver file to load ( contentResolver || webResolver )
 *
 * @returns {function} - Loaded resolver file
 */
const getResolverFile = (kegPath, kegConfig, type) => {
  try {
    const resolverPath = get(kegConfig, [ 'tapResolver', 'paths', type ])
    const resolver = resolverPath && path.join(kegPath, resolverPath)
    if (resolver) console.log(`Using custom resolver for ${type}`)

    return resolver
      ? require(resolver)
      : require(`./src/${type}`)
  }
  catch (e){
    console.log(`Error loading custom resolver for ${type}`)
    console.error(e.message)
    console.error(e.stack)

    return require(`./src/${type}`)
  }
}

/**
 * Sets up the babel config based on the PLATFORM ENV and the app config in app.json
 *
 * @returns {Object} - built babel config
 */
const babelSetup = (kegPath, tapPath, tapConfig) => {

  // Get the config for the App
  const kegConfig = getAppConfig(kegPath)

  const isWeb = PLATFORM === 'web'
  const platformConfAliases = getPlatformData(get(kegConfig, [ 'tapResolver', 'aliases' ]), isWeb)
  const babelConf = getPlatformData(get(kegConfig, [ 'tapResolver', 'babel' ]), isWeb)
  const contentResolver = getResolverFile(kegPath, kegConfig, 'contentResolver')
  const webResolver = getResolverFile(kegPath, kegConfig, 'webResolver')

  // Run the setup to get tap extensions, and alias helper
  const { buildAliases, EXTENSIONS } = runSetup(
    kegPath,
    kegConfig,
    contentResolver,
    tapPath,
    tapConfig
  )

  // Set the presets and plugins based on the platform type
  const presets = [ ...babelConf.presets ]
  const plugins = [ ...babelConf.plugins ]

  // Build the module-resolver, and add the alias based on platform type
  plugins.push([
    'module-resolver', {
      root: [ kegPath ],
      cwd: kegPath,
      extensions: EXTENSIONS,
      // Aliases work differently in webpack, so add the webResolver method helper for alias mapping
      resolvePath: isWeb && webResolver || undefined,
      alias: {
        ...buildAliases(),
        ...platformConfAliases
      }
    } ])

  return {
    presets,
    plugins,
    env: {
      test: {
        presets,
        plugins
      }
    }
  }

}

module.exports = NODE_ENV === 'resolver-test'
  ? {}
  : babelSetup