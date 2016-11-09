import { expect } from 'chai'
import * as Up from '../../Main'


context('Within most top-level outline conventions, footnotes produce a footnote block appearing after that convention. Specifically:', () => {
  context('Paragraphs:', () => {
    specify("With one footnote", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
        
Anyway, none of that matters.`

      const footnote = new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal."),
            footnote,
            new Up.Text(" Never have.")
          ]),
          new Up.FootnoteBlock([footnote]),
          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ]))
    })

    specify("With multiple footnotes", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)

Anyway, none of that matters.`

      const footnotes = [
        new Up.Footnote([
          new Up.Text('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Up.Footnote([
          new Up.Text('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal."),
            footnotes[0],
            new Up.Text(" Never have."),
            footnotes[1]
          ]),
          new Up.FootnoteBlock(footnotes),
          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ]))
    })
  })


  context('Headings:', () => {
    specify("With one footnote", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
================
        
Anyway, none of that matters.`

      const footnote = new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const heading = new Up.Heading([
        new Up.Text("I don't eat cereal."),
        footnote,
        new Up.Text(" Never have.")
      ], {
          level: 1,
          titleMarkup: "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.",
          ordinalInTableOfContents: 1
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          heading,
          new Up.FootnoteBlock([footnote]),
          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ], new Up.Document.TableOfContents([heading])))
    })

    specify("With multiple footnotes", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
================

Anyway, none of that matters.`

      const footnotes = [
        new Up.Footnote([
          new Up.Text('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Up.Footnote([
          new Up.Text('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      const heading = new Up.Heading([
        new Up.Text("I don't eat cereal."),
        footnotes[0],
        new Up.Text(" Never have."),
        footnotes[1]
      ], {
          level: 1,
          titleMarkup: "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)",
          ordinalInTableOfContents: 1
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          heading,
          new Up.FootnoteBlock(footnotes),
          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ], new Up.Document.TableOfContents([heading])))
    })
  })


  specify('Line blocks', () => {
    const markup = `
Roses are red (^This is not my line.)
Violets are blue (^Neither is this line. I think my mom made it up.)

Anyway, none of that matters.`

    const footnotes = [
      new Up.Footnote([
        new Up.Text('This is not my line.')
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text("Roses are red"),
            footnotes[0],
          ]),
          new Up.LineBlock.Line([
            new Up.Text("Violets are blue"),
            footnotes[1]
          ])
        ]),
        new Up.FootnoteBlock(footnotes),
        new Up.Paragraph([
          new Up.Text('Anyway, none of that matters.')
        ])
      ]))
  })

  specify('Unordered lists', () => {
    const markup = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* I don't eat (^Or touch.) pumpkins.

* Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)

Anyway, none of that matters.`

    const footnotes = [
      new Up.Footnote([
        new Up.Text("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text("Or touch.")
      ], { referenceNumber: 2 }),
      new Up.Footnote([
        new Up.Text('This is not my line.')
      ], { referenceNumber: 3 }),
      new Up.Footnote([
        new Up.Text('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([

          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat cereal."),
              footnotes[0],
              new Up.Text(" Never have.")
            ]),
            new Up.Paragraph([
              new Up.Text("It's too expensive.")
            ])
          ]),

          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat"),
              footnotes[1],
              new Up.Text(" pumpkins.")
            ])
          ]),

          new Up.BulletedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.Text("Roses are red"),
                footnotes[2]
              ]),
              new Up.LineBlock.Line([
                new Up.Text("Violets are blue"),
                footnotes[3]
              ])
            ]),
          ])
        ]),

        new Up.FootnoteBlock(footnotes),

        new Up.Paragraph([
          new Up.Text('Anyway, none of that matters.')
        ])
      ]))
  })

  specify('Ordered lists', () => {
    const markup = `
1) I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

2) I don't eat (^Or touch.) pumpkins.

