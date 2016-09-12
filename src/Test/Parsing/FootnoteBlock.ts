import { expect } from 'chai'
import { Up } from '../../Up'
import { Document } from '../../SyntaxNodes/Document'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { Table } from '../../SyntaxNodes/Table'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'


context('Within most top-level outline conventions, footnotes produce a footnote block appearing after that convention. Specifically:', () => {
  context('Paragraphs:', () => {
    specify("With one footnote", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
        
Anyway, none of that matters.`

      const footnote = new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Paragraph([
            new PlainText("I don't eat cereal."),
            footnote,
            new PlainText(" Never have.")
          ]),
          new FootnoteBlock([footnote]),
          new Paragraph([
            new PlainText('Anyway, none of that matters.')
          ])
        ]))
    })

    specify("With multiple footnotes", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)

Anyway, none of that matters.`

      const footnotes = [
        new Footnote([
          new PlainText('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Paragraph([
            new PlainText("I don't eat cereal."),
            footnotes[0],
            new PlainText(" Never have."),
            footnotes[1]
          ]),
          new FootnoteBlock(footnotes),
          new Paragraph([
            new PlainText('Anyway, none of that matters.')
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

      const footnote = new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

      const heading = new Heading([
        new PlainText("I don't eat cereal."),
        footnote,
        new PlainText(" Never have.")
      ], { level: 1, ordinalInTableOfContents: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          heading,
          new FootnoteBlock([footnote]),
          new Paragraph([
            new PlainText('Anyway, none of that matters.')
          ])
        ], new Document.TableOfContents([heading])))
    })

    specify("With multiple footnotes", () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
================

Anyway, none of that matters.`

      const footnotes = [
        new Footnote([
          new PlainText('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      const heading = new Heading([
        new PlainText("I don't eat cereal."),
        footnotes[0],
        new PlainText(" Never have."),
        footnotes[1]
      ], { level: 1, ordinalInTableOfContents: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          heading,
          new FootnoteBlock(footnotes),
          new Paragraph([
            new PlainText('Anyway, none of that matters.')
          ])
        ], new Document.TableOfContents([heading])))
    })
  })


  specify('Line blocks', () => {
    const markup = `
Roses are red (^This is not my line.)
Violets are blue (^Neither is this line. I think my mom made it up.)

Anyway, none of that matters.`

    const footnotes = [
      new Footnote([
        new PlainText('This is not my line.')
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
        new FootnoteBlock(footnotes),
        new Paragraph([
          new PlainText('Anyway, none of that matters.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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

        new FootnoteBlock(footnotes),

        new Paragraph([
          new PlainText('Anyway, none of that matters.')
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
      new Footnote([
        new PlainText("Well, I do, but I pretend not to.")
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText("Or touch.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
        new FootnoteBlock(footnotes),
        new Paragraph([
          new PlainText('Anyway, none of that matters.')
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
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Footnote([
        new PlainText('Except for Mondays.')
      ], { referenceNumber: 2 }),
      new Footnote([
        new PlainText('This is not my line.')
      ], { referenceNumber: 3 }),
      new Footnote([
        new PlainText('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText("I don't eat cereal."),
            footnotes[0],
            new PlainText(" Never have."),
            footnotes[1]
          ]),
          new LineBlock([
            new LineBlock.Line([
              new PlainText("Roses are red"),
              footnotes[2],
            ]),
            new LineBlock.Line([
              new PlainText("Violets are blue"),
              footnotes[3]
            ])
          ]),
        ]),
        new FootnoteBlock(footnotes),
        new Paragraph([
          new PlainText('Anyway, none of that matters.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Bulbasaur')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A strange seed was planted on its back at birth.'),
              footnotes[0],
              new PlainText(' The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Confuse Ray')]),
            new DescriptionList.Item.Subject([new PlainText('Lick')]),
            new DescriptionList.Item.Subject([
              new PlainText('Night Shade'),
              footnotes[1]
            ])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Ghost type moves.')
            ])
          ])),

          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Gary')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('A young man with a great sense of smell.'),
              footnotes[2]
            ])
          ]))
        ]),

        new FootnoteBlock(footnotes),

        new Paragraph([
          new PlainText('Anyway, none of that matters.')
        ])
      ]))
  })

  context('Tables and charts:', () => {
    specify('Their header rows', () => {
      const markup = `
Table:

Game [^ Video game];  Release Date [^ Only the year]

Final Fantasy;        1987
Final Fantasy II;     1988

Anyway, none of that matters.`

      const gameFootnote = new Footnote([
        new PlainText('Video game')
      ], { referenceNumber: 1 })

      const releaseDateFootnote = new Footnote([
        new PlainText('Only the year')
      ], { referenceNumber: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game'), gameFootnote]),
              new Table.Header.Cell([new PlainText('Release Date'), releaseDateFootnote])
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

          new FootnoteBlock([gameFootnote, releaseDateFootnote]),

          new Paragraph([
            new PlainText('Anyway, none of that matters.')
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

      const headerGameFootnote = new Footnote([
        new PlainText('Video game')
      ], { referenceNumber: 1 })

      const headerReleaseDateFootnote = new Footnote([
        new PlainText('Only the year')
      ], { referenceNumber: 2 })

      const rowGameFootnote = new Footnote([
        new PlainText('Japan uses the numeral 2')
      ], { referenceNumber: 3 })

      const rowReleaseDateFootnote = new Footnote([
        new PlainText('Almost 1989')
      ], { referenceNumber: 4 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game'), headerGameFootnote]),
              new Table.Header.Cell([new PlainText('Release Date'), headerReleaseDateFootnote])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Final Fantasy')]),
                new Table.Row.Cell([new PlainText('1987')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Final Fantasy II'), rowGameFootnote]),
                new Table.Row.Cell([new PlainText('1988'), rowReleaseDateFootnote])
              ])
            ]),

          new FootnoteBlock([
            headerGameFootnote,
            headerReleaseDateFootnote,
            rowGameFootnote,
            rowReleaseDateFootnote
          ]),

          new Paragraph([
            new PlainText('Anyway, none of that matters.')
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

      const captionGameNameFootnote = new Footnote([
        new PlainText('ファイナルファンタジ in Japan')
      ], { referenceNumber: 1 })

      const captionDecadeFootnote = new Footnote([
        new PlainText('An old series!')
      ], { referenceNumber: 2 })

      const headerGameFootnote = new Footnote([
        new PlainText('Video game')
      ], { referenceNumber: 3 })

      const headerReleaseDateFootnote = new Footnote([
        new PlainText('Only the year')
      ], { referenceNumber: 4 })

      const rowGameFootnote = new Footnote([
        new PlainText('Japan uses the numeral 2')
      ], { referenceNumber: 5 })

      const rowReleaseDateFootnote = new Footnote([
        new PlainText('Almost 1989')
      ], { referenceNumber: 6 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game'), headerGameFootnote]),
              new Table.Header.Cell([new PlainText('Release Date'), headerReleaseDateFootnote])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Final Fantasy')]),
                new Table.Row.Cell([new PlainText('1987')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Final Fantasy II'), rowGameFootnote]),
                new Table.Row.Cell([new PlainText('1988'), rowReleaseDateFootnote])
              ])
            ],
            new Table.Caption([
              new PlainText('Final Fantasy'),
              captionGameNameFootnote,
              new PlainText(' in the 1980s'),
              captionDecadeFootnote
            ])),

          new FootnoteBlock([
            captionGameNameFootnote,
            captionDecadeFootnote,
            headerGameFootnote,
            headerReleaseDateFootnote,
            rowGameFootnote,
            rowReleaseDateFootnote
          ]),

          new Paragraph([
            new PlainText('Anyway, none of that matters.')
          ])
        ]))
    })

    specify("Their content row header cells (for charts only)", () => {
      const markup = `
Chart: Final Fantasy [^ ファイナルファンタジ in Japan] in the 1980s

                                                      Release Date [^ Only the year]

Final Fantasy;                                        1987 [^ Same year as Mega Man]
Final Fantasy II [^ Japan uses the numeral 2];        1988 [^ Almost 1989]

Anyway, none of that matters.`

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

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
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
          ]),

          new Paragraph([
            new PlainText('Anyway, none of that matters.')
          ])
        ]))
    })
  })
})


context('To prevent footnotes from "leaking" out of revealable outline conventions, footnote blocks are kept hidden-away inside them. Revealable outline conventions are basically treated as mini-documents.', () => {
  context('Specifically:', () => {
    specify('Spoiler blocks', () => {
      const markup = `
SPOILER:
  I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
 
  Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)

  Anyway, none of that matters.`

      const paragraphFootnotes = [
        new Footnote([
          new PlainText('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      const lineBlockFootnotes = [
        new Footnote([
          new PlainText('This is not my line.')
        ], { referenceNumber: 3 }),
        new Footnote([
          new PlainText('Neither is this line. I think my mom made it up.')
        ], { referenceNumber: 4 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new SpoilerBlock([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              paragraphFootnotes[0],
              new PlainText(" Never have."),
              paragraphFootnotes[1]
            ]),
            new FootnoteBlock(paragraphFootnotes),
            new LineBlock([
              new LineBlock.Line([
                new PlainText("Roses are red"),
                lineBlockFootnotes[0],
              ]),
              new LineBlock.Line([
                new PlainText("Violets are blue"),
                lineBlockFootnotes[1]
              ])
            ]),
            new FootnoteBlock(lineBlockFootnotes),
            new Paragraph([
              new PlainText('Anyway, none of that matters.')
            ])
          ])
        ]))
    })

    specify('NSFW blocks', () => {
      const markup = `
NSFW:
  I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
 
  Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)

  Anyway, none of that matters.`

      const paragraphFootnotes = [
        new Footnote([
          new PlainText('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      const lineBlockFootnotes = [
        new Footnote([
          new PlainText('This is not my line.')
        ], { referenceNumber: 3 }),
        new Footnote([
          new PlainText('Neither is this line. I think my mom made it up.')
        ], { referenceNumber: 4 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new NsfwBlock([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              paragraphFootnotes[0],
              new PlainText(" Never have."),
              paragraphFootnotes[1]
            ]),
            new FootnoteBlock(paragraphFootnotes),
            new LineBlock([
              new LineBlock.Line([
                new PlainText("Roses are red"),
                lineBlockFootnotes[0],
              ]),
              new LineBlock.Line([
                new PlainText("Violets are blue"),
                lineBlockFootnotes[1]
              ])
            ]),
            new FootnoteBlock(lineBlockFootnotes),
            new Paragraph([
              new PlainText('Anyway, none of that matters.')
            ]),
          ]),
        ]))
    })

    specify('NSFL blocks', () => {
      const markup = `
NSFL:
  I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)
 
  Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)

  Anyway, none of that matters.`

      const paragraphFootnotes = [
        new Footnote([
          new PlainText('Well, I do, but I pretend not to.')
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText('Except for Mondays.')
        ], { referenceNumber: 2 })
      ]

      const lineBlockFootnotes = [
        new Footnote([
          new PlainText('This is not my line.')
        ], { referenceNumber: 3 }),
        new Footnote([
          new PlainText('Neither is this line. I think my mom made it up.')
        ], { referenceNumber: 4 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new NsflBlock([
            new Paragraph([
              new PlainText("I don't eat cereal."),
              paragraphFootnotes[0],
              new PlainText(" Never have."),
              paragraphFootnotes[1]
            ]),
            new FootnoteBlock(paragraphFootnotes),
            new LineBlock([
              new LineBlock.Line([
                new PlainText("Roses are red"),
                lineBlockFootnotes[0],
              ]),
              new LineBlock.Line([
                new PlainText("Violets are blue"),
                lineBlockFootnotes[1]
              ])
            ]),
            new FootnoteBlock(lineBlockFootnotes),
            new Paragraph([
              new PlainText('Anyway, none of that matters.')
            ]),
          ]),
        ]))
    })
  })


  context('Within revealable outline conventions, when footnotes are nested inside 2 or more (inner) outline conventions, they get placed into footnote blocks after the outermost (inner) outline conventions. Specifically:', () => {
    specify("Spoiler blocks", () => {
      const markup = `
SPOILER:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.
  
  Anyway, none of that matters.`

      const footnotes = [
        new Footnote([
          new PlainText("Well, I do, but I pretend not to.")
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText("Or touch.")
        ], { referenceNumber: 2 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
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

            new FootnoteBlock(footnotes),

            new Paragraph([
              new PlainText('Anyway, none of that matters.')
            ])
          ])
        ]))
    })

    specify("NSFW blocks", () => {
      const markup = `
NSFW:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.
  
  Anyway, none of that matters.`

      const footnotes = [
        new Footnote([
          new PlainText("Well, I do, but I pretend not to.")
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText("Or touch.")
        ], { referenceNumber: 2 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
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

            new FootnoteBlock(footnotes),

            new Paragraph([
              new PlainText('Anyway, none of that matters.')
            ])
          ])
        ]))
    })

    specify("NSFL blocks", () => {
      const markup = `
NSFL:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.
  
  Anyway, none of that matters.`

      const footnotes = [
        new Footnote([
          new PlainText("Well, I do, but I pretend not to.")
        ], { referenceNumber: 1 }),
        new Footnote([
          new PlainText("Or touch.")
        ], { referenceNumber: 2 })
      ]

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new NsflBlock([

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

            new FootnoteBlock(footnotes),

            new Paragraph([
              new PlainText('Anyway, none of that matters.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
        new ThematicBreak(),
        new Paragraph([
          new PlainText("I wear glasses"),
          footnoteInParagraph,
          new PlainText(" even while working out."),
        ]),
        new FootnoteBlock([footnoteInParagraph])
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

    const footnoteInUnorderedList = new Footnote([
      new PlainText("Well, I do, but I pretend not to.")
    ], { referenceNumber: 1 })

    const footnoteInSpoilerBlock = new Footnote([
      new PlainText("Or touch.")
    ], { referenceNumber: 2 })

    const footnoteAfterUnorderedList = new Footnote([
      new PlainText("It's actually been a dream of mine ever since I was young.")
    ], { referenceNumber: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
            new SpoilerBlock([
              new Paragraph([
                new PlainText("I don't eat"),
                footnoteInSpoilerBlock,
                new PlainText(" pumpkins.")
              ]),
              new FootnoteBlock([footnoteInSpoilerBlock])
            ])
          ])
        ]),
        new FootnoteBlock([footnoteInUnorderedList]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText("I wear glasses"),
          footnoteAfterUnorderedList,
          new PlainText(" even while working out."),
        ]),
        new FootnoteBlock([footnoteAfterUnorderedList])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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
        new PlainText("Only on Mondays…"),
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
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


describe("Within an outline convention, a nested footnote within an (inner) revealable outline convention which follows a nested footnote before the (inner) revealable outline convention", () => {
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

    const nestedFootnoteInBlockquote = new Footnote([
      new PlainText("On Mondays.")
    ], { referenceNumber: 4 })

    const footnoteInBlockquote = new Footnote([
      new PlainText("Well, I do, but I pretend"),
      nestedFootnoteInBlockquote,
      new PlainText(' not to.')
    ], { referenceNumber: 1 })

    const nestedFootnoteInNsflBlock = new Footnote([
      new PlainText("Or smell.")
    ], { referenceNumber: 3 })

    const footnoteInNsflBlock = new Footnote([
      new PlainText("Or touch."),
      nestedFootnoteInNsflBlock
    ], { referenceNumber: 2 })

    const footnoteAfterBlockquote = new Footnote([
      new PlainText("It's actually been a dream of mine ever since I was young.")
    ], { referenceNumber: 5 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText("I don't eat cereal."),
            footnoteInBlockquote,
            new PlainText(" Never have.")
          ]),
          new Paragraph([
            new PlainText("It's too expensive.")
          ]),
          new NsflBlock([
            new Paragraph([
              new PlainText("I don't eat"),
              footnoteInNsflBlock,
              new PlainText(" pumpkins.")
            ]),
            new FootnoteBlock([
              footnoteInNsflBlock,
              nestedFootnoteInNsflBlock
            ])
          ])
        ]),
        new FootnoteBlock([
          footnoteInBlockquote,
          nestedFootnoteInBlockquote
        ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText("I wear glasses"),
          footnoteAfterBlockquote,
          new PlainText(" even while working out.")
        ]),
        new FootnoteBlock([footnoteAfterBlockquote])
      ]))
  })
})
