import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
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

  it('is ignored if it is the final character of the text', () => {
    expect(Up.toAst('Hello, \\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, ')
      ]))
  })
})


context("Backslashes don't disable line breaks:", () => {
  specify('At the end of a line in a line block', () => {
    const text = `
Hello, world!\\
Goodbye, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Hello, world!
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

  specify('At the end of a paragraph', () => {
    const text = `
Hello, world!\\

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