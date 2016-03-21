/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { SyntaxNode } from '../../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('Overlapped stressed and deleted text', () => {
  it('produce a stress node, a nested revision deletion node, then a non-nested revision deletion node', () => {
    expect(Up.ast('I **love ~~drinking** whole~~ milk.')).to.be.eql(
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


describe('Overlapped emphasized and deleted text', () => {
  it('produce an emphasis node, a nested revision deletion node, then a non-nested revision deletion node', () => {
    expect(Up.ast('I *love ~~drinking* whole~~ milk.')).to.be.eql(
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
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('Overlapped stressed, deleted, and "asided" text', () => {
  it('produce chaos. But when a node is "cut" by its parent ending, another node of the same type follows its parent', () => {
    expect(Up.ast('I **love ~~((drinking** whole~~ milk)) all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new InlineAsideNode([
              new PlainTextNode('drinking')
            ])
          ])
        ]),
        new RevisionDeletionNode([
          new InlineAsideNode([
            new PlainTextNode(' whole')
          ])
        ]),
        new InlineAsideNode([
          new PlainTextNode(' nukj')
        ]),
        new PlainTextNode(' all the time.')
      ]))
  })
})


describe('Overlapped emphasized and linked text', () => {
  it('produce an emphasis node, followed by a link node containing another emphasis node. The link node is unbroken', () => {
    expect(Up.ast('I do *not [care* at](https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new EmphasisNode([
          new PlainTextNode('not '),
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care'),
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})