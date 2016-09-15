import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'


describe('A backslash', () => {
  it('disables any special behavior of the character that follows, preserving the other character as plain text', () => {
    expect(Up.parse('Hello, \\*world\\*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, *world*!')
      ]))
  })

  it("has no effect if the following character didn't have any special behavior to begin with", () => {
    expect(Up.parse('Hello, \\world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, world!')
      ]))
  })

  it('can disable the special behavior of another backslash', () => {
    expect(Up.parse('Hello, \\\\*world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, \\'),
        new Up.Emphasis([
          new Up.PlainText('world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('causes only the following character to be treated as plain text', () => {
    expect(Up.parse('Hello, \\\\, meet \\\\!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, \\, meet \\!')
      ]))
  })

  it('is ignored if it is the final character of the markup', () => {
    expect(Up.parse('Hello, Bob.\\')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, Bob.')
      ]))
  })
})


context("Backslashes don't disable line breaks:", () => {
  specify('At the end of a line in a line block', () => {
    const markup = `
Hello, world!\\
Goodbye, world!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.PlainText('Hello, world!')
          ]),
          new Up.LineBlock.Line([
            new Up.PlainText('Goodbye, world!')
          ])
        ])
      ]))
  })

  specify('At the end of a paragraph', () => {
    const markup = `
Hello, world!\\

Goodbye, world!`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Hello, world!')
        ]),
        new Up.Paragraph([
          new Up.PlainText('Goodbye, world!')
        ])
      ]))
  })
})