Anyway, none of that matters.`

    const footnotes = [
      new Up.Footnote([
        new Up.Text("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.NumberedList([
          new Up.NumberedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat cereal."),
              footnotes[0],
              new Up.Text(" Never have.")
            ]),
            new Up.Paragraph([
              new Up.Text("It's too expensive.")
            ])
          ], { ordinal: 1 }),
          new Up.NumberedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat"),
              footnotes[1],
              new Up.Text(" pumpkins.")
            ])
          ], { ordinal: 2 })
        ]),
        new Up.FootnoteBlock(footnotes),
        new Up.Paragraph([
          new Up.Text('Anyway, none of that matters.')
        ])
      ]))
  })

  specify('Blockquotes', () => {
    const markup = `
> I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
>
> Roses are red (^This is not my line.)
> Violets are blue (^Neither is this line. I think my mom made it up.)

Anyway, none of that matters.`

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text('Except for Mondays.')
      ], { referenceNumber: 2 }),
      new Up.Footnote([
        new Up.Text('This is not my line.')
      ], { referenceNumber: 3 }),
      new Up.Footnote([
        new Up.Text('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal."),
            footnotes[0],
            new Up.Text(" Never have."),
            footnotes[1]
          ]),
          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.Text("Roses are red"),
              footnotes[2],
            ]),
            new Up.LineBlock.Line([
              new Up.Text("Violets are blue"),
              footnotes[3]
            ])
          ]),
        ]),
        new Up.FootnoteBlock(footnotes),
        new Up.Paragraph([
          new Up.Text('Anyway, none of that matters.')
        ])
      ]))
  })

  specify('Description lists', () => {
    const markup = `
