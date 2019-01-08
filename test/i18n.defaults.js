var i18n = require('../i18n')

var should = require('should')

var fs = require('fs')

var extensions = require('./extensions')

extensions.forEach(function (extension) {
  describe('Module Defaults use ' + extension, function () {
    var testScope = {}

    beforeEach(function () {
      i18n.configure({
        locales: ['en', 'de'],
        register: testScope,
        directory: './defaultlocales',
        extension: extension
      })
      testScope.__('Hello')
    })

    afterEach(function () {
      var stats = fs.lstatSync('./defaultlocales')
      should.exist(stats)
      if (stats) {
        try {
          fs.unlinkSync('./defaultlocales/de' + extension)
          fs.unlinkSync('./defaultlocales/en' + extension)
          fs.rmdirSync('./defaultlocales')
        } catch (e) {}
      }
    })

    it('should be possible to setup a custom directory', function () {
      var stats = fs.lstatSync('./defaultlocales')
      should.exist(stats)
    })

    it('should be possible to read custom files with default a extension of ' + extension + ' (issue #16)', function () {
      var statsde = fs.lstatSync('./defaultlocales/de' + extension)

      var statsen = fs.lstatSync('./defaultlocales/en' + extension)
      should.exist(statsde)
      should.exist(statsen)
    })
  })
})
