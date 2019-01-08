var i18n = require('../i18n')
var should = require('should')
var path = require('path')
var extensions = require('./extensions')
var i18nPath = 'i18n'
var i18nFilename = path.resolve(i18nPath + '.js')

function reconfigure (config) {
  delete require.cache[i18nFilename]
  i18n = require(i18nFilename)
  i18n.configure(config)
}

extensions.forEach(function (extension) {
  describe('configure api use ' + extension, function () {
    it('should set an alias method on the object', function () {
      var customObject = {}
      reconfigure({
        locales: ['en', 'de'],
        register: customObject,
        api: {
          '__': 't'
        },
        extension: extension
      })
      should.equal(typeof customObject.t, 'function')
      should.equal(customObject.t('Hello'), 'Hello')
      customObject.setLocale('de')
      should.equal(customObject.t('Hello'), 'Hallo')
    })

    it('should work for any existing API method', function () {
      var customObject = {}
      reconfigure({
        locales: ['en', 'de'],
        register: customObject,
        api: {
          'getLocale': 'getLocaleAlias'
        },
        extension: extension
      })
      should.equal(typeof customObject.getLocaleAlias, 'function')
      customObject.setLocale('de')
      should.equal(customObject.getLocaleAlias(), 'de')
    })

    it('should ignore non existing API methods', function () {
      var customObject = {}
      reconfigure({
        locales: ['en', 'de'],
        register: customObject,
        api: {
          'nonExistingMethod': 'alias'
        },
        extension: extension
      })
      should.equal(typeof customObject.nonExistingMethod, 'undefined')
    })

    it('should not expose the actual API methods', function () {
      var customObject = {}
      reconfigure({
        locales: ['en', 'de'],
        register: customObject,
        api: {
          '__': 't'
        },
        extension: extension
      })
      should.equal(typeof customObject.__, 'undefined')
    })

    it('should escape res -> locals -> res recursion', function () {
      var customObject = {}
      customObject.locals = { res: customObject }
      reconfigure({
        locales: ['en', 'de'],
        register: customObject,
        api: {
          '__': 't'
        },
        extension: extension
      })
      should.equal(typeof customObject.t, 'function')
      should.equal(typeof customObject.locals.t, 'function')
    })
  })
})
