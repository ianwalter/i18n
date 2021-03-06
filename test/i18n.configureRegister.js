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
  describe('configure register use ' + extension, function () {
    it('should work on a custom object', function (done) {
      var customObject = {}
      reconfigure({
        locales: ['en', 'de'],
        register: customObject,
        extension: extension
      })
      should.equal(customObject.__('Hello'), 'Hello')
      customObject.setLocale('de')
      should.equal(customObject.__('Hello'), 'Hallo')
      done()
    })

    it('should work on list of objects', function () {
      var obj1 = {}; var obj2 = {}
      reconfigure({
        locales: ['en', 'de', 'fr'],
        register: [obj1, obj2],
        extension: extension
      })
      should.equal(obj1.__('Hello'), 'Hello')
      should.equal(obj2.__('Hello'), 'Hello')

      // sets both
      i18n.setLocale('fr')
      should.equal(obj1.__('Hello'), 'Bonjour')
      should.equal(obj2.__('Hello'), 'Bonjour')

      // sets both too
      obj1.setLocale('en')
      should.equal(obj1.__('Hello'), 'Hello')
      should.equal(obj2.__('Hello'), 'Hello')

      // sets obj2 only
      i18n.setLocale([obj2], 'de')
      should.equal(obj1.__('Hello'), 'Hello')
      should.equal(obj2.__('Hello'), 'Hallo')

      // sets obj2 only
      i18n.setLocale(obj2, 'fr', true)
      should.equal(obj1.__('Hello'), 'Hello')
      should.equal(obj2.__('Hello'), 'Bonjour')
    })
  })
})
