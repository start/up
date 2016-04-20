
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { PlaceholderFootnoteReferenceNode } from '../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'

function expectBlockquoteContentsToEqualDocumentContents(blockquotedText: string, text: string): void {
  expect(Up.toAst(blockquotedText)).to.be.eql(
    new DocumentNode([
      new BlockquoteNode(Up.toAst(text).children)
    ]))
}


describe('Consecutive lines starting with "> "', () => {
  it('are parsed like a document and then placed in a blockquote node', () => {
    const blockquotedText = `
> Hello, world!
>
> Goodbye, world!`

    const text = `
Hello, world!

Goodbye, world!`

    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })
})


describe('A blockquote', () => {
  it('can contain inline conventions', () => {
    const blockquotedText = `
> Hello, world!
>
> Goodbye, *world*!`

    const text = `
Hello, world!

Goodbye, *world*!`

    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })

  it('can contain headings', () => {
    const blockquotedText = `
> Hello, world!
> ===========`

    const text = `
Hello, world!
===========`

    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })

  it('can contain nested blockquotes', () => {
    const blockquotedText = `
> Hello, world!
>
> > Hello, mantle!`

    const text = `
Hello, world!

> Hello, mantle!`

    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
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
    const blockquotedText = '> > > Hello, *world*!!'
    const text = '> > Hello, *world*!!'
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })
})


describe('A blank blockquoted line', () => {
  it('does not require a trailing space after the blockquote delimiter', () => {
    expectBlockquoteContentsToEqualDocumentContents('>', '')
  })
})
