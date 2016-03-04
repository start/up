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


describe('Consecutive lines each bulleted by a number sign', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text =
      `
# Hello, world!
# Goodbye, world!`
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

describe('Consecutive lines each bulleted by a number sign followed by a period', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text =
      `
#. Hello, Lavender Town!
#. Goodbye, Lavender Town!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Lavender Town!')
            ])
          ]),
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Lavender Town!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('Consecutive lines each bulleted by a number sign followed by a right paren', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text =
      `
#) Hello, Celadon City!
#) Goodbye, Celadon City!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ]),
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Celadon City!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('Consecutive lines each bulleted by an integer followed by a period', () => {
  it('produce an ordered list node containing ordered list item nodes with explicit ordinals', () => {
    const text =
      `
1. Hello, Celadon City!
2. Goodbye, Celadon City!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Celadon City!')
            ])
          ], 2)
        ])
      ])
    )
  })
})

describe('Consecutive lines each bulleted by an integer followed by a right paren', () => {
  it('produce an ordered list node containing ordered list item nodes with explicit ordinals', () => {
    const text =
      `
1) Hello, Celadon City!
2) Goodbye, Celadon City!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Celadon City!')
            ])
          ], 2)
        ])
      ])
    )
  })
})


describe('A single line bulleted by a number sign', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    const text =
      `
# Hello, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('A single line bulleted by a number sign followed by a period', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    const text =
      `
#. Hello, Lavender Town!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Lavender Town!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('A single line bulleted by a number sign followed by a right paren', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    const text =
      `
#) Hello, Celadon City!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('A single line bulleted by an integer followed by a period', () => {
  it('produces a paragraph, not an ordered list', () => {
    const text =
      `
1783. Not a good year for Great Britain.`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('1783. Not a good year for Great Britain.')
        ])
      ])
    )
  })
})

describe('A single line bulleted by an integer followed by a right paren', () => {
  it('produces an ordered list node containing an ordered list item node with an explicit ordinal', () => {
    const text =
      `
1) Hello, Celadon City!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1)
        ])
      ])
    )
  })
})