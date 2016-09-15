import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('A backslash that is the first character in a paragraph', () => {
  it('correctly escapes the next character', () => {
    expect(Up.parse('\\*So many* Tuesdays')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('*So many* Tuesdays')
      ]))
  })
})


describe("A backslash that is the first character in a line block's first line", () => {
  it('correctly escapes the next character', () => {
    const markup = `
\\Roses are red
Violets are blue`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.PlainText('Roses are red')]),
          new Up.LineBlock.Line([new Up.PlainText('Violets are blue')])
        ])
      ]))
  })
})


describe("A backslash that is the first character in a line block's second line", () => {
  it('correctly escapes the next character', () => {
    const markup = `
Roses are red
\\Violets are blue`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.PlainText('Roses are red')]),
          new Up.LineBlock.Line([new Up.PlainText('Violets are blue')])
        ])
      ]))
  })
})


describe('4 consecutive backslashes', () => {
  it('produce plain text consisting of 2 consecutive backslashes', () => {
    expect(Up.parse('\\\\\\\\')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('\\\\')
      ]))
  })
})


describe('An escaped character', () => {
  it('can immediately follow inline code', () => {
    expect(Up.parse('`pennsylvania()`\\ avenue')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineCode('pennsylvania()'),
        new Up.PlainText(' avenue')
      ]))
  })
})
