import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ItalicNode } from '../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../SyntaxNodes/BoldNode'
import { InlineCode } from '../../SyntaxNodes/InlineCode'

describe('Text surrounded by single underscores', () => {
  it('is put inside an italic node', () => {
    expect(Up.toDocument('Hello, _world_!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new ItalicNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})

describe('Text separated from surrounding underscores by whitespace', () => {
  it('is not put inside an italic node', () => {
    expect(Up.toDocument('Birdie Sanders _ won _ Wisconsin')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Birdie Sanders _ won _ Wisconsin'),
      ]))
  })
})


describe('Italicized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, _`world`_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new ItalicNode([
          new InlineCode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain further italicized text', () => {
    expect(Up.toDocument('Hello, _my _little_ world_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new ItalicNode([
          new PlainTextNode('my '),
          new ItalicNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.toDocument('Hello, _my __little__ world_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new ItalicNode([
          new PlainTextNode('my '),
          new BoldNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Double underscores followed by two separate single closing underscores', () => {
  it('produces 2 nested emphasis nodes', () => {
    expect(Up.toDocument('__Warning:_ never feed this tarantula_')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new ItalicNode([
            new PlainTextNode('Warning:'),
          ]),
          new PlainTextNode(' never feed this tarantula')
        ])
      ]))
  })
})
