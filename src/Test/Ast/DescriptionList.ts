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
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Charmander')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ])
    )
  })
})


describe('Multiple non-indented lines followed by one indented line', () => {
  it('produce a description list node containing multiple terms and their single description', () => {
    const text =
      `
Charmander
Cyndaquil
Torchic
  The first three starter Fire Pokemon`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Charmander')]),
            new DescriptionTermNode([new PlainTextNode('Cyndaquil')]),
            new DescriptionTermNode([new PlainTextNode('Torchic')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('The first three starter Fire Pokemon')
            ])
          ]))
        ])
      ])
    )
  })
})
 

describe("A term in a description list", () => {
  it('can contain inline conventions', () => {
    const text =
      `
Ash *"Little Marco"* Ketchum
  A famous Pokemon Trainer from Pallet Town.`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([
              new PlainTextNode('Ash '),
              new EmphasisNode([new PlainTextNode('"Little Marco"')]),
              new PlainTextNode(' Ketchum')
            ])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('A famous Pokemon Trainer from Pallet Town.')
            ])
          ]))
        ])
      ])
    )
  })
})


describe("A description in a description list", () => {
  it('can contain inline conventions', () => {
    const text =
      `
Ash Ketchum
  A famous Pokemon Trainer *probably* from Pallet Town`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([
              new PlainTextNode('Ash Ketchum')
            ])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('A famous Pokemon Trainer '),
              new EmphasisNode([new PlainTextNode('probably')]),
              new PlainTextNode(' from Pallet Town')
            ])
          ]))
        ])
      ])
    )
  })
})


describe('Consecutive terms and descriptions', () => {
  it('produce a single description list node', () => {
    const text =
      `
Bulbasaur
  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade
  Ghost type moves.
  
Gary
  A young man with a great sense of smell.
`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Bulbasaur')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),
          
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Confuse Ray')]),
            new DescriptionTermNode([new PlainTextNode('Lick')]),
            new DescriptionTermNode([new PlainTextNode('Night Shade')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('Ghost type moves.')
            ])
          ])),
          
          new DescriptionListItemNode([
            new DescriptionTermNode([new PlainTextNode('Gary')])
          ], new DescriptionNode([
            new ParagraphNode([
              new PlainTextNode('A young man with a great sense of smell.')
            ])
          ]))
        ])
      ])
    )
  })
})
