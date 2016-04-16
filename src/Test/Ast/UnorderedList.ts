/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
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
import { Line } from '../../SyntaxNodes/Line'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('Consecutive bulleted lines', () => {
  it('produce an unordered list node containing unordered list item nodes', () => {
    const text =
      `
* Hello, world!
* Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('List items in an unordered list', () => {
  it('can be separated by 1 blank line', () => {
    const textWithSeparator =
      `
* Hello, world!

* Goodbye, world!`

    const textWithoutSeparator =
      `
* Hello, world!
* Goodbye, world!`
    expect(Up.ast(textWithSeparator)).to.be.eql(Up.ast(textWithoutSeparator))
  })
})


describe('A single bulleted line', () => {
  it('produces an unordered list node containing a single unordered list item', () => {
    const text = '* Hello, world!'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
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
  it('are parsed like a document and placed in the same unordered list item node', () => {
    const text =
      `
* Hello, world!
  ============
* Roses are red
  Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1)
          ]),
          new UnorderedListItem([
            new LineBlockNode([
              new Line([
                new PlainTextNode('Roses are red')
              ]),
              new Line([
                new PlainTextNode('Violets are blue')
              ])
            ])
          ])
        ])
      ])
    )
  })
})


describe('A bulleted line followed by multiple indented lines', () => {
  it('are placed the same bulleted list item node', () => {
    const text =
      `
* Hello, world!
  ============

  It is really late, and I am really tired.

* Goodbye, world!
  ===============`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1),
            new ParagraphNode([
              new PlainTextNode('It is really late, and I am really tired.')
            ])
          ]),
          new UnorderedListItem([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 1)
          ])
        ])
      ])
    )
  })
})


describe('An unordered list item containing multiple indented lines', () => {
  it('does not need a blank line to separate it from the following list item', () => {
    const itemsWithSeparator =
      `* Hello, world!
  ============

  It is really late, and I am really tired.
* Goodbye, world!
  ==============`
  
    const itemsWithoutSeparator =
      `
* Hello, world!
  ============

  It is really late, and I am really tired.

* Goodbye, world!
  ===============`
    expect(Up.ast(itemsWithoutSeparator)).to.be.eql(Up.ast(itemsWithSeparator))
  })

  it('can contain a nested unordered list that uses the same type of bullet as the top-level list item', () => {
    const text =
      `
* Hello, world!
  =============

  Upcoming features:
  
  * Code blocks in list items
  * Definition lists

* Goodbye, world!
  ===============`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1),
            new ParagraphNode([
              new PlainTextNode('Upcoming features:')
            ]),
            new UnorderedListNode([
              new UnorderedListItem([
                new ParagraphNode([
                  new PlainTextNode('Code blocks in list items')
                ])
              ]),
              new UnorderedListItem([
                new ParagraphNode([
                  new PlainTextNode('Definition lists')
                ])
              ])
            ])
          ]),
          new UnorderedListItem([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 1)
          ])
        ])
      ])
    )
  })
})


describe('An unordered list item with an asterisk bullet', () => {
  it('Can start with emphasized text', () => {
    const text = '* *Hello*, world!'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
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


describe('An unordered list', () => {
  it('can be directly followed by a paragraph', () => {
    const text =
      `
* Hello, world!
* Goodbye, world!
Hello, World 1-2!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, World 1-2!')
        ])
      ])
    )
  })
})
