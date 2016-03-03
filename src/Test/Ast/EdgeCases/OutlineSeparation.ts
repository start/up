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


describe('A section separator streak', () => {
  
  it('can be directly followed by a paragraph', () => {
    const text = `
~-~-~-~-~
60.4%`
    expect(Up.ast(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('60.4%')
        ])
      ]))
  })
  
  it('can be directly followed by a heading with a different underline', () => {
    const text = `
- - - - - - - - - - - 
Not me. Us!
@---------@`
    expect(Up.ast(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new HeadingNode([
          new PlainTextNode('Not me. Us!')
        ], 1)
      ]))
  })
})

describe('A streak of asterisks with spaces between', () => {
  it('produces a single section separator node rather than a heavily nested list', () => {
    const text = '* * * * * *'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})

describe('A streak of number signs with spaces between', () => {
  it('produces a single section separator node rather than a heavily nested list', () => {
    const text = '# # # # # #'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})

describe('A streak of asterisks with spaces between', () => {
  it('can directly follow an unordered list', () => {
    const text = `
* Mittens
* Gloves
* * * * * *`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ]),
          new UnorderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Gloves')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})

describe('A streak of number signs with spaces between', () => {
  it('can directly follow an ordered list', () => {
    const text = `
# Mittens
# Gloves
# # # # # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ]),
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Gloves')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})