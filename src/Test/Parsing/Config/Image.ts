import { expect } from 'chai'
import { Up } from '../../../Up'
import { Image } from '../../../SyntaxNodes/Image'
import { Document } from '../../../SyntaxNodes/Document'


describe('The term that represents image conventions', () => {
  const up = new Up({
    parsing: {
      terms: { image: 'see' }
    }
  })

  it('comes from the "image" term', () => {
    const markup = '[see: Chrono Cross logo][https://example.com/cc.png]'

    expect(up.parse(markup)).to.deep.equal(
      new Document([
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('is case-insensitive', () => {
    const lowercase = '[see: Chrono Cross logo][https://example.com/cc.png]'
    const mixedCase = '[SeE: Chrono Cross logo][https://example.com/cc.png]'

    expect(up.parse(mixedCase)).to.deep.equal(up.parse(lowercase))
  })

  it('is trimmed', () => {
    const markup = '[see: Chrono Cross logo][https://example.com/cc.png]'

    const document = Up.parse(markup, {
      terms: {
        image: ' \t see \t'
      }
    })

    expect(document).to.deep.equal(
      new Document([
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*see*: Chrono Cross logo][https://example.com/cc.png]'

    const document = Up.parse(markup, {
      terms: {
        image: '*see*'
      }
    })

    expect(document).to.deep.equal(
      new Document([
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[look: Chrono Cross logo](https://example.com/cc.png) [view: Chrono Cross logo](https://example.com/cc.png)'

    const document = Up.parse(markup, {
      terms: {
        image: ['view', 'look']
      }
    })

    expect(document).to.deep.equal(
      new Document([
        new Image('Chrono Cross logo', 'https://example.com/cc.png'),
        new Image('Chrono Cross logo', 'https://example.com/cc.png')
      ]))
  })
})


context('Image descriptions are evaluated for typographical conventions:', () => {
  specify('En dashes', () => {
    expect(Up.parse('[image: ghosts--eating luggage] (http://example.com/poltergeists.svg)')).to.deep.equal(
      new Document([
        new Image('ghosts–eating luggage', 'http://example.com/poltergeists.svg')
      ]))
  })

  specify('Em dashes', () => {
    expect(Up.parse('[image: ghosts---eating luggage] (http://example.com/poltergeists.svg)')).to.deep.equal(
      new Document([
        new Image('ghosts—eating luggage', 'http://example.com/poltergeists.svg')
      ]))
  })

  specify('Plus-minus signs', () => {
    expect(Up.parse('[image: ghosts eating luggage 10 pieces of luggage +-9] (http://example.com/poltergeists.svg)')).to.deep.equal(
      new Document([
        new Image('ghosts eating luggage 10 pieces of luggage ±9', 'http://example.com/poltergeists.svg')
      ]))
  })
})
