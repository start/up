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


describe('A document\'s first text underlined by any combination or arrangement of # = - + ~ * ^ @ : _', () => {
  it('produces a level-1 heading node', () => {
      const text =
      `
Hello, world!
#=-+~*^@:_+**###=~=~=~--~~~~`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
  
  it('can have whitespace interspersed throughout the underline in any manner', () => {
    const text =
      `
Hello, world!
 +**###=~=~=~   --~~~~ # =   - +    ~ * ^\t @ :_`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
  
  it('can use as few as 1 one of those characters in its underline', () => {
    const text =
      `
Hello, world!
~~~~~~~~~~~~`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have an optional overline consisting of the same characters as its underline', () => {
    const text =
      `
#=-+~*^@:_
Hello, world!
#=-+~*^@:_`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have an optional overline consisting of the same characters as its underline, but in a different arrangement and length', () => {
    const text =
      `
=*+:_~#^@-
Hello, world!
#=-+~*^@:_`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
  
  it('does not need to be the first convention in the document', () => {
    const text =
      `
Hello, world!
      
Goodbye, world!
~~~~~~~~~~~~`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
      ]))
  })
})