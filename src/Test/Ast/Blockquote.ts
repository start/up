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


function insideDocument(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode(syntaxNodes);
}


describe('Consecutive lines starting with "> "', function() {
  it('are parsed like a document and are placed in a blockquote node', function() {
    const blockquoteText =
      `
> Hello, world!
>
> Goodbye, world!`

    const text =
      `
Hello, world!

Goodbye, world!`
    expect(Up.ast(blockquoteText)).to.be.eql(
      insideDocument([
        new BlockquoteNode(Up.ast(text).children)
      ]))
  })

  it('Can have just 1 line', function() {
    const blockquoteText = '> Hi.'
    const text = 'Hi.'
    expect(Up.ast(blockquoteText)).to.be.eql(
      insideDocument([
        new BlockquoteNode(Up.ast(text).children)
      ]))
  })
})
