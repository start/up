import { expect } from 'chai'
import * as Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'


describe("The first heading with an underline comprised of different characters than the top-level heading's underline", () => {
  it('produces a level-2 heading node', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
      ]))
  })

  it('produces a level-2 heading node when the underline characters only differ by spaces', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
= = = = = = = =`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
      ]))
  })

  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye again, world!')], 2)
      ]))
  })

  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye again, world!')], 2)
      ]))
  })
})


describe('7 headings with different heading underlines', () => {

  it('produce 7 heading nodes, with levels in ascending order', () => {
    const text = `
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

    expect(Up.toAst(text)).to.be.eql(
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


describe("A level-2 heading underline defined outside of an unordered list", () => {
  it('produces a level-2 heading node inside the unordered list, too', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

* Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new UnorderedListNode([
          new UnorderedListItem([
            new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined outside of an ordered list", () => {
  it('produces a level-2 heading node inside the ordered list, too', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

#) Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new OrderedListNode([
          new OrderedListItem([
            new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined outside of a description list", () => {
  it('produces a level-2 heading node inside the description list, too', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

Awkward
  Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new DescriptionListNode([
          new DescriptionListItem(
            [new DescriptionTerm([new PlainTextNode('Awkward')])],
            new Description([
              new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
            ])
          )
        ])
      ]))
  })
})


describe("A level-2 heading underline defined outside of a blockquote", () => {
  it('is not recognized inside a blockquote, producing a level-1 heading node by default', () => {
    const text = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

> Umm, I forgot my keys.
> =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new BlockquoteNode([
          new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 1)
        ])
      ]))
  })
})


describe("A level-2 heading underline defined inside a blockquote but outside an unordered list in the same blockquote", () => {
  it('produces a level-2 heading node inside the ordered list, too', () => {
    const text = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=
>
> * Umm, I forgot my keys.
>   =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new HeadingNode([new PlainTextNode('Hello, world!')], 1),
          new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
          new UnorderedListNode([
            new UnorderedListItem([
              new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
            ])
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined inside a blockquote", () => {
  it('is not recognized inside a further nested blockquote, producing a level-1 heading node by default', () => {
    const text = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=
>
> > Umm, I forgot my keys.
> > =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new HeadingNode([new PlainTextNode('Hello, world!')], 1),
          new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
          new BlockquoteNode([
            new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 1)
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined inside a blockquote", () => {
  it('is not recognized inside a different blockquote, producing a level-1 heading node by default', () => {
    const text = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=


> Umm, I forgot my keys.
> =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new HeadingNode([new PlainTextNode('Hello, world!')], 1),
          new HeadingNode([new PlainTextNode('Goodbye, world!')], 2)
        ]),
        new BlockquoteNode([
          new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 1)
        ])
      ]))
  })
})