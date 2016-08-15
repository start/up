import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'


describe("The first heading with an underline comprised of different characters than the top-level heading's underline", () => {
  it('produces a level-2 heading node', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
      ]))
  })

  it('produces a level-2 heading node when the underline characters only differ by spaces', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
= = = = = = = =`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
      ]))
  })

  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye again, world!')], 2)
      ]))
  })

  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye again, world!')], 2)
      ]))
  })
})


describe('7 headings with different heading underlines', () => {

  it('produce 7 heading nodes, with levels in ascending order', () => {
    const markup = `
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

* Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined outside of an ordered list", () => {
  it('produces a level-2 heading node inside the ordered list, too', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

#) Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined outside of a description list", () => {
  it('produces a level-2 heading node inside the description list, too', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

Awkward
  Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new HeadingNode([new PlainTextNode('Hello, world!')], 1),
        new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
        new DescriptionListNode([
          new DescriptionListNode.Item(
            [new DescriptionListNode.Item.Term([new PlainTextNode('Awkward')])],
            new DescriptionListNode.Item.Description([
              new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
            ]))
        ])
      ]))
  })
})


describe("A level-2 heading underline defined outside of a blockquote", () => {
  it('is not recognized inside a blockquote, producing a level-1 heading node by default', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

> Umm, I forgot my keys.
> =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    const markup = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=
>
> * Umm, I forgot my keys.
>   =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new BlockquoteNode([
          new HeadingNode([new PlainTextNode('Hello, world!')], 1),
          new HeadingNode([new PlainTextNode('Goodbye, world!')], 2),
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new HeadingNode([new PlainTextNode('Umm, I forgot my keys.')], 2)
            ])
          ])
        ])
      ]))
  })
})


describe("A level-2 heading underline defined inside a blockquote", () => {
  it('is not recognized inside a further nested blockquote, producing a level-1 heading node by default', () => {
    const markup = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=
>
> > Umm, I forgot my keys.
> > =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
    const markup = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=


> Umm, I forgot my keys.
> =-=-=-=-=-=-=-=-=-=-=`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
