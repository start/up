import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ItalicNode } from '../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../SyntaxNodes/BoldNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'


describe('Text surrounded by 2 underscores', () => {
  it('is put inside a stress node', () => {
    expect(Up.toAst('Hello, __world__!')).to.be.eql(
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
    expect(Up.toAst('Hello, __`world`__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new BoldNode([
          new InlineCodeNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain further bold text', () => {
    expect(Up.toAst('Hello, __my __little__ world__!')).to.be.eql(
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
    expect(Up.toAst('Hello, __my _little_ world__!')).to.be.eql(
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
