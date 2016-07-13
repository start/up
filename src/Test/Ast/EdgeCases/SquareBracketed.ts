import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'



context('Square bracketed text can be directly followed by whitespace followed by', () => {
  context('a spoiler', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face [the one and only] [SPOILER: Gary].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new SquareBracketedNode([
            new PlainTextNode('[the one and only]')
          ]),
          new PlainTextNode(' '),
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face [the one and only] [SPOILER:Gary Oak].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new SquareBracketedNode([
            new PlainTextNode('[the one and only]')
          ]),
          new PlainTextNode(' '),
          new SpoilerNode([
            new PlainTextNode('Gary Oak')
          ]),
          new PlainTextNode('.')
        ]))
    })
  })
})
