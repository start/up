import { expect } from 'chai'
import * as Up from '../../Main'
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const milkHeading =
      new Up.Heading([new Up.Text('I enjoy milk')], {
        level: 2,
        searchableMarkup: "I enjoy milk",
        ordinalInTableOfContents: 2
      })

    const tableOfContents =
      new Up.Document.TableOfContents([appleHeading, milkHeading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        appleHeading,
        milkHeading
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text("Anyway, let's get to the point.")]),
        heading,
        new Up.Paragraph([new Up.Text("Who doesn't?")])
      ], tableOfContents))
  })

  specify('Ordered lists', () => {
    const markup = `
I enjoy apples
==============

1. They're cheap
2. They're delicious`

    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([new Up.Text("They're cheap")])
          ], { ordinal: 1 }),
          new Up.OrderedList.Item([
            new Up.Paragraph([new Up.Text("They're delicious")])
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([new Up.Text("They're cheap")])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([new Up.Text("They're delicious")])
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Apples')])
          ],
            new Up.DescriptionList.Item.Description([
              new Up.Paragraph([new Up.Text("They're delicious.")])
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text("Roses are read")
          ]),
          new Up.LineBlock.Line([
            new Up.Text("Apples are blue")
          ])
        ])
      ], tableOfContents))
  })

  specify('Revealable blocks', () => {
    const markup = `
Anyway, let's get to the point.

I enjoy apples
==============

SPOILER:
  Who doesn't?`

    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text("Anyway, let's get to the point.")]),
        heading,
        new Up.RevealableBlock([
          new Up.Paragraph([new Up.Text("Who doesn't?")])
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text("Anyway, let's get to the point.")]),
        heading,
        new Up.Blockquote([
          new Up.Paragraph([new Up.Text("Who doesn't?")])
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text("Anyway, let's get to the point.")]),
        heading,
        new Up.Paragraph([new Up.Text("Who doesn't?")]),
        new Up.ThematicBreak(),
        new Up.Paragraph([new Up.Text("No one!")])
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
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.CodeBlock('const reason = "They are cheap and delicious."')
      ], tableOfContents))
  })

  specify('Footnote blocks', () => {
    const markup = `
I enjoy apples
==============

I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        searchableMarkup: "I enjoy apples",
        ordinalInTableOfContents: 1
      })

    const footnote = new Up.Footnote([
      new Up.Text('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
          footnote,
          new Up.Text(" Never have.")
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
      new Up.Heading([new Up.Text('The Chrono series')], {
        level: 1,
        searchableMarkup: "The Chrono series",
        ordinalInTableOfContents: 1
      })

    const tableOfContents =
      new Up.Document.TableOfContents([heading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        heading,
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
        new Up.Heading([new Up.Text('Haunted houses')], {
          level: 1,
          searchableMarkup: "Haunted houses",
          ordinalInTableOfContents: 1
        })

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
        new Up.Heading([new Up.Text('Haunted houses')], {
          level: 1,
          searchableMarkup: "Haunted houses",
          ordinalInTableOfContents: 1
        })

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
        new Up.Heading([new Up.Text('Haunted houses')], {
          level: 1,
          searchableMarkup: "Haunted houses",
          ordinalInTableOfContents: 1
        })

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
        new Up.Heading([new Up.Text('Haunted houses')], {
          level: 1,
          searchableMarkup: "Haunted houses",
          ordinalInTableOfContents: 1
        })

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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const cheapHeading =
        new Up.Heading([new Up.Text("They're cheap")], {
          level: 2,
          searchableMarkup: "They're cheap",
          ordinalInTableOfContents: 2
        })

      const deliciousHeading =
        new Up.Heading([new Up.Text("They're delicious")], {
          level: 2,
          searchableMarkup: "They're delicious",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.OrderedList([
            new Up.OrderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.Text("Very cheap.")])
            ], { ordinal: 1 }),
            new Up.OrderedList.Item([
              deliciousHeading,
              new Up.Paragraph([new Up.Text("Very delicious.")])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const cheapHeading =
        new Up.Heading([new Up.Text("They're cheap")], {
          level: 2,
          searchableMarkup: "They're cheap",
          ordinalInTableOfContents: 2
        })

      const costHeading =
        new Up.Heading([new Up.Text("Cost")], {
          level: 2,
          searchableMarkup: "Cost",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.OrderedList([
            new Up.OrderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.Text("Very cheap.")]),
              new Up.OrderedList([
                new Up.OrderedList.Item([
                  costHeading,
                  new Up.Paragraph([new Up.Text("Typically, apples cost twenty dolloars per pound.")])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const cheapHeading =
        new Up.Heading([new Up.Text("They're cheap")], {
          level: 2,
          searchableMarkup: "They're cheap",
          ordinalInTableOfContents: 2
        })

      const deliciousHeading =
        new Up.Heading([new Up.Text("They're delicious")], {
          level: 2,
          searchableMarkup: "They're delicious",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, deliciousHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.Text("Very cheap.")])
            ]),
            new Up.UnorderedList.Item([
              deliciousHeading,
              new Up.Paragraph([new Up.Text("Very delicious.")])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const cheapHeading =
        new Up.Heading([new Up.Text("They're cheap")], {
          level: 2,
          searchableMarkup: "They're cheap",
          ordinalInTableOfContents: 2
        })

      const costHeading =
        new Up.Heading([new Up.Text("Cost")], {
          level: 2,
          searchableMarkup: "Cost",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              cheapHeading,
              new Up.Paragraph([new Up.Text("Very cheap.")]),
              new Up.UnorderedList([
                new Up.UnorderedList.Item([
                  costHeading,
                  new Up.Paragraph([new Up.Text("Typically, apples cost twenty dolloars per pound.")])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const cheapHeading =
        new Up.Heading([new Up.Text("They're cheap")], {
          level: 2,
          searchableMarkup: "They're cheap",
          ordinalInTableOfContents: 2
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.Blockquote([
            cheapHeading,
            new Up.Paragraph([new Up.Text("Very cheap.")])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const cheapHeading =
        new Up.Heading([new Up.Text("They're cheap")], {
          level: 2,
          searchableMarkup: "They're cheap",
          ordinalInTableOfContents: 2
        })

      const costHeading =
        new Up.Heading([new Up.Text("Cost")], {
          level: 2,
        searchableMarkup: "Cost",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, cheapHeading, costHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.Blockquote([
            cheapHeading,
            new Up.Paragraph([new Up.Text("Very cheap.")]),
            new Up.Blockquote([
              costHeading,
              new Up.Paragraph([new Up.Text("Typically, apples cost twenty dolloars per pound.")])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const bestFruitHeading =
        new Up.Heading([new Up.Text("The best fruit")], {
          level: 2,
          searchableMarkup: "The best fruit",
          ordinalInTableOfContents: 2
        })

      const pinkLadyHeading =
        new Up.Heading([new Up.Text("The best apple")], {
          level: 2,
          searchableMarkup: "The best apple",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Apple')])
            ], new Up.DescriptionList.Item.Description([
              bestFruitHeading,
              new Up.Paragraph([new Up.Text('Really.')])
            ])),
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Pink lady')])
            ], new Up.DescriptionList.Item.Description([
              pinkLadyHeading,
              new Up.Paragraph([new Up.Text('Really.')])
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
        new Up.Heading([new Up.Text('I enjoy apples')], {
          level: 1,
          searchableMarkup: "I enjoy apples",
          ordinalInTableOfContents: 1
        })

      const bestFruitHeading =
        new Up.Heading([new Up.Text("The best fruit")], {
          level: 2,
          searchableMarkup: "The best fruit",
          ordinalInTableOfContents: 2
        })

      const pinkLadyHeading =
        new Up.Heading([new Up.Text("The best apple")], {
          level: 2,
          searchableMarkup: "The best apple",
          ordinalInTableOfContents: 3
        })

      const tableOfContents =
        new Up.Document.TableOfContents([applesHeading, bestFruitHeading, pinkLadyHeading])

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          applesHeading,
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([new Up.Text('Apple')])
            ], new Up.DescriptionList.Item.Description([
              bestFruitHeading,
              new Up.Paragraph([new Up.Text('Really.')]),
              new Up.DescriptionList([
                new Up.DescriptionList.Item([
                  new Up.DescriptionList.Item.Subject([new Up.Text('Pink lady')])
                ], new Up.DescriptionList.Item.Description([
                  pinkLadyHeading,
                  new Up.Paragraph([new Up.Text('Really.')])
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
      new Up.Heading([new Up.Text('The best fruit')], {
        level: 1,
        searchableMarkup: "The best fruit",
        ordinalInTableOfContents: 1
      })

    const purchasingHeading =
      new Up.Heading([new Up.Text('Purchasing')], {
        level: 2,
        searchableMarkup: "Purchasing",
        ordinalInTableOfContents: 2
      })

    const tableOfContents =
      new Up.Document.TableOfContents([bestFruitHeading, purchasingHeading])

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([new Up.Text('I like apples.')]),

            new Up.OrderedList([
              new Up.OrderedList.Item([
                new Up.Paragraph([new Up.Text('Really.')]),

                new Up.DescriptionList([
                  new Up.DescriptionList.Item([
                    new Up.DescriptionList.Item.Subject([new Up.Text('Apple')])
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


  specify('However, they cannot be inside revealable blocks', () => {
    const markup = `
SPOILER:

  They're cheap
  -------------`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Heading([new Up.Text("They're cheap")], { level: 1, searchableMarkup: "They're cheap" })
        ])
      ], new Up.Document.TableOfContents([])))
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
