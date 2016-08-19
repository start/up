import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by 2 asterisks', () => {
  it('is put inside a stress node', () => {
    expect(Up.toDocument('Hello, **world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Stress([
          new PlainText('world')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Stressed text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, **`world`**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Stress([
          new InlineCode('world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain further stressed text', () => {
    expect(Up.toDocument('Hello, **my **little** world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Stress([
          new PlainText('my '),
          new Stress([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain emphasized text', () => {
    expect(Up.toDocument('Hello, **my *little* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Stress([
          new PlainText('my '),
          new Emphasis([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })})
