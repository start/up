import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'


describe('A backslash', () => {
  it('disables any special behavior of the character that follows, preserving the other character as plain text', () => {
    expect(Up.toDocument('Hello, \\*world\\*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, *world*!')
      ]))
  })

  it("has no effect if the following character didn't have any special behavior to begin with", () => {
    expect(Up.toDocument('Hello, \\world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, world!')
      ]))
  })

  it('can disable the special behavior of another backslash', () => {
    expect(Up.toDocument('Hello, \\\\*world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, \\'),
        new Emphasis([
          new PlainText('world')
        ]),
        new PlainText('!')
      ]))
  })

  it('causes only the following character to be treated as plain text', () => {
    expect(Up.toDocument('Hello, \\\\, meet \\\\!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, \\, meet \\!')
      ]))
  })

  it('is ignored if it is the final character of the markup', () => {
    expect(Up.toDocument('Hello, Bob.\\')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, Bob.')
      ]))
  })
})


context("Backslashes don't disable line breaks:", () => {
  specify('At the end of a line in a line block', () => {
    const markup = `
Hello, world!\\
Goodbye, world!`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Hello, world!')
          ]),
          new LineBlock.Line([
            new PlainText('Goodbye, world!')
          ])
        ])
      ]))
  })

  specify('At the end of a paragraph', () => {
    const markup = `
Hello, world!\\

Goodbye, world!`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Hello, world!')
        ]),
        new Paragraph([
          new PlainText('Goodbye, world!')
        ])
      ]))
  })
})
