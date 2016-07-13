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
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'


context('Square bracketed text can be directly followed by whitespace followed by', () => {
  context('a spoiler', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face (the one and only) [SPOILER: Gary].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new ParenthesizedNode([
            new PlainTextNode('(the one and only)')
          ]),
          new PlainTextNode(' '),
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face (the one and only) [SPOILER:Gary Oak].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new ParenthesizedNode([
            new PlainTextNode('(the one and only)')
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
      const text = "I don't eat cereal (or oatmeal) (^ Lying.) on Mondays."

      const footnote = new FootnoteNode([
        new PlainTextNode('Lying.')
      ], 1)

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal "),
            new ParenthesizedNode([
              new PlainTextNode('(or oatmeal)')
            ]),
            footnote,
            new PlainTextNode(" on Mondays."),
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })
  
    specify('that contains whitespace, but none directly after the caret', () => {
      const text = "I don't eat cereal (or oatmeal) (^Definitely lying.) on Mondays."

      const footnote = new FootnoteNode([
        new PlainTextNode('Definitely lying.')
      ], 1)

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal "),
            new ParenthesizedNode([
              new PlainTextNode('(or oatmeal)')
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
      expect(Up.toAst('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image: Gary] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face Gary '),
          new ParenthesizedNode([
            new PlainTextNode('(in Pokémon Red/Blue/Yellow)')
          ]),
          new PlainTextNode(' '),
          new ImageNode('Gary', 'https://example.com/gary.png'),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toAst('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image:Gary Oak] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face Gary '),
          new ParenthesizedNode([
            new PlainTextNode('(in Pokémon Red/Blue/Yellow)')
          ]),
          new PlainTextNode(' '),
          new ImageNode('Gary Oak', 'https://example.com/gary.png'),
          new PlainTextNode('.')
        ]))
    })
  })
})
