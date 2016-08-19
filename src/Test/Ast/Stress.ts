import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by 2 asterisks', () => {
  it('is put inside a stress node', () => {
    expect(Up.toDocument('Hello, **world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Stress([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Stressed text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, **`world`**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Stress([
          new InlineCode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain further stressed text', () => {
    expect(Up.toDocument('Hello, **my **little** world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Stress([
          new PlainTextNode('my '),
          new Stress([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain emphasized text', () => {
    expect(Up.toDocument('Hello, **my *little* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Stress([
          new PlainTextNode('my '),
          new Emphasis([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })})
