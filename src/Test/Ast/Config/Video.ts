import { expect } from 'chai'
import Up from '../../../index'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'


describe('The term that represents video conventions', () => {
  const up = new Up({
    terms: { video: 'watch' }
  })

  it('comes from the "video" config term', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const lowercase = '[watch: Nevada caucus footage][https://example.com/video.webm]'
    const mixedCase = '[WaTCH: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toDocument(lowercase)).to.be.eql(up.toDocument(mixedCase))
  })

  it('is trimmed', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(Up.toDocument(markup, { terms: { video: ' \t watch \t ' } })).to.be.eql(
      new UpDocument([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = '[*watch*: Nevada caucus footage][https://example.com/video.webm]'

    expect(Up.toDocument(markup, { terms: { video: '*watch*' } })).to.be.eql(
      new UpDocument([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[watch: Nevada caucus footage](https://example.com/video.webm) [view: Nevada caucus footage](https://example.com/video.webm)'

    expect(Up.toDocument(markup, { terms: { video: ['view', 'watch'] } })).to.be.eql(
      new UpDocument([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm'),
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })
})
