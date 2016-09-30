import { expect } from 'chai'
import * as Up from '../../Up'
import { Table } from '../../SyntaxNodes/Table'


context('When the "createSourceMap" setting is not enabled', () => {
  specify('no source maps are produced', () => {
    expect(Up.parse("I enjoy apples.")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('I enjoy apples.')], { sourceLineNumber: undefined }),
      ]))
  })
})


context('When the "createSourceMap" setting is enabled, outline nodes are given a source line number.', () => {
  const up = new Up.Transformer({
    parsing: {
      createSourceMap: true
    }
  })

  specify("The source line numbers start at 1", () => {
    expect(up.parse('Hi!')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text("Hi!")], { sourceLineNumber: 1 })
      ]))
  })


  context('Leading blank lines are accounted for (i.e. not ignored). For example:', () => {
    specify("1 leading blank line", () => {
      const markup = `
I actually start on the second line.`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([new Up.Text("I actually start on the second line.")], { sourceLineNumber: 2 })
        ]))
    })

    specify("2 leading blank lines", () => {
      const markup = `

I actually start on the third line.`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([new Up.Text("I actually start on the third line.")], { sourceLineNumber: 3 })
        ]))
    })

    specify("6 leading blank lines", () => {
      const markup = `





I actually start on the seventh line.`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([new Up.Text("I actually start on the seventh line.")], { sourceLineNumber: 7 })
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
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document(
            [heading],
            new Up.Document.TableOfContents([heading])))
      })

      specify('With an overline', () => {
        const markup = `
==============
I enjoy apples
==============`

        const heading =
          new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document(
            [heading],
            new Up.Document.TableOfContents([heading])))
      })
    })

    specify('Tables with captions', () => {
      const markup = `
Table: Games in the Chrono series

Game;             Release Date

Chrono Trigger;   1995
Chrono Cross;     1999`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game')]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ])
            ],
            new Up.Table.Caption([
              new Up.Text('Games in the Chrono series')
            ]), { sourceLineNumber: 2 })
        ]))
    })

    specify('Tables with a header column and with a caption', () => {
      const markup = `
Table: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('1')]),
              new Up.Table.Header.Cell([new Up.Text('0')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('true')]),
                new Up.Table.Row.Cell([new Up.Text('false')]),
              ], new Up.Table.Header.Cell([new Up.Text('1')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('false')]),
                new Up.Table.Row.Cell([new Up.Text('false')])
              ], new Up.Table.Header.Cell([new Up.Text('0')]))
            ],
            new Up.Table.Caption([
              new Up.InlineCode('AND'),
              new Up.Text(' operator logic')
            ]), { sourceLineNumber: 2 })
        ]))
    })

    specify('Ordered lists (and the outline nodes they contain)', () => {
      const markup = `
1. They're cheap

2. They're delicious`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.OrderedList([
            new Up.OrderedList.Item([
              new Up.Paragraph([new Up.Text("They're cheap")], { sourceLineNumber: 2 })
            ], { ordinal: 1 }),
            new Up.OrderedList.Item([
              new Up.Paragraph([new Up.Text("They're delicious")], { sourceLineNumber: 4 })
            ], { ordinal: 2 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Unordered lists (and the outline nodes they contain)', () => {
      const markup = `
* They're cheap

* They're delicious`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              new Up.Paragraph([new Up.Text("They're cheap")], { sourceLineNumber: 2 })
            ]),
            new Up.UnorderedList.Item([
              new Up.Paragraph([new Up.Text("They're delicious")], { sourceLineNumber: 4 })
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

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Apples')])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.Paragraph([new Up.Text("They're delicious.")], { sourceLineNumber: 3 })
              ])),
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Bananas')]),
              new Up.DescriptionList.Item.Subject([new Up.Text('Peaches')])
            ],
              new Up.DescriptionList.Item.Description([
                new Up.Paragraph([new Up.Text("They're also delicious.")], { sourceLineNumber: 7 })
              ]))
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Line blocks', () => {
      const markup = `
Roses are read
Apples are blue`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.LineBlock([
            new Up.LineBlock.Line([
              new Up.Text("Roses are read")
            ]),
            new Up.LineBlock.Line([
              new Up.Text("Apples are blue")
            ])
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Revealable blocks (and the outline nodes they contain)', () => {
      const markup = `
SPOILER:
  Who doesn't?`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.RevealableBlock([
            new Up.Paragraph([new Up.Text("Who doesn't?")], { sourceLineNumber: 3 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    specify('Blockquotes (and the outline nodes they contain)', () => {
      const markup = `
> Who doesn't?`
      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Blockquote([
            new Up.Paragraph([new Up.Text("Who doesn't?")], { sourceLineNumber: 2 })
          ], { sourceLineNumber: 2 })
        ]))
    })

    context('Thematic breaks indicated by:', () => {
      specify('A streak', () => {
        const markup = `~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-`

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document([
            new Up.ThematicBreak({ sourceLineNumber: 1 }),
          ]))
      })

      specify("3 blank lines", () => {
        const markup = `
The end.



No, really. That was it.`

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document([
            new Up.Paragraph([new Up.Text("The end.")], { sourceLineNumber: 2 }),
            new Up.ThematicBreak({ sourceLineNumber: 3 }),
            new Up.Paragraph([new Up.Text("No, really. That was it.")], { sourceLineNumber: 6 })
          ]))
      })

      specify("More than 3 blank lines", () => {
        const markup = `
The end.








No, really. That was it.`

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document([
            new Up.Paragraph([new Up.Text("The end.")], { sourceLineNumber: 2 }),
            new Up.ThematicBreak({ sourceLineNumber: 3 }),
            new Up.Paragraph([new Up.Text("No, really. That was it.")], { sourceLineNumber: 11 })
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

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document([
            new Up.Paragraph([new Up.Text("The end.")], { sourceLineNumber: 2 }),
            new Up.ThematicBreak({ sourceLineNumber: 3 }),
            new Up.Paragraph([new Up.Text("No, really. That was it.")], { sourceLineNumber: 15 })
          ]))
      })
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
const reason = "They are cheap and delicious."
\`\`\``

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.CodeBlock('const reason = "They are cheap and delicious."', { sourceLineNumber: 2 }),
        ]))
    })

    specify("Tables without captions", () => {
      const markup = `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

      const NO_CAPTION: Table.Caption = undefined

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game')]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ])
            ], NO_CAPTION, { sourceLineNumber: 2 })
        ]))
    })

    specify("Tables with a header column and without a caption", () => {
      const markup = `
Table:

        1;      0
1;      true;   false
0;      false;  false`

      const NO_CAPTION: Table.Caption = undefined

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('1')]),
              new Up.Table.Header.Cell([new Up.Text('0')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('true')]),
                new Up.Table.Row.Cell([new Up.Text('false')]),
              ], new Up.Table.Header.Cell([new Up.Text('1')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('false')]),
                new Up.Table.Row.Cell([new Up.Text('false')])
              ], new Up.Table.Header.Cell([new Up.Text('0')]))
            ], NO_CAPTION, { sourceLineNumber: 2 })
        ]))
    })


    context('Media nodes are given a source line number if they were "outlined":', () => {
      specify('Audio nodes', () => {
        expect(up.parse('[audio: haunted house] (example.com/hauntedhouse.ogg)')).to.deep.equal(
          new Up.Document([
            new Up.Audio('haunted house', 'https://example.com/hauntedhouse.ogg', { sourceLineNumber: 1 })
          ]))
      })

      specify('Images', () => {
        expect(up.parse('[image: haunted house] (example.com/hauntedhouse.svg)')).to.deep.equal(
          new Up.Document([
            new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg', { sourceLineNumber: 1 })
          ]))
      })

      specify('Videos', () => {
        expect(up.parse('[video: haunted house] (example.com/hauntedhouse.webm)')).to.deep.equal(
          new Up.Document([
            new Up.Video('haunted house', 'https://example.com/hauntedhouse.webm', { sourceLineNumber: 1 })
          ]))
      })
    })


    describe('A link containing an "outlined" media node', () => {
      it('is given a source line number (but the media node it contains is not)', () => {
        expect(up.parse('[image: haunted house] (example.com/hauntedhouse.svg) (example.com/gallery)')).to.deep.equal(
          new Up.Document([
            new Up.Link([
              new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg')
            ], 'https://example.com/gallery', { sourceLineNumber: 1 })
          ]))
      })
    })


    context('When a single line of markup produces multiple "outlined" media nodes', () => {
      specify('the media nodes are all mapped to that same line', () => {
        const markup =
          '[image: haunted house](example.com/hauntedhouse.svg) [audio: haunted house](example.com/hauntedhouse.ogg) [video: haunted house] (example.com/hauntedhouse.webm)'

        expect(up.parse(markup)).to.deep.equal(
          new Up.Document([
            new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg', { sourceLineNumber: 1 }),
            new Up.Audio('haunted house', 'https://example.com/hauntedhouse.ogg', { sourceLineNumber: 1 }),
            new Up.Video('haunted house', 'https://example.com/hauntedhouse.webm', { sourceLineNumber: 1 })
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

    const footnote = new Up.Footnote([
      new Up.Text('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup, { createSourceMap: true })).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(" Never have."),
        ], { sourceLineNumber: 2 }),
        new Up.FootnoteBlock([footnote]),
        new Up.Paragraph([new Up.Text('I do eat apples, though.')], { sourceLineNumber: 4 })
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
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

    const bestFruitHeading =
      new Up.Heading([new Up.Text("The best fruit")], { level: 2, ordinalInTableOfContents: 2, sourceLineNumber: 12 })

    const bestAppleHeading =
      new Up.Heading([new Up.Text("The best apple")], { level: 2, ordinalInTableOfContents: 3, sourceLineNumber: 18 })

    expect(Up.parse(markup, { createSourceMap: true })).to.deep.equal(
      new Up.Document([
        enjoyApplesHeading,
        new Up.Paragraph([new Up.Text("Don't you?")], { sourceLineNumber: 6 }),
        new Up.LineBlock([
          new Up.LineBlock.Line([new Up.Text('Roses are red')]),
          new Up.LineBlock.Line([new Up.Text('Apples are blue')])
        ], { sourceLineNumber: 8 }),
        bestFruitHeading,
        new Up.Paragraph([new Up.Text('Apples.')], { sourceLineNumber: 15 }),
        bestAppleHeading,
        new Up.Paragraph([new Up.Text('Pink lady.')], { sourceLineNumber: 21 })
      ], new Up.Document.TableOfContents([
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
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1, sourceLineNumber: 2 })

    const bestFruitHeading =
      new Up.Heading([new Up.Text("The best fruit")], { level: 2, ordinalInTableOfContents: 2, sourceLineNumber: 9 })

    const bestAppleHeading =
      new Up.Heading([new Up.Text("The best apple")], { level: 2, ordinalInTableOfContents: 3, sourceLineNumber: 16 })

    expect(Up.parse(markup, { createSourceMap: true })).to.deep.equal(
      new Up.Document([
        enjoyApplesHeading,
        new Up.Paragraph([new Up.Text("Don't you?")], { sourceLineNumber: 6 }),
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Apple')])
          ], new Up.DescriptionList.Item.Description([
            bestFruitHeading,
            new Up.RevealableBlock([
              new Up.Paragraph([new Up.Text('Really.')], { sourceLineNumber: 13 })
            ], { sourceLineNumber: 12 })
          ])),
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Pink lady')])
          ], new Up.DescriptionList.Item.Description([
            bestAppleHeading,
            new Up.Blockquote([
              new Up.Paragraph([new Up.Text('Really.')], { sourceLineNumber: 19 })
            ], { sourceLineNumber: 19 })
          ]))
        ], { sourceLineNumber: 8 })
      ], new Up.Document.TableOfContents([
        enjoyApplesHeading,
        bestFruitHeading,
        bestAppleHeading
      ])))
  })
})
