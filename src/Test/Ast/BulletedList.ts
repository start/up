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
import { BulletedListNode } from '../../SyntaxNodes/BulletedListNode'
import { BulletedListItemNode } from '../../SyntaxNodes/BulletedListItemNode'


describe('Consecutive bulleted lines', () => {
  it('produce a bulleted list node containing bulleted list item nodes', () => {
    const text =
      `
* Hello, world!
* Goodbyte, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbyte, world!')
            ])
          ])
        ])
      ]))
  })
})

describe('Bulleted lines separated by a single blank line', () => {
  it('produce a bulleted list node containing bulleted list item nodes', () => {
    const text =
      `
* Hello, world!

* Goodbyte, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbyte, world!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('Bulleted lines separated by a 2 blank lines', () => {
  it('produce two separate bulleted lists', () => {
    const text =
      `
* Hello, world!


* Goodbyte, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ])
        ]),
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbyte, world!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('Bulleted lines separated by a 3 blank lines', () => {
  it('produce two separate bulleted lists separated by a section separator node', () => {
    const text =
      `
* Hello, world!



* Goodbyte, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ])
        ]),
        new SectionSeparatorNode(),
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Goodbyte, world!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('A single bulleted line', () => {
  it('produce a bulleted list node containing a single bulleted list item', () => {
    const text = '* Hello, world!'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ])
        ])
      ])
    )
  })
})

describe('A bulleted line followed by an indented line', () => {
  it('are part of the same bulleted list item', () => {
    const text =
      `
* Hello, world!
  ============
* Goodbyte, world!
  ---------------`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 2)
          ]),
          new BulletedListItemNode([
            new HeadingNode([
              new PlainTextNode('Goodbyte, world!')
            ], 3)
          ])
        ])
      ])
    )
  })
})