import { expect } from 'chai'
import Up from '../../../index'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The term that represents video conventions', () => {
  const up = new Up({
    terms: { video: 'watch' }
  })

  it('comes from the "video" config term', () => {
    const markup = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const lowercase = '[watch: Nevada caucus footage][https://example.com/video.webm]'
    const mixedCase = '[WaTCH: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
  })

  it('ignores any regular expression syntax', () => {
    const markup = '[+watch+: Nevada caucus footage][https://example.com/video.webm]'

    expect(Up.toAst(markup, { terms: { video: '+watch+' } })).to.be.eql(
      new DocumentNode([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })

  it('can have multiple variations', () => {
    const markup = '[watch: Nevada caucus footage](https://example.com/video.webm) [view: Nevada caucus footage](https://example.com/video.webm)'

    expect(Up.toAst(markup, { terms: { video: ['view', 'watch'] } })).to.be.eql(
      new DocumentNode([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm'),
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ]))
  })
})
