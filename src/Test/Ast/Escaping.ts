import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('A backslash', () => {
  it('causes the following character to be treated as plain text', () => {
    expect(Up.toAst('Hello, \\world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, world!')
      ]))
  })

  it('causes the following backslash to be treated as plain text', () => {
    expect(Up.toAst('Hello, \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\!')
      ]))
  })

  it('disables any special meaning of the following character', () => {
    expect(Up.toAst('Hello, \\*world\\*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world*!')
      ]))
  })

  it('causes only the following character to be treated as plain text', () => {
    expect(Up.toAst('Hello, \\\\, meet \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\, meet \\!')
      ]))
  })

  it('is ignored if it is the final character of the text', () => {
    expect(Up.toAst('Hello, \\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, ')
      ]))
  })

  it('does not disable line breaks', () => {
    const text = `
Hello, world!\\
\\
Goodbye, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ]),
        new ParagraphNode([
          new PlainTextNode('Goodbye, world!')
        ])
      ]))
  })
})
