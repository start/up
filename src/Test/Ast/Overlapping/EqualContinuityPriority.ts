import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { PlainTextNode } from'../../../SyntaxNodes/PlainTextNode'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { StressNode } from'../../../SyntaxNodes/StressNode'
import { ItalicNode } from'../../../SyntaxNodes/ItalicNode'
import { BoldNode } from'../../../SyntaxNodes/BoldNode'
import { RevisionDeletionNode } from'../../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from'../../../SyntaxNodes/RevisionInsertionNode'
import { NormalParentheticalNode } from'../../../SyntaxNodes/NormalParentheticalNode'
import { SquareParentheticalNode } from'../../../SyntaxNodes/SquareParentheticalNode'
import { HighlightNode } from'../../../SyntaxNodes/HighlightNode'


// TODO: Organize these tests into contexts for clarity

describe('Overlapped stressed and deleted text', () => {
  it('splits the revision delietion node because it opened second', () => {
    expect(Up.toDocument('I **love ~~drinking** whole~~ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped deleted and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I ~~love **drinking~~ whole** milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new RevisionDeletionNode([
          new PlainTextNode('love '),
          new StressNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I *love **drinking* whole** milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new Emphasis([
          new PlainTextNode('love '),
          new StressNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and emphasized text', () => {
  it('split the emphasis node because it opened second', () => {
    expect(Up.toDocument('I **love *drinking** whole* milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new Emphasis([
            new PlainTextNode('drinking')
          ])
        ]),
        new Emphasis([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped italicized and emphasized text', () => {
  it('split the emphasis node because it opened second', () => {
    expect(Up.toDocument('I _love *drinking_ whole* milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new ItalicNode([
          new PlainTextNode('love '),
          new Emphasis([
            new PlainTextNode('drinking')
          ])
        ]),
        new Emphasis([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and italicized text', () => {
  it('split the italic node because it opened second', () => {
    expect(Up.toDocument('I *love _drinking* whole_ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new Emphasis([
          new PlainTextNode('love '),
          new ItalicNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new ItalicNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped bold and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I __love **drinking__ whole** milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new BoldNode([
          new PlainTextNode('love '),
          new StressNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and bold text', () => {
  it('split the bold node because it opened second', () => {
    expect(Up.toDocument('I **love __drinking** whole__ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new BoldNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new BoldNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped emphasized and inserted text', () => {
  it('split the revision insertion node because it opened second', () => {
    expect(Up.toDocument('I *love ++drinking* whole++ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new Emphasis([
          new PlainTextNode('love '),
          new RevisionInsertionNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new RevisionInsertionNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped inserted and emphasized text', () => {
  it('split the emphasis node because it opened second', () => {
    expect(Up.toDocument('I ++love *drinking++ whole* milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new RevisionInsertionNode([
          new PlainTextNode('love '),
          new Emphasis([
            new PlainTextNode('drinking')
          ])
        ]),
        new Emphasis([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped highlighted and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toDocument('I [highlight: love **drinking] whole** milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new HighlightNode([
          new PlainTextNode('love '),
          new StressNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and highlighted text', () => {
  it('split the highlight node because it opened second', () => {
    expect(Up.toDocument('I **love [highlight: drinking** whole] milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new HighlightNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new HighlightNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and parenthesized text', () => {
  it('splits the normal parenthetical node because it opened second', () => {
    expect(Up.toDocument('I **love (drinking** whole) milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new NormalParentheticalNode([
            new PlainTextNode('(drinking')
          ])
        ]),
        new NormalParentheticalNode([
          new PlainTextNode(' whole)')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and square bracketed text', () => {
  it('splits the square parenthetical node because it opened second', () => {
    expect(Up.toDocument('I **love [drinking** whole] milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new SquareParentheticalNode([
            new PlainTextNode('[drinking')
          ])
        ]),
        new SquareParentheticalNode([
          new PlainTextNode(' whole]')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})
