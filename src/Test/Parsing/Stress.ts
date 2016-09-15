import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by 2 asterisks', () => {
  it('is put inside a stress node', () => {
    expect(Up.parse('Hello, **world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Stress([
          new Up.PlainText('world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Stressed text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, **`world`**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Stress([
          new Up.InlineCode('world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain further stressed text', () => {
    expect(Up.parse('Hello, **my **little** world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Stress([
          new Up.PlainText('my '),
          new Up.Stress([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain emphasized text', () => {
    expect(Up.parse('Hello, **my *little* world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Stress([
          new Up.PlainText('my '),
          new Up.Emphasis([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })})
