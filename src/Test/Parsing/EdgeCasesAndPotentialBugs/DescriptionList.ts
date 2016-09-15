import { expect } from 'chai'
import Up = require('../../../index')


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
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Spoiler')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('Something that could ruin your favorite movie.')
            ])
          ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('NSFW')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Something that could get you fired.')
              ])
            ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('NSFL')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Something that could ruin your life.')
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
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Table')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A table is a collection of data organized into rows and columns. Evere table must have a header, but the caption is optional.')
            ])
          ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Chart')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('In Up, a chart is simply a table with a second, vertical header.')
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
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Bulbasaur')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ]),

        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.PlainText("Charmanders're red")
          ]),
          new Up.LineBlock.Line([
            new Up.PlainText("Squirtles are blue")
          ]),
        ]),

        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Confuse Ray')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Lick')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Night Shade')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Ghost type moves.')
              ])
            ]))
        ])
      ]))
  })


  context('Multiple blank lines separate the would-be subjects from the would-be description:', () => {
    specify("2 blank lines", () => {
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
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Bulbasaur')])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
              ])
            ]))
          ]),

          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.PlainText("Charmanders're red")
            ]),
            new Up.LineBlock.Line([
              new Up.PlainText("Squirtles are blue")
            ]),
          ]),

          new Up.Paragraph([
            new Up.PlainText("Isn't that a good poem?")
          ]),

          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Confuse Ray')]),
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Lick')]),
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Night Shade')])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.Paragraph([
                  new Up.PlainText('Ghost type moves.')
                ])
              ]))
          ])
        ]))
    })

    specify("3 or more blank lines", () => {
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
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Bulbasaur')])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
              ])
            ]))
          ]),

          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.PlainText("Charmanders're red")
            ]),
            new Up.LineBlock.Line([
              new Up.PlainText("Squirtles are blue")
            ]),
          ]),

          new Up.ThematicBreak(),
          new Up.Paragraph([
            new Up.PlainText("Isn't that a good poem?")
          ]),

          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Confuse Ray')]),
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Lick')]),
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Night Shade')])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.Paragraph([
                  new Up.PlainText('Ghost type moves.')
                ])
              ]))
          ])
        ]))
    })
  })
})
