/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
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
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../../../SyntaxNodes/UnorderedListItemNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { OrderedListItemNode } from '../../../SyntaxNodes/OrderedListItemNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../../SyntaxNodes/LineNode'


describe('An unordered list with a single item', () => {
  it('can be sandwched by section separator streaks', () => {
    const text = `
-----------
* Mittens
-----------`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new UnorderedListNode([
          new UnorderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})

describe('An unordered list', () => {
  it('can be sandwched by line blocks', () => {
    const text = `
Roses are red
Violets are blue
- Kansas
- Nebraska
Lyrics have lines
And addresses do, too`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new LineNode([
            new PlainTextNode('Roses are red')
          ]),
          new LineNode([
            new PlainTextNode('Violets are blue')
          ])
        ]),
        new UnorderedListNode([
          new UnorderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Kansas')
            ])
          ]),
          new UnorderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Nebraska')
            ])
          ])
        ]),
        new LineBlockNode([
          new LineNode([
            new PlainTextNode('Lyrics have lines')
          ]),
          new LineNode([
            new PlainTextNode('And addresses do, too')
          ])
        ]),
      ])
    )
  })
})