import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'
import { RevisionInsertion } from '../../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../../SyntaxNodes/RevisionDeletion'


describe('Emphasized text containing an unmatched openining delimiter requiring backtracking', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toDocument('Hello, *my ((world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new PlainText('my ((world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('A convention overlapping emphasis (containing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toDocument('++Hello, *my++ ((world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('Hello, '),
          new Emphasis([
            new PlainText('my')
          ]),
        ]),
        new Emphasis([
          new PlainText(' ((world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with both emphasis conventions enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toDocument('++Hello, **my++ ((lovely* world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' ((lovely')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toDocument('++Hello, **my++ lovely* ((world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' lovely')
          ]),
          new PlainText(' ((world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('Double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toDocument('Hello, **my ((lovely* world*!!*')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new Emphasis([
            new PlainText('my ((lovely')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toDocument('++Hello, **my++ ((lovely* world*!!*')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' ((lovely')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the outer emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toDocument('++Hello, **my++ lovely* ((world*!!*')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' lovely')
          ]),
          new PlainText(' ((world')
        ]),
        new PlainText('!!*')
      ]))
  })
})


describe('Overlapped stressed, deleted, and inserted text, with an unmatched start delimiter (requiring backtracking) inside the revision deletion convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toDocument('I **love ~~covertly {{ ++drinking** whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new RevisionDeletion([
            new PlainText('covertly {{ '),
            new RevisionInsertion([
              new PlainText('drinking')
            ])
          ])
        ]),
        new RevisionDeletion([
          new RevisionInsertion([
            new PlainText(' whole')
          ])
        ]),
        new RevisionInsertion([
          new PlainText(' milk')
        ]),
        new PlainText(' all the time.')
      ]))
  })
})


describe('Overlapped stressed, deleted, and inserted text, with an unmatched start delimiter (requiring backtracking) inside the revision insertion convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toDocument('I **love ~~covertly ++drinking** {{ whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new RevisionDeletion([
            new PlainText('covertly '),
            new RevisionInsertion([
              new PlainText('drinking')
            ])
          ])
        ]),
        new RevisionDeletion([
          new RevisionInsertion([
            new PlainText(' {{ whole')
          ])
        ]),
        new RevisionInsertion([
          new PlainText(' milk')
        ]),
        new PlainText(' all the time.')
      ]))
  })
})


describe('Several unmatched footnote start delimiters in the same paragraph, with varying different of leading whitespace,', () => {
  it('are all preserved as plain text, along with all their leading whitespace', () => {
    expect(Up.toDocument("(^(^ (^  \t (^ Palm trees?  (^(^ \t(^")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText("(^(^ (^  \t (^ Palm trees?  (^(^ \t(^")
      ]))
  })
})
