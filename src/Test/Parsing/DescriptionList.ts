import { expect } from 'chai'
import Up = require('../../index')


describe('A non-indented line followed by an indented line', () => {
  it('produce a description list node containing a single subject and its description', () => {
    const markup = `
Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmander')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmander')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Cyndaquil')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Torchic')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('The first three starter Fire Pokemon')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Ash '),
              new Up.InlineQuote([new Up.PlainText('Little Marco')]),
              new Up.PlainText(' Ketchum')
            ])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('A famous Pokemon Trainer from Pallet Town.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Ash Ketchum')
            ])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('A famous Pokemon Trainer '),
                new Up.Emphasis([new Up.PlainText('probably')]),
                new Up.PlainText(' from Pallet Town')
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
  A young man with a great sense of smell.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Bulbasaur')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Confuse Ray')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Lick')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Night Shade')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Ghost type moves.')
              ])
            ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Gary')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('A young man with a great sense of smell.')
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
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Ash Ketchum')
            ])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('A famous Pokemon Trainer from Pallet Town.')
              ])
            ]))
        ]),
        new Up.Paragraph([
          new Up.PlainText('The secret to eternal youth is to join a cartoon.')
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.PlainText('Poem')
              ])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.LineBlock([
                  new Up.LineBlock.Line([
                    new Up.PlainText('Roses are red'),
                  ]),
                  new Up.LineBlock.Line([
                    new Up.PlainText('Violets are blue')
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.PlainText('Poem')
              ])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.LineBlock([
                  new Up.LineBlock.Line([
                    new Up.PlainText('Roses are red'),
                  ]),
                  new Up.LineBlock.Line([
                    new Up.PlainText('Violets are blue')
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.PlainText('Poem')
              ])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.LineBlock([
                  new Up.LineBlock.Line([
                    new Up.PlainText('Roses are red'),
                  ]),
                  new Up.LineBlock.Line([
                    new Up.PlainText('Violets are blue')
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

  expect(Up.parse(markup)).to.deep.equal(
    new Up.Document([
      new Up.DescriptionList([
        new Up.DescriptionList.Item([
          new Up.DescriptionList.Item.Subject([
            new Up.PlainText('Poem')
          ])
        ],
          new Up.DescriptionList.Item.Description([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.PlainText('Roses are red')
              ]),
              new Up.LineBlock.Line([
                new Up.PlainText('Violets are blue')
              ])
            ]),
            new Up.Paragraph([
              new Up.PlainText('I really like this one.')
            ]),
            new Up.Paragraph([
              new Up.PlainText("I think it's my favorite.")
            ])
          ])),
        new Up.DescriptionList.Item([
          new Up.DescriptionList.Item.Subject([
            new Up.PlainText('Address')
          ])
        ],
          new Up.DescriptionList.Item.Description([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.PlainText('1234 Spooky Street')
              ]),
              new Up.LineBlock.Line([
                new Up.PlainText('Pepe, PA 17101')
              ])
            ]),
            new Up.Paragraph([
              new Up.PlainText('I used to live there.')
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
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('League of Legends')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A multiplayer online battle arena game')
            ])
          ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('StarCraft 2')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A real-time strategy game')
            ])
          ]))
        ]),
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Magnus Carlsen')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('An above average chess player')
            ])
          ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Lee Chang-ho')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('An above average go player')
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
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('League of Legends')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A multiplayer online battle arena game')
            ])
          ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('StarCraft 2')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A real-time strategy game')
            ])
          ]))
        ]),
        new Up.ThematicBreak(),
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Magnus Carlsen')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('An above average chess player')
            ])
          ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([
              new Up.PlainText('Lee Chang-ho')
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('An above average go player')
            ])
          ]))
        ])
      ]))
  })
})


context('In a description list, descriptions may have an optional leading blank line. This is true for:', () => {
  specify('The first description', () => {
    const markup = `
Bulbasaur

  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Bulbasaur')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmander')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ])
            ]))
        ])
      ]))
  })

  specify('The last description', () => {
    const markup = `
Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.
  
Bulbasaur

  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmander')]),
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ])
            ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Bulbasaur')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ]))
        ])
      ]))
  })

  specify('The the only description', () => {
    const markup = `
Charmander

  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmander')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })

  specify('A description with multiple subjects', () => {
    const markup = `
Charmander
Charmeleon
Charizard

  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmander')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charmeleon')]),
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Charizard')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })
})
