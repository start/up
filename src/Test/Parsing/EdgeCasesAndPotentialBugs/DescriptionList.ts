import { expect } from 'chai'
import { Up } from '../../../Up'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { DescriptionList } from '../../../SyntaxNodes/DescriptionList'


context('The terms for revealable outline conventions', () => {
  it('can be the subjects in a description list if they are escaped', () => {
    const markup = `
\\Spoiler
  Something that could ruin your favorite movie.

\\NSFW
  Something that could get you fired.
  
\\NSFL
  Something that could ruin your life.`

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Spoiler')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Something that could ruin your favorite movie.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('NSFW')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('Something that could get you fired.')
              ])
            ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('NSFL')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('Something that could ruin your life.')
              ])
            ]))
        ])
      ]))
  })
})


context('The terms for tables and charts', () => {
  it('can be the subjects in a description list if they are escaped', () => {
    const markup = `
\\Table
  A table is a collection of data organized into rows and columns. Evere table must have a header, but the caption is optional.

\\Chart
  In Up, a chart is simply a table with a second, vertical header.`

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Table')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A table is a collection of data organized into rows and columns. Evere table must have a header, but the caption is optional.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Chart')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('In Up, a chart is simply a table with a second, vertical header.')
              ])
            ]))
        ])
      ]))
  })
})


context('A block of would-be subjects in a description list terminates the list if:', () => {
  specify("A blank line separates any of the would-be subjects", () => {
    const markup = `
Bulbasaur
  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Charmanders're red
Squirtles are blue

Confuse Ray
Lick
Night Shade
  Ghost type moves.`

    expect(Up.parse(markup)).to.deep.equal(
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


  specify("A blank line separates the would-be subjects from the would-be description", () => {
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

    expect(Up.parse(markup)).to.deep.equal(
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
