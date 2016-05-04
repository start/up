import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'


describe('Text surrounded by 2 asterisks', () => {
  it('is put inside a stress node', () => {
    expect(Up.toAst('Hello, **world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can even contain further stressed text', () => {
    expect(Up.toAst('Hello, **my **little** world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('my '),
          new StressNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can even contain emphasized text', () => {
    expect(Up.toAst('Hello, **my *little* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('my '),
          new EmphasisNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})
