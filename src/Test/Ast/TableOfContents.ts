import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Table } from '../../SyntaxNodes/Table'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { OutlineSeparator } from '../../SyntaxNodes/OutlineSeparator'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { Heading } from '../../SyntaxNodes/Heading'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { Link } from '../../SyntaxNodes/Link'


const NO_TABLE_OF_CONTENTS: UpDocument.TableOfContents = undefined

// TODO: Rewrite


context("A document is not given a table of contents if", () => {
  specify('the "createTableOfContents" config setting is not set to true', () => {
    const markup = `
I enjoy apples
==============`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Heading([new PlainText('I enjoy apples')], 1),
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText('Can you guess what this chart represents?')]),
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
          ]),
        new SpoilerBlock([
          new Heading([new PlainText('The answer!')], 1),
          new Paragraph([
            new PlainText('The chart represents the logic for the '),
            new InlineCode('AND'),
            new PlainText(' operator.'),
          ])
        ])
      ], NO_TABLE_OF_CONTENTS))
  })
})


context('A document is given a table of contents if the "createTableOfContents" config setting is set to true and the document contains', () => {
  specify('a heading', () => {
    const markup = `
I enjoy apples
==============`

    const heading =
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([heading], tableOfContents))
  })

  specify('a table with a caption', () => {
    const markup = `
Table: Games in the Chrono series

Game;             Release Date

Chrono Trigger;   1995
Chrono Cross;     1999`

    const table =
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
        ]))

    const tableOfContents =
      new UpDocument.TableOfContents([table])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([table], tableOfContents))
  })

  specify('a chart with a caption', () => {
    const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

    const chart =
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
        ]))

    const tableOfContents =
      new UpDocument.TableOfContents([chart])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([chart], tableOfContents))
  })
})


