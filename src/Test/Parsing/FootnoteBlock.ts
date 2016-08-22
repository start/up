import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { OutlineSeparator } from '../../SyntaxNodes/OutlineSeparator'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { Table } from '../../SyntaxNodes/Table'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'


describe('A footnote in a paragph', () => {
  it("produces a footnote block node after the paragraph", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have.")
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A paragraph with two footnotes', () => {
  it("produces a single footnote block node after the paragraph for both footnotes", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)"

    const footnotes = [
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText('Except for Mondays.')
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnotes[0],
          new PlainText(" Never have."),
          footnotes[1]
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('Footnotes in a heading', () => {
  it('produce a footnote block after the heading', () => {
    const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
--------------------------------------------------------------------`

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    const heading =
      new Heading([
        new PlainText("I don't eat cereal."),
        footnote,
        new PlainText(" Never have.")
      ], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new FootnoteBlock([
          footnote
        ])
      ], new UpDocument.TableOfContents([heading])))
  })
})


describe('Footnotes in a line block', () => {
  it('produce a footnote block after the line block', () => {
    const markup = `
Roses are red (^This is not my line.)
Violets are blue (^Neither is this line. I think my mom made it up.)`

    const footnotes = [
      new Footnote([
        new PlainText('This is not my line.')
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText("Roses are red"),
            footnotes[0],
          ]),
          new LineBlock.Line([
            new PlainText("Violets are blue"),
            footnotes[1]
          ])
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('Footnotes in unordered list items', () => {
  it('produce a footnote block that appears after the entire list', () => {
    const markup = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* I don't eat (^Or touch.) pumpkins.

* Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)`

    const footnotes = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 }),
      new Footnote([
        new PlainText('This is not my line.')
      ], { referenceNumber: 3 }),
      new Footnote([
        new PlainText('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([

          new UnorderedList.Item([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              footnotes[0],
              new PlainText(" Never have.")
            ]),
            new Paragraph([
              new PlainText("It's too expensive.")
            ])
          ]),

          new UnorderedList.Item([
            new Paragraph([
              new PlainText("I don't eat"),
              footnotes[1],
              new PlainText(" pumpkins.")
            ])
          ]),

          new UnorderedList.Item([
            new LineBlock([
              new LineBlock.Line([
                new PlainText("Roses are red"),
                footnotes[2]
              ]),
              new LineBlock.Line([
                new PlainText("Violets are blue"),
                footnotes[3]
              ])
            ]),
          ])
        ]),

        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('Footnotes in a blockquote', () => {
  it('produce footnote blocks within the blockquote', () => {
    const markup = "> I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

    const footnote =
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Blockquote([
          new Paragraph([
            new PlainText("I don't eat cereal."),
            footnote,
            new PlainText(" Never have.")
          ]),
          new FootnoteBlock([footnote])
        ])
      ]))
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a blockquote', () => {
  it("produce footnote blocks inside the blockquote after all the appropriate outline conventions", () => {
    const markup = `
> * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
>
>   It's too expensive.
>
> * I don't eat (^Or touch.) pumpkins.`

    const footnotes = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Blockquote([

          new UnorderedList([

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat cereal."),
                footnotes[0],
                new PlainText(" Never have.")
              ]),
              new Paragraph([
                new PlainText("It's too expensive.")
              ])
            ]),

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat"),
                footnotes[1],
                new PlainText(" pumpkins.")
              ])
            ])

          ]),

          new FootnoteBlock(footnotes)

        ])
      ]))
  })
})


