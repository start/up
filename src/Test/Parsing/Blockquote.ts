import { expect } from 'chai'
import { Up } from '../../Up'
import { Document } from '../../SyntaxNodes/Document'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'


describe('Consecutive lines starting with "> "', () => {
  it('produce a blockquote node. The content following the delimiter is parsed for outline conventions, which are placed', () => {
    const markup = `
> Hello, world!
>
> Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Paragraph([
            new PlainText('Goodbye, world!')
          ])
        ])
      ]))
  })
})


describe("Blockquote delimeters", () => {
  specify("can have their trailing space omitted", () => {
    const markup = `
>Hello, world!
>
>Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Paragraph([
            new PlainText('Goodbye, world!')
          ])
        ])
      ]))
  })
})


context("Within a blockquote", () => {
  specify('some delimiters can have a trailing space while other delimiters do not', () => {
    const markup = `
>Hello, world!
>
> Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Paragraph([
            new PlainText('Goodbye, world!')
          ])
        ])
      ]))
  })

  context("A space directly following greater than sign is considered part of the delimiter", () => {
    specify('So it takes 3 spaces from the ">" to provide indention', () => {
      const markup = `
> Charmander
>   Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Blockquote([
            new DescriptionList([
              new DescriptionList.Item([
                new DescriptionList.Item.Subject([new PlainText('Charmander')])
              ],
                new DescriptionList.Item.Description([
                  new Paragraph([
                    new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
                  ])
                ]))
            ])
          ])
        ]))
    })
  })


  context('A tab character directly following the ">" is not considered part of the delimiter', () => {
    specify('So a single tab (following a delimiter without space) provides indentation', () => {
      const markup = `
> Charmander
>\tObviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new Blockquote([
            new DescriptionList([
              new DescriptionList.Item([
                new DescriptionList.Item.Subject([new PlainText('Charmander')])
              ],
                new DescriptionList.Item.Description([
                  new Paragraph([
                    new PlainText('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
                  ])
                ]))
            ])
          ])
        ]))
    })
  })
})


describe('A blockquote', () => {
  it('can contain inline conventions', () => {
    const markup = `
> Hello, world!
>
> Goodbye, *world*!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Paragraph([
            new PlainText('Goodbye, '),
            new Emphasis([
              new PlainText('world')
            ]),
            new PlainText('!')
          ])
        ])
      ]))
  })

  it('can contain headings', () => {
    const markup = `
> Hello, world!
> ===========`

    const heading =
      new Heading([
        new PlainText('Hello, world!')
      ], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          heading
        ])
      ], new Document.TableOfContents([heading])))
  })

  it('can contain nested blockquotes', () => {
    const markup = `
> Hello, world!
>
> > Hello, mantle!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Blockquote([
            new Paragraph([
              new PlainText('Hello, mantle!')
            ])
          ])
        ])
      ]))
  })
})


describe('Several blockquoted lines, followed by a blank line, followed by more blockquoted lines', () => {
  it('produce two separate blockquote nodes', () => {
    const markup = `
> Hello, world!
>
> Goodbye, world!

> Welp, I tried to leave earlier.
>
> This is awkward...`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Paragraph([
            new PlainText('Goodbye, world!')
          ])
        ]),

        new Blockquote([
          new Paragraph([
            new PlainText('Welp, I tried to leave earlier.')
          ]),
          new Paragraph([
            new PlainText('This is awkward…')
          ])
        ])
      ]))
  })
})


describe('Sseveral blockquoted lines, followed by blank line, followed by more blockquoted lines, all within an outer blockquote', () => {
  it('produce a blockquote node containing two separate blockquote nodes', () => {
    const markup = `
> > Hello, world!
> >
> > Goodbye, world!
>
> > Welp, I tried to leave earlier.
> >
> > This is awkward...`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Blockquote([
            new Paragraph([
              new PlainText('Hello, world!')
            ]),
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ]),

          new Blockquote([
            new Paragraph([
              new PlainText('Welp, I tried to leave earlier.')
            ]),
            new Paragraph([
              new PlainText('This is awkward…')
            ])
          ])
        ])
      ]))
  })
})


describe('Within a blockquote, 3 or more blank lines', () => {
  it('produce a thematic break node', () => {
    const markup = `
> Hello, world!
>
>
>
> Goodbye, *world*!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new ThematicBreak(),
          new Paragraph([
            new PlainText('Goodbye, '),
            new Emphasis([
              new PlainText('world')
            ]),
            new PlainText('!')
          ])
        ])
      ]))
  })
})


describe('A single blockquote delimiter without its trailing space', () => {
  it('produces a blockquote note', () => {
    expect(Up.parse('>Hello, taxes!')).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, taxes!')
          ])
        ])
      ]))
  })
})


describe('A single line blockquote', () => {
  it('can contain nested blockquotes', () => {
    expect(Up.parse('> > > Hello, *world*!!')).to.deep.equal(
      new Document([
        new Blockquote([
          new Blockquote([
            new Blockquote([
              new Paragraph([
                new PlainText('Hello, '),
                new Emphasis([
                  new PlainText('world')
                ]),
                new PlainText('!!')
              ])
            ])
          ])
        ])
      ]))
  })
})


describe('Multiple blockquote delimiters, each without their trailing space, followed by a final blockquote delimiter with its trailing space,', () => {
  it('produce nested blockquote nodes, one for each delimiter', () => {
    expect(Up.parse(`>>> Hello, world!`)).to.deep.equal(
      new Document([
        new Blockquote([
          new Blockquote([
            new Blockquote([
              new Paragraph([
                new PlainText('Hello, world!')
              ])
            ])
          ])
        ])
      ]))
  })
})


describe('Multiple blockquote delimiters, each with their trailing space, followed by a final blockquote delimiter without its trailing space,', () => {
  it('produce nested blockquote nodes, one for each delimiter', () => {
    expect(Up.parse(`> > >Hello, world!`)).to.deep.equal(
      new Document([
        new Blockquote([
          new Blockquote([
            new Blockquote([
              new Paragraph([
                new PlainText('Hello, world!')
              ])
            ])
          ])
        ])
      ]))
  })
})


context('Within a given blockquote', () => {
  specify('some delimiters can have trailing spaces delimeters while others do not', () => {
    const markup = `
>Hello, world!
>
> Goodbye, world!
>
>
>\tUmmm... I said goodbye.`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          new Paragraph([
            new PlainText('Hello, world!')
          ]),
          new Paragraph([
            new PlainText('Goodbye, world!')
          ]),
          new Paragraph([
            new PlainText('Ummm… I said goodbye.')
          ])
        ])
      ]))
  })
})
