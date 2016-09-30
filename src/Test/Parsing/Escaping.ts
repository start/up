import { expect } from 'chai'
import * as Up from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'


describe('A backslash', () => {
  it('disables any special behavior of the character that follows, preserving the other character as plain text', () => {
    expect(Up.parse('Hello, \\*world\\*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, *world*!')
      ]))
  })

  it("has no effect if the following character didn't have any special behavior to begin with", () => {
    expect(Up.parse('Hello, \\world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, world!')
      ]))
  })

  it('can disable the special behavior of another backslash', () => {
    expect(Up.parse('Hello, \\\\*world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, \\'),
        new Up.Emphasis([
          new Up.Text('world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('causes only the following character to be treated as plain text', () => {
    expect(Up.parse('Hello, \\\\, meet \\\\!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, \\, meet \\!')
      ]))
  })

  it('is ignored if it is the final character of the markup', () => {
    expect(Up.parse('Hello, Bob.\\')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, Bob.')
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
            new Up.Text('Hello, world!')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Goodbye, world!')
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
          new Up.Text('Hello, world!')
        ]),
        new Up.Paragraph([
          new Up.Text('Goodbye, world!')
        ])
      ]))
  })
})
