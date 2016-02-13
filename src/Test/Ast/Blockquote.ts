/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'

function expectBlockquoteContentsToEqualDocumentContents(blockquotedText: string, text: string): void {
  expect(Up.ast(blockquotedText)).to.be.eql(
    new DocumentNode([
      new BlockquoteNode(Up.ast(text).children)
    ]))
}

describe('Consecutive lines starting with "> "', () => {
  it('are parsed like a document and then placed in a blockquote node', () => {
    const blockquotedText =
`> Hello, world!
>
> Goodbye, world!`
    const text =
`Hello, world!

Goodbye, world!`
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })

  it('can contain inline conventions', () => {
    const blockquotedText = '> Hello, *world*!!'
    const text = 'Hello, *world*!!'
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })

  it('can contain headings', () => {
    const blockquotedText =
`> Hello, world!
> ===========`
    const text =
`Hello, world!
===========`
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })

  it('can contain nested blockquotes', () => {
    const blockquotedText =
`> Hello, world!
>
> > Hello, mantle!`
    const text =
`Hello, world!

> Hello, mantle!`
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })

  it('are placed in a blockquote node even when there is just 1 empty line', () => {
    const blockquotedText = '> '
    const text = ''
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })
  
  it('can contain nested blockquotes even when there is just 1 line', () => {
    const blockquotedText = '> > > Hello, *world*!!'
    const text = '> > Hello, *world*!!'
    expectBlockquoteContentsToEqualDocumentContents(blockquotedText, text)
  })
  
})
