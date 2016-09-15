import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context('parenthesized text can be directly followed by whitespace followed by', () => {
  context('an inline spoiler', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face (the one and only) [SPOILER: Gary].')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('After you beat the Elite Four, you have to face '),
          new Up.NormalParenthetical([
            new Up.PlainText('(the one and only)')
          ]),
          new Up.PlainText(' '),
          new Up.InlineSpoiler([
            new Up.PlainText('Gary')
          ]),
          new Up.PlainText('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face (the one and only) [SPOILER:Gary Oak].')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('After you beat the Elite Four, you have to face '),
          new Up.NormalParenthetical([
            new Up.PlainText('(the one and only)')
          ]),
          new Up.PlainText(' '),
          new Up.InlineSpoiler([
            new Up.PlainText('Gary Oak')
          ]),
          new Up.PlainText('.')
        ]))
    })
  })

  context('a footnote', () => {
    specify('that only contains whitespace directly after the caret', () => {
      const markup = "I don't eat cereal (or oatmeal) (^ Lying.) on Mondays."

      const footnote = new Up.Footnote([
        new Up.PlainText('Lying.')
      ], { referenceNumber: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.PlainText("I don't eat cereal "),
            new Up.NormalParenthetical([
              new Up.PlainText('(or oatmeal)')
            ]),
            footnote,
            new Up.PlainText(" on Mondays."),
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('that contains whitespace, but none directly after the caret', () => {
      const markup = "I don't eat cereal (or oatmeal) (^Definitely lying.) on Mondays."

      const footnote = new Up.Footnote([
        new Up.PlainText('Definitely lying.')
      ], { referenceNumber: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.PlainText("I don't eat cereal "),
            new Up.NormalParenthetical([
              new Up.PlainText('(or oatmeal)')
            ]),
            footnote,
            new Up.PlainText(" on Mondays."),
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  context('an image', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image: Gary] (example.com/gary.png).')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('After you beat the Elite Four, you have to face Gary '),
          new Up.NormalParenthetical([
            new Up.PlainText('(in Pokémon Red/Blue/Yellow)')
          ]),
          new Up.PlainText(' '),
          new Up.Image('Gary', 'https://example.com/gary.png'),
          new Up.PlainText('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face Gary (in Pokémon Red/Blue/Yellow) [image:Gary Oak] (example.com/gary.png).')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.PlainText('After you beat the Elite Four, you have to face Gary '),
          new Up.NormalParenthetical([
            new Up.PlainText('(in Pokémon Red/Blue/Yellow)')
          ]),
          new Up.PlainText(' '),
          new Up.Image('Gary Oak', 'https://example.com/gary.png'),
          new Up.PlainText('.')
        ]))
    })
  })
})
