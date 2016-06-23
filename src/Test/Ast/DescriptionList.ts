import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'


describe('A non-indented line followed by an indented line', () => {
  it('produce a description list node containing a single term and its description', () => {
    const text = `
Charmander
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Charmander')])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
              ])
            ]))
        ])
      ])
    )
  })
})


describe('Multiple non-indented lines followed by one indented line', () => {
  it('produce a description list node containing multiple terms and their single description', () => {
    const text = `
Charmander
Cyndaquil
Torchic
  The first three starter Fire Pokemon`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Charmander')]),
            new DescriptionTerm([new PlainTextNode('Cyndaquil')]),
            new DescriptionTerm([new PlainTextNode('Torchic')])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('The first three starter Fire Pokemon')
              ])
            ]))
        ])
      ])
    )
  })
})


describe("A term in a description list", () => {
  it('can contain inline conventions', () => {
    const text = `
Ash *"Little Marco"* Ketchum
  A famous Pokemon Trainer from Pallet Town.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Ash '),
              new EmphasisNode([new PlainTextNode('"Little Marco"')]),
              new PlainTextNode(' Ketchum')
            ])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('A famous Pokemon Trainer from Pallet Town.')
              ])
            ]))
        ])
      ])
    )
  })
})


describe("A description in a description list", () => {
  it('can contain inline conventions', () => {
    const text = `
Ash Ketchum
  A famous Pokemon Trainer *probably* from Pallet Town`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Ash Ketchum')
            ])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('A famous Pokemon Trainer '),
                new EmphasisNode([new PlainTextNode('probably')]),
                new PlainTextNode(' from Pallet Town')
              ])
            ]))
        ])
      ])
    )
  })
})


describe('Consecutive terms and descriptions', () => {
  it('produce a single description list node', () => {
    const text = `
Bulbasaur
  A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade
  Ghost type moves.
  
Gary
  A young man with a great sense of smell.
`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Bulbasaur')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Confuse Ray')]),
            new DescriptionTerm([new PlainTextNode('Lick')]),
            new DescriptionTerm([new PlainTextNode('Night Shade')])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('Ghost type moves.')
              ])
            ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Gary')])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('A young man with a great sense of smell.')
              ])
            ]))
        ])
      ])
    )
  })
})


describe("A description list", () => {
  it('can be directly followed by a paragraph', () => {
    const text = `
Ash Ketchum
  A famous Pokemon Trainer from Pallet Town.
The secret to eternal youth is to join a cartoon.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([
              new PlainTextNode('Ash Ketchum')
            ])
          ],
            new Description([
              new ParagraphNode([
                new PlainTextNode('A famous Pokemon Trainer from Pallet Town.')
              ])
            ]))
        ]),
        new ParagraphNode([
          new PlainTextNode('The secret to eternal youth is to join a cartoon.')
        ])
      ])
    )
  })
})



context('Lines in the description of description list must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const text = `
Poem
  Roses are red
  Violets are blue`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListItem([
              new DescriptionTerm([
                new PlainTextNode('Poem')
              ])
            ],
              new Description([
                new LineBlockNode([
                  new Line([
                    new PlainTextNode('Roses are red'),
                  ]),
                  new Line([
                    new PlainTextNode('Violets are blue')
                  ])
                ])
              ]))
          ]),
        ])
      )
    })

    specify('One tab', () => {
      const text = `
Poem
\tRoses are red
\tViolets are blue`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListItem([
              new DescriptionTerm([
                new PlainTextNode('Poem')
              ])
            ],
              new Description([
                new LineBlockNode([
                  new Line([
                    new PlainTextNode('Roses are red'),
                  ]),
                  new Line([
                    new PlainTextNode('Violets are blue')
                  ])
                ])
              ]))
          ])
        ])
      )
    })

    specify('One space folled by one tab', () => {
      const text = `
Poem
 \tRoses are red
 \tViolets are blue`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListItem([
              new DescriptionTerm([
                new PlainTextNode('Poem')
              ])
            ],
              new Description([
                new LineBlockNode([
                  new Line([
                    new PlainTextNode('Roses are red'),
                  ]),
                  new Line([
                    new PlainTextNode('Violets are blue')
                  ])
                ])
              ]))
          ])
        ])
      )
    })
  })
})

specify('Different lines in a description list can use different indentation', () => {
  const text = `
Poem
  Roses are red
 \tViolets are blue
 
\tI really like this one.
   
  I think it's my favorite.

Address
\t1234 Spooky Street
  Pepe, PA 17101
 
 \tI used to live there.`

  expect(Up.toAst(text)).to.be.eql(
    new DocumentNode([
      new DescriptionListNode([
        new DescriptionListItem([
          new DescriptionTerm([
            new PlainTextNode('Poem')
          ])
        ],
          new Description([
            new LineBlockNode([
              new Line([
                new PlainTextNode('Roses are red')
              ]),
              new Line([
                new PlainTextNode('Violets are blue')
              ])
            ]),
            new ParagraphNode([
              new PlainTextNode('I really like this one.')
            ]),
            new ParagraphNode([
              new PlainTextNode("I think it's my favorite.")
            ])
          ])
        ),
        new DescriptionListItem([
          new DescriptionTerm([
            new PlainTextNode('Address')
          ])
        ],
          new Description([
            new LineBlockNode([
              new Line([
                new PlainTextNode('1234 Spooky Street')
              ]),
              new Line([
                new PlainTextNode('Pepe, PA 17101')
              ])
            ]),
            new ParagraphNode([
              new PlainTextNode('I used to live there.')
            ])
          ]))
      ])
    ])
  )
})