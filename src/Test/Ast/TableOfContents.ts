import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'

const NO_TABLE_OF_CONTENTS: DocumentNode.TableOfContents = undefined


context("A document is not given a table of contents if", () => {
  specify('the "createTableOfContents" config setting is not set to true', () => {
    const markup = `
I enjoy apples
==============`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
      ], NO_TABLE_OF_CONTENTS))
  })

  specify("the 'createTableOfContents' config setting is set to true, but the document has no outline conventions that would be put into its table of contents", () => {
    const markup = `
Can you guess what this chart represents?

Chart:

        1;      0
1;      true;   false
0;      false;  false


SPOILER:
  The answer!
  -----------
  
  The chart represents the logic for the \`AND\` operator.`

    expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Can you guess what this chart represents?')]),
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
          ]),
        new SpoilerBlockNode([
          new HeadingNode([new PlainTextNode('The answer!')], 1),
          new ParagraphNode([
            new PlainTextNode('The chart represents the logic for the '),
            new InlineCodeNode('AND'),
            new PlainTextNode(' operator.'),
          ])
        ])
      ], NO_TABLE_OF_CONTENTS))
  })
})


context('A document is given a table of contents if the "createTableOfContents" config setting is set to true and the document contains', () => {
  const up = new Up({
    createTableOfContents: true
  })

  specify('a heading', () => {
    const markup = `
I enjoy apples
==============`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([heading], tableOfContents))
  })

  specify('a table with a caption', () => {
    const markup = `
Table: Games in the Chrono series

Game;             Release Date

Chrono Trigger;   1995
Chrono Cross;     1999`

    const table =
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
        ]))

    const tableOfContents =
      new DocumentNode.TableOfContents([table])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([table], tableOfContents))
  })

  specify('a chart with a caption', () => {
    const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

    const chart =
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
        ]))

    const tableOfContents =
      new DocumentNode.TableOfContents([chart])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([chart], tableOfContents))
  })
})


