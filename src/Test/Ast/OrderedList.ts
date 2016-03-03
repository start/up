/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItemNode } from '../../SyntaxNodes/OrderedListItemNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('Consecutive lines bulleted by number signs followed by periods', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text =
      `
#. Hello, world!
#. Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ])
      ])
    )
  })
})