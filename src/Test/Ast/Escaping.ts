import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'


describe('A backslash', () => {
  it('disables any special behavior of the character that follows, preserving the other character as plain text', () => {
    expect(Up.toDocument('Hello, \\*world\\*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world*!')
      ]))
  })

  it("has no effect if the following character didn't have any special behavior to begin with", () => {
    expect(Up.toDocument('Hello, \\world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, world!')
      ]))
  })

  it('can disable the special behavior of another backslash', () => {
    expect(Up.toDocument('Hello, \\\\*world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\'),
        new EmphasisNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('causes only the following character to be treated as plain text', () => {
    expect(Up.toDocument('Hello, \\\\, meet \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\, meet \\!')
      ]))
  })

  it('is ignored if it is the final character of the markup', () => {
    expect(Up.toDocument('Hello, Bob.\\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, Bob.')
      ]))
  })
})


context("Backslashes don't disable line breaks:", () => {
  specify('At the end of a line in a line block', () => {
    const markup = `
Hello, world!\\
Goodbye, world!`
    expect(Up.toDocument(markup)).to.be.eql(
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

  specify('At the end of a paragraph', () => {
    const markup = `
Hello, world!\\

Goodbye, world!`
    expect(Up.toDocument(markup)).to.be.eql(
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
