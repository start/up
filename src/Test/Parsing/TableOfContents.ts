import { expect } from 'chai'
import Up = require('../../index')
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'


describe('The table of contents', () => {
  it('produces entries for headings', () => {
    const markup = `
I enjoy apples
==============

I enjoy milk
------------`
    const appleHeading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const milkHeading =
      new Up.Heading([new Up.PlainText('I enjoy milk')], { level: 2, ordinalInTableOfContents: 2 })

    const tableOfContents =
      new Up.Document.TableOfContents([appleHeading, milkHeading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        appleHeading,
        milkHeading,
      ], tableOfContents))
  })
})


context('The table of contents only produces entries for headings. It does not produce entries for:', () => {
  specify('Paragraphs', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

Who doesn't?`

    const heading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText("Anyway, let's get to the point.")]),
        heading,
        new Up.Paragraph([new Up.PlainText("Who doesn't?")])
      ], tableOfContents))
  })

  specify('Ordered lists', () => {
    const markup = `
I enjoy apples
==============

1. They're cheap
2. They're delicious`

    const heading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([new Up.PlainText("They're cheap")])
          ], { ordinal: 1 }),
          new Up.OrderedList.Item([
            new Up.Paragraph([new Up.PlainText("They're delicious")])
          ], { ordinal: 2 })
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([new Up.PlainText("They're cheap")])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([new Up.PlainText("They're delicious")])
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.PlainText('Apples')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([new Up.PlainText("They're delicious.")])
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.PlainText("Roses are read")
          ]),
          new Up.LineBlock.Line([
            new Up.PlainText("Apples are blue")
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText("Anyway, let's get to the point.")]),
        heading,
        new Up.SpoilerBlock([
          new Up.Paragraph([new Up.PlainText("Who doesn't?")])
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText("Anyway, let's get to the point.")]),
        heading,
        new Up.NsfwBlock([
          new Up.Paragraph([new Up.PlainText("Who doesn't?")])
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText("Anyway, let's get to the point.")]),
        heading,
        new Up.NsflBlock([
          new Up.Paragraph([new Up.PlainText("Who doesn't?")])
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText("Anyway, let's get to the point.")]),
        heading,
        new Up.Blockquote([
          new Up.Paragraph([new Up.PlainText("Who doesn't?")])
        ])
      ], tableOfContents))
  })

  specify('Thematic breaks', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

Who doesn't?

~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-

No one!`

    const heading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText("Anyway, let's get to the point.")]),
        heading,
        new Up.Paragraph([new Up.PlainText("Who doesn't?")]),
        new Up.ThematicBreak(),
        new Up.Paragraph([new Up.PlainText("No one!")])
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
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.CodeBlock('const reason = "They are cheap and delicious."'),
      ], tableOfContents))
  })

  specify('Footnote blocks', () => {
    const markup = `
I enjoy apples
==============

I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

    const heading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.PlainText(" Never have.")
        ]),
        new Up.FootnoteBlock([footnote])
      ], tableOfContents))
  })

  specify("Tables", () => {
    const markup = `
The Chrono series
=================

Table: Games in the Chrono series

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`
    const heading =
      new Up.Heading([new Up.PlainText('The Chrono series')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ])
          ],
          new Up.Table.Caption([
            new Up.PlainText('Games in the Chrono series')
          ]))
      ], tableOfContents))
  })

  specify("Charts", () => {
    const markup = `
Boolean logic
=============

Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`
    const heading =
      new Up.Heading([new Up.PlainText('Boolean logic')], { level: 1, ordinalInTableOfContents: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
          ],
          new Up.Table.Caption([
            new Up.InlineCode('AND'),
            new Up.PlainText(' operator logic')
          ]))
      ], tableOfContents))
  })


  context("Outlined media:", () => {
    specify('Audio', () => {
      const markup = `
Haunted houses
==============

[audio: haunted house] (example.com/hauntedhouse.ogg)`

      const heading =
        new Up.Heading([new Up.PlainText('Haunted houses')], { level: 1, ordinalInTableOfContents: 1 })

      const tableOfContents =
        new Up.Document.TableOfContents([heading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          heading,
          new Up.Audio('haunted house', 'https://example.com/hauntedhouse.ogg')
        ], tableOfContents))
    })

    specify('Images', () => {
      const markup = `
Haunted houses
==============

[image: haunted house] (example.com/hauntedhouse.svg)`

      const heading =
        new Up.Heading([new Up.PlainText('Haunted houses')], { level: 1, ordinalInTableOfContents: 1 })

      const tableOfContents =
        new Up.Document.TableOfContents([heading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          heading,
          new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg')
        ], tableOfContents))
    })

    specify('Videos', () => {
      const markup = `
Haunted houses
==============

[video: haunted house] (example.com/hauntedhouse.webm)`

      const heading =
        new Up.Heading([new Up.PlainText('Haunted houses')], { level: 1, ordinalInTableOfContents: 1 })

      const tableOfContents =
        new Up.Document.TableOfContents([heading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          heading,
          new Up.Video('haunted house', 'https://example.com/hauntedhouse.webm')
        ], tableOfContents))
    })


    specify('Links containing an outlined media convention', () => {
      const markup = `
Haunted houses
==============

[image: haunted house] (example.com/hauntedhouse.svg) (example.com/gallery)`

      const heading =
        new Up.Heading([new Up.PlainText('Haunted houses')], { level: 1, ordinalInTableOfContents: 1 })

      const tableOfContents =
        new Up.Document.TableOfContents([heading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          heading,
          new Up.Link([
            new Up.Image('haunted house', 'https://example.com/hauntedhouse.svg')
          ], 'https://example.com/gallery')
        ], tableOfContents))
    })
  })
})



