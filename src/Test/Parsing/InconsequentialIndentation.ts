import { expect } from 'chai'
import * as Up from '../../Up'


context('Ordered list item bullets can have a single leading space. This includes the bullet for:', () => {
  specify('The first item', () => {
    const markup = `
 * Hello, Celadon City!
* Goodbye, Celadon City!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ])
        ])
      ]))
  })

  specify('The last item', () => {
    const markup = `
- Goodbye, Celadon City!
 - Hello, Celadon City!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('No, really. Goodbye.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('No, really. Goodbye.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ])
        ])
      ]))
  })

  specify('The last item', () => {
    const markup = `
- Goodbye, Celadon City!
 - Hello, Celadon City!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('No, really. Goodbye.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('No, really. Goodbye.')
            ])
          ])
        ])
      ]))
  })
})


context('Description list subjects can have a single leading space. This includes:', () => {
  specify('The first subject for a description', () => {
    const markup = `
 Charmander
Charmeleon
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmander')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmeleon')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })

  specify('The last subject for a description', () => {
    const markup = `
Charmander
 Charmeleon
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmander')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmeleon')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ])
          ]))
        ])
      ]))
  })

  specify('A subject that is neither the first nor the last for a description', () => {
    const markup = `
Charmander
 Charmeleon
Charizard
  Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmander')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmeleon')]),
            new Up.DescriptionList.Item.Subject([new Up.Text('Charizard')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Skeltals are white')
          ]),
          new Up.LineBlock.Line([
            new Up.Text('If you stay here')
          ]),
          new Up.LineBlock.Line([
            new Up.Text("You're in for a fright")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.CodeBlock(
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm just a normal guy who eats only when it's raining outside.")
        ]),
        new Up.Paragraph([
          new Up.Text("Aren't you this way?")
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
      new Up.Heading([new Up.Text('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const coreHeading =
      new Up.Heading([new Up.Text('Hello, core!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        worldHeading,
        coreHeading,
      ], new Up.Document.TableOfContents([worldHeading, coreHeading])))
  })

  specify('Revealable blocks', () => {
    const markup = `
 \t SPOILER:
 \t
   \t I like shorts! They're comfy and easy to wear!

\t I like blankets, too.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text("I like shorts! They're comfy and easy to wear!")
          ]),
          new Up.Paragraph([
            new Up.Text("I like blankets, too.")
          ])
        ])
      ]))
  })


  context('Tables:', () => {
    specify('When the header row is indented less than 2 spaces (which would produce a header column)', () => {
      const markup = `
  \t Table:

 Game; Release Date

 \t Final Fantasy; 1987
 \t  Final Fantasy II; 1988
 \t Chrono Trigger; 1995
 \t  Chrono Cross; 1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game')]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
                new Up.Table.Row.Cell([new Up.Text('1987')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
                new Up.Table.Row.Cell([new Up.Text('1988')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ]),
            ])
        ]))
    })

    specify('When the header row is indented 2 or more spaces (producing a header column)', () => {
      const markup = `
 \t  Table: AND operator logic

   \t     1;      0
 \t  1;      true;   false
  0;      false;  false`

      expect(Up.parse(markup)).to.deep.equal(
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
            new Up.Table.Caption([new Up.Text('AND operator logic')]))
        ]))
    })
  })


  context('Blockquotes:', () => {
    specify('The first line', () => {
      const markup = `
  \t \t > I like shorts! They're comfy and easy to wear!
>
> I like blankets, too.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Blockquote([
            new Up.Paragraph([
              new Up.Text("I like shorts! They're comfy and easy to wear!")
            ]),
            new Up.Paragraph([
              new Up.Text("I like blankets, too.")
            ])
          ])
        ]))
    })

    specify('The last line', () => {
      const markup = `
> I like shorts! They're comfy and easy to wear!
>
\t \t > I like blankets, too.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Blockquote([
            new Up.Paragraph([
              new Up.Text("I like shorts! They're comfy and easy to wear!")
            ]),
            new Up.Paragraph([
              new Up.Text("I like blankets, too.")
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Blockquote([
            new Up.LineBlock([
              new Up.LineBlock.Line([new Up.Text('Roses are red')]),
              new Up.LineBlock.Line([new Up.Text('Violets are blue')])
            ]),
            new Up.Paragraph([
              new Up.Text("I like poems! They're comfy and easy to write!")
            ])
          ])
        ]))
    })

    specify('After the delimiters', () => {
      const markup = `
>   \t I like shorts! They're comfy and easy to wear!
>
>\t I like blankets, too.`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Blockquote([
            new Up.Paragraph([
              new Up.Text("I like shorts! They're comfy and easy to wear!")
            ]),
            new Up.Paragraph([
              new Up.Text("I like blankets, too.")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Lavender Town!')
            ]),
            new Up.Paragraph([
              new Up.Text('How are we today?')
            ])
          ], { ordinal: 1 })
        ])
      ]))
  })

  specify('Unordered list items', () => {
    const markup = `
*  \t Buy milk.

 \t\t Now.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy milk.')
            ]),
            new Up.Paragraph([
              new Up.Text('Now.')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.DescriptionList([
          new Up.DescriptionList.Item([
            new Up.DescriptionList.Item.Subject([new Up.Text('Charmander')])
          ], new Up.DescriptionList.Item.Description([
            new Up.Paragraph([
              new Up.Text('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
            ]),
            new Up.Paragraph([
              new Up.Text('Does not evolve into Kadabra.')
            ])
          ]))
        ])
      ]))
  })
})
