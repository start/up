import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by 2 underscores', () => {
  it('is put inside a stress node', () => {
    expect(Up.toDocument('Hello, __world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Bold([
          new PlainText('world')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Bold text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, __`world`__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Bold([
          new InlineCode('world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain further bold text', () => {
    expect(Up.toDocument('Hello, __my __little__ world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Bold([
          new PlainText('my '),
          new Bold([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain italicized text', () => {
    expect(Up.toDocument('Hello, __my _little_ world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Bold([
          new PlainText('my '),
          new Italic([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })
})
