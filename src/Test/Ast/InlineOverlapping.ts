import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'


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


describe('Overlapped emphasized and stressed text', () => {
  it('produce an emphasis node, a nested stress node, then a non-nested stress node', () => {
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
  it('produce a stress node, a nested emphasis node, then a non-nested emphasis node', () => {
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


describe('A paragraph with 2 instances of overlapped conventions', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.toAst('I *love ~~drinking* whole~~ milk. I *love ~~drinking* whole~~ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new EmphasisNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk. I '),
        new EmphasisNode([
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


describe('Overlapped stressed, deleted, and inserted text', () => {
  it('produce chaos. But when a node is "cut" by its parent ending, another node of the same type follows its parent', () => {
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


describe('A spoiler that overlaps a link', () => {
  it("produce the correct nodes, despite the seemingly terminating closing bracket in the link's contents", () => {
    // TODO: For bracketed conventions, possibly allow different types of brackets
    expect(Up.toAst('[SPOILER: Gary loses to [Ash] Ketchum -> http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Gary loses to '),
        ]),
        new LinkNode([
          new SpoilerNode([
            new PlainTextNode('Ash')
          ]),
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ])
    )
  })
})