Bulbasaur
  A strange seed was planted on its back at birth. (^What happens to the creature if the seed is never planted?) The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade (^This probably wasn't a reference to the family of plants.)
  Ghost type moves.
  
Gary
  A young man with a great sense of smell. (^Or maybe Ash simply smelled really good.)
  
Anyway, none of that matters.`

    const footnotes = [
      new Up.Footnote([
        new Up.Text("What happens to the creature if the seed is never planted?")
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text("This probably wasn't a reference to the family of plants.")
      ], { referenceNumber: 2 }),
      new Up.Footnote([
        new Up.Text("Or maybe Ash simply smelled really good.")
      ], { referenceNumber: 3 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Bulbasaur')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('A strange seed was planted on its back at birth.'),
              footnotes[0],
              new Up.Text(' The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Confuse Ray')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Lick')]),
            new Up.DescriptionList.Item.Subject([
              new Up.Text('Night Shade'),
              footnotes[1]
            ])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('Ghost type moves.')
            ])
          ])),

          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Gary')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('A young man with a great sense of smell.'),
              footnotes[2]
            ])
          ]))
        ]),

        new Up.FootnoteBlock(footnotes),

        new Up.Paragraph([
          new Up.Text('Anyway, none of that matters.')
        ])
      ]))
  })

  context('Tabless:', () => {
    specify('Their header rows', () => {
      const markup = `
Table:

Game [^ Video game];  Release Date [^ Only the year]

Final Fantasy;        1987
Final Fantasy II;     1988

Anyway, none of that matters.`

      const gameFootnote = new Up.Footnote([
        new Up.Text('Video game')
      ], { referenceNumber: 1 })

      const releaseDateFootnote = new Up.Footnote([
        new Up.Text('Only the year')
      ], { referenceNumber: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game'), gameFootnote]),
              new Up.Table.Header.Cell([new Up.Text('Release Date'), releaseDateFootnote])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
                new Up.Table.Row.Cell([new Up.Text('1987')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
                new Up.Table.Row.Cell([new Up.Text('1988')])
              ])
            ]),

          new Up.FootnoteBlock([gameFootnote, releaseDateFootnote]),

          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ]))
    })

    specify("Their content rows", () => {
      const markup = `
Table:

Game [^ Video game];  Release Date [^ Only the year]

Final Fantasy;                                  1987
Final Fantasy II [^ Japan uses the numeral 2];  1988 [^ Almost 1989]

Anyway, none of that matters.`

      const headerGameFootnote = new Up.Footnote([
        new Up.Text('Video game')
      ], { referenceNumber: 1 })

      const headerReleaseDateFootnote = new Up.Footnote([
        new Up.Text('Only the year')
      ], { referenceNumber: 2 })

      const rowGameFootnote = new Up.Footnote([
        new Up.Text('Japan uses the numeral 2')
      ], { referenceNumber: 3 })

      const rowReleaseDateFootnote = new Up.Footnote([
        new Up.Text('Almost 1989')
      ], { referenceNumber: 4 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game'), headerGameFootnote]),
              new Up.Table.Header.Cell([new Up.Text('Release Date'), headerReleaseDateFootnote])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
                new Up.Table.Row.Cell([new Up.Text('1987')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy II'), rowGameFootnote]),
                new Up.Table.Row.Cell([new Up.Text('1988'), rowReleaseDateFootnote])
              ])
            ]),

          new Up.FootnoteBlock([
            headerGameFootnote,
            headerReleaseDateFootnote,
            rowGameFootnote,
            rowReleaseDateFootnote
          ]),

          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ]))
    })

    specify("Their captions", () => {
      const markup = `
Table: Final Fantasy [^ ファイナルファンタジ in Japan] in the 1980s [^ An old series!]

Game [^Video game];                             Release Date [^ Only the year]

Final Fantasy;                                  1987
Final Fantasy II [^ Japan uses the numeral 2];  1988 [^ Almost 1989]

Anyway, none of that matters.`

      const captionGameNameFootnote = new Up.Footnote([
        new Up.Text('ファイナルファンタジ in Japan')
      ], { referenceNumber: 1 })

      const captionDecadeFootnote = new Up.Footnote([
        new Up.Text('An old series!')
      ], { referenceNumber: 2 })

      const headerGameFootnote = new Up.Footnote([
        new Up.Text('Video game')
      ], { referenceNumber: 3 })

      const headerReleaseDateFootnote = new Up.Footnote([
        new Up.Text('Only the year')
      ], { referenceNumber: 4 })

      const rowGameFootnote = new Up.Footnote([
        new Up.Text('Japan uses the numeral 2')
      ], { referenceNumber: 5 })

      const rowReleaseDateFootnote = new Up.Footnote([
        new Up.Text('Almost 1989')
      ], { referenceNumber: 6 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game'), headerGameFootnote]),
              new Up.Table.Header.Cell([new Up.Text('Release Date'), headerReleaseDateFootnote])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
                new Up.Table.Row.Cell([new Up.Text('1987')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy II'), rowGameFootnote]),
                new Up.Table.Row.Cell([new Up.Text('1988'), rowReleaseDateFootnote])
              ])
            ],
            new Up.Table.Caption([
              new Up.Text('Final Fantasy'),
              captionGameNameFootnote,
              new Up.Text(' in the 1980s'),
              captionDecadeFootnote
            ])),

          new Up.FootnoteBlock([
            captionGameNameFootnote,
            captionDecadeFootnote,
            headerGameFootnote,
            headerReleaseDateFootnote,
            rowGameFootnote,
            rowReleaseDateFootnote
          ]),

          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ]))
    })

    specify("Their header column cells", () => {
      const markup = `
Table: Final Fantasy [^ ファイナルファンタジ in Japan] in the 1980s

                                                      Release Date [^ Only the year]

Final Fantasy;                                        1987 [^ Same year as Mega Man]
Final Fantasy II [^ Japan uses the numeral 2];        1988 [^ Almost 1989]

Anyway, none of that matters.`

      const captionFootnote = new Up.Footnote([
        new Up.Text('ファイナルファンタジ in Japan')
      ], { referenceNumber: 1 })

      const headerFootnote = new Up.Footnote([
        new Up.Text('Only the year')
      ], { referenceNumber: 2 })

      const firstRowFootnote = new Up.Footnote([
        new Up.Text('Same year as Mega Man')
      ], { referenceNumber: 3 })

      const secondRowHeaderCellFootnote = new Up.Footnote([
        new Up.Text('Japan uses the numeral 2')
      ], { referenceNumber: 4 })

      const secondRowFootnote = new Up.Footnote([
        new Up.Text('Almost 1989')
      ], { referenceNumber: 5 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date'), headerFootnote])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1987'), firstRowFootnote])
              ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1988'), secondRowFootnote])
              ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II'), secondRowHeaderCellFootnote]))
            ],
            new Up.Table.Caption([
              new Up.Text('Final Fantasy'),
              captionFootnote,
              new Up.Text(' in the 1980s')
            ])),

          new Up.FootnoteBlock([
            captionFootnote,
            headerFootnote,
            firstRowFootnote,
            secondRowHeaderCellFootnote,
            secondRowFootnote
          ]),

          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ]))
    })
  })
})


context('To prevent footnotes from "leaking" out of revealable blocks', () => {
  specify('footnote blocks are kept hidden-away inside them', () => {
    const markup = `
SPOILER:
  I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
 
  Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)

  Anyway, none of that matters.`

    const paragraphFootnotes = [
      new Up.Footnote([
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text('Except for Mondays.')
      ], { referenceNumber: 2 })
    ]

    const lineBlockFootnotes = [
      new Up.Footnote([
        new Up.Text('This is not my line.')
      ], { referenceNumber: 3 }),
      new Up.Footnote([
        new Up.Text('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal."),
            paragraphFootnotes[0],
            new Up.Text(" Never have."),
            paragraphFootnotes[1]
          ]),
          new Up.FootnoteBlock(paragraphFootnotes),
          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.Text("Roses are red"),
              lineBlockFootnotes[0],
            ]),
            new Up.LineBlock.Line([
              new Up.Text("Violets are blue"),
              lineBlockFootnotes[1]
            ])
          ]),
          new Up.FootnoteBlock(lineBlockFootnotes),
          new Up.Paragraph([
            new Up.Text('Anyway, none of that matters.')
          ])
        ])
      ]))
  })


  context('Within revealable blocks, when footnotes are nested inside 2 or more (inner) outline conventions', () => {
    specify("they get placed into footnote blocks after the outermost (inner) outline conventions", () => {
      const markup = `