describe('Footnotes in a spoiler block', () => {
  it('produce footnote blocks within the spoiler block', () => {
    const markup = `
SPOILER:

  This ruins the movie. [^ And this is a fun fact.]`

    const footnote =
      new Footnote([
        new PlainText("And this is a fun fact.")
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlock([
          new Paragraph([
            new PlainText("This ruins the movie."),
            footnote,
          ]),
          new FootnoteBlock([footnote])
        ])
      ]))
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a spoiler block', () => {
  it("produce footnote blocks inside the spoiler block after all the appropriate outline conventions", () => {
    const markup = `
SPOILER:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.`

    const footnotes = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new SpoilerBlock([

          new UnorderedList([

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat cereal."),
                footnotes[0],
                new PlainText(" Never have."),
              ]),
              new Paragraph([
                new PlainText("It's too expensive.")
              ])
            ]),

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat"),
                footnotes[1],
                new PlainText(" pumpkins.")
              ])
            ])

          ]),

          new FootnoteBlock(footnotes)

        ])
      ]))
  })
})


describe('Footnotes in a NSFW block', () => {
  it('produce footnote blocks within the NSFW block', () => {
    const markup = `
NSFW:

  This ruins the movie. [^ And this is a fun fact.]`

    const footnote =
      new Footnote([
        new PlainText("And this is a fun fact.")
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsfwBlock([
          new Paragraph([
            new PlainText("This ruins the movie."),
            footnote,
          ]),
          new FootnoteBlock([footnote])
        ])
      ]))
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a NSFW block', () => {
  it("produce footnote blocks inside the NSFW block after all the appropriate outline conventions", () => {
    const markup = `
NSFW:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.`

    const footnotes = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsfwBlock([

          new UnorderedList([

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat cereal."),
                footnotes[0],
                new PlainText(" Never have."),
              ]),
              new Paragraph([
                new PlainText("It's too expensive.")
              ])
            ]),

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat"),
                footnotes[1],
                new PlainText(" pumpkins.")
              ])
            ])

          ]),

          new FootnoteBlock(footnotes)

        ])
      ]))
  })
})


describe('Footnotes in a NSFL block', () => {
  it('produce footnote blocks within the NSFL block', () => {
    const markup = `
NSFL:

  This ruins the movie. [^ And this is a fun fact.]`

    const footnote =
      new Footnote([
        new PlainText("And this is a fun fact.")
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsflBlock([
          new Paragraph([
            new PlainText("This ruins the movie."),
            footnote,
          ]),
          new FootnoteBlock([footnote])
        ])
      ]))
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a NSFL block', () => {
  it("produce footnote blocks inside the NSFL block after all the appropriate outline conventions", () => {
    const markup = `
NSFL:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.`

    const footnotes = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new NsflBlock([

          new UnorderedList([

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat cereal."),
                footnotes[0],
                new PlainText(" Never have.")
              ]),
              new Paragraph([
                new PlainText("It's too expensive.")
              ])
            ]),

            new UnorderedList.Item([
              new Paragraph([
                new PlainText("I don't eat"),
                footnotes[1],
                new PlainText(" pumpkins.")
              ])
            ])

          ]),

          new FootnoteBlock(footnotes)

        ])
      ]))
  })
})


describe('Footnotes in a table header', () => {
  specify('are placed into a footnote block after the table', () => {
    const markup = `
Table:

Game;               Release Date [^ Only the year]

Final Fantasy;      1987
Final Fantasy II;   1988`

    const footnote = new Footnote([
      new PlainText('Only the year')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date'), footnote])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('1988')])
            ])
          ]),

        new FootnoteBlock([footnote])
      ]))
  })
})


describe('Footnotes in a table row', () => {
  specify("are placed into a footnote block after the table (after any footnotes in the table's header)", () => {
    const markup = `
Table:

Game;               Release Date [^ Only the year]

Final Fantasy;      1987
Final Fantasy II;   1988 [^ Almost 1989]`

    const headerFootnote = new Footnote([
      new PlainText('Only the year')
    ], { referenceNumber: 1 })

    const rowFootnote = new Footnote([
      new PlainText('Almost 1989')
    ], { referenceNumber: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date'), headerFootnote])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('1988'), rowFootnote])
            ])
          ]),

        new FootnoteBlock([
          headerFootnote,
          rowFootnote
        ])
      ]))
  })
})


