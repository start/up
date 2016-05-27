import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'


describe('The term that represents video conventions', () => {
    const up = new Up({
      i18n: {
        terms: { video: 'watch' }
      }
    })
    
  it('comes from the "video" config term', () => {
    const text = '[watch: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toAst(text)).to.be.eql(
      new DocumentNode([
        new VideoNode('Nevada caucus footage', 'https://example.com/video.webm')
      ])
    )
  })
    
  it('is always case insensitive', () => {
    const lowercase = '[watch: Nevada caucus footage][https://example.com/video.webm]'
    const mixedCase = '[WaTCH: Nevada caucus footage][https://example.com/video.webm]'

    expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
  })
})
