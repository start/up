import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'


describe('Consecutive lines starting with greater than symbols', () => {
  it('are parsed like a document and then placed in a blockquote node', () => {
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


describe('Blockquote delimeters', () => {
  it('can be followed by an optional space', () => {
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


describe('A blank blockquoted line', () => {
  it('does not require a trailing space after the blockquote delimiter', () => {
    expect(Up.toAst('>')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([])
      ]))
  })
})
