const expect = require('chai').expect


context('The Up library is exported two ways:', () => {
  specify('As default', () => {
    const Up = require('./lib/index').default
    expect(Up.toHtml('It actually worked?')).to.be.eql('<p>It actually worked?</p>')
  })

  specify('As Up', () => {
    const Up = require('./lib/index').Up
    expect(Up.toHtml('That seems *very* unlikely.')).to.be.eql('<p>That seems <em>very</em> unlikely.</p>')
  })
})


describe("Both exports", () => {
  it('point to the same object', () => {
    const exports = require('./lib/index')
    expect(exports.default).to.be.eql(exports.Up)
  })
})