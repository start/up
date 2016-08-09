import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'


context('2 consecutive dashes normally produce an en dash.', () => {
  specify('This applies in regular text', () => {
    expect(Up.toAst("Okay--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay–I'll eat the tarantula.")
      ]))
  })

  context('This does not apply within', () => {
    specify('Inline code', () => {
      expect(Up.toAst("`i--;`")).to.be.eql(
        insideDocumentAndParagraph([
          new InlineCodeNode('i--;')
        ]))
    })

    specify('Link URLs', () => {
      expect(Up.toAst("[American flag emoji] (https://example.com/empojis/US--flag?info)")).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode("American flag emoji")
          ], 'https://example.com/empojis/US--flag?info')
        ]))
    })

    specify('Media URLs', () => {
      expect(Up.toAst('[video: ghosts eating luggage] (http://example.com/polter--geists.webm)')).to.be.eql(
        new DocumentNode([
          new VideoNode('ghosts eating luggage', 'http://example.com/polter--geists.webm')
        ]))
    })

    specify('Linkified media URLs', () => {
      expect(Up.toAst('[image: you fight Gary] (https://example.com/fight.svg) (http://example.com/final--battle)')).to.be.eql(
        new DocumentNode([
          new LinkNode([
            new ImageNode('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final--battle')
        ]))
    })

    specify('Linkified URLs for non-media conventions', () => {
      expect(Up.toAst('[SPOILER: you fight Gary] (http://example.com/final--battle)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new LinkNode([
              new PlainTextNode('you fight Gary')
            ], 'http://example.com/final--battle')
          ])
        ]))
    })
  })
})


describe('When either of the dashes are escaped, no en dash is produced:', () => {
  specify('First dash:', () => {
    expect(Up.toAst("Okay\\--I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay--I'll eat the tarantula.")
      ]))
  })

  specify('Second dash:', () => {
    expect(Up.toAst("Okay-\\-I'll eat the tarantula.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay--I'll eat the tarantula.")
      ]))
  })
})
