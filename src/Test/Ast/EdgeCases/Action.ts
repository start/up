import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'


context('Action text can be directly followed by whitespace followed by', () => {
  context('a spoiler', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face {sigh} [SPOILER: Gary].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new ActionNode([
            new PlainTextNode('sigh')
          ]),
          new PlainTextNode(' '),
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face {sigh} [SPOILER:Gary Oak].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new ActionNode([
            new PlainTextNode('sigh')
          ]),
          new PlainTextNode(' '),
          new SpoilerNode([
            new PlainTextNode('Gary Oak')
          ]),
          new PlainTextNode('.')
        ]))
    })
  })

  context('a footnote', () => {
    specify('that only contains whitespace directly after the caret', () => {
      const text = "I don't eat cereal {sigh} (^ Lying.) on Mondays."

      const footnote = new FootnoteNode([
        new PlainTextNode('Lying.')
      ], 1)

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal "),
            new ActionNode([
              new PlainTextNode('sigh')
            ]),
            footnote,
            new PlainTextNode(" on Mondays."),
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })
  
    specify('that contains whitespace, but none directly after the caret', () => {
      const text = "I don't eat cereal {sigh} (^Definitely lying.) on Mondays."

      const footnote = new FootnoteNode([
        new PlainTextNode('Definitely lying.')
      ], 1)

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal "),
            new ActionNode([
              new PlainTextNode('sigh')
            ]),
            footnote,
            new PlainTextNode(" on Mondays."),
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })
  })


  context('an image', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face Gary {sigh} [image: Gary] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face Gary '),
          new ActionNode([
            new PlainTextNode('sigh')
          ]),
          new PlainTextNode(' '),
          new ImageNode('Gary', 'https://example.com/gary.png'),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face Gary {sigh} [image:Gary Oak] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face Gary '),
          new ActionNode([
            new PlainTextNode('sigh')
          ]),
          new PlainTextNode(' '),
          new ImageNode('Gary Oak', 'https://example.com/gary.png'),
          new PlainTextNode('.')
        ]))
    })
  })
})
