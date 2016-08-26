import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by doublequote characters', () => {
  it('is put inside an inline quote node', () => {
    expect(Up.toDocument('Hello, "world"!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new InlineQuote([
          new PlainText('world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('Inline quotes', () => {
  it('are evaluated for inline conventions', () => {
    expect(Up.toDocument('"You should always use `<font>` elements."')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new PlainText('You should always use '),
          new InlineCode('<font>'),
          new PlainText(' elements.'),
        ]),
      ]))
  })

  it('can contain nested inline quotes', () => {
    expect(Up.toDocument('John stood up. "Hello, my "little" world!"')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('John stood up. '),
        new Emphasis([
          new PlainText('my '),
          new Emphasis([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Nested inline quotes', () => {
  it('can open at the same time', () => {
    expect(Up.toDocument('Bob recounted, ""Come here right now!", she said. But I walked away."')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Bob recounted, '),
        new InlineQuote([
          new InlineQuote([
            new PlainText('Come here right now!'),
          ]),
          new PlainText(', she said. But I walked away.')
        ])
      ]))
  })

  it('can close at the same time', () => {
    expect(Up.toDocument('"I walked away while she screamed "come here right now!"", Bob recounted.')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineQuote([
          new PlainText('I walked away while she screamed '),
          new InlineQuote([
            new PlainText('come here right now!'),
          ]),
        ]),
        new PlainText(', Bob recounted.')
      ]))
  })
})


describe('Text separated from (otherwise surrounding) doublequotes by whitespace', () => {
  it('is not put inside an inline quote node', () => {
    expect(Up.toDocument('My favorite quote mark " is your favorite quote mark " and we all know it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('My favorite quote mark " is your favorite quote mark " and we all know it.'),
      ]))
  })
})
