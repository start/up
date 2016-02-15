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
`* Hello, world!
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
  
  it('can be separated by a single optional blank line', () => {
    const textWithSeparator =
`* Hello, world!

* Goodbyte, world!`

    const textWithoutSeparator =
`* Hello, world!
* Goodbyte, world!`
    expect(Up.ast(textWithSeparator)).to.be.eql(Up.ast(textWithoutSeparator))
  })
})

describe('Bulleted lines separated by a 2 blank lines', () => {
  it('produce two separate bulleted lists', () => {
    const text =
`* Hello, world!


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
`* Hello, world!



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
  it('produces a bulleted list node containing a single bulleted list item', () => {
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
  it('are parsed like a document and placed in the same bulleted list item node', () => {
    const text =
`* Hello, world!
  ============
* Roses are red
  Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 2)
          ]),
          new BulletedListItemNode([
            new LineBlockNode([
              new LineNode([
                new PlainTextNode('Roses are red')
              ]),
              new LineNode([
                new PlainTextNode('Violets are blue')
              ])
            ])
          ])
        ])
      ])
    )
  })
})

describe('A bulleted line followed by indented lines and single blank lines', () => {
  it('are parsed like a document and placed in the same bulleted list item node', () => {
    const text =
`* Hello, world!
  ============

  It is really late, and I am really tired.

* Goodbye, world!
  ---------------`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 2),
            new ParagraphNode([
              new PlainTextNode('It is really late, and I am really tired.')
            ])
          ]),
          new BulletedListItemNode([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 3)
          ])
        ])
      ])
    )
  })

  it('does not need a blank line to separate it from other list items', () => {
    const textWithoutSeparator =
`* Hello, world!
  ============

  It is really late, and I am really tired.

* Goodbye, world!
  ---------------`

    const textWithSeparator =
`* Hello, world!
  ============

  It is really late, and I am really tired.
* Goodbye, world!
  ---------------`
    expect(Up.ast(textWithoutSeparator)).to.be.eql(Up.ast(textWithSeparator))
  })
})


describe('A bullet list item with an asterisk bullet', () => {
  it('Can start with emphasized text', () => {
    const text = '* *Hello*, world!'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new BulletedListNode([
          new BulletedListItemNode([
            new ParagraphNode([
              new EmphasisNode([
                new PlainTextNode('Hello')
              ]),
              new PlainTextNode(', world!')
            ])
          ])
        ])
      ])
    )
  })
})