context('The table of contents of a document does not include most conventions. Specifically, it does not include:', () => {
  specify('Paragraphs', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

Who doesn't?`

    const heading =
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText("Anyway, let's get to the point.")]),
        heading,
        new Paragraph([new PlainText("Who doesn't?")])
      ], tableOfContents))
  })

  specify('Ordered lists', () => {
    const markup = `
I enjoy apples
==============

1. They're cheap
2. They're delicious`

    const heading =
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([new PlainText("They're cheap")])
          ], 1),
          new OrderedList.Item([
            new Paragraph([new PlainText("They're delicious")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([new PlainText("They're cheap")])
          ]),
          new UnorderedList.Item([
            new Paragraph([new PlainText("They're delicious")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Term([new PlainText('Apples')])
          ],
            new DescriptionList.Item.Description([
              new Paragraph([new PlainText("They're delicious.")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new LineBlock([
          new LineBlock.Line([
            new PlainText("Roses are read")
          ]),
          new LineBlock.Line([
            new PlainText("Apples are blue")
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText("Anyway, let's get to the point.")]),
        heading,
        new SpoilerBlock([
          new Paragraph([new PlainText("Who doesn't?")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText("Anyway, let's get to the point.")]),
        heading,
        new NsfwBlock([
          new Paragraph([new PlainText("Who doesn't?")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText("Anyway, let's get to the point.")]),
        heading,
        new NsflBlock([
          new Paragraph([new PlainText("Who doesn't?")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText("Anyway, let's get to the point.")]),
        heading,
        new Blockquote([
          new Paragraph([new PlainText("Who doesn't?")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText("Anyway, let's get to the point.")]),
        heading,
        new Paragraph([new PlainText("Who doesn't?")]),
        new OutlineSeparator(),
        new Paragraph([new PlainText("No one!")])
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
      new Heading([new PlainText('I enjoy apples')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new CodeBlock('const reason = "They are cheap and delicious."'),
      ], tableOfContents))
  })

  specify('Footnote blocks', () => {
    const markup = `
I enjoy apples
==============

I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

    const heading =
      new Heading([new PlainText('I enjoy apples')], 1)

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have.")
        ]),
        new FootnoteBlock([footnote])
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
      new Heading([new PlainText('The Chrono series')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
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
      new Heading([new PlainText('Boolean logic')], 1)

    const tableOfContents =
      new UpDocument.TableOfContents([heading])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        heading,
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
        new Heading([new PlainText('Haunted houses')], 1)

      const tableOfContents =
        new UpDocument.TableOfContents([heading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          heading,
          new Audio('haunted house', 'https://example.com/hauntedhouse.ogg')
        ], tableOfContents))
    })

    specify('Images', () => {
      const markup = `
Haunted houses
==============

[image: haunted house] (example.com/hauntedhouse.svg)`

      const heading =
        new Heading([new PlainText('Haunted houses')], 1)

      const tableOfContents =
        new UpDocument.TableOfContents([heading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          heading,
          new Image('haunted house', 'https://example.com/hauntedhouse.svg')
        ], tableOfContents))
    })

    specify('Videos', () => {
      const markup = `
Haunted houses
==============

[video: haunted house] (example.com/hauntedhouse.webm)`

      const heading =
        new Heading([new PlainText('Haunted houses')], 1)

      const tableOfContents =
        new UpDocument.TableOfContents([heading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          heading,
          new Video('haunted house', 'https://example.com/hauntedhouse.webm')
        ], tableOfContents))
    })


    specify('Links containing an outlined media convention', () => {
      const markup = `
Haunted houses
==============

[image: haunted house] (example.com/hauntedhouse.svg) (example.com/gallery)`

      const heading =
        new Heading([new PlainText('Haunted houses')], 1)

      const tableOfContents =
        new UpDocument.TableOfContents([heading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          heading,
          new Link([
            new Image('haunted house', 'https://example.com/hauntedhouse.svg')
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
        new Heading([new PlainText('I enjoy apples')], 1)

      const cheapHeading =
        new Heading([new PlainText("They're cheap")], 2)

      const deliciousHeading =
        new Heading([new PlainText("They're delicious")], 2)

      const tableOfContents =
        new UpDocument.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          applesHeading,
          new OrderedList([
            new OrderedList.Item([
              cheapHeading,
              new Paragraph([new PlainText("Very cheap.")])
            ], 1),
            new OrderedList.Item([
              deliciousHeading,
              new Paragraph([new PlainText("Very delicious.")])
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
        new Heading([new PlainText('I enjoy apples')], 1)

      const cheapHeading =
        new Heading([new PlainText("They're cheap")], 2)

      const costHeading =
        new Heading([new PlainText("Cost")], 2)

      const tableOfContents =
        new UpDocument.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          applesHeading,
          new OrderedList([
            new OrderedList.Item([
              cheapHeading,
              new Paragraph([new PlainText("Very cheap.")]),
              new OrderedList([
                new OrderedList.Item([
                  costHeading,
                  new Paragraph([new PlainText("Typically, apples cost twenty dolloars per pound.")])
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
        new Heading([new PlainText('I enjoy apples')], 1)

      const cheapHeading =
        new Heading([new PlainText("They're cheap")], 2)

      const deliciousHeading =
        new Heading([new PlainText("They're delicious")], 2)

      const tableOfContents =
        new UpDocument.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          applesHeading,
          new UnorderedList([
            new UnorderedList.Item([
              cheapHeading,
              new Paragraph([new PlainText("Very cheap.")])
            ]),
            new UnorderedList.Item([
              deliciousHeading,
              new Paragraph([new PlainText("Very delicious.")])
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
        new Heading([new PlainText('I enjoy apples')], 1)

      const cheapHeading =
        new Heading([new PlainText("They're cheap")], 2)

      const costHeading =
        new Heading([new PlainText("Cost")], 2)

      const tableOfContents =
        new UpDocument.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          applesHeading,
          new UnorderedList([
            new UnorderedList.Item([
              cheapHeading,
              new Paragraph([new PlainText("Very cheap.")]),
              new UnorderedList([
                new UnorderedList.Item([
                  costHeading,
                  new Paragraph([new PlainText("Typically, apples cost twenty dolloars per pound.")])
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
        new Heading([new PlainText('I enjoy apples')], 1)

      const bestFruitHeading =
        new Heading([new PlainText("The best fruit")], 2)

      const pinkLadyHeading =
        new Heading([new PlainText("The best apple")], 2)

      const tableOfContents =
        new UpDocument.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          applesHeading,
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Term([new PlainText('Apple')])
            ], new DescriptionList.Item.Description([
              bestFruitHeading,
              new Paragraph([new PlainText('Really.')])
            ])),
            new DescriptionList.Item([
              new DescriptionList.Item.Term([new PlainText('Pink lady')])
            ], new DescriptionList.Item.Description([
              pinkLadyHeading,
              new Paragraph([new PlainText('Really.')])
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
        new Heading([new PlainText('I enjoy apples')], 1)

      const bestFruitHeading =
        new Heading([new PlainText("The best fruit")], 2)

      const pinkLadyHeading =
        new Heading([new PlainText("The best apple")], 2)

      const tableOfContents =
        new UpDocument.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          applesHeading,
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Term([new PlainText('Apple')])
            ], new DescriptionList.Item.Description([
              bestFruitHeading,
              new Paragraph([new PlainText('Really.')]),
              new DescriptionList([
                new DescriptionList.Item([
                  new DescriptionList.Item.Term([new PlainText('Pink lady')])
                ], new DescriptionList.Item.Description([
                  pinkLadyHeading,
                  new Paragraph([new PlainText('Really.')])
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
      new Heading([new PlainText('The best fruit')], 1)

    const table =
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Apple')]),
          new Table.Header.Cell([new PlainText('Description')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Pink Lady')]),
            new Table.Row.Cell([new PlainText('Very crisp and sweet')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Red Delicious')]),
            new Table.Row.Cell([new PlainText('Very mushy and bland')])
          ])
        ],
        new Table.Caption([
          new PlainText('Apple varieties')
        ]))

    const purchasingHeading =
      new Heading([new PlainText('Purchasing')], 2)

    const chart =
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('Target')]),
          new Table.Header.Cell([new PlainText('Walmart')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('No')]),
            new Table.Row.Cell([new PlainText('Yes')])
          ], new Table.Header.Cell([new PlainText('Pink Lady')])),
          new Table.Row([
            new Table.Row.Cell([new PlainText('No')]),
            new Table.Row.Cell([new PlainText('No')])
          ], new Table.Header.Cell([new PlainText('Red Delicious')]))
        ],
        new Table.Caption([
          new PlainText('Where to buy apples')
        ]))

    const tableOfContents =
      new UpDocument.TableOfContents([bestFruitHeading, table, purchasingHeading, chart])

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([new PlainText('I like apples.')]),

            new OrderedList([
              new OrderedList.Item([
                new Paragraph([new PlainText('Really.')]),

                new DescriptionList([
                  new DescriptionList.Item([
                    new DescriptionList.Item.Term([new PlainText('Apple')])
                  ], new DescriptionList.Item.Description([
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

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Blockquote([
            new Heading([new PlainText("They're cheap")], 1)
          ])
        ], NO_TABLE_OF_CONTENTS))
    })

    specify('Spoiler blocks', () => {
      const markup = `
SPOILER:

  They're cheap
  -------------`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new SpoilerBlock([
            new Heading([new PlainText("They're cheap")], 1)
          ])
        ], NO_TABLE_OF_CONTENTS))
    })

    specify('NSFW blocks', () => {
      const markup = `
NSFW:

  They're cheap
  -------------`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new NsfwBlock([
            new Heading([new PlainText("They're cheap")], 1)
          ])
        ], NO_TABLE_OF_CONTENTS))
    })

    specify('NSFL blocks', () => {
      const markup = `
NSFL:

  They're cheap
  -------------`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new NsflBlock([
            new Heading([new PlainText("They're cheap")], 1)
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

    const document = Up.toDocument(markup)

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

    const document = Up.toDocument(markup)

    const unorderedList = document.children[0] as UnorderedList
    const orderedList = unorderedList.items[0].children[1] as OrderedList
    const descriptionList = orderedList.items[0].children[1] as DescriptionList

    const [bestFruitHeading, table, purchasingHeading, chart] = descriptionList.items[0].description.children
    const { entries } = document.tableOfContents

    expect(entries[0] === bestFruitHeading).to.be.true
    expect(entries[1] === table).to.be.true
    expect(entries[2] === purchasingHeading).to.be.true
    expect(entries[3] === chart).to.be.true
  })
})
