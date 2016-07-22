import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'


describe('Consecutive lines starting with "> "', () => {
  it('produce a blockquote node. The content following the delimiter is parsed for outline conventions, which are placed', () => {
    const text = `
> Hello, world!
>
> Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Goodbye, world!')
          ])
        ])
      ]))
  })
})


describe("Blockquote delimeters", () => {
  specify("can have their trailing space omitted", () => {
    const text = `
>Hello, world!
>
>Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Goodbye, world!')
          ])
        ])
      ]))
  })
})


context("Within a blockquote", () => {
  specify('some delimiters can have a trailing space while other delimiters do not', () => {
    const text = `
>Hello, world!
>
> Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Goodbye, world!')
          ])
        ])
      ]))
  })

  context("A space directly following greater than sign is considered part of the delimiter", () => {
    specify('So it takes 3 spaces from the ">" to provide indention', () => {
      const text = `
> Charmander
>   Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new BlockquoteNode([
            new DescriptionListNode([
              new DescriptionListNode.Item([
                new DescriptionListNode.Item.Term([new PlainTextNode('Charmander')])
              ],
                new DescriptionListNode.Item.Description([
                  new ParagraphNode([
                    new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
                  ])
                ]))
            ])
          ])
        ])
      )
    })
  })


  context('A tab character directly following the ">" is not considered part of the delimiter', () => {
    specify('So a single tab (following a delimiter without space) provides indentation', () => {
      const text = `
> Charmander
>\tObviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new BlockquoteNode([
            new DescriptionListNode([
              new DescriptionListNode.Item([
                new DescriptionListNode.Item.Term([new PlainTextNode('Charmander')])
              ],
                new DescriptionListNode.Item.Description([
                  new ParagraphNode([
                    new PlainTextNode('Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.')
                  ])
                ]))
            ])
          ])
        ])
      )
    })
  })
})


describe('A blockquote', () => {
  it('can contain inline conventions', () => {
    const text = `
> Hello, world!
>
> Goodbye, *world*!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Goodbye, '),
            new EmphasisNode([
              new PlainTextNode('world')
            ]),
            new PlainTextNode('!')
          ])
        ])
      ]))
  })

  it('can contain headings', () => {
    const text = `
> Hello, world!
> ===========`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new HeadingNode([
            new PlainTextNode('Hello, world!')
          ], 1)
        ])
      ]))
  })

  it('can contain nested blockquotes', () => {
    const text = `
> Hello, world!
>
> > Hello, mantle!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new BlockquoteNode([
            new ParagraphNode([
              new PlainTextNode('Hello, mantle!')
            ])
          ])
        ])
      ]))
  })
})


describe('Several blockquoted lines, followed by a blank line, followed by more blockquoted lines', () => {
  it('produce two separate blockquote nodes', () => {
    const text = `
> Hello, world!
>
> Goodbye, world!

> Welp, I tried to leave earlier.
>
> This is awkward...`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Goodbye, world!')
          ])
        ]),

        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Welp, I tried to leave earlier.')
          ]),
          new ParagraphNode([
            new PlainTextNode('This is awkward...')
          ])
        ])
      ]))
  })
})


describe('Sseveral blockquoted lines, followed by blank line, followed by more blockquoted lines, all within an outer blockquote', () => {
  it('produce a blockquote node containing two separate blockquote nodes', () => {
    const text = `
> > Hello, world!
> >
> > Goodbye, world!
>
> > Welp, I tried to leave earlier.
> >
> > This is awkward...`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new BlockquoteNode([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ]),
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ]),

          new BlockquoteNode([
            new ParagraphNode([
              new PlainTextNode('Welp, I tried to leave earlier.')
            ]),
            new ParagraphNode([
              new PlainTextNode('This is awkward...')
            ])
          ])
        ])
      ]))
  })
})


describe('Within a blockquote, 3 or more blank lines', () => {
  it('produce a section separator node', () => {
    const text = `
> Hello, world!
>
>
>
> Goodbye, *world*!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new SectionSeparatorNode(),
          new ParagraphNode([
            new PlainTextNode('Goodbye, '),
            new EmphasisNode([
              new PlainTextNode('world')
            ]),
            new PlainTextNode('!')
          ])
        ])
      ]))
  })
})


describe('A single blockquote delimiter without its trailing space', () => {
  it('produces a blockquote note', () => {
    expect(Up.toAst('>Hello, taxes!')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, taxes!')
          ])
        ])
      ]))
  })
})


describe('A single line blockquote', () => {
  it('can contain nested blockquotes', () => {
    expect(Up.toAst('> > > Hello, *world*!!')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new BlockquoteNode([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode('Hello, '),
                new EmphasisNode([
                  new PlainTextNode('world')
                ]),
                new PlainTextNode('!!')
              ])
            ])
          ])
        ])
      ]))
  })
})


describe('Multiple blockquote delimiters, each without their trailing space, followed by a final blockquote delimiter with its trailing space,', () => {
  it('produce nested blockquote nodes, one for each delimiter', () => {
    expect(Up.toAst(`>>> Hello, world!`)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new BlockquoteNode([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode('Hello, world!')
              ])
            ])
          ])
        ])
      ]))
  })
})


describe('Multiple blockquote delimiters, each with their trailing space, followed by a final blockquote delimiter without its trailing space,', () => {
  it('produce nested blockquote nodes, one for each delimiter', () => {
    expect(Up.toAst(`> > >Hello, world!`)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new BlockquoteNode([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode('Hello, world!')
              ])
            ])
          ])
        ])
      ]))
  })
})


context('Within a given blockquote', () => {
  specify('some delimiters can have trailing spaces delimeters while others do not', () => {
    const text = `
>Hello, world!
>
> Goodbye, world!
>
>\tUmmm... I said goodbye.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('Hello, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Goodbye, world!')
          ]),
          new ParagraphNode([
            new PlainTextNode('Ummm... I said goodbye.')
          ])
        ])
      ]))
  })
})
