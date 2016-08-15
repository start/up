import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { NormalParentheticalNode } from '../../../SyntaxNodes/NormalParentheticalNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'


context('parenthesized text can be directly followed by whitespace followed by', () => {
  context('an inline spoiler', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face (the one and only) [SPOILER: Gary].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new NormalParentheticalNode([
            new PlainTextNode('(the one and only)')
          ]),
          new PlainTextNode(' '),
          new InlineSpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face (the one and only) [SPOILER:Gary Oak].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face '),
          new NormalParentheticalNode([
            new PlainTextNode('(the one and only)')
          ]),
          new PlainTextNode(' '),
          new InlineSpoilerNode([
            new PlainTextNode('Gary Oak')
          ]),
          new PlainTextNode('.')
        ]))
    })
  })

  context('a footnote', () => {
    specify('that only contains whitespace directly after the caret', () => {
      const markup = "I don't eat cereal (or oatmeal) (^ Lying.) on Mondays."

      const footnote = new FootnoteNode([
        new PlainTextNode('Lying.')
      ], 1)

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal "),
            new NormalParentheticalNode([
              new PlainTextNode('(or oatmeal)')
            ]),
            footnote,
            new PlainTextNode(" on Mondays."),
          ]),
          new FootnoteBlockNode([footnote])
        ]))
    })

    specify('that contains whitespace, but none directly after the caret', () => {
      const markup = "I don't eat cereal (or oatmeal) (^Definitely lying.) on Mondays."

      const footnote = new FootnoteNode([
        new PlainTextNode('Definitely lying.')
      ], 1)

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal "),
            new NormalParentheticalNode([
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
      expect(Up.toDocument('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image: Gary] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face Gary '),
          new NormalParentheticalNode([
            new PlainTextNode('(in Pokémon Red/Blue/Yellow)')
          ]),
          new PlainTextNode(' '),
          new ImageNode('Gary', 'https://example.com/gary.png'),
          new PlainTextNode('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image:Gary Oak] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('After you beat the Elite Four, you have to face Gary '),
          new NormalParentheticalNode([
            new PlainTextNode('(in Pokémon Red/Blue/Yellow)')
          ]),
          new PlainTextNode(' '),
          new ImageNode('Gary Oak', 'https://example.com/gary.png'),
          new PlainTextNode('.')
        ]))
    })
  })
})
