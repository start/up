import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { Table } from '../../SyntaxNodes/Table'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'


context('Ordered list item bullets can have a single leading space. This includes the bullet for:', () => {
  specify('The first item', () => {
    const markup = `
 * Hello, Celadon City!
* Goodbye, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ])
        ])
      ]))
  })

  specify('The last item', () => {
    const markup = `
- Goodbye, Celadon City!
 - Hello, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ])
        ])
      ]))
  })

  specify('An item in the middle', () => {
    const markup = `
- Hello, Celadon City!
 - Goodbye, Celadon City!
- No, really. Goodbye.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('No, really. Goodbye.')
            ])
          ])
        ])
      ]))
  })

  specify('Every item', () => {
    const markup = `
 - Hello, Celadon City!
 - Goodbye, Celadon City!
 - No, really. Goodbye.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('No, really. Goodbye.')
            ])
          ])
        ])
      ]))
  })
})


context('Ordered list item bullets can have a single leading space. This includes the bullet for:', () => {
  specify('The first item', () => {
    const markup = `
 * Hello, Celadon City!
* Goodbye, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ])
        ])
      ]))
  })

  specify('The last item', () => {
    const markup = `
- Goodbye, Celadon City!
 - Hello, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ])
        ])
      ]))
  })

  specify('An item in the middle', () => {
    const markup = `
- Hello, Celadon City!
 - Goodbye, Celadon City!
- No, really. Goodbye.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('No, really. Goodbye.')
            ])
          ])
        ])
      ]))
  })

  specify('Every item', () => {
    const markup = `
 - Hello, Celadon City!
 - Goodbye, Celadon City!
 - No, really. Goodbye.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('No, really. Goodbye.')
            ])
          ])
        ])
      ]))
  })
})


context('Description list subjects can have a single leading space. This includes:', () => {
  specify('The first term for a description', () => {
    const markup = `
 Charmander
Charmeleon
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Charmander')]),
            new DescriptionList.Item.Subject([new PlainText('Charmeleon')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })

  specify('The last term for a description', () => {
    const markup = `
Charmander
 Charmeleon
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Charmander')]),
            new DescriptionList.Item.Subject([new PlainText('Charmeleon')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })

  specify('A term that is neither the first nor the last for a description', () => {
    const markup = `
Charmander
 Charmeleon
Charizard
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Charmander')]),
            new DescriptionList.Item.Subject([new PlainText('Charmeleon')]),
            new DescriptionList.Item.Subject([new PlainText('Charizard')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })
})


context("If a line block's first line is indented at least 2 spaces or a tab", () => {
  specify('the indentation of subsequent lines does not matter', () => {
    const markup = `
  \t Roses are red
Skeltals are white
 \t  If you stay here
 You're in for a fright`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
          ]),
        ])
      ]))
  })
})


context("If a line block's first line has one or zero leading spaces", () => {
  specify('subsequent lines can have 1 or zero leading spaces (anything more would produce a description list)', () => {
    const markup = `
Roses are red
 Skeltals are white
 If you stay here
You're in for a fright`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red')
          ]),
          new LineBlock.Line([
            new PlainText('Skeltals are white')
          ]),
          new LineBlock.Line([
            new PlainText('If you stay here')
          ]),
          new LineBlock.Line([
            new PlainText("You're in for a fright")
          ]),
        ])
      ]))
  })
})


context("Indentation does not matter for a code block's fences, though it does matter for the code itself", () => {
  it('produces a code block node', () => {
    const markup = `
          \`\`\`\`\`\`\`\`\`\`\`\`
  function factorial(n: number): number {
    return (
      n <= 1
        ? 1
        : n * factorial(n - 1))
  }
          \`\`\`\`\`\`\`\`\`\`\`\``

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new CodeBlock(
          `  function factorial(n: number): number {
    return (
      n <= 1
        ? 1
        : n * factorial(n - 1))
  }`    ),
      ]))
  })
})


