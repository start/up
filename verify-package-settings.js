"use strict";

const expect = require('chai').expect
const packageSettings = require('./package.json')

const Up = require('./' + packageSettings.main)


describe('The `main` field in package.json', () => {
  it('points to the entry point of the library', () => {
    expect(Up.toHtml('It *actually* worked?')).to.equal('<p>It <em>actually</em> worked?</p>')
  })
})


describe('The `version` field in package.json', () => {
  it('matches the version of the library', () => {
    expect(packageSettings.version).to.equal(Up.VERSION)
  })
})
