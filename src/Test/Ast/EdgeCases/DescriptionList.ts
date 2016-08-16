import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { DescriptionListNode } from '../../../SyntaxNodes/DescriptionListNode'


context('The terms in a description list item must be on consecutive lines.', () => {
  specify("If a blank line is encountered in what would be a block of terms, that block terminates the description list", () => {
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
  })