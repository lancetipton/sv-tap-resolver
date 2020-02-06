const { appConfig, appRoot } = require('../mocks')

// Helpers to allow calling the setup function in a test env
const buildAliases = jest.fn(() => { return {} })
const buildConstants = jest.fn(() => { return {} })
const getAppConfig = jest.fn(() => { return appConfig })
const resolver = () => ""

// Mock the called functions for testing
jest.setMock('../builders/buildAliases', buildAliases)
jest.setMock('../builders/buildConstants', buildConstants)
jest.setMock('../resolvers/getAppConfig', getAppConfig)

// Module to test
const runSetup = require('../runSetup')

describe('runSetup', () => {
  
  beforeEach(() => {
    getAppConfig.mockClear()
    buildConstants.mockClear()
    buildAliases.mockClear()
  })

  describe('params', () => {

    it('should call the getAppConfig when no config is passed in', () => {
      runSetup(appRoot, null, resolver, null)
      expect(getAppConfig).toHaveBeenCalled()
    })

    it('should NOT call the getAppConfig when a config is passed in', () => {
      runSetup(appRoot, appConfig, resolver, null)
      expect(getAppConfig).not.toHaveBeenCalled()
    })

  })

  describe('Internal function calls', () => {

    it('should call the buildConstants method', () => {
      const tapName = null
      runSetup(appRoot, appConfig, resolver, tapName)

      expect(buildConstants).toHaveBeenCalledWith(appRoot, appConfig, tapName)
    })

    it('should call the buildAliases method', () => {
      runSetup(appRoot, appConfig, resolver, null)

      expect(buildAliases).toHaveBeenCalled()
    })

  })

})
