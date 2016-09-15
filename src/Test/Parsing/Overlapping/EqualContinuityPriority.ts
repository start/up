import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'


// TODO: Organize these tests into contexts for clarity


describe('Overlapped emphasized and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I *love **drinking* whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Emphasis([
          new Up.PlainText('love '),
          new Up.Stress([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Stress([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I **love *drinking** whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.Emphasis([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Emphasis([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped italicized and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I _love *drinking_ whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Italic([
          new Up.PlainText('love '),
          new Up.Emphasis([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Emphasis([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and italicized text', () => {
  it('splits the italic node because it opened second', () => {
    expect(Up.parse('I *love _drinking* whole_ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Emphasis([
          new Up.PlainText('love '),
          new Up.Italic([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Italic([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped bold and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I __love **drinking__ whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Bold([
          new Up.PlainText('love '),
          new Up.Stress([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Stress([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and bold text', () => {
  it('splits the bold node because it opened second', () => {
    expect(Up.parse('I **love __drinking** whole__ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.Bold([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Bold([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and square bracketed text', () => {
  it('splits the square parenthetical node because it opened second', () => {
    expect(Up.parse('I *love [drinking* whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Emphasis([
          new Up.PlainText('love '),
          new Up.SquareParenthetical([
            new Up.PlainText('[drinking')
          ])
        ]),
        new Up.SquareParenthetical([
          new Up.PlainText(' whole]')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped square bracketed and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I [love *drinking] whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.SquareParenthetical([
          new Up.PlainText('[love '),
          new Up.Emphasis([
            new Up.PlainText('drinking]')
          ])
        ]),
        new Up.Emphasis([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped highlighted and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I [highlight: love **drinking] whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Highlight([
          new Up.PlainText('love '),
          new Up.Stress([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Stress([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and highlighted text', () => {
  it('splits the highlight node because it opened second', () => {
    expect(Up.parse('I **love [highlight: drinking** whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.Highlight([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and parenthesized text', () => {
  it('splits the normal parenthetical node because it opened second', () => {
    expect(Up.parse('I **love (drinking** whole) milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.NormalParenthetical([
            new Up.PlainText('(drinking')
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.PlainText(' whole)')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and square bracketed text', () => {
  it('splits the square parenthetical node because it opened second', () => {
    expect(Up.parse('I **love [drinking** whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.SquareParenthetical([
            new Up.PlainText('[drinking')
          ])
        ]),
        new Up.SquareParenthetical([
          new Up.PlainText(' whole]')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped quoted and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I "love *drinking" whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.InlineQuote([
          new Up.PlainText('love '),
          new Up.Emphasis([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Emphasis([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and quoted text', () => {
  it('splits the inline quote node because it opened second', () => {
    expect(Up.parse('I *love "drinking* whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Emphasis([
          new Up.PlainText('love '),
          new Up.InlineQuote([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.InlineQuote([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped quoted and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I **love "drinking** whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.InlineQuote([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.InlineQuote([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and quoted text', () => {
  it('splits the quoted node because it opened second', () => {
    expect(Up.parse('I "love **drinking" whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.InlineQuote([
          new Up.PlainText('love '),
          new Up.Stress([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Stress([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped quoted and highlighted text', () => {
  it('splits the highlight node because it opened second', () => {
    expect(Up.parse('I [highlight: love "drinking] whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Highlight([
          new Up.PlainText('love '),
          new Up.InlineQuote([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.InlineQuote([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('Overlapped highlighted and quoted text', () => {
  it('splits the quoted node because it opened second', () => {
    expect(Up.parse('I "love [highlight: drinking" whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.InlineQuote([
          new Up.PlainText('love '),
          new Up.Highlight([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})
