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
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../../SyntaxNodes/UnorderedListItemNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItemNode } from '../../SyntaxNodes/DescriptionListItemNode'
import { DescriptionTermNode } from '../../SyntaxNodes/DescriptionTermNode'
import { DescriptionNode } from '../../SyntaxNodes/DescriptionNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A non-indented line followed by an indented line', () => {
  it('produce a description list node containing a single term and its description', () => {
    const text =
      `
Charmander
  A flame burns on the tip of its tail from birth. It is said that a Charmander dies if its flame ever goes out.`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Charmander')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('A flame burns on the tip of its tail from birth. It is said that a Charmander dies if its flame ever goes out.')
            ])
          ]))
        ])
      ])
    )
  })
})


describe('Multiple non-indented lines followed by an indented line', () => {
  it('produce a description list node containing a multiple terms and their description', () => {
    const text =
      `
Charmander
Cyndaquil
Torchic
  Starter Fire Pokemon`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Charmander')]),
            new DescriptionTermNode([new PlainTextNode('Cyndaquil')]),
            new DescriptionTermNode([new PlainTextNode('Torchic')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('Starter Fire Pokemon')
            ])
          ]))
        ])
      ])
    )
  })
})
