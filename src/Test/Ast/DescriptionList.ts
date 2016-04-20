
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
import { PlaceholderFootnoteReferenceNode } from '../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'


describe('A non-indented line followed by an indented line', () => {
  it('produce a description list node containing a single term and its description', () => {
    const text =
      `
Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Charmander')])
          ], new Description([
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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Charmander')]),
            new DescriptionTerm([new PlainTextNode('Cyndaquil')]),
            new DescriptionTerm([new PlainTextNode('Torchic')])
          ], new Description([
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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Ash '),
              new EmphasisNode([new PlainTextNode('"Little Marco"')]),
              new PlainTextNode(' Ketchum')
            ])
          ], new Description([
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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Ash Ketchum')
            ])
          ], new Description([
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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Bulbasaur')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Confuse Ray')]),
            new DescriptionTerm([new PlainTextNode('Lick')]),
            new DescriptionTerm([new PlainTextNode('Night Shade')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('Ghost type moves.')
            ])
          ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Gary')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A young man with a great sense of smell.')
            ])
          ]))
        ])
      ])
    )
  })
})


describe("A description list", () => {
  it('can be directly followed by a paragraph', () => {
    const text =
      `
Ash Ketchum
  A famous Pokemon Trainer from Pallet Town.
The secret to eternal youth is to join a cartoon.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Ash Ketchum')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A famous Pokemon Trainer from Pallet Town.')
            ])
          ]))
        ]),
        new ParagraphNode([
          new PlainTextNode('The secret to eternal youth is to join a cartoon.')
        ])
      ])
    )
  })
})