context('For some outline conventions, all extra indentation is ignored:', () => {
  specify('Paragraphs', () => {
    const markup = `
   \t  I'm just a normal guy who eats only when it's raining outside.
  
  \t\t\t\t Aren't you this way?`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm just a normal guy who eats only when it's raining outside.")
        ]),
        new Paragraph([
          new PlainText("Aren't you this way?")
        ])
      ]))
  })

  specify('Headings', () => {
    const markup = `
Hello, world!
~~~~~~~~~~~~~~~

 \t Hello, core!
 \t ~~~~~~~~~~~~~~~`

    const worldHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const coreHeading =
      new Heading([new PlainText('Hello, core!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        worldHeading,
        coreHeading,
      ], new UpDocument.TableOfContents([worldHeading, coreHeading])))
  })

  specify('Spoiler blocks', () => {
    const markup = `
 \t SPOILER:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new SpoilerBlock([
          new Paragraph([
            new PlainText("I like shorts! They're comfy and easy to wear!")
          ]),
          new Paragraph([
            new PlainText("I like blankets, too.")
          ])
        ])
      ]))
  })

  specify('NSFW blocks', () => {
    const markup = `
  \t NSFW:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new NsfwBlock([
          new Paragraph([
            new PlainText("I like shorts! They're comfy and easy to wear!")
          ]),
          new Paragraph([
            new PlainText("I like blankets, too.")
          ])
        ])
      ]))
  })

  specify('NSFL blocks', () => {
    const markup = `
  \t NSFL:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new NsflBlock([
          new Paragraph([
            new PlainText("I like shorts! They're comfy and easy to wear!")
          ]),
          new Paragraph([
            new PlainText("I like blankets, too.")
          ])
        ])
      ]))
  })

  specify('Tables', () => {
    const markup = `
  \t Table:

 \t  Game; Release Date

 \t Final Fantasy; 1987
 \t  Final Fantasy II; 1988

 \t Chrono Trigger; 1995
 \t  Chrono Cross; 1999`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('1988')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
            ]),
          ])
      ]))
  })

  specify("Charts", () => {
    const markup = `
 \t  Chart: AND operator logic

   \t     1;      0
 \t  1;      true;   false
  0;      false;  false`

    expect(Up.toDocument(markup)).to.deep.equal(
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
          new Table.Caption([new PlainText('AND operator logic')]))
      ]))
  })

  context('Blockquotes:', () => {
    specify('The first line', () => {
      const markup = `
  \t \t > I like shorts! They're comfy and easy to wear!
>
> I like blankets, too.`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Blockquote([
            new Paragraph([
              new PlainText("I like shorts! They're comfy and easy to wear!")
            ]),
            new Paragraph([
              new PlainText("I like blankets, too.")
            ])
          ])
        ]))
    })

    specify('The last line', () => {
      const markup = `
> I like shorts! They're comfy and easy to wear!
>
\t \t > I like blankets, too.`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Blockquote([
            new Paragraph([
              new PlainText("I like shorts! They're comfy and easy to wear!")
            ]),
            new Paragraph([
              new PlainText("I like blankets, too.")
            ])
          ])
        ]))
    })

    specify('A line in the middle', () => {
      const markup = `
> Roses are red
\t > Violets are blue
>
> I like poems! They're comfy and easy to write!`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Blockquote([
            new LineBlock([
              new LineBlock.Line([new PlainText('Roses are red')]),
              new LineBlock.Line([new PlainText('Violets are blue')])
            ]),
            new Paragraph([
              new PlainText("I like poems! They're comfy and easy to write!")
            ])
          ])
        ]))
    })

    specify('After the delimiters', () => {
      const markup = `
>   \t I like shorts! They're comfy and easy to wear!
>
>\t I like blankets, too.`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Blockquote([
            new Paragraph([
              new PlainText("I like shorts! They're comfy and easy to wear!")
            ]),
            new Paragraph([
              new PlainText("I like blankets, too.")
            ])
          ])
        ]))
    })
  })
})


context("Within list items, extra indentation for outline conventions is ignored, just as it would be at the top-level of the document", () => {
  specify('Ordered list items', () => {
    const markup = `
1)  \t Hello, Lavender Town!

 \t\t How are we today?`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Lavender Town!')
            ]),
            new Paragraph([
              new PlainText('How are we today?')
            ])
          ], { ordinal: 1 })
        ])
      ]))
  })

  specify('Unordered list items', () => {
    const markup = `
*  \t Buy milk.

 \t\t Now.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy milk.')
            ]),
            new Paragraph([
              new PlainText('Now.')
            ])
          ])
        ])
      ]))
  })

  specify('Descriptions in a description list', () => {
    const markup = `
Charmander
   \t Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.
   
\t Does not evolve into Kadabra.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new DescriptionList([
          new DescriptionList.Item([
            new DescriptionList.Item.Subject([new PlainText('Charmander')])
          ], new DescriptionList.Item.Description([
            new Paragraph([
              new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ]),
            new Paragraph([
              new PlainText('Does not evolve into Kadabra.')
            ])
          ]))
        ])
      ]))
  })
})
