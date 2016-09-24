import { expect } from 'chai'
import { insideDocumentAndParagraph } from '../Helpers'
import * as Up from '../../../index'


context('An unmatched left parenthesis within quotation marks produces a quote:', () => {
  specify('At the end of a paragraph', () => {
    expect(Up.parse('"("')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('"("')
        ])
      ]))
  })

  specify('Before the end of a paragraph', () => {
    expect(Up.parse('"(" is a left parenthesis.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineQuote([
          new Up.Text('"("')
        ]),
        new Up.Text(' is a left parenthesis.')
      ]))
  })
})