describe('Footnotes in a table caption', () => {
  specify("are placed into a footnote block after the table (before any footnotes in the table's header and rows)", () => {
    const markup = `
Table: Final Fantasy [^ ファイナルファンタジ in Japan] in the 1980s

Game;               Release Date [^ Only the year]

Final Fantasy;      1987
Final Fantasy II;   1988 [^ Almost 1989]`

    const captionFootnote = new Footnote([
      new PlainText('ファイナルファンタジ in Japan')
    ], { referenceNumber: 1 })

    const headerFootnote = new Footnote([
      new PlainText('Only the year')
    ], { referenceNumber: 2 })

    const rowFootnote = new Footnote([
      new PlainText('Almost 1989')
    ], { referenceNumber: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date'), headerFootnote])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('1988'), rowFootnote])
            ])
          ],
          new Table.Caption([
            new PlainText('Final Fantasy'),
            captionFootnote,
            new PlainText(' in the 1980s')
          ])),

        new FootnoteBlock([
          captionFootnote,
          headerFootnote,
          rowFootnote
        ])
      ]))
  })
})


describe("Footnotes in a chart's row header cell", () => {
  specify("are placed into a footnote block after the table (before footnotes in the same row and after footnotes in previous rows)", () => {
    const markup = `
Chart: Final Fantasy [^ ファイナルファンタジ in Japan] in the 1980s

                                                      Release Date [^ Only the year]

Final Fantasy;                                        1987 [^ Same year as Mega Man]
Final Fantasy II [^ Japan uses the numeral 2];        1988 [^ Almost 1989]`

    const captionFootnote = new Footnote([
      new PlainText('ファイナルファンタジ in Japan')
    ], { referenceNumber: 1 })

    const headerFootnote = new Footnote([
      new PlainText('Only the year')
    ], { referenceNumber: 2 })

    const firstRowFootnote = new Footnote([
      new PlainText('Same year as Mega Man')
    ], { referenceNumber: 3 })

    const secondRowHeaderCellFootnote = new Footnote([
      new PlainText('Japan uses the numeral 2')
    ], { referenceNumber: 4 })

    const secondRowFootnote = new Footnote([
      new PlainText('Almost 1989')
    ], { referenceNumber: 5 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date'), headerFootnote])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987'), firstRowFootnote])
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1988'), secondRowFootnote])
            ], new Table.Header.Cell([new PlainText('Final Fantasy II'), secondRowHeaderCellFootnote]))
          ],
          new Table.Caption([
            new PlainText('Final Fantasy'),
            captionFootnote,
            new PlainText(' in the 1980s')
          ])),

        new FootnoteBlock([
          captionFootnote,
          headerFootnote,
          firstRowFootnote,
          secondRowHeaderCellFootnote,
          secondRowFootnote
        ])
      ]))
  })
})


describe('Footnotes in ordered list items', () => {
  it('produce a footnote block that appears after the entire list', () => {
    const markup = `
1) I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

2) I don't eat (^Or touch.) pumpkins.`

    const footnotes = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              footnotes[0],
              new PlainText(" Never have.")
            ]),
            new Paragraph([
              new PlainText("It's too expensive.")
            ])
          ], { ordinal: 1 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText("I don't eat"),
              footnotes[1],
              new PlainText(" pumpkins.")
            ])
          ], { ordinal: 2 })
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('Footnotes in description list terms and definitions', () => {
  it('produce a footnote block that appears after the entire description list', () => {
    const markup = `
Bulbasaur
  A strange seed was planted on its back at birth. (^What happens to the creature if the seed is never planted?) The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade (^This probably wasn't a reference to the family of plants.)
  Ghost type moves.
  
Gary
  A young man with a great sense of smell. (^Or maybe Ash simply smelled really good.)`

    const footnotes = [
      new Footnote([
        new PlainText("What happens to the creature if the seed is never planted?")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("This probably wasn't a reference to the family of plants.")
      ], { referenceNumber: 2 }),
      new Footnote([
        new PlainText("Or maybe Ash simply smelled really good.")
      ], { referenceNumber: 3 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Term([new PlainText('Bulbasaur')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A strange seed was planted on its back at birth.'),
              footnotes[0],
              new PlainText(' The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Term([new PlainText('Confuse Ray')]),
            new DescriptionList.Item.Term([new PlainText('Lick')]),
            new DescriptionList.Item.Term([
              new PlainText('Night Shade'),
              footnotes[1]
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Ghost type moves.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Term([new PlainText('Gary')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A young man with a great sense of smell.'),
              footnotes[2]
            ])
          ]))
        ]),

        new FootnoteBlock(footnotes)
      ]))
  })
})


