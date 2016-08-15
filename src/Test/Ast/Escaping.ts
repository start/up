import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
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

  it('is ignored if it is the final character of the markup', () => {
    expect(Up.toAst('Hello, \\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, ')
      ]))
  })
})


context("Backslashes don't disable line breaks:", () => {
  specify('At the end of a line in a line block', () => {
    const markup = `
Hello, world!\\
Goodbye, world!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode('Hello, world!')
          ]),
          new LineBlockNode.Line([
            new PlainTextNode('Goodbye, world!')
          ])
        ])
      ]))
  })

  specify('On an otherwise-empty line between paragraphs', () => {
    const markup = `
Hello, world!
\\
Goodbye, world!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ]),
        new ParagraphNode([
          new PlainTextNode('Goodbye, world!')
        ])
      ]))
  })

  specify('At the end of a paragraph', () => {
    const markup = `
Hello, world!\\

Goodbye, world!`
    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ]),
        new ParagraphNode([
          new PlainTextNode('Goodbye, world!')
        ])
      ]))
  })
})
