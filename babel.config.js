const path = require('path')
const appRootPath = require('app-root-path').path
const runSetup = require('./src/setup')
const getAppConfig = require('./src/getAppConfig')
const { get, isObj, isStr } = require('jsutils')
const { PLATFORM, NODE_ENV, TAP } = process.env

/**
 * Try to get the name of the current tap
 * @param {string} name - name of the current tap
 *
 * @returns {string} - name of the current tap
 */
const getTapName = name => {

  name = name || TAP

  // If we already have a name, lowercase it, and return it
  if(name && isStr(name)) return name

  // Try to get the tapConfig, but don't validate it
  const tapConfig = getAppConfig(appRootPath, false, false)
  // Check for the name
  const tapName = get(tapConfig, ['name'])

  // If there's a name, lowercase it, and return it
  return tapName && tapName
}

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
 * @param {Object} rootConfig - default app.json config
 * @param {string} type - Type of resolver file to load ( contentResolver || webResolver )
 *
 * @returns {function} - Loaded resolver file
 */
const getResolverFile = (rootPath, rootConfig, type) => {
  try {
    const resolverPath = get(rootConfig, [ 'tapResolver', 'paths', type ])
    const resolver = resolverPath && path.join(rootPath, resolverPath)
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
const babelSetup = (appPath, tapName) => {

  const rootPath = appPath || appRootPath

  // Get the config for the App
  const rootConfig = getAppConfig(rootPath)

  const isWeb = PLATFORM === 'web'
  const platformConfAliases = getPlatformData(get(rootConfig, [ 'tapResolver', 'aliases' ]), isWeb)
  const babelConf = getPlatformData(get(rootConfig, [ 'tapResolver', 'babel' ]), isWeb)
  const contentResolver = getResolverFile(rootPath, rootConfig, 'contentResolver')
  const webResolver = getResolverFile(rootPath, rootConfig, 'webResolver')

  // Run the setup to get tap extensions, and alias helper
  const { buildAliases, EXTENSIONS } = runSetup(rootPath, rootConfig, contentResolver, getTapName(tapName))
  // Set the presets and plugins based on the platform type
  const presets = [ ...babelConf.presets ]
  const plugins = [ ...babelConf.plugins ]

  // Build the module-resolver, and add the alias based on platform type
  plugins.push([
    'module-resolver', {
      root: [ rootPath ],
      cwd: rootPath,
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