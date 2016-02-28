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


describe('Between paragraphs', () => {
  it('1 blank line simply provides separation, producing no syntax node itself', () => {
    const text = `Hello, world!

Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('2 blank lines simply provide separation, producing no syntax nodes themselves', () => {
    const text = `Hello, world!

  \t 
Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })
})