describe("In a document, footnotes' reference numbers", () => {
  it('do not reset between outline conventions.', () => {
    const markup = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* I don't eat (^Or touch.) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const footnotesInUnorderedList = [
      new Footnote([
        new PlainText("Well, I do, but I pretend not to."),
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch."),
      ], { referenceNumber: 2 })
    ]

    const footnoteInParagraph =
      new Footnote([
        new PlainText("It's actually been a dream of mine ever since I was young."),
      ], { referenceNumber: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              footnotesInUnorderedList[0],
              new PlainText(" Never have.")
            ]),
            new Paragraph([
              new PlainText("It's too expensive.")
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText("I don't eat"),
              footnotesInUnorderedList[1],
              new PlainText(" pumpkins.")
            ])
          ])
        ]),
        new FootnoteBlock(footnotesInUnorderedList),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText("I wear glasses"),
          footnoteInParagraph,
          new PlainText(" even while working out."),
        ]),
        new FootnoteBlock([footnoteInParagraph])
      ]))
  })
})


describe("Within an outline convention, a blockquoted footnote that follows a non-blockquoted footnote", () => {
  it('has a reference number greater than that of the preceding footnote (inside the same outline convention), but it produces footnote block that appears before the footnote block of the preceding footnote', () => {
    const markup = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* > I don't eat (^Or touch.) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const footnoteInUnorderedList = new Footnote([
      new PlainText("Well, I do, but I pretend not to.")
    ], { referenceNumber: 1 })

    const footnoteInBlockquote = new Footnote([
      new PlainText("Or touch.")
    ], { referenceNumber: 2 })

    const footnoteInParagraph = new Footnote([
      new PlainText("It's actually been a dream of mine ever since I was young.")
    ], { referenceNumber: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              footnoteInUnorderedList,
              new PlainText(" Never have.")
            ]),
            new Paragraph([
              new PlainText("It's too expensive.")
            ])
          ]),
          new UnorderedList.Item([
            new Blockquote([
              new Paragraph([
                new PlainText("I don't eat"),
                footnoteInBlockquote,
                new PlainText(" pumpkins.")
              ]),
              new FootnoteBlock([footnoteInBlockquote])
            ])
          ])
        ]),
        new FootnoteBlock([footnoteInUnorderedList]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText("I wear glasses"),
          footnoteInParagraph,
          new PlainText(" even while working out."),
        ]),
        new FootnoteBlock([footnoteInParagraph])
      ]))
  })
})


