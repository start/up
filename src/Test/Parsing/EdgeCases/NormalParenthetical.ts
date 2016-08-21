import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Image } from '../../../SyntaxNodes/Image'


context('parenthesized text can be directly followed by whitespace followed by', () => {
  context('an inline spoiler', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face (the one and only) [SPOILER: Gary].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('After you beat the Elite Four, you have to face '),
          new NormalParenthetical([
            new PlainText('(the one and only)')
          ]),
          new PlainText(' '),
          new InlineSpoiler([
            new PlainText('Gary')
          ]),
          new PlainText('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face (the one and only) [SPOILER:Gary Oak].')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('After you beat the Elite Four, you have to face '),
          new NormalParenthetical([
            new PlainText('(the one and only)')
          ]),
          new PlainText(' '),
          new InlineSpoiler([
            new PlainText('Gary Oak')
          ]),
          new PlainText('.')
        ]))
    })
  })

  context('a footnote', () => {
    specify('that only contains whitespace directly after the caret', () => {
      const markup = "I don't eat cereal (or oatmeal) (^ Lying.) on Mondays."

      const footnote = new Footnote([
        new PlainText('Lying.')
      ], 1)

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Paragraph([
            new PlainText("I don't eat cereal "),
            new NormalParenthetical([
              new PlainText('(or oatmeal)')
            ]),
            footnote,
            new PlainText(" on Mondays."),
          ]),
          new FootnoteBlock([footnote])
        ]))
    })

    specify('that contains whitespace, but none directly after the caret', () => {
      const markup = "I don't eat cereal (or oatmeal) (^Definitely lying.) on Mondays."

      const footnote = new Footnote([
        new PlainText('Definitely lying.')
      ], 1)

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Paragraph([
            new PlainText("I don't eat cereal "),
            new NormalParenthetical([
              new PlainText('(or oatmeal)')
            ]),
            footnote,
            new PlainText(" on Mondays."),
          ]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  context('an image', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image: Gary] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('After you beat the Elite Four, you have to face Gary '),
          new NormalParenthetical([
            new PlainText('(in Pokémon Red/Blue/Yellow)')
          ]),
          new PlainText(' '),
          new Image('Gary', 'https://example.com/gary.png'),
          new PlainText('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.toDocument('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image:Gary Oak] (example.com/gary.png).')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('After you beat the Elite Four, you have to face Gary '),
          new NormalParenthetical([
            new PlainText('(in Pokémon Red/Blue/Yellow)')
          ]),
          new PlainText(' '),
          new Image('Gary Oak', 'https://example.com/gary.png'),
          new PlainText('.')
        ]))
    })
  })
})
