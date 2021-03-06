import { expect } from 'chai'
import * as Up from '../../../Main'


describe('The keyword that represents video conventions', () => {
  const up = new Up.Up({
    parsing: {
      keywords: { audio: 'listen' }
    }
  })

  it('comes from the "audio" keyword', () => {
    const markup = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('is case-insensitive', () => {
    const lowercase = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'
    const mixedCase = '[LiStEn: chanting at Nevada caucus][https://example.com/audio.ogg]'

    expect(up.parse(mixedCase)).to.deep.equal(up.parse(lowercase))
  })

  it('is trimmed', () => {
    const markup = '[listen: chanting at Nevada caucus][https://example.com/audio.ogg]'

    const document = Up.parse(markup, {
      keywords: {
        audio: ' \t listen \t '
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*listen*: chanting at Nevada caucus][https://example.com/audio.ogg]'

    const document = Up.parse(markup, {
      keywords: {
        audio: '*listen*'
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[hear: chanting at Nevada caucus](https://example.com/audio.ogg) [listen: chanting at Nevada caucus](https://example.com/audio.ogg)'

    const document = Up.parse(markup, {
      keywords: {
        audio: ['hear', 'listen']
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg'),
        new Up.Audio('chanting at Nevada caucus', 'https://example.com/audio.ogg')
      ]))
  })
})
