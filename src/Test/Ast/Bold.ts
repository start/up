import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ItalicNode } from '../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../SyntaxNodes/BoldNode'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by 2 underscores', () => {
  it('is put inside a stress node', () => {
    expect(Up.toDocument('Hello, __world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new BoldNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Bold text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, __`world`__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new BoldNode([
          new InlineCode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain further bold text', () => {
    expect(Up.toDocument('Hello, __my __little__ world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new BoldNode([
          new PlainTextNode('my '),
          new BoldNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain italicized text', () => {
    expect(Up.toDocument('Hello, __my _little_ world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new BoldNode([
          new PlainTextNode('my '),
          new ItalicNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})
