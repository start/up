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


describe('A non-blank line underlined by number signs', () => {
  it('produces a level-1 heading node when there are at least 3 number signs', () => {
    const text =
      `
Hello, world!
###`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
  
  it('can be underlined by more than 3 number signs', () => {
    const text =
      `
Hello, world!
##############`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
  
  
  it('can contain inline conventions', () => {
    const text =
      `
Hello, *world*!
##############`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([
          new PlainTextNode('Hello, '),
          new EmphasisNode([
            new PlainTextNode('world')
          ]),
          new PlainTextNode('!')
          ], 1),
      ]))
  })

  it('can have an optional overline comprised of number signs', () => {
    const text =
      `
######
Hello, world!
######`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('can have an overline that is not the same length as its underline', () => {
    const text =
      `
#########
Hello, world!
######`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have an overline comprised of different characters', () => {
    const text =
      `
======
Hello, world!
######`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have a dotted overline comprised of number signs', () => {
    const text =
      `
# # # #
Hello, world!
#######`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have any other characters in its underline', () => {
    const text =
      `
Hello, world!
######=`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have any other characters in the overline', () => {
    const text =
      `
=######
Hello, world!
######`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })

  it('cannot have a leading space in its underline', () => {
    const text =
      `
Hello, world!
 ######`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))

  })
  it('cannot have a leading space in overline underline', () => {
    const text =
      `
 ######
Hello, world!
######`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
      ]))
  })
})

describe('A non-blank line underlined by equal signs', () => {
  it('produces a level-2 heading node when there are at least 3 equal signs', () => {
    const text =
      `
Hello, world!
===`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 2),
      ]))
  })
  
  it('can have an optional overline comprised of equal signs', () => {
    const text =
      `
====
Hello, world!
===`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 2),
      ]))
  })
})

describe('A non-blank line underlined by equal hyphens', () => {
  it('produces a level-3 heading node when there are at least 3 hyphens', () => {
    const text =
      `
Hello, world!
---`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 3),
      ]))
  })
  
  it('can have an optional overline comprised of hyphen', () => {
    const text =
      `
---
Hello, world!
-----`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 3),
      ]))
  })
})


describe('A non-blank line with a dotted underline comprised of number signs', () => {
  it('produces a level-4 heading node when there are at least 3 number signs each delimited by 1 space', () => {
    const text =
      `
Hello, world!
# # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })
  
  it('can have more than 3 number signs in its underline', () => {
    const text =
      `
Hello, world!
# # # # # # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('can have an optional dotted overline comprised of number signs', () => {
    const text =
      `
# # # #
Hello, world!
# # # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('can have an overline that is not the same length as its underline', () => {
    const text =
      `
# # #
Hello, world!
# # # # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have an overline comprised of different characters', () => {
    const text =
      `
= = = =
Hello, world!
# # # #`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have a solid overline comprised of number signs', () => {
    const text =
      `
#######
Hello, world!
# # # #`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have any other characters in its underline', () => {
    const text =
      `
Hello, world!
# # # # -`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('cannot have any other characters in the overline', () => {
    const text =
      `
- # # #
Hello, world!
# # #`
    expect(Up.ast(text)).to.not.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })

  it('can have a leading space in its underline', () => {
    const text =
      `
Hello, world!
 # # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))

  })
  
  it('can have a leading space in overline underline', () => {
    const text =
      `
 # # # # # #
Hello, world!
# # # # # #`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 4),
      ]))
  })
})

describe('A non-blank line with a dotted underline comprised of equal signs', () => {
  it('produces a level-5 heading node when there are at least 3 equal signs each delimited by 1 space', () => {
    const text =
      `
Hello, world!
= = =`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 5),
      ]))
  })
  
  it('can have an optional overline comprised of equal signs', () => {
    const text =
      `
= = = =
Hello, world!
= = =`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 5),
      ]))
  })
})


describe('A non-blank line with a dotted underline comprised of hyphens', () => {
  it('produces a level-6 heading node when there are at least 3 hyphens each delimited by 1 space', () => {
    const text =
      `
Hello, world!
- - - - -`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 6),
      ]))
  })
  
  it('can have an optional overline comprised of equal signs', () => {
    const text =
      `
- - -
Hello, world!
- - - -`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 6),
      ]))
  })
})
