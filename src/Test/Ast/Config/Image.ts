import { expect } from 'chai'
import Up from '../../../index'
import { Image } from '../../../SyntaxNodes/Image'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'


describe('The term that represents image conventions', () => {
  const up = new Up({
    terms: { image: 'see' }
  })

  it('comes from the "image" config term', () => {
    const markup = '[see: Chrono Cross logo][https://example.com/cc.png]'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const lowercase = '[see: Chrono Cross logo][https://example.com/cc.png]'
    const mixedCase = '[SeE: Chrono Cross logo][https://example.com/cc.png]'

    expect(up.toDocument(mixedCase)).to.be.eql(up.toDocument(lowercase))
  })

  it('is trimmed', () => {
    const markup = '[see: Chrono Cross logo][https://example.com/cc.png]'

    expect(Up.toDocument(markup, { terms: { markup: { image: ' \t see \t' } } })).to.be.eql(
      new UpDocument([
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*see*: Chrono Cross logo][https://example.com/cc.png]'

    expect(Up.toDocument(markup, { terms: { markup: { image: '*see*' } } })).to.be.eql(
      new UpDocument([
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[look: Chrono Cross logo](https://example.com/cc.png) [view: Chrono Cross logo](https://example.com/cc.png)'

    expect(Up.toDocument(markup, { terms: { markup: { image: ['view', 'look'] } } })).to.be.eql(
      new UpDocument([
        new Image('Chrono Cross logo', 'https://example.com/cc.png'),
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })
})


context('Image descriptions are evaluated for typographical conventions:', () => {
  specify('En dashes', () => {
    expect(Up.toDocument('[image: ghosts--eating luggage] (http://example.com/poltergeists.svg)')).to.be.eql(
      new UpDocument([
        new Image('ghosts–eating luggage', 'http://example.com/poltergeists.svg')
      ]))
  })

  specify('Em dashes', () => {
    expect(Up.toDocument('[image: ghosts---eating luggage] (http://example.com/poltergeists.svg)')).to.be.eql(
      new UpDocument([
        new Image('ghosts—eating luggage', 'http://example.com/poltergeists.svg')
      ]))
  })

  specify('Plus-minus signs', () => {
    expect(Up.toDocument('[image: ghosts eating luggage 10 pieces of luggage +-9] (http://example.com/poltergeists.svg)')).to.be.eql(
      new UpDocument([
        new Image('ghosts eating luggage 10 pieces of luggage ±9', 'http://example.com/poltergeists.svg')
      ]))
  })
})
