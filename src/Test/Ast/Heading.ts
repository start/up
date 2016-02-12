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


function insideDocument(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode(syntaxNodes);
}


describe('A non-blank line underlined by number signs', function() {
  it('produces a level-1 heading node when there are at least 3 number signs', function() {
    const text =
      `
Hello, world!
###`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
  
  it('can be underlined by more than 3 number signs', function() {
    const text =
      `
Hello, world!
##############`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have an optional overline comprised of number signs', function() {
    const text =
      `
######
Hello, world!
######`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have an overline that is not the same length as its underline', function() {
    const text =
      `
#########
Hello, world!
######`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have an overline comprised of different characters', function() {
    const text =
      `
======
Hello, world!
######`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have a dotted overline comprised of number signs', function() {
    const text =
      `
# # # #
Hello, world!
#######`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have any other characters in its underline', function() {
    const text =
      `
Hello, world!
######=`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have any other characters in the overline', function() {
    const text =
      `
=######
Hello, world!
######`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have a leading space in its underline', function() {
    const text =
      `
Hello, world!
 ######`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))

  })
  it('cannot have a leading space in overline underline', function() {
    const text =
      `
 ######
Hello, world!
######`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})
