import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'

describe('Text surrounded by single asterisks', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toAst('Hello, *world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})

describe('Text separated from surrounding asterisks by whitespace', () => {
  it('is not put inside an emphasis node', () => {
    expect(Up.toAst('Birdie Sanders * won * Wisconsin')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Birdie Sanders * won * Wisconsin'),
      ]))
  })
})


describe('Emphasized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toAst('Hello, *`world`*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new InlineCodeNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain further emphasized text', () => {
    expect(Up.toAst('Hello, *my *little* world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new EmphasisNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.toAst('Hello, *my **little** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new StressNode([
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
    expect(Up.toAst('**Warning:* never feed this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode('Warning:'),
          ]),
          new PlainTextNode(' never feed this tarantula')
        ])
      ]))
  })
})
