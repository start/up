import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


describe('Emphasized text containing an unmatched opening delimiter requiring backtracking', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.parse('Hello, *my (^world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.PlainText('my (^world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('A convention overlapping emphasis (containing an unmatched opening delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.parse('[Hello, *my] (^world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[Hello, '),
          new Up.Emphasis([
            new Up.PlainText('my]')
          ]),
        ]),
        new Up.Emphasis([
          new Up.PlainText(' (^world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with both emphasis conventions enclosing an unmatched opening delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.parse('[Hello, **my] (^lovely* world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[Hello, '),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText('my]')
            ])
          ]),
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(' (^lovely')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched opening delimiter requiring backtracking)', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text', () => {
    expect(Up.parse('[Hello, **my] lovely* (^world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[Hello, '),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText('my]')
            ])
          ]),
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(' lovely')
          ]),
          new Up.PlainText(' (^world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('Double emphasis (with the inner emphasis enclosing an unmatched opening delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.parse('Hello, **my (^lovely* world*!!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText('my (^lovely')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the inner emphasis enclosing an unmatched opening delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.parse('[Hello, **my] (^lovely* world*!!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[Hello, '),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText('my]')
            ])
          ]),
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(' (^lovely')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!!*')
      ]))
  })
})


describe('A convention overlapping double emphasis (with the outer emphasis enclosing an unmatched opening delimiter requiring backtracking) followed by an extra closing asterisk', () => {
  it('is parsed as though the unmatched opening delimiter were any other bit of plain text, with the final asterisk remaining as plain text', () => {
    expect(Up.parse('[Hello, **my] lovely* (^world*!!*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.SquareParenthetical([
          new Up.PlainText('[Hello, '),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText('my]')
            ])
          ]),
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(' lovely')
          ]),
          new Up.PlainText(' (^world')
        ]),
        new Up.PlainText('!!*')
      ]))
  })
})


describe('Overlapped stressed, parenthesized, and square bracketed text, with an unmatched start delimiter (requiring backtracking) inside the normal parenthetical convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.parse('I **love (quickly [^ "eating** pepperoni) pizza" all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.NormalParenthetical([
            new Up.PlainText('(quickly [^ '),
            new Up.InlineQuote([
              new Up.PlainText('eating')
            ])
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.InlineQuote([
            new Up.PlainText(' pepperoni)')
          ])
        ]),
        new Up.InlineQuote([
          new Up.PlainText(' pizza')
        ]),
        new Up.PlainText(' all the time.')
      ]))
  })
})


describe('Overlapped stressed, parenthesized, and square bracketed text, with an unmatched start delimiter (requiring backtracking) inside the square parenthetical convention', () => {
  it("is parsed as though the unmatched opening delimiter were any other bit of plain text", () => {
    expect(Up.parse('I **love (quickly "eating** [^ pepperoni) pizza" all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.NormalParenthetical([
            new Up.PlainText('(quickly '),
            new Up.InlineQuote([
              new Up.PlainText('eating')
            ])
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.InlineQuote([
            new Up.PlainText(' [^ pepperoni)')
          ])
        ]),
        new Up.InlineQuote([
          new Up.PlainText(' pizza')
        ]),
        new Up.PlainText(' all the time.')
      ]))
  })
})


describe('Several unmatched footnote start delimiters in the same paragraph, with varying different of leading whitespace,', () => {
  it('are all preserved as plain text, along with all their leading whitespace', () => {
    expect(Up.parse("(^(^ (^  \t (^ Palm trees?  (^(^ \t(^")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText("(^(^ (^  \t (^ Palm trees?  (^(^ \t(^")
      ]))
  })
})
