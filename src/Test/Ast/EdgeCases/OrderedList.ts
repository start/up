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


describe('An ordered list with a single item', () => {
  it('can be sandwched by section separator streaks', () => {
    const text = `
-----------
# Mittens
-----------`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})