context("Headings don't have to be at the top level of the document to be included in the table of contents.", () => {
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
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const cheapHeading =
        new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

      const deliciousHeading =
        new Up.Heading([new Up.PlainText("They're delicious")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.OrderedList([
            new Up.OrderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.PlainText("Very cheap.")])
            ], { ordinal: 1 }),
            new Up.OrderedList.Item([
              deliciousHeading,
              new Up.Paragraph([new Up.PlainText("Very delicious.")])
            ], { ordinal: 2 })
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
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const cheapHeading =
        new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

      const costHeading =
        new Up.Heading([new Up.PlainText("Cost")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.OrderedList([
            new Up.OrderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.PlainText("Very cheap.")]),
              new Up.OrderedList([
                new Up.OrderedList.Item([
                  costHeading,
                  new Up.Paragraph([new Up.PlainText("Typically, apples cost twenty dolloars per pound.")])
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
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const cheapHeading =
        new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

      const deliciousHeading =
        new Up.Heading([new Up.PlainText("They're delicious")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.PlainText("Very cheap.")])
            ]),
            new Up.UnorderedList.Item([
              deliciousHeading,
              new Up.Paragraph([new Up.PlainText("Very delicious.")])
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
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const cheapHeading =
        new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

      const costHeading =
        new Up.Heading([new Up.PlainText("Cost")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.PlainText("Very cheap.")]),
              new Up.UnorderedList([
                new Up.UnorderedList.Item([
                  costHeading,
                  new Up.Paragraph([new Up.PlainText("Typically, apples cost twenty dolloars per pound.")])
                ])
              ])
            ])
          ])
        ], tableOfContents))
    })

    specify('Blockquotes', () => {
      const markup = `
I enjoy apples
==============

> They're cheap
> -------------
>
> Very cheap.`

      const applesHeading =
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const cheapHeading =
        new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.Blockquote([
            cheapHeading,
            new Up.Paragraph([new Up.PlainText("Very cheap.")])
          ])
        ], tableOfContents))
    })

    specify('Nested blockquotes', () => {
      const markup = `
I enjoy apples
==============

> They're cheap
> -------------
>
> Very cheap.
>
> > Cost
> > ----
> >
> > Typically, apples cost twenty dolloars per pound.`

      const applesHeading =
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const cheapHeading =
        new Up.Heading([new Up.PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

      const costHeading =
        new Up.Heading([new Up.PlainText("Cost")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.Blockquote([
            cheapHeading,
            new Up.Paragraph([new Up.PlainText("Very cheap.")]),
            new Up.Blockquote([
              costHeading,
              new Up.Paragraph([new Up.PlainText("Typically, apples cost twenty dolloars per pound.")])
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
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const bestFruitHeading =
        new Up.Heading([new Up.PlainText("The best fruit")], { level: 2, ordinalInTableOfContents: 2 })

      const pinkLadyHeading =
        new Up.Heading([new Up.PlainText("The best apple")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Apple')])
            ], new Up.DescriptionList.Item.Description([
              bestFruitHeading,
              new Up.Paragraph([new Up.PlainText('Really.')])
            ])),
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Pink lady')])
            ], new Up.DescriptionList.Item.Description([
              pinkLadyHeading,
              new Up.Paragraph([new Up.PlainText('Really.')])
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
        new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

      const bestFruitHeading =
        new Up.Heading([new Up.PlainText("The best fruit")], { level: 2, ordinalInTableOfContents: 2 })

      const pinkLadyHeading =
        new Up.Heading([new Up.PlainText("The best apple")], { level: 2, ordinalInTableOfContents: 3 })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.PlainText('Apple')])
            ], new Up.DescriptionList.Item.Description([
              bestFruitHeading,
              new Up.Paragraph([new Up.PlainText('Really.')]),
              new Up.DescriptionList([
                new Up.DescriptionList.Item([
                  new Up.DescriptionList.Item.Subject([new Up.PlainText('Pink lady')])
                ], new Up.DescriptionList.Item.Description([
                  pinkLadyHeading,
                  new Up.Paragraph([new Up.PlainText('Really.')])
                ]))
              ])
            ]))
          ])
        ], tableOfContents))
    })
  })

  specify('They can be nested arbitrarily deep within ordered lists, unordered lists, description lists, and blockquotes', () => {
    const markup = `
* I like apples.

  #) Really.
  
    Apple
      The best fruit
      ==============
      
      > Purchasing
      > ----------`

    const bestFruitHeading =
      new Up.Heading([new Up.PlainText('The best fruit')], { level: 1, ordinalInTableOfContents: 1 })

    const purchasingHeading =
      new Up.Heading([new Up.PlainText('Purchasing')], { level: 2, ordinalInTableOfContents: 2 })

    const tableOfContents =
      new Up.Document.TableOfContents([bestFruitHeading, purchasingHeading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([new Up.PlainText('I like apples.')]),

            new Up.OrderedList([
              new Up.OrderedList.Item([
                new Up.Paragraph([new Up.PlainText('Really.')]),

                new Up.DescriptionList([
                  new Up.DescriptionList.Item([
                    new Up.DescriptionList.Item.Subject([new Up.PlainText('Apple')])
                  ], new Up.DescriptionList.Item.Description([
                    bestFruitHeading,
                    new Up.Blockquote([
                      purchasingHeading
                    ])
                  ]))
                ])
              ])
            ])
          ])
        ])
      ], tableOfContents))
  })


  context('However they cannot be inside revealable blocks:', () => {
    specify('Spoiler blocks', () => {
      const markup = `
SPOILER:

  They're cheap
  -------------`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.SpoilerBlock([
            new Up.Heading([new Up.PlainText("They're cheap")], { level: 1 })
          ])
        ], new Up.Document.TableOfContents([])))
    })

    specify('NSFW blocks', () => {
      const markup = `
NSFW:

  They're cheap
  -------------`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NsfwBlock([
            new Up.Heading([new Up.PlainText("They're cheap")], { level: 1 })
          ])
        ], new Up.Document.TableOfContents([])))
    })

    specify('NSFL blocks', () => {
      const markup = `
NSFL:

  They're cheap
  -------------`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Heading([new Up.PlainText("They're cheap")], { level: 1 })
          ])
        ], new Up.Document.TableOfContents([])))
    })
  })
})


describe("The entries in a table of contents reference the same syntax node objects that are in the document's syntax tree. This is true for entries", () => {
  specify("coming from the top level of the document", () => {
    const markup = `
The best fruit
==============

Purchasing
----------`

    const document = Up.parse(markup)

    const [bestFruitHeading, purchasingHeading] = document.children as any[]
    const entries = document.tableOfContents.entries as any[]

    expect(entries[0] === bestFruitHeading).to.be.true
    expect(entries[1] === purchasingHeading).to.be.true
  })

  specify("nested deep within other conventions", () => {
    const markup = `
* I like apples.

  # Really.
  
    Apple
      The best fruit
      ==============

      Purchasing
      ----------`

    const document = Up.parse(markup)

    const unorderedList = document.children[0] as UnorderedList
    const orderedList = unorderedList.items[0].children[1] as OrderedList
    const descriptionList = orderedList.items[0].children[1] as DescriptionList

    const [bestFruitHeading, purchasingHeading] = descriptionList.items[0].description.children as any[]
    const entries = document.tableOfContents.entries as any[]

    expect(entries[0] === bestFruitHeading).to.be.true
    expect(entries[1] === purchasingHeading).to.be.true
  })
})
