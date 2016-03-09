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
import { UnorderedListItem } from '../../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../../SyntaxNodes/OrderedListItem'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'


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
          new UnorderedListItem([
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
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ])
        ]),
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Kansas')
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Nebraska')
            ])
          ])
        ]),
        new LineBlockNode([
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ])
        ]),
      ])
    )
  })
})


describe('An unordered list followed by 3 blank lines followed by another unordered list', () => {
  it('produce an unordered list, a section separator, and another unordered list', () => {
    const text = `
- Iowa
- New Hampshire



- Clinton
- Sanders 
`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Iowa')
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('New Hampshire')
            ])
          ])
        ]),
        new SectionSeparatorNode(),
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Clinton')
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Sanders')
            ])
          ])
        ]),
      ]))
  })
})