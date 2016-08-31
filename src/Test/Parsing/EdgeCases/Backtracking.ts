import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'


describe('Emphasized text containing an unmatched openining delimiter requiring backtracking', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toDocument('Hello, *my (^world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new PlainText('my (^world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('A convention overlapping emphasis (containing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toDocument('[Hello, *my] (^world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[Hello, '),
          new Emphasis([
            new PlainText('my]')
          ]),
        ]),
        new Emphasis([
          new PlainText(' (^world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with both emphasis conventions enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toDocument('[Hello, **my] (^lovely* world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my]')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' (^lovely')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.toDocument('[Hello, **my] lovely* (^world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
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
          new PlainText(' (^world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('Double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toDocument('Hello, **my (^lovely* world*!!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new Emphasis([
            new PlainText('my (^lovely')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toDocument('[Hello, **my] (^lovely* world*!!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my]')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' (^lovely')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the outer emphasis enclosing an unmatched openining delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.toDocument('[Hello, **my] lovely* (^world*!!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new SquareParenthetical([
          new PlainText('[Hello, '),
          new Emphasis([
            new Emphasis([
              new PlainText('my]')
            ])
          ]),
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(' lovely')
          ]),
          new PlainText(' (^world')
        ]),
        new PlainText('!!*')
      ]))
  })
})


describe('Overlapped stressed, parenthesized, and square bracketed text, with an unmatched start delimiter (requiring backtracking) inside the normal parenthetical convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toDocument('I **love (covertly [^ [drinking** whole) milk] all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new NormalParenthetical([
            new PlainText('(covertly [^ '),
            new SquareParenthetical([
              new PlainText('[drinking')
            ])
          ])
        ]),
        new NormalParenthetical([
          new SquareParenthetical([
            new PlainText(' whole)')
          ])
        ]),
        new SquareParenthetical([
          new PlainText(' milk]')
        ]),
        new PlainText(' all the time.')
      ]))
  })
})


describe('Overlapped stressed, parenthesized, and square bracketed text, with an unmatched start delimiter (requiring backtracking) inside the square parenthetical convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.toDocument('I **love (covertly [drinking** [^ whole) milk]] all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new NormalParenthetical([
            new PlainText('(covertly '),
            new SquareParenthetical([
              new PlainText('[drinking')
            ])
          ])
        ]),
        new NormalParenthetical([
          new SquareParenthetical([
            new PlainText(' [^ whole)')
          ])
        ]),
        new SquareParenthetical([
          new PlainText(' milk]')
        ]),
        new PlainText(' all the time.')
      ]))
  })
})


describe('Several unmatched footnote start delimiters in the same paragraph, with varying different of leading whitespace,', () => {
  it('are all preserved as plain text, along with all their leading whitespace', () => {
    expect(Up.toDocument("(^(^ (^  \t (^ Palm trees?  (^(^ \t(^")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("(^(^ (^  \t (^ Palm trees?  (^(^ \t(^")
      ]))
  })
})
