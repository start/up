import { expect } from 'chai'
import Up from '../../../index'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The term that represents video conventions', () => {
  it('comes from the "video" config term', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(Up.toAst(markup, { terms: { video: 'watch' } })).to.be.eql(
      new DocumentNode([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('can contain multiple variations', () => {
    const markup = '[watch: Nevada caucus footage](https://example.com/video.webm) [view: Nevada caucus footage](https://example.com/video.webm)'

    expect(Up.toAst(markup, { terms: { video: ['watch', 'view'] } })).to.be.eql(
      new DocumentNode([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm'),
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const up = new Up({
      terms: { video: 'watch' }
    })

    const lowercase = '[watch: Nevada caucus footage][https://example.com/video.webm]'
    const mixedCase = '[WaTCH: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
  })
})
