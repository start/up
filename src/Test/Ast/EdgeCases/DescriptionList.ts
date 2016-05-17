import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { DescriptionListNode } from '../../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../../SyntaxNodes/Description'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


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
