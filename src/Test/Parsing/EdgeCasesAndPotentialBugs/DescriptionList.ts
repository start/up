import { expect } from 'chai'
import * as Up from '../../../Main'


context('The terms for revealable block conventions', () => {
  it('can be the subjects in a description list if they are escaped', () => {
    const markup = `
\\Spoiler
  Something that could ruin your favorite movie.

\\NSFW
  Something that could get you fired.
  
\\NSFL
  Something that could ruin your life.
  
\\Revealable
  Something that can be revealed.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Spoiler')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('Something that could ruin your favorite movie.')
            ])
          ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('NSFW')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('Something that could get you fired.')
              ])
            ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('NSFL')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('Something that could ruin your life.')
              ])
            ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Revealable')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('Something that can be revealed.')
              ])
            ]))
        ])
      ]))
  })
})


context('The keyword for table', () => {
  it('can be the subject in a description list if it is escaped', () => {
    const markup = `
\\Table
  A table is a collection of data organized into rows and columns. Evere table must have a header, but the caption is optional.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Table')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('A table is a collection of data organized into rows and columns. Evere table must have a header, but the caption is optional.')
            ])
          ])),
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
            new Up.DescriptionList.Item.Subject([new Up.Text('Bulbasaur')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ]),

        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text("Charmanders're red")
          ]),
          new Up.LineBlock.Line([
            new Up.Text("Squirtles are blue")
          ]),
        ]),

        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Confuse Ray')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Lick')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Night Shade')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('Ghost type moves.')
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
              new Up.DescriptionList.Item.Subject([new Up.Text('Bulbasaur')])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
              ])
            ]))
          ]),

          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.Text("Charmanders're red")
            ]),
            new Up.LineBlock.Line([
              new Up.Text("Squirtles are blue")
            ]),
          ]),

          new Up.Paragraph([
            new Up.Text("Isn't that a good poem?")
          ]),

          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Confuse Ray')]),
              new Up.DescriptionList.Item.Subject([new Up.Text('Lick')]),
              new Up.DescriptionList.Item.Subject([new Up.Text('Night Shade')])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.Paragraph([
                  new Up.Text('Ghost type moves.')
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
              new Up.DescriptionList.Item.Subject([new Up.Text('Bulbasaur')])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
              ])
            ]))
          ]),

          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.Text("Charmanders're red")
            ]),
            new Up.LineBlock.Line([
              new Up.Text("Squirtles are blue")
            ]),
          ]),

          new Up.ThematicBreak(),
          new Up.Paragraph([
            new Up.Text("Isn't that a good poem?")
          ]),

          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Confuse Ray')]),
              new Up.DescriptionList.Item.Subject([new Up.Text('Lick')]),
              new Up.DescriptionList.Item.Subject([new Up.Text('Night Shade')])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.Paragraph([
                  new Up.Text('Ghost type moves.')
                ])
              ]))
          ])
        ]))
    })
  })
})
