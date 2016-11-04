// We currently support (and test on Travis CI) every officially maintained version
// of Node.js. Unfortunately, that includes v0.12, which requires the `harmony` flag
// if you want to use `const` in strict mode.

const expect = require('chai').expect
const path = require('path');

const packageSettings = require('./package.json')
const Up = require('./' + packageSettings.main)


context('In package.json', () => {
  specify('the `main` field points to the entry point of the library', () => {
    expect(Up.parseAndRender('It *actually* worked?')).to.equal('<p>It <em>actually</em> worked?</p>')
  })

  specify('the `typings` field points to the typings for the entry point of the library', () => {
    const typingsBasename = path.basename(packageSettings.typings, '.d.ts')
    const entryPointBasename = path.basename(packageSettings.main, '.js')

    expect(typingsBasename).to.equal(entryPointBasename)
  })

  specify('the `version` field matches the version of the library', () => {
    expect(packageSettings.version).to.equal(Up.VERSION)
  })
})
