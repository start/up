import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { Stress } from'../../../SyntaxNodes/Stress'
import { Italic } from'../../../SyntaxNodes/Italic'
import { Bold } from'../../../SyntaxNodes/Bold'
import { RevisionDeletion } from'../../../SyntaxNodes/RevisionDeletion'
import { RevisionInsertion } from'../../../SyntaxNodes/RevisionInsertion'
import { NormalParenthetical } from'../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from'../../../SyntaxNodes/SquareParenthetical'
import { Highlight } from'../../../SyntaxNodes/Highlight'


// TODO: Organize these tests into contexts for clarity

describe('Overlapped stressed and deleted text', () => {
  it('splits the revision delietion node because it opened second', () => {
    expect(Up.toDocument('I **love ~~drinking** whole~~ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new RevisionDeletion([
            new PlainText('drinking')
          ])
        ]),
        new RevisionDeletion([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped deleted and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I ~~love **drinking~~ whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new RevisionDeletion([
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


describe('Overlapped emphasized and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I *love **drinking* whole** milk.')).to.deep.equal(
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
  it('split the emphasis node because it opened second', () => {
    expect(Up.toDocument('I **love *drinking** whole* milk.')).to.deep.equal(
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
  it('split the emphasis node because it opened second', () => {
    expect(Up.toDocument('I _love *drinking_ whole* milk.')).to.deep.equal(
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
  it('split the italic node because it opened second', () => {
    expect(Up.toDocument('I *love _drinking* whole_ milk.')).to.deep.equal(
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
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I __love **drinking__ whole** milk.')).to.deep.equal(
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
  it('split the bold node because it opened second', () => {
    expect(Up.toDocument('I **love __drinking** whole__ milk.')).to.deep.equal(
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


describe('Overlapped emphasized and inserted text', () => {
  it('split the revision insertion node because it opened second', () => {
    expect(Up.toDocument('I *love ++drinking* whole++ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new RevisionInsertion([
            new PlainText('drinking')
          ])
        ]),
        new RevisionInsertion([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('Overlapped inserted and emphasized text', () => {
  it('split the emphasis node because it opened second', () => {
    expect(Up.toDocument('I ++love *drinking++ whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new RevisionInsertion([
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


describe('Overlapped highlighted and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I [highlight: love **drinking] whole** milk.')).to.deep.equal(
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
  it('split the highlight node because it opened second', () => {
    expect(Up.toDocument('I **love [highlight: drinking** whole] milk.')).to.deep.equal(
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
    expect(Up.toDocument('I **love (drinking** whole) milk.')).to.deep.equal(
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
    expect(Up.toDocument('I **love [drinking** whole] milk.')).to.deep.equal(
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
