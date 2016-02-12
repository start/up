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

describe('A non-blank line underlined by equal signs', function() {
  it('produces a level-2 heading node when there are at least 3 equal signs', function() {
    const text =
      `
Hello, world!
===`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 2),
      ]))
  })
  
  it('can have an optional overline comprised of equal signs', function() {
    const text =
      `
====
Hello, world!
===`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 2),
      ]))
  })
})

describe('A non-blank line underlined by equal hyphens', function() {
  it('produces a level-3 heading node when there are at least 3 hyphens', function() {
    const text =
      `
Hello, world!
---`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 3),
      ]))
  })
  
  it('can have an optional overline comprised of hyphen', function() {
    const text =
      `
---
Hello, world!
-----`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 3),
      ]))
  })
})


describe('A non-blank line with a dotted underline comprised of number signs', function() {
  it('produces a level-4 heading node when there are at least 3 number signs delimited by 1 space', function() {
    const text =
      `
Hello, world!
# # #`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })
  
  it('can have more than 3 number signs in its underline', function() {
    const text =
      `
Hello, world!
# # # # # # #`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('can have an optional dotted overline comprised of number signs', function() {
    const text =
      `
# # # #
Hello, world!
# # # #`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('can have an overline that is not the same length as its underline', function() {
    const text =
      `
# # #
Hello, world!
# # # # #`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have an overline comprised of different characters', function() {
    const text =
      `
= = = =
Hello, world!
# # # #`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have a solid overline comprised of number signs', function() {
    const text =
      `
#######
Hello, world!
# # # #`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have any other characters in its underline', function() {
    const text =
      `
Hello, world!
# # # # -`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have any other characters in the overline', function() {
    const text =
      `
- # # #
Hello, world!
# # #`
    expect(Up.ast(text)).to.not.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('can have a leading space in its underline', function() {
    const text =
      `
Hello, world!
 # # #`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))

  })
  
  it('can have a leading space in overline underline', function() {
    const text =
      `
 # # # # # #
Hello, world!
# # # # # #`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })
})