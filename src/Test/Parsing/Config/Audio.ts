import { expect } from 'chai'
import Up from '../../../index'
import { Audio } from '../../../SyntaxNodes/Audio'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'


describe('The term that represents video conventions', () => {
  const up = new Up({
    terms: {
      markup: { audio: 'listen' }
    }
  })

  it('comes from the "audio" config term', () => {
    const markup = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'

    expect(up.parseDocument(markup)).to.deep.equal(
      new UpDocument([
        new Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('is case-insensitive', () => {
    const lowercase = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'
    const mixedCase = '[LiStEn: chanting at Nevada caucus][https://example.com/audio.ogg]'

    expect(up.parseDocument(mixedCase)).to.deep.equal(up.parseDocument(lowercase))
  })

  it('is trimmed', () => {
    const markup = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'

    const document = Up.parseDocument(markup, {
      terms: {
        markup: { audio: ' \t listen \t ' }
      }
    })

    expect(document).to.deep.equal(
      new UpDocument([
        new Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*listen*: chanting at Nevada caucus][https://example.com/audio.ogg]'

    const document = Up.parseDocument(markup, {
      terms: {
        markup: { audio: '*listen*' }
      }
    })

    expect(document).to.deep.equal(
      new UpDocument([
        new Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[hear: chanting at Nevada caucus](https://example.com/audio.ogg) [listen: chanting at Nevada caucus](https://example.com/audio.ogg)'

    const document = Up.parseDocument(markup, {
      terms: {
        markup: { audio: ['hear', 'listen'] }
      }
    })

    expect(document).to.deep.equal(
      new UpDocument([
        new Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg'),
        new Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })
})
