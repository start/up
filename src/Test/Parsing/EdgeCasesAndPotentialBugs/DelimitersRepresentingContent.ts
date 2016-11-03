import { expect } from 'chai'
import { insideDocumentAndParagraph } from '../Helpers'
import * as Up from '../../../Main'


context('An unmatched left parenthesis within quotation marks produces an inline quote containing the parenthesis:', () => {
  specify('At the end of a paragraph', () => {
    expect(Up.parse('"("')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('(')
        ])
      ]))
  })

  specify('Before the end of a paragraph', () => {
    expect(Up.parse('"(" is a left parenthesis.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('(')
        ]),
        new Up.Text(' is a left parenthesis.')
      ]))
  })
})


context('An unmatched left parenthesis within square brackets produces a square parenthetical containing the parenthesis:', () => {
  specify('At the end of a paragraph', () => {
    expect(Up.parse('[(]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[(]')
        ])
      ]))
  })

  specify('Before the end of a paragraph', () => {
    expect(Up.parse('[(] is a left parenthesis.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('[(]')
        ]),
        new Up.Text(' is a left parenthesis.')
      ]))
  })
})


context('An unmatched quotation mark within square brackets produces a square parenthetical containing the quotation mark:', () => {
  specify('At the end of a paragraph', () => {
    expect(Up.parse('["]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('["]')
        ])
      ]))
  })

  specify('Before the end of a paragraph', () => {
    expect(Up.parse('["] is a quotation mark.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.Text('["]')
        ]),
        new Up.Text(' is a quotation mark.')
      ]))
  })
})
