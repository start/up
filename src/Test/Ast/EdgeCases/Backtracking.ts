import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'


describe('Emphasized text containing an unmatched openining delimiter requiring backtracking', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toAst('Hello, *my ++world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my ++world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping emphasis (containing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toAst('++Hello, *my++ ~~world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('Hello, '),
          new EmphasisNode([
            new PlainTextNode('my')
          ]),
        ]),
        new EmphasisNode([
          new PlainTextNode(' ~~world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with both emphasis conventions enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toAst('++Hello, **my++ ~~lovely* world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('Hello, '),
          new EmphasisNode([
            new EmphasisNode([
              new PlainTextNode('my')
            ])
          ]),
        ]),
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode(' ~~lovely')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toAst('++Hello, **my++ lovely* ~~world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('Hello, '),
          new EmphasisNode([
            new EmphasisNode([
              new PlainTextNode('my')
            ])
          ]),
        ]),
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode(' lovely')
          ]),
          new PlainTextNode(' ~~world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})