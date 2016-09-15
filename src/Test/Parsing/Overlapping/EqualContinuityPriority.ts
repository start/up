import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from'.././Helpers'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { Stress } from'../../../SyntaxNodes/Stress'
import { Italic } from'../../../SyntaxNodes/Italic'
import { Bold } from'../../../SyntaxNodes/Bold'
import { NormalParenthetical } from'../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from'../../../SyntaxNodes/SquareParenthetical'
import { Highlight } from'../../../SyntaxNodes/Highlight'
import { InlineQuote } from'../../../SyntaxNodes/InlineQuote'


// TODO: Organize these tests into contexts for clarity


describe('Overlapped emphasized and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I *love **drinking* whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new Stress([
            new PlainText('drinking')
          ])
        ]),
        new Stress([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I **love *drinking** whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new Emphasis([
            new PlainText('drinking')
          ])
        ]),
        new Emphasis([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped italicized and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I _love *drinking_ whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Italic([
          new PlainText('love '),
          new Emphasis([
            new PlainText('drinking')
          ])
        ]),
        new Emphasis([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and italicized text', () => {
  it('splits the italic node because it opened second', () => {
    expect(Up.parse('I *love _drinking* whole_ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new Italic([
            new PlainText('drinking')
          ])
        ]),
        new Italic([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped bold and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I __love **drinking__ whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Bold([
          new PlainText('love '),
          new Stress([
            new PlainText('drinking')
          ])
        ]),
        new Stress([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and bold text', () => {
  it('splits the bold node because it opened second', () => {
    expect(Up.parse('I **love __drinking** whole__ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new Bold([
            new PlainText('drinking')
          ])
        ]),
        new Bold([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and square bracketed text', () => {
  it('splits the square parenthetical node because it opened second', () => {
    expect(Up.parse('I *love [drinking* whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new SquareParenthetical([
            new PlainText('[drinking')
          ])
        ]),
        new SquareParenthetical([
          new PlainText(' whole]')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped square bracketed and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I [love *drinking] whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new SquareParenthetical([
          new PlainText('[love '),
          new Emphasis([
            new PlainText('drinking]')
          ])
        ]),
        new Emphasis([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped highlighted and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I [highlight: love **drinking] whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Highlight([
          new PlainText('love '),
          new Stress([
            new PlainText('drinking')
          ])
        ]),
        new Stress([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and highlighted text', () => {
  it('splits the highlight node because it opened second', () => {
    expect(Up.parse('I **love [highlight: drinking** whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new Highlight([
            new PlainText('drinking')
          ])
        ]),
        new Highlight([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and parenthesized text', () => {
  it('splits the normal parenthetical node because it opened second', () => {
    expect(Up.parse('I **love (drinking** whole) milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new NormalParenthetical([
            new PlainText('(drinking')
          ])
        ]),
        new NormalParenthetical([
          new PlainText(' whole)')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and square bracketed text', () => {
  it('splits the square parenthetical node because it opened second', () => {
    expect(Up.parse('I **love [drinking** whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new SquareParenthetical([
            new PlainText('[drinking')
          ])
        ]),
        new SquareParenthetical([
          new PlainText(' whole]')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped quoted and emphasized text', () => {
  it('splits the emphasis node because it opened second', () => {
    expect(Up.parse('I "love *drinking" whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new InlineQuote([
          new PlainText('love '),
          new Emphasis([
            new PlainText('drinking')
          ])
        ]),
        new Emphasis([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and quoted text', () => {
  it('splits the inline quote node because it opened second', () => {
    expect(Up.parse('I *love "drinking* whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new InlineQuote([
            new PlainText('drinking')
          ])
        ]),
        new InlineQuote([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped quoted and stressed text', () => {
  it('splits the stress node because it opened second', () => {
    expect(Up.parse('I **love "drinking** whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new InlineQuote([
            new PlainText('drinking')
          ])
        ]),
        new InlineQuote([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped stressed and quoted text', () => {
  it('splits the quoted node because it opened second', () => {
    expect(Up.parse('I "love **drinking" whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new InlineQuote([
          new PlainText('love '),
          new Stress([
            new PlainText('drinking')
          ])
        ]),
        new Stress([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped quoted and highlighted text', () => {
  it('splits the highlight node because it opened second', () => {
    expect(Up.parse('I [highlight: love "drinking] whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Highlight([
          new PlainText('love '),
          new InlineQuote([
            new PlainText('drinking')
          ])
        ]),
        new InlineQuote([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped highlighted and quoted text', () => {
  it('splits the quoted node because it opened second', () => {
    expect(Up.parse('I "love [highlight: drinking" whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new InlineQuote([
          new PlainText('love '),
          new Highlight([
            new PlainText('drinking')
          ])
        ]),
        new Highlight([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})