SPOILER:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.
  
  Anyway, none of that matters.`

      const footnotes = [
        new Up.Footnote([
          new Up.Text("Well, I do, but I pretend not to.")
        ], { referenceNumber: 1 }),
        new Up.Footnote([
          new Up.Text("Or touch.")
        ], { referenceNumber: 2 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([

            new Up.BulletedList([
              new Up.BulletedList.Item([
                new Up.Paragraph([
                  new Up.Text("I don't eat cereal."),
                  footnotes[0],
                  new Up.Text(" Never have."),
                ]),
                new Up.Paragraph([
                  new Up.Text("It's too expensive.")
                ])
              ]),
              new Up.BulletedList.Item([
                new Up.Paragraph([
                  new Up.Text("I don't eat"),
                  footnotes[1],
                  new Up.Text(" pumpkins.")
                ])
              ])
            ]),

            new Up.FootnoteBlock(footnotes),

            new Up.Paragraph([
              new Up.Text('Anyway, none of that matters.')
            ])
          ])
        ]))
    })
  })
})


describe("Footnotes' reference numbers", () => {
  it('do not reset between outline conventions.', () => {
    const markup = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* I don't eat (^Or touch.) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const footnotesInUnorderedList = [
      new Up.Footnote([
        new Up.Text("Well, I do, but I pretend not to."),
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text("Or touch."),
      ], { referenceNumber: 2 })
    ]

    const footnoteInParagraph =
      new Up.Footnote([
        new Up.Text("It's actually been a dream of mine ever since I was young."),
      ], { referenceNumber: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat cereal."),
              footnotesInUnorderedList[0],
              new Up.Text(" Never have.")
            ]),
            new Up.Paragraph([
              new Up.Text("It's too expensive.")
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat"),
              footnotesInUnorderedList[1],
              new Up.Text(" pumpkins.")
            ])
          ])
        ]),
        new Up.FootnoteBlock(footnotesInUnorderedList),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text("I wear glasses"),
          footnoteInParagraph,
          new Up.Text(" even while working out."),
        ]),
        new Up.FootnoteBlock([footnoteInParagraph])
      ]))
  })
})


describe("Within an outline convention, a footnote within an (inner) revealable outline convention which follows a footnote before the (inner) revealable outline convention", () => {
  it("has a reference number greater than that of the preceding footnote, but it produces footnote block that appears before the preceding footnote's block", () => {
    const markup = `
