"use strict";

const path = require('path');
const expect = require('chai').expect
const packageSettings = require('./package.json')

const Up = require('./' + packageSettings.main)


describe('The `main` field in package.json', () => {
  it('points to the entry point of the library', () => {
    expect(Up.parseAndRender('It *actually* worked?')).to.equal('<p>It <em>actually</em> worked?</p>')
  })
})


describe('The `typings` field in package.json', () => {
  it('points to the typings for the entry point of the library', () => {
    const typingsBasename = path.basename(packageSettings.typings, '.d.ts')
    const mainBasename =path.basename(packageSettings.main, '.js')

    expect(typingsBasename).to.equal(mainBasename)
  })
})


describe('The `version` field in package.json', () => {
  it('matches the version of the library', () => {
    expect(packageSettings.version).to.equal(Up.VERSION)
  })
})
