import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'



describe('A URL starting with a slash', () => {
  it('has no added prefix by default, because the default "baseForUrlsStartingWithSlash" config setting is blank', () => {
    const text = '[Chrono Cross](/wiki/Chrono_Chross)'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Chrono Cross')
        ], '/wiki/Chrono_Chross')
      ])
    )
  })
})