* I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* SPOILER:
    I don't eat (^ Or touch.) pumpkins.

------------------------

I wear glasses (^ It's actually been a dream of mine ever since I was young.) even while working out.`

    const footnoteInUnorderedList = new Up.Footnote([
      new Up.Text("Well, I do, but I pretend not to.")
    ], { referenceNumber: 1 })

    const footnoteInSpoilerBlock = new Up.Footnote([
      new Up.Text("Or touch.")
    ], { referenceNumber: 2 })

    const footnoteAfterUnorderedList = new Up.Footnote([
      new Up.Text("It's actually been a dream of mine ever since I was young.")
    ], { referenceNumber: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text("I don't eat cereal."),
              footnoteInUnorderedList,
              new Up.Text(" Never have.")
            ]),
            new Up.Paragraph([
              new Up.Text("It's too expensive.")
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.RevealableBlock([
              new Up.Paragraph([
                new Up.Text("I don't eat"),
                footnoteInSpoilerBlock,
                new Up.Text(" pumpkins.")
              ]),
              new Up.FootnoteBlock([footnoteInSpoilerBlock])
            ])
          ])
        ]),
        new Up.FootnoteBlock([footnoteInUnorderedList]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text("I wear glasses"),
          footnoteAfterUnorderedList,
          new Up.Text(" even while working out."),
        ]),
        new Up.FootnoteBlock([footnoteAfterUnorderedList])
      ]))
  })
})


describe('Nesed footnotes (footnotes referenced by other footnotes)', () => {
  it('appear in their footnote block after any non-nested footnotes (and are assigned reference numbers after any non-nested footnotes)', () => {
    const markup = "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably.)"

    const footnoteInsideFirstFootnote = new Up.Footnote([
      new Up.Text('Well, I '),
      new Up.Emphasis([
        new Up.Text('do')
      ]),
      new Up.Text(', but I pretend not to.')
    ], { referenceNumber: 3 })

    const firstFootnote = new Up.Footnote([
      new Up.Text("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new Up.Text(" Never have.")
    ], { referenceNumber: 1 })

    const secondFootnote = new Up.Footnote([
      new Up.Text("Probably."),
    ], { referenceNumber: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Me? I'm totally normal."),
          firstFootnote,
          new Up.Text(" Really."),
          secondFootnote,
        ]),
        new Up.FootnoteBlock([
          firstFootnote,
          secondFootnote,
          footnoteInsideFirstFootnote
        ])
      ]))
  })

  it('appear in the footnote block after any lesser nested footnotes (and are assigned reference numbers after any lesser-nested footnotes)', () => {
    const markup =
      "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do* (^Only on Mondays...) but I pretend not to.) Never have. (^At least you've never seen me.)) Really. (^Probably.)"

    const footnoteInsideFirstInnerFootnote =
      new Up.Footnote([
        new Up.Text("Only on Mondays…"),
      ], { referenceNumber: 5 })

    const secondInnerFootnote = new Up.Footnote([
      new Up.Text("At least you've never seen me.")
    ], { referenceNumber: 4 })

    const firstInnerFootnote = new Up.Footnote([
      new Up.Text('Well, I '),
      new Up.Emphasis([
        new Up.Text('do'),
      ]),
      footnoteInsideFirstInnerFootnote,
      new Up.Text(' but I pretend not to.')
    ], { referenceNumber: 3 })

    const firstFootnote = new Up.Footnote([
      new Up.Text("That said, I don't eat cereal."),
      firstInnerFootnote,
      new Up.Text(" Never have."),
      secondInnerFootnote,
    ], { referenceNumber: 1 })

    const secondFootnote = new Up.Footnote([
      new Up.Text("Probably."),
    ], { referenceNumber: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Me? I'm totally normal."),
          firstFootnote,
          new Up.Text(" Really."),
          secondFootnote
        ]),
        new Up.FootnoteBlock([
          firstFootnote,
          secondFootnote,
          firstInnerFootnote,
          secondInnerFootnote,
          footnoteInsideFirstInnerFootnote
        ])
      ]))
  })

  it('have reference numbers coming before any footnotes in subsequent outline conventions (because they are referenced earlier)', () => {
    const markup = `
Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably.)

I don't eat (^Or touch.) pumpkins.`

    const footnoteInsideFirstFootnote = new Up.Footnote([
      new Up.Text('Well, I '),
      new Up.Emphasis([
        new Up.Text('do')
      ]),
      new Up.Text(', but I pretend not to.'),
    ], { referenceNumber: 3 })

    const firstFootnoteInFirstParagraph = new Up.Footnote([
      new Up.Text("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new Up.Text(" Never have.")
    ], { referenceNumber: 1 })

    const secondFootnoteInFirstParagraph = new Up.Footnote([
      new Up.Text("Probably.")
    ], { referenceNumber: 2 })

    const footnoteInSecondParagraph = new Up.Footnote([
      new Up.Text("Or touch.")
    ], { referenceNumber: 4 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Me? I'm totally normal."),
          firstFootnoteInFirstParagraph,
          new Up.Text(" Really."),
          secondFootnoteInFirstParagraph,
        ]),
        new Up.FootnoteBlock([
          firstFootnoteInFirstParagraph,
          secondFootnoteInFirstParagraph,
          footnoteInsideFirstFootnote
        ]),
        new Up.Paragraph([
          new Up.Text("I don't eat"),
          footnoteInSecondParagraph,
          new Up.Text(' pumpkins.')
        ]),
        new Up.FootnoteBlock([
          footnoteInSecondParagraph
        ])
      ]))
  })
})


