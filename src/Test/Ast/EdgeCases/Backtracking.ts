import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'


describe('Emphasized text containing an unmatched openining delimiter requiring backtracking', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toAst('Hello, *my ((world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my ((world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping emphasis (containing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toAst('++Hello, *my++ ((world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('Hello, '),
          new EmphasisNode([
            new PlainTextNode('my')
          ]),
        ]),
        new EmphasisNode([
          new PlainTextNode(' ((world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with both emphasis conventions enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toAst('++Hello, **my++ ((lovely* world*!!')).to.be.eql(
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
            new PlainTextNode(' ((lovely')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toAst('++Hello, **my++ lovely* ((world*!!')).to.be.eql(
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
          new PlainTextNode(' ((world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toAst('++Hello, **my++ ((lovely* world*!!*')).to.be.eql(
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
            new PlainTextNode(' ((lovely')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the outer emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toAst('++Hello, **my++ lovely* ((world*!!*')).to.be.eql(
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
          new PlainTextNode(' ((world')
        ]),
        new PlainTextNode('!!*')
      ]))
  })
})


describe('An unmathced start delimiter (requiring backtracking) followed by overlapped stressed, deleted, and inserted text', () => {
  it("Is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toAst('{{I **love ~~covertly ++drinking** whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('{{I '),
        new StressNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('covertly '),
            new RevisionInsertionNode([
              new PlainTextNode('drinking')
            ])
          ])
        ]),
        new RevisionDeletionNode([
          new RevisionInsertionNode([
            new PlainTextNode(' whole')
          ])
        ]),
        new RevisionInsertionNode([
          new PlainTextNode(' milk')
        ]),
        new PlainTextNode(' all the time.')
      ]))
  })
})