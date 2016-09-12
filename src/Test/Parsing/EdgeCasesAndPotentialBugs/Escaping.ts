import { expect } from 'chai'
import { Up } from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'


describe('A backslash that is the first character in a paragraph', () => {
  it('correctly escapes the next character', () => {
    expect(Up.parse('\\*So many* Tuesdays')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('*So many* Tuesdays')
      ]))
  })
})


describe("A backslash that is the first character in a line block's first line", () => {
  it('correctly escapes the next character', () => {
    const markup = `
\\Roses are red
Violets are blue`

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([new PlainText('Roses are red')]),
          new LineBlock.Line([new PlainText('Violets are blue')])
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
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([new PlainText('Roses are red')]),
          new LineBlock.Line([new PlainText('Violets are blue')])
        ])
      ]))
  })
})


describe('4 consecutive backslashes', () => {
  it('produce plain text consisting of 2 consecutive backslashes', () => {
    expect(Up.parse('\\\\\\\\')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('\\\\')
      ]))
  })
})


describe('An escaped character', () => {
  it('can immediately follow inline code', () => {
    expect(Up.parse('`pennsylvania()`\\ avenue')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineCode('pennsylvania()'),
        new PlainText(' avenue')
      ]))
  })
})
