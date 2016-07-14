import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { ActionNode } from '../../../SyntaxNodes/ActionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'


describe('Emphasis overlapping a linkified spoiler', () => {
  it('splits the emphasis node', () => {
    expect(Up.toAst('After you beat the Elite Four, *only [SPOILER: you* fight Gary] (http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new EmphasisNode([
          new PlainTextNode('only ')
        ]),
        new SpoilerNode([
          new LinkNode([
            new EmphasisNode([
              new PlainTextNode('you')
            ]),
            new PlainTextNode(' fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A linkified spoiler overlapping revision deletion', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight Gary ~~Ketchum](http://example.com/finalbattle) and then the credits roll~~.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('you fight Gary '),
            new RevisionDeletionNode([
              new PlainTextNode('Ketchum')
            ])
          ], 'http://example.com/finalbattle')
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' and then the credits roll')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
