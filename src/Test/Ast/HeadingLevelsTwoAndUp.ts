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


describe("The first heading with an underline comprised of different characters than the top-level heading's underline", () => {
  it('produces a level-2 heading node', () => {
    const text =
      `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
      ]))
  }) 
  
  it('produces a level-2 heading node when the underline characters only differ by spaces', () => {
    const text =
      `
Hello, world!
=============

Goodbye, world!
= = = = = = = =`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
      ]))
  })
  
  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const text =
      `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye again, world!')], 2)
      ]))
  })
  
  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const text =
      `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye again, world!')], 2)
      ]))
  })
})


describe('7 headings with different heading underlines', () => {
  
  it('produce 7 heading nodes, with levels in ascending order', () => {
    const text =
      `
####################
Interactive Software
####################


#~#~#~#~#~#
Video Games
#~#~#~#~#~#


Handheld Video Games
********************


Game Boy Games
==============


Real-Time Strategy Game Boy Games
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
Real-Time Strategy Game Boy Games Published By Nintendo
-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-


Warlocked
- - - - -`

    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Interactive Software')], 1),
        new HeadingNode([new PlainTextNode('Video Games')], 2),
        new HeadingNode([new PlainTextNode('Handheld Video Games')], 3),
        new HeadingNode([new PlainTextNode('Game Boy Games')], 4),
        new HeadingNode([new PlainTextNode('Real-Time Strategy Game Boy Games')], 5),
        new HeadingNode([new PlainTextNode('Real-Time Strategy Game Boy Games Published By Nintendo')], 6),
        new HeadingNode([new PlainTextNode('Warlocked')], 7)
      ]))
  })
})
