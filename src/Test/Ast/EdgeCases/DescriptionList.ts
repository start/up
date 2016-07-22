import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { DescriptionListNode } from '../../../SyntaxNodes/DescriptionListNode'
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
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('League of Legends')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A multiplayer online battle arena game')
            ])
          ])
          ),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('StarCraft 2')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A real-time strategy game')
            ])
          ])
          )
        ]),
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Magnus Carlsen')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('An above average chess player')
            ])
          ])
          ),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Lee Chang-ho')
            ])
          ], new DescriptionListNode.Item.Description([
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
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('League of Legends')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A multiplayer online battle arena game')
            ])
          ])
          ),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('StarCraft 2')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A real-time strategy game')
            ])
          ])
          )
        ]),
        new SectionSeparatorNode(),
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Magnus Carlsen')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('An above average chess player')
            ])
          ])
          ),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Lee Chang-ho')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('An above average go player')
            ])
          ])
          )
        ])
      ]))
  })
})
