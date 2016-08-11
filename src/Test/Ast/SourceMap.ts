import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


const NO_SPECIFIED_SOURCE_LINE_NUMBER: number = undefined


context('When the "createSourceMap" config setting is not set to true', () => {
  specify('no source maps are produced', () => {
    expect(Up.toAst("I enjoy apples.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('I enjoy apples.')], NO_SPECIFIED_SOURCE_LINE_NUMBER),
      ]))
  })
})


context('When the "createSourceMap" config setting is set to true, outline nodes are given a source line number.', () => {
  const up = new Up({
    createSourceMap: true
  })

  specify("The source line numbers start at 1.", () => {
    expect(up.toAst('Hi!')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Hi!")], 1)
      ]))
  })


  context('Leading blank lines are accounted for (i.e. not ignored). For example:', () => {
    specify("1 leading blank line", () => {
      const markup = `
I actually start on the second line.`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([new PlainTextNode("I actually start on the second line.")], 2)
        ]))
    })

    specify("2 leading blank lines", () => {
      const markup = `

I actually start on the third line.`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([new PlainTextNode("I actually start on the third line.")], 3)
        ]))
    })

    specify("6 leading blank lines", () => {
      const markup = `





I actually start on the seventh line.`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([new PlainTextNode("I actually start on the seventh line.")], 7)
        ]))
    })
  })


  context("Paragraphs nodes aren't the only type to receive a line number. Nearly every type of outline node is given one. Specifically:", () => {
    context('Headings:', () => {
      specify('Without an overline', () => {
        const markup = `
I enjoy apples
==============`

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new HeadingNode([new PlainTextNode('I enjoy apples')], 1, 2)
          ]))
      })

      specify('With an overline', () => {
        const markup = `
==============
I enjoy apples
==============`

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new HeadingNode([new PlainTextNode('I enjoy apples')], 1, 2)
          ]))
      })
    })

    specify('Tables with captions', () => {
      const markup = `
Table: Games in the Chrono series

Game;             Release Date

Chrono Trigger;   1995
Chrono Cross;     1999`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('Game')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
                new TableNode.Row.Cell([new PlainTextNode('1995')])
              ]),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
                new TableNode.Row.Cell([new PlainTextNode('1999')])
              ])
            ],
            new TableNode.Caption([
              new PlainTextNode('Games in the Chrono series')
            ]), 2)
        ]))
    })

    specify('Charts with captions', () => {
      const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('1')]),
              new TableNode.Header.Cell([new PlainTextNode('0')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('true')]),
                new TableNode.Row.Cell([new PlainTextNode('false')]),
              ], new TableNode.Header.Cell([new PlainTextNode('1')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('false')]),
                new TableNode.Row.Cell([new PlainTextNode('false')])
              ], new TableNode.Header.Cell([new PlainTextNode('0')]))
            ],
            new TableNode.Caption([
              new InlineCodeNode('AND'),
              new PlainTextNode(' operator logic')
            ]), 2)
        ]))
    })

    specify('Ordered lists (and the outline nodes they contain)', () => {
      const markup = `
1. They're cheap

2. They're delicious`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
              new ParagraphNode([new PlainTextNode("They're cheap")], 2)
            ], 1),
            new OrderedListNode.Item([
              new ParagraphNode([new PlainTextNode("They're delicious")], 4)
            ], 2)
          ], 2)
        ]))
    })

    specify('Unordered lists (and the outline nodes they contain)', () => {
      const markup = `
* They're cheap

* They're delicious`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new ParagraphNode([new PlainTextNode("They're cheap")], 2)
            ]),
            new UnorderedListNode.Item([
              new ParagraphNode([new PlainTextNode("They're delicious")], 4)
            ])
          ], 2)
        ]))
    })

    specify('Description lists (and the outline nodes they contain)', () => {
      const markup = `
Apples
  They're delicious.

Bananas
Peaches
  They're also delicious.`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new DescriptionListNode([
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([new PlainTextNode('Apples')])
            ],
              new DescriptionListNode.Item.Description([
                new ParagraphNode([new PlainTextNode("They're delicious.")], 3)
              ])),
            new DescriptionListNode.Item([
              new DescriptionListNode.Item.Term([new PlainTextNode('Bananas')]),
              new DescriptionListNode.Item.Term([new PlainTextNode('Peaches')])
            ],
              new DescriptionListNode.Item.Description([
                new ParagraphNode([new PlainTextNode("They're also delicious.")], 7)
              ]))
          ], 2)
        ]))
    })

    specify('Line blocks', () => {
      const markup = `
Roses are read
Apples are blue`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new LineBlockNode([
            new LineBlockNode.Line([
              new PlainTextNode("Roses are read")
            ]),
            new LineBlockNode.Line([
              new PlainTextNode("Apples are blue")
            ])
          ], 2)
        ]))
    })

    specify('Spoiler blocks (and the outline nodes they contain)', () => {
      const markup = `
SPOILER:
  Who doesn't?`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new SpoilerBlockNode([
            new ParagraphNode([new PlainTextNode("Who doesn't?")], 3)
          ], 2)
        ]))
    })

    specify('NSFW blocks (and the outline nodes they contain)', () => {
      const markup = `
NSFW:

  Who doesn't?`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new NsfwBlockNode([
            new ParagraphNode([new PlainTextNode("Who doesn't?")], 4)
          ], 2)
        ]))
    })

    specify('NSFL blocks (and the outline nodes they contain)', () => {
      const markup = `
NSFL:


  Who doesn't?`

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new ParagraphNode([new PlainTextNode("Who doesn't?")], 5)
          ], 2)
        ]))
    })

    specify('Blockquotes (and the outline nodes they contain)', () => {
      const markup = `
> Who doesn't?`
      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new BlockquoteNode([
            new ParagraphNode([new PlainTextNode("Who doesn't?")], 2)
          ], 2)
        ]))
    })

    context('Outline separators indicated by:', () => {
      specify('A streak', () => {
        const markup = `~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-`

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new OutlineSeparatorNode(1),
          ]))
      })

      specify("3 blank lines", () => {
        const markup = `
The end.



No, really. That was it.`

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new ParagraphNode([new PlainTextNode("The end.")], 2),
            new OutlineSeparatorNode(3),
            new ParagraphNode([new PlainTextNode("No, really. That was it.")], 6)
          ]))
      })

      specify("More than 3 blank lines", () => {
        const markup = `
The end.








No, really. That was it.`

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new ParagraphNode([new PlainTextNode("The end.")], 2),
            new OutlineSeparatorNode(3),
            new ParagraphNode([new PlainTextNode("No, really. That was it.")], 11)
          ]))
      })

      specify("Multiple streaks and instances of 3+ blank lines (all of which are condensed into one separator node)", () => {
        const markup = `
The end.




~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~-~-~-~-~-~-~-~-~-~-~-~-~
~=~=~=~=~=~=~=~=~=~=~=~=~
#=#=#=#=#=#=#=#=#=#=#=#=#




No, really. That was it.`

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new ParagraphNode([new PlainTextNode("The end.")], 2),
            new OutlineSeparatorNode(3),
            new ParagraphNode([new PlainTextNode("No, really. That was it.")], 15)
          ]))
      })
    })

    specify('Code blocks', () => {
      const markup = `
\`\`\`
const reason = "They are cheap and delicious."
\`\`\``

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new CodeBlockNode('const reason = "They are cheap and delicious."', 2),
        ]))
    })

    specify("Tables without captions", () => {
      const markup = `
Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

      const NO_CAPTION: TableNode.Caption = undefined

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('Game')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
                new TableNode.Row.Cell([new PlainTextNode('1995')])
              ]),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
                new TableNode.Row.Cell([new PlainTextNode('1999')])
              ])
            ], NO_CAPTION, 2)
        ]))
    })

    specify("Charts without captions", () => {
      const markup = `
Chart:

        1;      0
1;      true;   false
0;      false;  false`

      const NO_CAPTION: TableNode.Caption = undefined

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('1')]),
              new TableNode.Header.Cell([new PlainTextNode('0')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('true')]),
                new TableNode.Row.Cell([new PlainTextNode('false')]),
              ], new TableNode.Header.Cell([new PlainTextNode('1')])),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('false')]),
                new TableNode.Row.Cell([new PlainTextNode('false')])
              ], new TableNode.Header.Cell([new PlainTextNode('0')]))
            ], NO_CAPTION, 2)
        ]))
    })


    context('Media nodes are given a source line number if they were "outlined":', () => {
      specify('Audio nodes', () => {
        expect(up.toAst('[audio: haunted house] (example.com/hauntedhouse.ogg)')).to.be.eql(
          new DocumentNode([
            new AudioNode('haunted house', 'https://example.com/hauntedhouse.ogg', 1)
          ]))
      })

      specify('Images', () => {
        expect(up.toAst('[image: haunted house] (example.com/hauntedhouse.svg)')).to.be.eql(
          new DocumentNode([
            new ImageNode('haunted house', 'https://example.com/hauntedhouse.svg', 1)
          ]))
      })

      specify('Videos', () => {
        expect(up.toAst('[video: haunted house] (example.com/hauntedhouse.webm)')).to.be.eql(
          new DocumentNode([
            new VideoNode('haunted house', 'https://example.com/hauntedhouse.webm', 1)
          ]))
      })
    })


    describe('A link containing an outlined media node', () => {
      it('is given a source line number (but the media node itself is not)', () => {
        expect(up.toAst('[image: haunted house] (example.com/hauntedhouse.svg) (example.com/gallery)')).to.be.eql(
          new DocumentNode([
            new LinkNode([
              new ImageNode('haunted house', 'https://example.com/hauntedhouse.svg')
            ], 'https://example.com/gallery', 1)
          ]))
      })
    })

    describe('Multiple media nodes produced from the same line of markup', () => {
      it('are all mapped to the same line', () => {
        const markup =
          '[image: haunted house](example.com/hauntedhouse.svg) [audio: haunted house](example.com/hauntedhouse.ogg) [video: haunted house] (example.com/hauntedhouse.webm)'

        expect(up.toAst(markup)).to.be.eql(
          new DocumentNode([
            new ImageNode('haunted house', 'https://example.com/hauntedhouse.svg', 1),
            new AudioNode('haunted house', 'https://example.com/hauntedhouse.ogg', 1),
            new VideoNode('haunted house', 'https://example.com/hauntedhouse.webm', 1)
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

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(markup, { createSourceMap: true })).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ], 2),
        new FootnoteBlockNode([footnote]),
        new ParagraphNode([new PlainTextNode('I do eat apples, though.')], 4)
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

    expect(Up.toAst(markup, { createSourceMap: true })).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1, 2),
        new ParagraphNode([new PlainTextNode("Don't you?")], 6),
        new LineBlockNode([
          new LineBlockNode.Line([new PlainTextNode('Roses are red')]),
          new LineBlockNode.Line([new PlainTextNode('Apples are blue')])
        ], 8),
        new HeadingNode([new PlainTextNode("The best fruit")], 2, 12),
        new ParagraphNode([new PlainTextNode('Apples.')], 15),
        new HeadingNode([new PlainTextNode("The best apple")], 2, 18),
        new ParagraphNode([new PlainTextNode('Pink lady.')], 21)
      ]))
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

    expect(Up.toAst(markup, { createSourceMap: true })).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1, 2),
        new ParagraphNode([new PlainTextNode("Don't you?")], 6),
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Apple')])
          ], new DescriptionListNode.Item.Description([
            new HeadingNode([new PlainTextNode("The best fruit")], 2, 9),
            new SpoilerBlockNode([
              new ParagraphNode([new PlainTextNode('Really.')], 13)
            ], 12)
          ])),
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Pink lady')])
          ], new DescriptionListNode.Item.Description([
            new HeadingNode([new PlainTextNode("The best apple")], 2, 16),
            new BlockquoteNode([
              new ParagraphNode([new PlainTextNode('Really.')], 19)
            ], 19)
          ]))
        ], 8)
      ]))
  })
})
