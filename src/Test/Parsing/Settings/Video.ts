import { expect } from 'chai'
import * as Up from '../../../Main'


describe('The keyword that represents video conventions', () => {
  const up = new Up.Up({
    parsing: {
      keywords: { video: 'watch' }
    }
  })

  it('comes from the "video" keyword', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('is case-insensitive', () => {
    const lowercase = '[watch: Nevada caucus footage][https://example.com/video.webm]'
    const mixedCase = '[WaTCH: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.parse(lowercase)).to.deep.equal(up.parse(mixedCase))
  })

  it('is trimmed', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    const document = Up.parse(markup, {
      keywords: {
        video: ' \t watch \t '
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*watch*: Nevada caucus footage][https://example.com/video.webm]'

    const document = Up.parse(markup, {
      keywords: {
        video: '*watch*'
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[watch: Nevada caucus footage](https://example.com/video.webm) [view: Nevada caucus footage](https://example.com/video.webm)'

    const document = Up.parse(markup, {
      keywords: {
        video: ['view', 'watch']
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Video('Nevada caucus footage', 'https://example.com/video.webm'),
        new Up.Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })
})
