import { expect } from 'chai'
import Up from '../../../index'
import { Video } from '../../../SyntaxNodes/Video'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'


describe('The term that represents video conventions', () => {
  const up = new Up({
    parsing: {
      terms: { video: 'watch' }
    }
  })

  it('comes from the "video" settings term', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Video('Nevada caucus footage', 'https://example.com/video.webm')
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
      terms: {
        video: ' \t watch \t '
      }
    })

    expect(document).to.deep.equal(
      new UpDocument([
        new Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*watch*: Nevada caucus footage][https://example.com/video.webm]'

    const document = Up.parse(markup, {
      terms: {
        video: '*watch*'
      }
    })

    expect(document).to.deep.equal(
      new UpDocument([
        new Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[watch: Nevada caucus footage](https://example.com/video.webm) [view: Nevada caucus footage](https://example.com/video.webm)'

    const document = Up.parse(markup, {
      terms: {
        video: ['view', 'watch']
      }
    })

    expect(document).to.deep.equal(
      new UpDocument([
        new Video('Nevada caucus footage', 'https://example.com/video.webm'),
        new Video('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })
})
