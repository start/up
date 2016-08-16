import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'


describe('A backslash that is the first character in a paragraph', () => {
  it('correctly escapes the next character', () => {
    expect(Up.toDocument('\\*So many* Tuesdays')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('*So many* Tuesdays')
      ]))
  })
})


describe("A backslash that is the first character in a line block's first line", () => {
  it('correctly escapes the next character', () => {
    const markup = `
\\Roses are red
Violets are blue`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('Roses are red')]),
          new LineBlockNode.Line([new PlainTextNode('Violets are blue')])
        ])
      ]))
  })
})


describe("A backslash that is the first character in a line block's second line", () => {
  it('correctly escapes the next character', () => {
    const markup = `
Roses are red
\\Violets are blue`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('Roses are red')]),
          new LineBlockNode.Line([new PlainTextNode('Violets are blue')])
        ])
      ]))
  })
})


describe('4 consecutive backslashes', () => {
  it('produce plain text consisting of 2 consecutive backslashes', () => {
    expect(Up.toDocument('\\\\\\\\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('\\\\')
      ]))
  })
})


describe('An escaped character', () => {
  it('can immediately follow inline code', () => {
    expect(Up.toDocument('`pennsylvania()`\\ avenue')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineCodeNode('pennsylvania()'),
        new PlainTextNode(' avenue')
      ]))
  })
})
