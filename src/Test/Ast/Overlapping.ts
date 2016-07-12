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


describe('Conventions that completely overlap', () => {
  it('are nested in the order they ended, and do not produce an empty node at the beginning', () => {
    expect(Up.toAst('++**Why would you do this?++**')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new RevisionInsertionNode([
            new PlainTextNode('Why would you do this?')
          ])
        ])
      ])
    )
  })
})


describe("Overlapping conventions where the in which only the first convention's end delimiter is inside the second", () => {
  it('are treated as though the first convention ends before the second', () => {
    expect(Up.toAst('++Oh ~~++why would you do this?~~')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('Oh ')
        ]),
        new RevisionDeletionNode([
          new PlainTextNode('why would you do this?')
        ])
      ])
    )
  })
})


context("Overlapping conventions where only the first convention's start delimiter is outside of the second are treated as though the first convention is inside the second (and thus not overlapping).", () => {
  specify('This is the case for nearly all conventions', () => {
    expect(Up.toAst('~~++Oh~~ why would you do this?++')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new RevisionDeletionNode([
            new PlainTextNode('Oh')
          ]),
          new PlainTextNode(' why would you do this?')
        ])
      ])
    )
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses)', () => {
      expect(Up.toAst('~~(Oh~~ why would you do this?)')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new ParenthesizedNode([
              new PlainTextNode('(Oh')
            ]),
          ]),
          new ParenthesizedNode([
            new PlainTextNode(' why would you do this?)')
          ])
        ])
      )
    })

    specify('Square brackets)', () => {
      expect(Up.toAst('~~[Oh~~ why would you do this?]')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new SquareBracketedNode([
              new PlainTextNode('(Oh')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode(' why would you do this?)')
          ])
        ])
      )
    })
  })
})