import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { Table } from '../../SyntaxNodes/Table'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { Link } from '../../SyntaxNodes/Link'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'


context('When the "createSourceMap" config setting is not set to true', () => {
  specify('no source maps are produced', () => {
    expect(Up.toDocument("I enjoy apples.")).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('I enjoy apples.')], { sourceLineNumber: undefined }),
      ]))
  })
})


context('When the "createSourceMap" config setting is set to true, outline nodes are given a source line number.', () => {
  const up = new Up({
    createSourceMap: true
  })

  specify("The source line numbers start at 1.", () => {
    expect(up.toDocument('Hi!')).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText("Hi!")], { sourceLineNumber: 1 })
      ]))
  })


  context('Leading blank lines are accounted for (i.e. not ignored). For example:', () => {
    specify("1 leading blank line", () => {
      const markup = `
I actually start on the second line.`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Paragraph([new PlainText("I actually start on the second line.")], { sourceLineNumber: 2 })
        ]))
    })

    specify("2 leading blank lines", () => {
      const markup = `

I actually start on the third line.`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Paragraph([new PlainText("I actually start on the third line.")], { sourceLineNumber: 3 })
        ]))
    })

    specify("6 leading blank lines", () => {
      const markup = `





I actually start on the seventh line.`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Paragraph([new PlainText("I actually start on the seventh line.")], { sourceLineNumber: 7 })
        ]))
    })
  })


  context("Paragraphs nodes aren't the only type to receive a line number. Nearly every type of outline node is given one. Specifically:", () => {
    context('Headings:', () => {
      specify('Without an overline', () => {
        const markup = `
I enjoy apples
==============`

        const heading =
          new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument(
            [heading],
            new UpDocument.TableOfContents([heading])))
      })

      specify('With an overline', () => {
        const markup = `
==============
I enjoy apples
==============`

        const heading =
          new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument(
            [heading],
            new UpDocument.TableOfContents([heading])))
      })
    })

    specify('Tables with captions', () => {
      const markup = `
Table: Games in the Chrono series

Game;             Release Date

Chrono Trigger;   1995
Chrono Cross;     1999`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game')]),
              new Table.Header.Cell([new PlainText('Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Trigger')]),
                new Table.Row.Cell([new PlainText('1995')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Cross')]),
                new Table.Row.Cell([new PlainText('1999')])
              ])
            ],
            new Table.Caption([
              new PlainText('Games in the Chrono series')
            ]), { sourceLineNumber: 2 })
        ]))
    })

    specify('Charts with captions', () => {
      const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('1')]),
              new Table.Header.Cell([new PlainText('0')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('true')]),
                new Table.Row.Cell([new PlainText('false')]),
              ], new Table.Header.Cell([new PlainText('1')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('false')]),
                new Table.Row.Cell([new PlainText('false')])
              ], new Table.Header.Cell([new PlainText('0')]))
            ],
            new Table.Caption([
              new InlineCode('AND'),
              new PlainText(' operator logic')
            ]), { sourceLineNumber: 2 })
        ]))
    })

    specify('Ordered lists (and the outline nodes they contain)', () => {
      const markup = `
1. They're cheap

2. They're delicious`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new Paragraph([new PlainText("They're cheap")], { sourceLineNumber: 2 })
            ], { ordinal: 1 }),
            new OrderedList.Item([
              new Paragraph([new PlainText("They're delicious")], { sourceLineNumber: 4 })
            ], { ordinal: 2 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Unordered lists (and the outline nodes they contain)', () => {
      const markup = `
* They're cheap

* They're delicious`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
              new Paragraph([new PlainText("They're cheap")], { sourceLineNumber: 2 })
            ]),
            new UnorderedList.Item([
              new Paragraph([new PlainText("They're delicious")], { sourceLineNumber: 4 })
            ])
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Description lists (and the outline nodes they contain)', () => {
      const markup = `
Apples
  They're delicious.

Bananas
Peaches
  They're also delicious.`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([new PlainText('Apples')])
            ],
              new DescriptionList.Item.Description([
                new Paragraph([new PlainText("They're delicious.")], { sourceLineNumber: 3 })
              ])),
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([new PlainText('Bananas')]),
              new DescriptionList.Item.Subject([new PlainText('Peaches')])
            ],
              new DescriptionList.Item.Description([
                new Paragraph([new PlainText("They're also delicious.")], { sourceLineNumber: 7 })
              ]))
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Line blocks', () => {
      const markup = `
Roses are read
Apples are blue`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new LineBlock([
            new LineBlock.Line([
              new PlainText("Roses are read")
            ]),
            new LineBlock.Line([
              new PlainText("Apples are blue")
            ])
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Spoiler blocks (and the outline nodes they contain)', () => {
      const markup = `
SPOILER:
  Who doesn't?`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
            new Paragraph([new PlainText("Who doesn't?")], { sourceLineNumber: 3 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('NSFW blocks (and the outline nodes they contain)', () => {
      const markup = `
NSFW:

  Who doesn't?`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new Paragraph([new PlainText("Who doesn't?")], { sourceLineNumber: 4 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('NSFL blocks (and the outline nodes they contain)', () => {
      const markup = `
NSFL:


  Who doesn't?`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsflBlock([
            new Paragraph([new PlainText("Who doesn't?")], { sourceLineNumber: 5 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Blockquotes (and the outline nodes they contain)', () => {
      const markup = `
> Who doesn't?`
      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Blockquote([
            new Paragraph([new PlainText("Who doesn't?")], { sourceLineNumber: 2 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    context('Thematic breaks indicated by:', () => {
      specify('A streak', () => {
        const markup = `~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-`

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument([
            new ThematicBreak({ sourceLineNumber: 1 }),
          ]))
      })

      specify("3 blank lines", () => {
        const markup = `
The end.



No, really. That was it.`

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument([
            new Paragraph([new PlainText("The end.")], { sourceLineNumber: 2 }),
            new ThematicBreak({ sourceLineNumber: 3 }),
            new Paragraph([new PlainText("No, really. That was it.")], { sourceLineNumber: 6 })
          ]))
      })

      specify("More than 3 blank lines", () => {
        const markup = `
The end.








No, really. That was it.`

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument([
            new Paragraph([new PlainText("The end.")], { sourceLineNumber: 2 }),
            new ThematicBreak({ sourceLineNumber: 3 }),
            new Paragraph([new PlainText("No, really. That was it.")], { sourceLineNumber: 11 })
          ]))
      })

      specify("Multiple streaks and instances of 3+ blank lines (all of which are condensed into one thematic break node)", () => {
        const markup = `
The end.




~-~-~-~-~-~-~-~-~-~-~-~-~
~~~~~~~~~~~~~~~~~~~~~~~~~
~=~=~=~=~=~=~=~=~=~=~=~=~
#=#=#=#=#=#=#=#=#=#=#=#=#




No, really. That was it.`

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument([
            new Paragraph([new PlainText("The end.")], { sourceLineNumber: 2 }),
            new ThematicBreak({ sourceLineNumber: 3 }),
            new Paragraph([new PlainText("No, really. That was it.")], { sourceLineNumber: 15 })
          ]))
      })
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
const reason = "They are cheap and delicious."
\`\`\``

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new CodeBlock('const reason = "They are cheap and delicious."', { sourceLineNumber: 2 }),
        ]))
    })

    specify("Tables without captions", () => {
      const markup = `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

      const NO_CAPTION: Table.Caption = undefined

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game')]),
              new Table.Header.Cell([new PlainText('Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Trigger')]),
                new Table.Row.Cell([new PlainText('1995')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Cross')]),
                new Table.Row.Cell([new PlainText('1999')])
              ])
            ], NO_CAPTION, { sourceLineNumber: 2 })
        ]))
    })

    specify("Charts without captions", () => {
      const markup = `
Chart:

        1;      0
1;      true;   false
0;      false;  false`

      const NO_CAPTION: Table.Caption = undefined

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('1')]),
              new Table.Header.Cell([new PlainText('0')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('true')]),
                new Table.Row.Cell([new PlainText('false')]),
              ], new Table.Header.Cell([new PlainText('1')])),
              new Table.Row([
                new Table.Row.Cell([new PlainText('false')]),
                new Table.Row.Cell([new PlainText('false')])
              ], new Table.Header.Cell([new PlainText('0')]))
            ], NO_CAPTION, { sourceLineNumber: 2 })
        ]))
    })


    context('Media nodes are given a source line number if they were "outlined":', () => {
      specify('Audio nodes', () => {
        expect(up.toDocument('[audio: haunted house] (example.com/hauntedhouse.ogg)')).to.deep.equal(
          new UpDocument([
            new Audio('haunted house', 'https://example.com/hauntedhouse.ogg', { sourceLineNumber: 1 })
          ]))
      })

      specify('Images', () => {
        expect(up.toDocument('[image: haunted house] (example.com/hauntedhouse.svg)')).to.deep.equal(
          new UpDocument([
            new Image('haunted house', 'https://example.com/hauntedhouse.svg', { sourceLineNumber: 1 })
          ]))
      })

      specify('Videos', () => {
        expect(up.toDocument('[video: haunted house] (example.com/hauntedhouse.webm)')).to.deep.equal(
          new UpDocument([
            new Video('haunted house', 'https://example.com/hauntedhouse.webm', { sourceLineNumber: 1 })
          ]))
      })
    })


    describe('A link containing an "outlined" media node', () => {
      it('is given a source line number (but the media node it contains is not)', () => {
        expect(up.toDocument('[image: haunted house] (example.com/hauntedhouse.svg) (example.com/gallery)')).to.deep.equal(
          new UpDocument([
            new Link([
              new Image('haunted house', 'https://example.com/hauntedhouse.svg')
            ], 'https://example.com/gallery', { sourceLineNumber: 1 })
          ]))
      })
    })


    context('When a single line of markup produces multiple "outlined" media nodes', () => {
      specify('the media nodes are all mapped to that same line', () => {
        const markup =
          '[image: haunted house](example.com/hauntedhouse.svg) [audio: haunted house](example.com/hauntedhouse.ogg) [video: haunted house] (example.com/hauntedhouse.webm)'

        expect(up.toDocument(markup)).to.deep.equal(
          new UpDocument([
            new Image('haunted house', 'https://example.com/hauntedhouse.svg', { sourceLineNumber: 1 }),
            new Audio('haunted house', 'https://example.com/hauntedhouse.ogg', { sourceLineNumber: 1 }),
            new Video('haunted house', 'https://example.com/hauntedhouse.webm', { sourceLineNumber: 1 })
          ]))
      })
    })
  })
})


describe('Footnote blocks', () => {
  it('are not assigned source line numbers', () => {
    const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

I do eat apples, though.`

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup, { createSourceMap: true })).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ], { sourceLineNumber: 2 }),
        new FootnoteBlock([footnote]),
        new Paragraph([new PlainText('I do eat apples, though.')], { sourceLineNumber: 4 })
      ]))
  })
})


context('When there are several outline conventions, all of them are given soure line numbers. This includes when:', () => {
  specify('They are all at the top-level of the document', () => {
    const markup = `
==============
I enjoy apples
==============

Don't you?

Roses are red
Apples are blue


The best fruit
--------------

Apples.


The best apple
--------------
  
Pink lady.`

    const enjoyApplesHeading =
      new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

    const bestFruitHeading =
      new Heading([new PlainText("The best fruit")], { level: 2, ordinalInTableOfContents: 2, sourceLineNumber: 12 })

    const bestAppleHeading =
      new Heading([new PlainText("The best apple")], { level: 2, ordinalInTableOfContents: 3, sourceLineNumber: 18 })

    expect(Up.toDocument(markup, { createSourceMap: true })).to.deep.equal(
      new UpDocument([
        enjoyApplesHeading,
        new Paragraph([new PlainText("Don't you?")], { sourceLineNumber: 6 }),
        new LineBlock([
          new LineBlock.Line([new PlainText('Roses are red')]),
          new LineBlock.Line([new PlainText('Apples are blue')])
        ], { sourceLineNumber: 8 }),
        bestFruitHeading,
        new Paragraph([new PlainText('Apples.')], { sourceLineNumber: 15 }),
        bestAppleHeading,
        new Paragraph([new PlainText('Pink lady.')], { sourceLineNumber: 21 })
      ], new UpDocument.TableOfContents([
        enjoyApplesHeading,
        bestFruitHeading,
        bestAppleHeading])))
  })

  specify('Some are deeply nested.', () => {
    const markup = `
==============
I enjoy apples
==============

Don't you?

Apple
  The best fruit
  --------------

  SPOILER:
    Really.

Pink lady
  The best apple
  --------------
  
  > Really.`


    const enjoyApplesHeading =
      new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

    const bestFruitHeading =
      new Heading([new PlainText("The best fruit")], { level: 2, ordinalInTableOfContents: 2, sourceLineNumber: 9 })

    const bestAppleHeading =
      new Heading([new PlainText("The best apple")], { level: 2, ordinalInTableOfContents: 3, sourceLineNumber: 16 })

    expect(Up.toDocument(markup, { createSourceMap: true })).to.deep.equal(
      new UpDocument([
        enjoyApplesHeading,
        new Paragraph([new PlainText("Don't you?")], { sourceLineNumber: 6 }),
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Apple')])
          ], new DescriptionList.Item.Description([
            bestFruitHeading,
            new SpoilerBlock([
              new Paragraph([new PlainText('Really.')], { sourceLineNumber: 13 })
            ], { sourceLineNumber: 12 })
          ])),
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Pink lady')])
          ], new DescriptionList.Item.Description([
            bestAppleHeading,
            new Blockquote([
              new Paragraph([new PlainText('Really.')], { sourceLineNumber: 19 })
            ], { sourceLineNumber: 19 })
          ]))
        ], { sourceLineNumber: 8 })
      ], new UpDocument.TableOfContents([
        enjoyApplesHeading,
        bestFruitHeading,
        bestAppleHeading
      ])))
  })
})
