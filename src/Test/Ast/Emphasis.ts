import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { InlineCode } from '../../SyntaxNodes/InlineCode'

describe('Text surrounded by single asterisks', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toDocument('Hello, *world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Emphasis([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})

describe('Text separated from surrounding asterisks by whitespace', () => {
  it('is not put inside an emphasis node', () => {
    expect(Up.toDocument('Birdie Sanders * won * Wisconsin')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Birdie Sanders * won * Wisconsin'),
      ]))
  })
})


describe('Emphasized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, *`world`*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Emphasis([
          new InlineCode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain further emphasized text', () => {
    expect(Up.toDocument('Hello, *my *little* world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Emphasis([
          new PlainTextNode('my '),
          new Emphasis([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.toDocument('Hello, *my **little** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Emphasis([
          new PlainTextNode('my '),
          new Stress([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Double asterisks followed by two separate single closing asterisks', () => {
  it('produces 2 nested emphasis nodes', () => {
    expect(Up.toDocument('**Warning:* never feed this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new Emphasis([
            new PlainTextNode('Warning:'),
          ]),
          new PlainTextNode(' never feed this tarantula')
        ])
      ]))
  })
})