context('The table of contents of a document does not include most conventions. Specifically, it does not include:', () => {
  const up = new Up({
    createTableOfContents: true
  })

  specify('Paragraphs', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

Who doesn't?`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Anyway, let's get to the point.")]),
        heading,
        new ParagraphNode([new PlainTextNode("Who doesn't?")])
      ], tableOfContents))
  })

  specify('Ordered lists', () => {
    const markup = `
I enjoy apples
==============

1. They're cheap
2. They're delicious`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        heading,
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([new PlainTextNode("They're cheap")])
          ], 1),
          new OrderedListNode.Item([
            new ParagraphNode([new PlainTextNode("They're delicious")])
          ], 2)
        ])
      ], tableOfContents))
  })

  specify('Unordered lists', () => {
    const markup = `
I enjoy apples
==============

* They're cheap
* They're delicious`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        heading,
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([new PlainTextNode("They're cheap")])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([new PlainTextNode("They're delicious")])
          ])
        ])
      ], tableOfContents))
  })

  specify('Description lists', () => {
    const markup = `
I enjoy apples
==============

Apples
  They're delicious.`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        heading,
        new DescriptionListNode([
          new DescriptionListNode.Item([
            new DescriptionListNode.Item.Term([new PlainTextNode('Apples')])
          ],
            new DescriptionListNode.Item.Description([
              new ParagraphNode([new PlainTextNode("They're delicious.")])
            ]))
        ])
      ], tableOfContents))
  })

  specify('Line blocks', () => {
    const markup = `
I enjoy apples
==============

Roses are read
Apples are blue`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        heading,
        new LineBlockNode([
          new LineBlockNode.Line([
            new PlainTextNode("Roses are read")
          ]),
          new LineBlockNode.Line([
            new PlainTextNode("Apples are blue")
          ])
        ])
      ], tableOfContents))
  })

  specify('Spoiler blocks', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

SPOILER:
  Who doesn't?`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Anyway, let's get to the point.")]),
        heading,
        new SpoilerBlockNode([
          new ParagraphNode([new PlainTextNode("Who doesn't?")])
        ])
      ], tableOfContents))
  })

  specify('NSFW blocks', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

NSFW:
  Who doesn't?`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Anyway, let's get to the point.")]),
        heading,
        new NsfwBlockNode([
          new ParagraphNode([new PlainTextNode("Who doesn't?")])
        ])
      ], tableOfContents))
  })

  specify('NSFL blocks', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

NSFL:
  Who doesn't?`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Anyway, let's get to the point.")]),
        heading,
        new NsflBlockNode([
          new ParagraphNode([new PlainTextNode("Who doesn't?")])
        ])
      ], tableOfContents))
  })

  specify('Blockquotes', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

> Who doesn't?`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Anyway, let's get to the point.")]),
        heading,
        new BlockquoteNode([
          new ParagraphNode([new PlainTextNode("Who doesn't?")])
        ])
      ], tableOfContents))
  })

  specify('Outline separators', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

Who doesn't?

~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

No one!`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode("Anyway, let's get to the point.")]),
        heading,
        new ParagraphNode([new PlainTextNode("Who doesn't?")]),
        new OutlineSeparatorNode(),
        new ParagraphNode([new PlainTextNode("No one!")])
      ], tableOfContents))
  })

  specify('Code blocks', () => {
    const markup = `
I enjoy apples
==============

\`\`\`
const reason = "They are cheap and delicious."
\`\`\``

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        heading,
        new CodeBlockNode('const reason = "They are cheap and delicious."'),
      ], tableOfContents))
  })

  specify('Footnote blocks', () => {
    const markup = `
I enjoy apples
==============

I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

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

  specify("Tables without captions", () => {
    const markup = `
The Chrono series
=================

Table:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`
    const heading =
      new HeadingNode([new PlainTextNode('The Chrono series')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
      new DocumentNode([
        heading,
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
          ])
      ], tableOfContents))
  })

  specify("Charts without captions", () => {
    const markup = `
Boolean logic
=============

Chart:

        1;      0
1;      true;   false
0;      false;  false`
    const heading =
      new HeadingNode([new PlainTextNode('Boolean logic')], 1)

    const tableOfContents =
      new DocumentNode.TableOfContents([heading])

    expect(Up.toAst(markup, { createTableOfContents: true })).to.be.eql(
      new DocumentNode([
        heading,
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
          ])
      ], tableOfContents))
  })


  // TODO: Consider including outlined media conventions in the table of contents
  context("Outlined media:", () => {
    specify('Audio', () => {
      const markup = `
Haunted houses
==============

[audio: haunted house] (example.com/hauntedhouse.ogg)`

      const heading =
        new HeadingNode([new PlainTextNode('Haunted houses')], 1)

      const tableOfContents =
        new DocumentNode.TableOfContents([heading])

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          heading,
          new AudioNode('haunted house', 'https://example.com/hauntedhouse.ogg')
        ], tableOfContents))
    })

    specify('Images', () => {
      const markup = `
Haunted houses
==============

[image: haunted house] (example.com/hauntedhouse.svg)`

      const heading =
        new HeadingNode([new PlainTextNode('Haunted houses')], 1)

      const tableOfContents =
        new DocumentNode.TableOfContents([heading])

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          heading,
          new ImageNode('haunted house', 'https://example.com/hauntedhouse.svg')
        ], tableOfContents))
    })

    specify('Videos', () => {
      const markup = `
Haunted houses
==============

[video: haunted house] (example.com/hauntedhouse.webm)`

      const heading =
        new HeadingNode([new PlainTextNode('Haunted houses')], 1)

      const tableOfContents =
        new DocumentNode.TableOfContents([heading])

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          heading,
          new VideoNode('haunted house', 'https://example.com/hauntedhouse.webm')
        ], tableOfContents))
    })


    specify('Links containing an outlined media convention', () => {
      const markup = `
Haunted houses
==============

[image: haunted house] (example.com/hauntedhouse.svg) (example.com/gallery)`

      const heading =
        new HeadingNode([new PlainTextNode('Haunted houses')], 1)

      const tableOfContents =
        new DocumentNode.TableOfContents([heading])

      expect(up.toAst(markup)).to.be.eql(
        new DocumentNode([
          heading,
          new LinkNode([
            new ImageNode('haunted house', 'https://example.com/hauntedhouse.svg')
          ], 'https://example.com/gallery')
        ], tableOfContents))
    })
  })
})



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
        ], NO_TABLE_OF_CONTENTS))
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
        ], NO_TABLE_OF_CONTENTS))
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
        ], NO_TABLE_OF_CONTENTS))
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
        ], NO_TABLE_OF_CONTENTS))
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

    const document = Up.toAst(markup, { createTableOfContents: true })

    const [bestFruitHeading, table, purchasingHeading, chart] = document.children
    const { entries } = document.tableOfContents

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

    const document = Up.toAst(markup, { createTableOfContents: true })

    const unorderedList = document.children[0] as UnorderedListNode
    const orderedList = unorderedList.items[0].children[1] as OrderedListNode
    const descriptionList = orderedList.items[0].children[1] as DescriptionListNode

    const [bestFruitHeading, table, purchasingHeading, chart] = descriptionList.items[0].description.children
    const { entries } = document.tableOfContents

    expect(entries[0] === bestFruitHeading).to.be.true
    expect(entries[1] === table).to.be.true
    expect(entries[2] === purchasingHeading).to.be.true
    expect(entries[3] === chart).to.be.true
  })
})
