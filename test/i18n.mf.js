const i18n = require('../i18n')
const should = require('should')
const extensions = require('./extensions')
const { oneLineTrim } = require('common-tags')

extensions.forEach(extension => {
  describe(`parsing Messageformat phrases use ${extension}`, () => {
    const mfTest = {}

    beforeEach(() => {
      i18n.configure({
        locales: ['en', 'de', 'fr', 'ru'],
        register: mfTest,
        directory: './locales',
        updateFiles: false,
        objectNotation: true,
        extension
      })
    })

    it('should work with simple strings', () => {
      mfTest.setLocale('en')
      should.equal('Hello', mfTest.__mf('Hello'))

      mfTest.setLocale('de')
      should.equal('Hallo', mfTest.__mf('Hello'))
      should.equal('Hallo', mfTest.__mf('Hello'))
      should.equal('Hallo Marcus, wie geht es dir heute?', mfTest.__mf('Hello %s, how are you today?', 'Marcus'))
      should.equal('Hello', i18n.__mf({ phrase: 'Hello', locale: 'en' }))
      should.equal('Hello', mfTest.__mf({ phrase: 'Hello', locale: 'en' }))
    })

    it('should work with basic replacements', () => {
      mfTest.setLocale('en')
      should.equal('Hello Marcus', mfTest.__mf('Hello {name}', { name: 'Marcus' }))

      mfTest.setLocale('de')
      should.equal('Hallo Marcus', mfTest.__mf('Hello {name}', { name: 'Marcus' }))
      should.equal('Hallo Marcus, wie war dein test?', mfTest.__mf('Hello {name}, how was your %s?', 'test', { name: 'Marcus' }))
    })

    it('should work with plurals', () => {
      const msg = oneLineTrim`
        In {lang}, there {NUM, plural,
          =0{are no unicorns}
          one{is # unicorn}
          other{are # unicorns}
        }
      `

      mfTest.setLocale('en')
      const english0 = mfTest.__mf(msg, { NUM: 0, lang: 'english' })
      should.equal('In english, there are no unicorns', english0)
      const english1 = mfTest.__mf(msg, { NUM: 1, lang: 'english' })
      should.equal('In english, there is 1 unicorn', english1)
      const english2 = mfTest.__mf(msg, { NUM: 2, lang: 'english' })
      should.equal('In english, there are 2 unicorns', english2)

      mfTest.setLocale('de')
      const german0 = mfTest.__mf(msg, { NUM: 0, lang: 'german' })
      should.equal('In german, there are no unicorns', german0)
      const german1 = mfTest.__mf(msg, { NUM: 1, lang: 'german' })
      should.equal('In german, there is 1 unicorn', german1)
      const german2 = mfTest.__mf(msg, { NUM: 2, lang: 'german' })
      should.equal('In german, there are 2 unicorns', german2)
    })
  })
})
