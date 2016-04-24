
import { expect } from 'chai'
import * as Up from '../../../index'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../../SyntaxNodes/OrderedListItem'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'
import { DescriptionListNode } from '../../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../../SyntaxNodes/Description'


describe('A description list followed by 2 blank lines followed by another description list', () => {
  it('produce two separate description lists', () => {
    const text = `
League of Legends
  A multiplayer online battle arena game
StarCraft 2
  A real-time strategy game


Magnus Carlsen
  An above average chess player 
Lee Chang-ho
  An above average go player 
`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('League of Legends')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A multiplayer online battle arena game')
            ])
          ])
          ),
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('StarCraft 2')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A real-time strategy game')
            ])
          ])
          )
        ]),
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Magnus Carlsen')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('An above average chess player')
            ])
          ])
          ),
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Lee Chang-ho')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('An above average go player')
            ])
          ])
          )
        ])
      ]))
  })
})


describe('A description list followed by 3 blank lines followed by another description list', () => {
  it('produce a description list, a section separator, and another description list', () => {
    const text = `
League of Legends
  A multiplayer online battle arena game
StarCraft 2
  A real-time strategy game



Magnus Carlsen
  An above average chess player 
Lee Chang-ho
  An above average go player 
`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('League of Legends')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A multiplayer online battle arena game')
            ])
          ])
          ),
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('StarCraft 2')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A real-time strategy game')
            ])
          ])
          )
        ]),
        new SectionSeparatorNode(),
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Magnus Carlsen')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('An above average chess player')
            ])
          ])
          ),
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Lee Chang-ho')
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('An above average go player')
            ])
          ])
          )
        ])
      ]))
  })
})
