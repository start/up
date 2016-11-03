import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


context('A square parenthetical text can be directly followed by whitespace followed by', () => {
  context('an inline revealable', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face [the one and only] [SPOILER: Gary].')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('After you beat the Elite Four, you have to face '),
          new Up.SquareParenthetical([
            new Up.Text('[the one and only]')
          ]),
          new Up.Text(' '),
          new Up.InlineRevealable([
            new Up.Text('Gary')
          ]),
          new Up.Text('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face [the one and only] [SPOILER:Gary Oak].')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('After you beat the Elite Four, you have to face '),
          new Up.SquareParenthetical([
            new Up.Text('[the one and only]')
          ]),
          new Up.Text(' '),
          new Up.InlineRevealable([
            new Up.Text('Gary Oak')
          ]),
          new Up.Text('.')
        ]))
    })
  })


  context('a footnote', () => {
    specify('that only contains whitespace directly after the caret', () => {
      const markup = "I don't eat cereal [or oatmeal] (^ Lying.) on Mondays."

      const footnote = new Up.Footnote([
        new Up.Text('Lying.')
      ], { referenceNumber: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal "),
            new Up.SquareParenthetical([
              new Up.Text('[or oatmeal]')
            ]),
            footnote,
            new Up.Text(" on Mondays."),
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })

    specify('that contains whitespace, but none directly after the caret', () => {
      const markup = "I don't eat cereal [or oatmeal] (^Definitely lying.) on Mondays."

      const footnote = new Up.Footnote([
        new Up.Text('Definitely lying.')
      ], { referenceNumber: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal "),
            new Up.SquareParenthetical([
              new Up.Text('[or oatmeal]')
            ]),
            footnote,
            new Up.Text(" on Mondays."),
          ]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  context('an image', () => {
    specify('that only contains whitespace directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face Gary [in Pokémon Red/Blue/Yellow] [image: Gary] (example.com/gary.png).')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('After you beat the Elite Four, you have to face Gary '),
          new Up.SquareParenthetical([
            new Up.Text('[in Pokémon Red/Blue/Yellow]')
          ]),
          new Up.Text(' '),
          new Up.Image('Gary', 'https://example.com/gary.png'),
          new Up.Text('.')
        ]))
    })

    specify('that contains whitespace, but non directly after the colon', () => {
      expect(Up.parse('After you beat the Elite Four, you have to face Gary [in Pokémon Red/Blue/Yellow] [image:Gary Oak] (example.com/gary.png).')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('After you beat the Elite Four, you have to face Gary '),
          new Up.SquareParenthetical([
            new Up.Text('[in Pokémon Red/Blue/Yellow]')
          ]),
          new Up.Text(' '),
          new Up.Image('Gary Oak', 'https://example.com/gary.png'),
          new Up.Text('.')
        ]))
    })
  })
})