describe("Within an outline convention, a blockquoted nested footnote that follows a non-blockquoted nested footnote", () => {
  it('has a reference number lower than that of the preceding nested footnote (inside the same outline convention) because it gets referenced in an earlier footnote block', () => {
    const markup = `
* I don't eat cereal. (^Well, I do, but I pretend [^On Mondays.] not to.) Never have.

  It's too expensive.

* > I don't eat (^Or touch. [^Or smell.]) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const nestedFootnoteInUnorderedList = new Footnote([
      new PlainText("On Mondays.")
    ], { referenceNumber: 4 })

    const footnoteInUnorderedList = new Footnote([
      new PlainText("Well, I do, but I pretend"),
      nestedFootnoteInUnorderedList,
      new PlainText(' not to.')
    ], { referenceNumber: 1 })

    const nestedFootnoteInBlockquote = new Footnote([
      new PlainText("Or smell.")
    ], { referenceNumber: 3 })

    const footnoteInBlockquote = new Footnote([
      new PlainText("Or touch."),
      nestedFootnoteInBlockquote
    ], { referenceNumber: 2 })

    const footnoteInParagraph = new Footnote([
      new PlainText("It's actually been a dream of mine ever since I was young.")
    ], { referenceNumber: 5 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              footnoteInUnorderedList,
              new PlainText(" Never have.")
            ]),
            new Paragraph([
              new PlainText("It's too expensive.")
            ])
          ]),
          new UnorderedList.Item([
            new Blockquote([
              new Paragraph([
                new PlainText("I don't eat"),
                footnoteInBlockquote,
                new PlainText(" pumpkins.")
              ]),
              new FootnoteBlock([
                footnoteInBlockquote,
                nestedFootnoteInBlockquote
              ])
            ])
          ])
        ]),
        new FootnoteBlock([
          footnoteInUnorderedList,
          nestedFootnoteInUnorderedList
        ]),
        new OutlineSeparator(),
        new Paragraph([
          new PlainText("I wear glasses"),
          footnoteInParagraph,
          new PlainText(" even while working out.")
        ]),
        new FootnoteBlock([footnoteInParagraph])
      ]))
  })
})


describe('Nesed footnotes (footnotes referenced by other footnotes)', () => {
  it('appear in their footnote block after any non-nested footnotes (and are assigned reference numbers after any non-nested footnotes)', () => {
    const markup = "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably.)"

    const footnoteInsideFirstFootnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.')
    ], { referenceNumber: 3 })

    const firstFootnote = new Footnote([
      new PlainText("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new PlainText(" Never have.")
    ], { referenceNumber: 1 })

    const secondFootnote = new Footnote([
      new PlainText("Probably."),
    ], { referenceNumber: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("Me? I'm totally normal."),
          firstFootnote,
          new PlainText(" Really."),
          secondFootnote,
        ]),
        new FootnoteBlock([
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
      new Footnote([
        new PlainText("Only on Mondays..."),
      ], { referenceNumber: 5 })

    const secondInnerFootnote = new Footnote([
      new PlainText("At least you've never seen me.")
    ], { referenceNumber: 4 })

    const firstInnerFootnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do'),
      ]),
      footnoteInsideFirstInnerFootnote,
      new PlainText(' but I pretend not to.')
    ], { referenceNumber: 3 })

    const firstFootnote = new Footnote([
      new PlainText("That said, I don't eat cereal."),
      firstInnerFootnote,
      new PlainText(" Never have."),
      secondInnerFootnote,
    ], { referenceNumber: 1 })

    const secondFootnote = new Footnote([
      new PlainText("Probably."),
    ], { referenceNumber: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("Me? I'm totally normal."),
          firstFootnote,
          new PlainText(" Really."),
          secondFootnote
        ]),
        new FootnoteBlock([
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

    const footnoteInsideFirstFootnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.'),
    ], { referenceNumber: 3 })

    const firstFootnoteInFirstParagraph = new Footnote([
      new PlainText("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new PlainText(" Never have.")
    ], { referenceNumber: 1 })

    const secondFootnoteInFirstParagraph = new Footnote([
      new PlainText("Probably.")
    ], { referenceNumber: 2 })

    const footnoteInSecondParagraph = new Footnote([
      new PlainText("Or touch.")
    ], { referenceNumber: 4 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("Me? I'm totally normal."),
          firstFootnoteInFirstParagraph,
          new PlainText(" Really."),
          secondFootnoteInFirstParagraph,
        ]),
        new FootnoteBlock([
          firstFootnoteInFirstParagraph,
          secondFootnoteInFirstParagraph,
          footnoteInsideFirstFootnote
        ]),
        new Paragraph([
          new PlainText("I don't eat"),
          footnoteInSecondParagraph,
          new PlainText(' pumpkins.')
        ]),
        new FootnoteBlock([
          footnoteInSecondParagraph
        ])
      ]))
  })
})
