import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'


describe('A non-indented line followed by an indented line', () => {
  it('produce a description list node containing a single term and its description', () => {
    const markup = `
Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Charmander')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ])
            ]))
        ])
      ]))
  })
})


describe('Multiple non-indented lines followed by one indented line', () => {
  it('produce a description list node containing multiple terms and their single description', () => {
    const markup = `
Charmander
Cyndaquil
Torchic
  The first three starter Fire Pokemon`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Charmander')]),
            new DescriptionListNode.Item.Term([new PlainTextNode('Cyndaquil')]),
            new DescriptionListNode.Item.Term([new PlainTextNode('Torchic')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('The first three starter Fire Pokemon')
              ])
            ]))
        ])
      ]))
  })
})


describe("A term in a description list", () => {
  it('can contain inline conventions', () => {
    const markup = `
Ash *"Little Marco"* Ketchum
  A famous Pokemon Trainer from Pallet Town.`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Ash '),
              new EmphasisNode([new PlainTextNode('"Little Marco"')]),
              new PlainTextNode(' Ketchum')
            ])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('A famous Pokemon Trainer from Pallet Town.')
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Ash Ketchum')
            ])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('A famous Pokemon Trainer '),
                new EmphasisNode([new PlainTextNode('probably')]),
                new PlainTextNode(' from Pallet Town')
              ])
            ]))
        ])
      ]))
  })
})


describe('Consecutive terms and descriptions', () => {
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Bulbasaur')])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),

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


describe("A description list", () => {
  it('can be directly followed by a paragraph', () => {
    const markup = `
Ash Ketchum
  A famous Pokemon Trainer from Pallet Town.
The secret to eternal youth is to join a cartoon.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Ash Ketchum')
            ])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([
                new PlainTextNode('A famous Pokemon Trainer from Pallet Town.')
              ])
            ]))
        ]),
        new ParagraphNode([
          new PlainTextNode('The secret to eternal youth is to join a cartoon.')
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

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([
                new PlainTextNode('Poem')
              ])
            ],
              new DescriptionListNode.Item.Description([
                new LineBlockNode([
                  new LineBlockNode.Line([
                    new PlainTextNode('Roses are red'),
                  ]),
                  new LineBlockNode.Line([
                    new PlainTextNode('Violets are blue')
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

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([
                new PlainTextNode('Poem')
              ])
            ],
              new DescriptionListNode.Item.Description([
                new LineBlockNode([
                  new LineBlockNode.Line([
                    new PlainTextNode('Roses are red'),
                  ]),
                  new LineBlockNode.Line([
                    new PlainTextNode('Violets are blue')
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

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([
                new PlainTextNode('Poem')
              ])
            ],
              new DescriptionListNode.Item.Description([
                new LineBlockNode([
                  new LineBlockNode.Line([
                    new PlainTextNode('Roses are red'),
                  ]),
                  new LineBlockNode.Line([
                    new PlainTextNode('Violets are blue')
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

  expect(Up.toDocument(markup)).to.be.eql(
    new UpDocument([
      new DescriptionListNode([
        new DescriptionListNode.Item([
          new DescriptionListNode.Item.Term([
            new PlainTextNode('Poem')
          ])
        ],
          new DescriptionListNode.Item.Description([
            new LineBlockNode([
              new LineBlockNode.Line([
                new PlainTextNode('Roses are red')
              ]),
              new LineBlockNode.Line([
                new PlainTextNode('Violets are blue')
              ])
            ]),
            new ParagraphNode([
              new PlainTextNode('I really like this one.')
            ]),
            new ParagraphNode([
              new PlainTextNode("I think it's my favorite.")
            ])
          ])),
        new DescriptionListNode.Item([
          new DescriptionListNode.Item.Term([
            new PlainTextNode('Address')
          ])
        ],
          new DescriptionListNode.Item.Description([
            new LineBlockNode([
              new LineBlockNode.Line([
                new PlainTextNode('1234 Spooky Street')
              ]),
              new LineBlockNode.Line([
                new PlainTextNode('Pepe, PA 17101')
              ])
            ]),
            new ParagraphNode([
              new PlainTextNode('I used to live there.')
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
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('League of Legends')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A multiplayer online battle arena game')
            ])
          ])),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('StarCraft 2')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A real-time strategy game')
            ])
          ]))
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
          ])),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Lee Chang-ho')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('An above average go player')
            ])
          ]))
        ])
      ]))
  })
})


describe('A description list followed by 3 blank lines followed by another description list', () => {
  it('produce a description list, an outline separator, and another description list', () => {
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
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('League of Legends')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A multiplayer online battle arena game')
            ])
          ])),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('StarCraft 2')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('A real-time strategy game')
            ])
          ]))
        ]),
        new OutlineSeparatorNode(),
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Magnus Carlsen')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('An above average chess player')
            ])
          ])),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([
              new PlainTextNode('Lee Chang-ho')
            ])
          ], new DescriptionListNode.Item.Description([
            new ParagraphNode([
              new PlainTextNode('An above average go player')
            ])
          ]))
        ])
      ]))
  })
})
