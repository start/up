import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { DescriptionListNode } from '../../../SyntaxNodes/DescriptionListNode'


context('A block of would-be terms in a description list terminates the list if:', () => {
  specify("A blank line separates any of the would-be terms", () => {
    const markup = `
Bulbasaur
  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Charmanders're red
Squirtles are blue

Confuse Ray
Lick
Night Shade
  Ghost type moves.
  
Gary
  A young man with a great sense of smell.
`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Bulbasaur')])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ]),

        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode("Charmanders're red")
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("Squirtles are blue")
          ]),
        ]),

        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Confuse Ray')]),
            new DescriptionListNode.Item.Term([new PlainTextNode('Lick')]),
            new DescriptionListNode.Item.Term([new PlainTextNode('Night Shade')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('Ghost type moves.')
              ])
            ])),

          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Gary')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('A young man with a great sense of smell.')
              ])
            ]))
        ])
      ]))
  })


  specify("A blank line separates the would-be terms from the would-be description", () => {
    const markup = `
Bulbasaur
  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Charmanders're red
Squirtles are blue

\tIsn't that a good poem?

Confuse Ray
Lick
Night Shade
  Ghost type moves.
  
Gary
  A young man with a great sense of smell.
`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Bulbasaur')])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ]),

        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode("Charmanders're red")
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("Squirtles are blue")
          ]),
        ]),

        new ParagraphNode([
          new PlainTextNode("Isn't that a good poem?")
        ]),

        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Confuse Ray')]),
            new DescriptionListNode.Item.Term([new PlainTextNode('Lick')]),
            new DescriptionListNode.Item.Term([new PlainTextNode('Night Shade')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('Ghost type moves.')
              ])
            ])),

          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Gary')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('A young man with a great sense of smell.')
              ])
            ]))
        ])
      ]))
  })
})