describe("Within an outline convention, a nested footnote within an (inner) revealable block which follows a nested footnote before the (inner) revealable block", () => {
  it('has a reference number lower than that of the preceding nested footnote because it gets referenced in an earlier footnote block', () => {
    const markup = `
> I don't eat cereal. (^Well, I do, but I pretend [^On Mondays.] not to.) Never have.
>
>  It's too expensive.
>
> NSFL:
>   I don't eat (^Or touch. [^Or smell.]) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const nestedFootnoteInBlockquote = new Up.Footnote([
      new Up.Text("On Mondays.")
    ], { referenceNumber: 4 })

    const footnoteInBlockquote = new Up.Footnote([
      new Up.Text("Well, I do, but I pretend"),
      nestedFootnoteInBlockquote,
      new Up.Text(' not to.')
    ], { referenceNumber: 1 })

    const nestedFootnoteInRevealableBlock = new Up.Footnote([
      new Up.Text("Or smell.")
    ], { referenceNumber: 3 })

    const footnoteInRevealableBlock = new Up.Footnote([
      new Up.Text("Or touch."),
      nestedFootnoteInRevealableBlock
    ], { referenceNumber: 2 })

    const footnoteAfterBlockquote = new Up.Footnote([
      new Up.Text("It's actually been a dream of mine ever since I was young.")
    ], { referenceNumber: 5 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          new Up.Paragraph([
            new Up.Text("I don't eat cereal."),
            footnoteInBlockquote,
            new Up.Text(" Never have.")
          ]),
          new Up.Paragraph([
            new Up.Text("It's too expensive.")
          ]),
          new Up.RevealableBlock([
            new Up.Paragraph([
              new Up.Text("I don't eat"),
              footnoteInRevealableBlock,
              new Up.Text(" pumpkins.")
            ]),
            new Up.FootnoteBlock([
              footnoteInRevealableBlock,
              nestedFootnoteInRevealableBlock
            ])
          ])
        ]),
        new Up.FootnoteBlock([
          footnoteInBlockquote,
          nestedFootnoteInBlockquote
        ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text("I wear glasses"),
          footnoteAfterBlockquote,
          new Up.Text(" even while working out.")
        ]),
        new Up.FootnoteBlock([footnoteAfterBlockquote])
      ]))
  })
})
