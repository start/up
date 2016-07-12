import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'


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


describe('Double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toAst('Hello, **my ((lovely* world*!!*')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode('my ((lovely')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!!*')
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


describe('Overlapped stressed, deleted, and inserted text, with an unmatched start delimiter (requiring backtracking) inside the revision deletion convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toAst('I **love ~~covertly {{ ++drinking** whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('covertly {{ '),
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


describe('Overlapped stressed, deleted, and inserted text, with an unmatched start delimiter (requiring backtracking) inside the revision insertion convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toAst('I **love ~~covertly ++drinking** {{ whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
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
            new PlainTextNode(' {{ whole')
          ])
        ]),
        new RevisionInsertionNode([
          new PlainTextNode(' milk')
        ]),
        new PlainTextNode(' all the time.')
      ]))
  })
})


describe('Several unmatched footnote start delimiters in the same paragraph, with varying different of leading whitespace,', () => {
  it('are all preserved as plain text, along with all their leading whitespace', () => {
    expect(Up.toAst("(^(^ (^  \t (^ Palm trees?  (^(^")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("(^(^ (^  \t (^ Palm trees?  (^(^")
      ]))
  })
})