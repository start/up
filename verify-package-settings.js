"use strict";

const expect = require('chai').expect
const path = require('node:path');

const packageSettings = require('./package.json')
const Up = require('./' + packageSettings.main)


context('In package.json', () => {
  specify('the `main` field points to the entry point of the library', () => {
    expect(Up.parseAndRender('It *actually* worked?')).to.equal('<p>It <em>actually</em> worked?</p>')
  })

  specify('the `types` field points to the typings for the entry point of the library', () => {
    const typesBasename = path.basename(packageSettings.types, '.d.ts')
    const entryPointBasename = path.basename(packageSettings.main, '.js')

    expect(typesBasename).to.equal(entryPointBasename)
  })

  specify('the `version` field matches the version of the library', () => {
    expect(packageSettings.version).to.equal(Up.VERSION)
  })
})
