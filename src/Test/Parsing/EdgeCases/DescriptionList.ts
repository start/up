import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { DescriptionList } from '../../../SyntaxNodes/DescriptionList'


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
  Ghost type moves.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Bulbasaur')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ]),

        new LineBlock([
          new LineBlock.Line([
            new PlainText("Charmanders're red")
          ]),
          new LineBlock.Line([
            new PlainText("Squirtles are blue")
          ]),
        ]),

        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Confuse Ray')]),
            new DescriptionList.Item.Subject([new PlainText('Lick')]),
            new DescriptionList.Item.Subject([new PlainText('Night Shade')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('Ghost type moves.')
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
  Ghost type moves.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Bulbasaur')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ]),

        new LineBlock([
          new LineBlock.Line([
            new PlainText("Charmanders're red")
          ]),
          new LineBlock.Line([
            new PlainText("Squirtles are blue")
          ]),
        ]),

        new Paragraph([
          new PlainText("Isn't that a good poem?")
        ]),

        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Confuse Ray')]),
            new DescriptionList.Item.Subject([new PlainText('Lick')]),
            new DescriptionList.Item.Subject([new PlainText('Night Shade')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('Ghost type moves.')
              ])
            ]))
        ])
      ]))
  })
})
