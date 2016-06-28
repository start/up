import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'


describe('Consecutive lines starting with "> "', () => {
  it('are parsed like a document and then placed in a blockquote node', () => {
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


describe('A single blockquote delimiter missing its trailing space', () => {
  it('does not produce a blockquote note', () => {
    expect(Up.toAst('>Hello, taxes!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('>Hello, taxes!')
      ]))
  })
})


describe('Multiple blockquote delimiters each missing their trailing space, followed by a final blockquote delimiter with its trailing space,', () => {
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


describe('A blank blockquoted line', () => {
  it('does not require a trailing space after the blockquote delimiter', () => {

    expect(Up.toAst('>')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([])
      ]))
  })
})
