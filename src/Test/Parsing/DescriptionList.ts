import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'


describe('A non-indented line followed by an indented line', () => {
  it('produce a description list node containing a single subject and its description', () => {
    const markup = `
Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Charmander')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ])
            ]))
        ])
      ]))
  })
})


describe('Multiple non-indented lines followed by one indented line', () => {
  it('produce a description list node containing multiple subjects and their single description', () => {
    const markup = `
Charmander
Cyndaquil
Torchic
  The first three starter Fire Pokemon`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Charmander')]),
            new DescriptionList.Item.Subject([new PlainText('Cyndaquil')]),
            new DescriptionList.Item.Subject([new PlainText('Torchic')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('The first three starter Fire Pokemon')
              ])
            ]))
        ])
      ]))
  })
})


describe("A subject in a description list", () => {
  it('can contain inline conventions', () => {
    const markup = `
Ash "Little Marco" Ketchum
  A famous Pokemon Trainer from Pallet Town.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Ash '),
              new InlineQuote([new PlainText('Little Marco')]),
              new PlainText(' Ketchum')
            ])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('A famous Pokemon Trainer from Pallet Town.')
              ])
            ]))
        ])
      ]))
  })
})


describe("A description in a description list", () => {
  it('can contain inline conventions', () => {
    const markup = `
Ash Ketchum
  A famous Pokemon Trainer *probably* from Pallet Town`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Ash Ketchum')
            ])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('A famous Pokemon Trainer '),
                new Emphasis([new PlainText('probably')]),
                new PlainText(' from Pallet Town')
              ])
            ]))
        ])
      ]))
  })
})


describe('Consecutive subjects and descriptions', () => {
  it('produce a single description list node', () => {
    const markup = `
Bulbasaur
  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade
  Ghost type moves.
  
Gary
  A young man with a great sense of smell.
`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Bulbasaur')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Confuse Ray')]),
            new DescriptionList.Item.Subject([new PlainText('Lick')]),
            new DescriptionList.Item.Subject([new PlainText('Night Shade')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('Ghost type moves.')
              ])
            ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Gary')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('A young man with a great sense of smell.')
              ])
            ]))
        ])
      ]))
  })
})


describe("A description list", () => {
  it('can be directly followed by a paragraph', () => {
    const markup = `
Ash Ketchum
  A famous Pokemon Trainer from Pallet Town.
The secret to eternal youth is to join a cartoon.`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Ash Ketchum')
            ])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('A famous Pokemon Trainer from Pallet Town.')
              ])
            ]))
        ]),
        new Paragraph([
          new PlainText('The secret to eternal youth is to join a cartoon.')
        ])
      ]))
  })
})



context('Lines in the description of description list must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const markup = `
Poem
  Roses are red
  Violets are blue`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Poem')
              ])
            ],
              new DescriptionList.Item.Description([
                new LineBlock([
                  new LineBlock.Line([
                    new PlainText('Roses are red'),
                  ]),
                  new LineBlock.Line([
                    new PlainText('Violets are blue')
                  ])
                ])
              ]))
          ]),
        ]))
    })

    specify('One tab', () => {
      const markup = `
Poem
\tRoses are red
\tViolets are blue`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Poem')
              ])
            ],
              new DescriptionList.Item.Description([
                new LineBlock([
                  new LineBlock.Line([
                    new PlainText('Roses are red'),
                  ]),
                  new LineBlock.Line([
                    new PlainText('Violets are blue')
                  ])
                ])
              ]))
          ])
        ]))
    })

    specify('One space folled by one tab', () => {
      const markup = `
Poem
 \tRoses are red
 \tViolets are blue`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Poem')
              ])
            ],
              new DescriptionList.Item.Description([
                new LineBlock([
                  new LineBlock.Line([
                    new PlainText('Roses are red'),
                  ]),
                  new LineBlock.Line([
                    new PlainText('Violets are blue')
                  ])
                ])
              ]))
          ])
        ]))
    })
  })
})

specify('Different lines in a description list can use different indentation', () => {
  const markup = `
Poem
  Roses are red
 \tViolets are blue
 
\tI really like this one.
   
  I think it's my favorite.

Address
\t1234 Spooky Street
  Pepe, PA 17101
 
 \tI used to live there.`

  expect(Up.toDocument(markup)).to.deep.equal(
    new UpDocument([
      new DescriptionList([
        new DescriptionList.Item([
          new DescriptionList.Item.Subject([
            new PlainText('Poem')
          ])
        ],
          new DescriptionList.Item.Description([
            new LineBlock([
              new LineBlock.Line([
                new PlainText('Roses are red')
              ]),
              new LineBlock.Line([
                new PlainText('Violets are blue')
              ])
            ]),
            new Paragraph([
              new PlainText('I really like this one.')
            ]),
            new Paragraph([
              new PlainText("I think it's my favorite.")
            ])
          ])),
        new DescriptionList.Item([
          new DescriptionList.Item.Subject([
            new PlainText('Address')
          ])
        ],
          new DescriptionList.Item.Description([
            new LineBlock([
              new LineBlock.Line([
                new PlainText('1234 Spooky Street')
              ]),
              new LineBlock.Line([
                new PlainText('Pepe, PA 17101')
              ])
            ]),
            new Paragraph([
              new PlainText('I used to live there.')
            ])
          ]))
      ])
    ]))
})


describe('A description list followed by 2 blank lines followed by another description list', () => {
  it('produce two separate description lists', () => {
    const markup = `
League of Legends
  A multiplayer online battle arena game
StarCraft 2
  A real-time strategy game


Magnus Carlsen
  An above average chess player
Lee Chang-ho
  An above average go player
`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('League of Legends')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A multiplayer online battle arena game')
            ])
          ])),
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('StarCraft 2')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A real-time strategy game')
            ])
          ]))
        ]),
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Magnus Carlsen')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('An above average chess player')
            ])
          ])),
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Lee Chang-ho')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('An above average go player')
            ])
          ]))
        ])
      ]))
  })
})


describe('A description list followed by 3 blank lines followed by another description list', () => {
  it('produce a description list, a thematic break, and another description list', () => {
    const markup = `
League of Legends
  A multiplayer online battle arena game
StarCraft 2
  A real-time strategy game



Magnus Carlsen
  An above average chess player
Lee Chang-ho
  An above average go player
`
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('League of Legends')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A multiplayer online battle arena game')
            ])
          ])),
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('StarCraft 2')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A real-time strategy game')
            ])
          ]))
        ]),
        new ThematicBreak(),
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Magnus Carlsen')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('An above average chess player')
            ])
          ])),
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([
              new PlainText('Lee Chang-ho')
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('An above average go player')
            ])
          ]))
        ])
      ]))
  })
})
