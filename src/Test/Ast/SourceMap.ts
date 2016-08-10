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

       specify("Indicated by multiple streaks and instances of consecutive 3+ blank lines (all of which are condensed into one separator node)", () => {
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
  })
})


describe('Footnote blocks', () => {
  it('are not assigned source line numbers', () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(markup, { createSourceMap: true })).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ], 1),
        new FootnoteBlockNode([footnote])
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

/*

  context("Headings, tables with captions, and charts with captions don't have to be at the top level of the document to be included in the table of contents.", () => {
    context('Instead, they can be inside:', () => {
      specify('Ordered lists', () => {
        const markup = `
I enjoy apples
==============

1. They're cheap
   -------------

   Very cheap.

2. They're delicious
   -----------------
   
   Very delicious.`

        const applesHeading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const cheapHeading =
          new HeadingNode([new PlainTextNode("They're cheap")], 2)

        const deliciousHeading =
          new HeadingNode([new PlainTextNode("They're delicious")], 2)

        const tableOfContents =
          new DocumentNode.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            applesHeading,
            new OrderedListNode([
              new OrderedListNode.Item([
                cheapHeading,
                new ParagraphNode([new PlainTextNode("Very cheap.")])
              ], 1),
              new OrderedListNode.Item([
                deliciousHeading,
                new ParagraphNode([new PlainTextNode("Very delicious.")])
              ], 2)
            ])
          ], tableOfContents))
      })

      specify('Nested ordered lists', () => {
        const markup = `
I enjoy apples
==============

# They're cheap
  -------------

  Very cheap.

  # Cost
    ----
   
    Typically, apples cost twenty dolloars per pound.`

        const applesHeading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const cheapHeading =
          new HeadingNode([new PlainTextNode("They're cheap")], 2)

        const costHeading =
          new HeadingNode([new PlainTextNode("Cost")], 2)

        const tableOfContents =
          new DocumentNode.TableOfContents([applesHeading, cheapHeading, costHeading])

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            applesHeading,
            new OrderedListNode([
              new OrderedListNode.Item([
                cheapHeading,
                new ParagraphNode([new PlainTextNode("Very cheap.")]),
                new OrderedListNode([
                  new OrderedListNode.Item([
                    costHeading,
                    new ParagraphNode([new PlainTextNode("Typically, apples cost twenty dolloars per pound.")])
                  ])
                ])
              ])
            ])
          ], tableOfContents))
      })

      specify('Unordered lists', () => {
        const markup = `
I enjoy apples
==============

* They're cheap
  -------------

  Very cheap.

* They're delicious
  -----------------
   
  Very delicious.`

        const applesHeading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const cheapHeading =
          new HeadingNode([new PlainTextNode("They're cheap")], 2)

        const deliciousHeading =
          new HeadingNode([new PlainTextNode("They're delicious")], 2)

        const tableOfContents =
          new DocumentNode.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            applesHeading,
            new UnorderedListNode([
              new UnorderedListNode.Item([
                cheapHeading,
                new ParagraphNode([new PlainTextNode("Very cheap.")])
              ]),
              new UnorderedListNode.Item([
                deliciousHeading,
                new ParagraphNode([new PlainTextNode("Very delicious.")])
              ])
            ])
          ], tableOfContents))
      })

      specify('Nested unordered lists', () => {
        const markup = `
I enjoy apples
==============

* They're cheap
  -------------

  Very cheap.

  * Cost
    -----------------
   
    Typically, apples cost twenty dolloars per pound.`

        const applesHeading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const cheapHeading =
          new HeadingNode([new PlainTextNode("They're cheap")], 2)

        const costHeading =
          new HeadingNode([new PlainTextNode("Cost")], 2)

        const tableOfContents =
          new DocumentNode.TableOfContents([applesHeading, cheapHeading, costHeading])

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            applesHeading,
            new UnorderedListNode([
              new UnorderedListNode.Item([
                cheapHeading,
                new ParagraphNode([new PlainTextNode("Very cheap.")]),
                new UnorderedListNode([
                  new UnorderedListNode.Item([
                    costHeading,
                    new ParagraphNode([new PlainTextNode("Typically, apples cost twenty dolloars per pound.")])
                  ])
                ])
              ])
            ])
          ], tableOfContents))
      })

      specify('Description lists', () => {
        const markup = `
I enjoy apples
==============

Apple
  The best fruit
  --------------

  Really.

Pink lady
  The best apple
  --------------
  
  Really.`

        const applesHeading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const bestFruitHeading =
          new HeadingNode([new PlainTextNode("The best fruit")], 2)

        const pinkLadyHeading =
          new HeadingNode([new PlainTextNode("The best apple")], 2)

        const tableOfContents =
          new DocumentNode.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            applesHeading,
            new DescriptionListNode([
              new DescriptionListNode.Item([
                new DescriptionListNode.Item.Term([new PlainTextNode('Apple')])
              ], new DescriptionListNode.Item.Description([
                bestFruitHeading,
                new ParagraphNode([new PlainTextNode('Really.')])
              ])),
              new DescriptionListNode.Item([
                new DescriptionListNode.Item.Term([new PlainTextNode('Pink lady')])
              ], new DescriptionListNode.Item.Description([
                pinkLadyHeading,
                new ParagraphNode([new PlainTextNode('Really.')])
              ]))
            ])
          ], tableOfContents))
      })

      specify('Nested description lists', () => {
        const markup = `
I enjoy apples
==============

Apple
  The best fruit
  --------------

  Really.

  Pink lady
    The best apple
    --------------
    
    Really.`

        const applesHeading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const bestFruitHeading =
          new HeadingNode([new PlainTextNode("The best fruit")], 2)

        const pinkLadyHeading =
          new HeadingNode([new PlainTextNode("The best apple")], 2)

        const tableOfContents =
          new DocumentNode.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            applesHeading,
            new DescriptionListNode([
              new DescriptionListNode.Item([
                new DescriptionListNode.Item.Term([new PlainTextNode('Apple')])
              ], new DescriptionListNode.Item.Description([
                bestFruitHeading,
                new ParagraphNode([new PlainTextNode('Really.')]),
                new DescriptionListNode([
                  new DescriptionListNode.Item([
                    new DescriptionListNode.Item.Term([new PlainTextNode('Pink lady')])
                  ], new DescriptionListNode.Item.Description([
                    pinkLadyHeading,
                    new ParagraphNode([new PlainTextNode('Really.')])
                  ]))
                ])
              ]))
            ])
          ], tableOfContents))
      })
    })

    specify('They can be nested arbitrarily deep within ordered lists, unordered lists, and description lists', () => {
      const markup = `
* I like apples.

  # Really.
  
    Apple
      The best fruit
      ==============
      
      Table: Apple varieties
      
      Apple;            Description
      Pink Lady;        Very crisp and sweet
      Red Delicious;    Very mushy and bland
      

      Purchasing
      ----------
      
      Chart: Where to buy apples

                        Target;   Walmart
      Pink Lady;        No;       Yes
      Red Delicious;    No;       No`

      const bestFruitHeading =
        new HeadingNode([new PlainTextNode('The best fruit')], 1)

      const table =
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Apple')]),
            new TableNode.Header.Cell([new PlainTextNode('Description')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Pink Lady')]),
              new TableNode.Row.Cell([new PlainTextNode('Very crisp and sweet')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Red Delicious')]),
              new TableNode.Row.Cell([new PlainTextNode('Very mushy and bland')])
            ])
          ],
          new TableNode.Caption([
            new PlainTextNode('Apple varieties')
          ]))

      const purchasingHeading =
        new HeadingNode([new PlainTextNode('Purchasing')], 2)

      const chart =
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Target')]),
            new TableNode.Header.Cell([new PlainTextNode('Walmart')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('No')]),
              new TableNode.Row.Cell([new PlainTextNode('Yes')])
            ], new TableNode.Header.Cell([new PlainTextNode('Pink Lady')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('No')]),
              new TableNode.Row.Cell([new PlainTextNode('No')])
            ], new TableNode.Header.Cell([new PlainTextNode('Red Delicious')]))
          ],
          new TableNode.Caption([
            new PlainTextNode('Where to buy apples')
          ]))

      const tableOfContents =
        new DocumentNode.TableOfContents([bestFruitHeading, table, purchasingHeading, chart])

      expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
        new DocumentNode([
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new ParagraphNode([new PlainTextNode('I like apples.')]),

              new OrderedListNode([
                new OrderedListNode.Item([
                  new ParagraphNode([new PlainTextNode('Really.')]),

                  new DescriptionListNode([
                    new DescriptionListNode.Item([
                      new DescriptionListNode.Item.Term([new PlainTextNode('Apple')])
                    ], new DescriptionListNode.Item.Description([
                      bestFruitHeading,
                      table,
                      purchasingHeading,
                      chart
                    ]))
                  ])
                ])
              ])
            ])
          ])
        ], tableOfContents))
    })


    context('However they cannot be inside:', () => {
      specify('Blockquotes', () => {
        const markup = `
> They're cheap
> -------------`

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            new BlockquoteNode([
              new HeadingNode([new PlainTextNode("They're cheap")], 1)
            ])
          ], NO_SPECIFIED_SOURCE_LINE_NUMBER))
      })

      specify('Spoiler blocks', () => {
        const markup = `
SPOILER:

  They're cheap
  -------------`

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            new SpoilerBlockNode([
              new HeadingNode([new PlainTextNode("They're cheap")], 1)
            ])
          ], NO_SPECIFIED_SOURCE_LINE_NUMBER))
      })

      specify('NSFW blocks', () => {
        const markup = `
NSFW:

  They're cheap
  -------------`

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            new NsfwBlockNode([
              new HeadingNode([new PlainTextNode("They're cheap")], 1)
            ])
          ], NO_SPECIFIED_SOURCE_LINE_NUMBER))
      })

      specify('NSFL blocks', () => {
        const markup = `
NSFL:

  They're cheap
  -------------`

        expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
          new DocumentNode([
            new NsflBlockNode([
              new HeadingNode([new PlainTextNode("They're cheap")], 1)
            ])
          ], NO_SPECIFIED_SOURCE_LINE_NUMBER))
      })
    })
  })


  describe("The entries in a table of contents reference the same syntax node objects that are in the document's syntax tree. This is true for entries", () => {
    specify("coming from the top level of the document", () => {
      const markup = `
The best fruit
==============

Table: Apple varieties

Apple;            Description
Pink Lady;        Very crisp and sweet
Red Delicious;    Very mushy and bland


Purchasing
----------

Chart: Where to buy apples

                  Target;   Walmart
Pink Lady;        No;       Yes
Red Delicious;    No;       No`

      const documentNode = Up.toAst(markup, { createTableOfContents: true })

      const [bestFruitHeading, table, purchasingHeading, chart] = documentNode.children
      const { entries } = documentNode.tableOfContents

      expect(entries[0] === bestFruitHeading).to.be.true
      expect(entries[1] === table).to.be.true
      expect(entries[2] === purchasingHeading).to.be.true
      expect(entries[3] === chart).to.be.true
    })

    specify("nested deep within other conventions", () => {
      const markup = `
* I like apples.

  # Really.
  
    Apple
      The best fruit
      ==============
      
      Table: Apple varieties
      
      Apple;            Description
      Pink Lady;        Very crisp and sweet
      Red Delicious;    Very mushy and bland
      

      Purchasing
      ----------
      
      Chart: Where to buy apples

                        Target;   Walmart
      Pink Lady;        No;       Yes
      Red Delicious;    No;       No`

      const documentNode = Up.toAst(markup, { createTableOfContents: true })

      const unorderedList = documentNode.children[0] as UnorderedListNode
      const orderedList = unorderedList.items[0].children[1] as OrderedListNode
      const descriptionList = orderedList.items[0].children[1] as DescriptionListNode

      const [bestFruitHeading, table, purchasingHeading, chart] = descriptionList.items[0].description.children
      const { entries } = documentNode.tableOfContents

      expect(entries[0] === bestFruitHeading).to.be.true
      expect(entries[1] === table).to.be.true
      expect(entries[2] === purchasingHeading).to.be.true
      expect(entries[3] === chart).to.be.true
    })
  })
})

*/
/*
  specify('Footnote blocks', () => {
      const markup = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

      const footnote = new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)

      const tableOfContents =
        new DocumentNode.TableOfContents([heading])

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          heading,
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal."),
            footnote,
            new PlainTextNode(" Never have.")
          ]),
          new FootnoteBlockNode([footnote])
        ], tableOfContents))
    })
    */