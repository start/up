import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by 2 underscores', () => {
  it('is put inside a stress node', () => {
    expect(Up.parse('Hello, __world__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Bold([
          new Up.PlainText('world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Bold text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, __`world`__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Bold([
          new Up.InlineCode('world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain further bold text', () => {
    expect(Up.parse('Hello, __my __little__ world__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Bold([
          new Up.PlainText('my '),
          new Up.Bold([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain italicized text', () => {
    expect(Up.parse('Hello, __my _little_ world__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Bold([
          new Up.PlainText('my '),
          new Up.Italic([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})
