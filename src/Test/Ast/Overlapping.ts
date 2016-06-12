import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'


describe('Overlapped stressed and deleted text', () => {
  it('produce a stress node, a nested revision deletion node, then a non-nested revision deletion node. The revision deletion node is split because it opened second', () => {
    expect(Up.toAst('I **love ~~drinking** whole~~ milk.')).to.be.eql(
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


describe('Overlapped emphasized and stressed text', () => {
  it('split the stress node because it opened second', () => {
    expect(Up.toAst('I *love **drinking* whole** milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new EmphasisNode([
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
    expect(Up.toAst('I **love *drinking** whole* milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new EmphasisNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new EmphasisNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and deleted text', () => {
  it('produce a stress node, a nested revision deletion node, then a non-nested revision deletion node', () => {
    expect(Up.toAst('I **love ~~drinking** whole~~ milk.')).to.be.eql(
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


describe('Overlapped stressed and parenthesized text', () => {
  it('splits the parenthesized node because it opened after the stress node', () => {
    expect(Up.toAst('I **love (drinking** whole) milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new ParenthesizedNode([
            new PlainTextNode('(drinking')
          ])
        ]),
        new ParenthesizedNode([
          new PlainTextNode(' whole)')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed and square bracketed text', () => {
  it('splits the square bracketed node because it opened after the stress node', () => {
    expect(Up.toAst('I **love [drinking** whole] milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new SquareBracketedNode([
            new PlainTextNode('[drinking')
          ])
        ]),
        new SquareBracketedNode([
          new PlainTextNode(' whole]')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed, deleted, and inserted text', () => {
  it("split the revision deletion node once and the revision insertion node twice, becuase earlier conventions aren't split by later ones", () => {
    expect(Up.toAst('I **love ~~++drinking** whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
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


describe('Conventions that completely overlap', () => {
  it('are nested in the order they started, and do not create an empty node at the end', () => {
    expect(Up.toAst('++**Why would you do this?++**')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new StressNode([
            new PlainTextNode('Why would you do this?')
          ])
        ])
      ])
    )
  })
})
