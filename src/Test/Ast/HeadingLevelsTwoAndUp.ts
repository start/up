import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Heading } from '../../SyntaxNodes/Heading'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'


describe("The first heading with an underline comprised of different characters than the top-level heading's underline", () => {
  it('produces a level-2 heading node', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], 1)

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], 2)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument(
        [helloHeading, goodbyeHeading],
        new UpDocument.TableOfContents([helloHeading, goodbyeHeading])
      ))
  })

  it('produces a level-2 heading node when the underline characters only differ by spaces', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
= = = = = = = =`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], 1)

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], 2)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument(
        [helloHeading, goodbyeHeading],
        new UpDocument.TableOfContents([helloHeading, goodbyeHeading])
      ))
  })

  it('produces a level-2 heading node even when it is not the second heading in a document', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=============

Goodbye again, world!
=-=-=-=-=-=-=-=`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], 1)

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], 2)

    const goodbyeAgainHeading =
      new Heading([new PlainText('Goodbye again, world!')], 2)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        helloHeading,
        goodbyeHeading],
        new UpDocument.TableOfContents([
          helloHeading,
          goodbyeHeading,
          goodbyeAgainHeading])
      ))
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
        new Heading([new PlainText('Hello, world!')], 1),
        new Heading([new PlainText('Goodbye, world!')], 1),
        new Heading([new PlainText('Goodbye again, world!')], 2)
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
        new Heading([new PlainText('Interactive Software')], 1),
        new Heading([new PlainText('Video Games')], 2),
        new Heading([new PlainText('Handheld Video Games')], 3),
        new Heading([new PlainText('Game Boy Games')], 4),
        new Heading([new PlainText('Real-Time Strategy Game Boy Games')], 5),
        new Heading([new PlainText('Real-Time Strategy Game Boy Games Published By Nintendo')], 6),
        new Heading([new PlainText('Warlocked')], 7)
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
        new Heading([new PlainText('Hello, world!')], 1),
        new Heading([new PlainText('Goodbye, world!')], 2),
        new UnorderedList([
          new UnorderedList.Item([
            new Heading([new PlainText('Umm, I forgot my keys.')], 2)
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
        new Heading([new PlainText('Hello, world!')], 1),
        new Heading([new PlainText('Goodbye, world!')], 2),
        new OrderedList([
          new OrderedList.Item([
            new Heading([new PlainText('Umm, I forgot my keys.')], 2)
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
        new Heading([new PlainText('Hello, world!')], 1),
        new Heading([new PlainText('Goodbye, world!')], 2),
        new DescriptionList([
          new DescriptionList.Item(
            [new DescriptionList.Item.Term([new PlainText('Awkward')])],
            new DescriptionList.Item.Description([
              new Heading([new PlainText('Umm, I forgot my keys.')], 2)
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
        new Heading([new PlainText('Hello, world!')], 1),
        new Heading([new PlainText('Goodbye, world!')], 2),
        new Blockquote([
          new Heading([new PlainText('Umm, I forgot my keys.')], 1)
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
        new Blockquote([
          new Heading([new PlainText('Hello, world!')], 1),
          new Heading([new PlainText('Goodbye, world!')], 2),
          new UnorderedList([
            new UnorderedList.Item([
              new Heading([new PlainText('Umm, I forgot my keys.')], 2)
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
        new Blockquote([
          new Heading([new PlainText('Hello, world!')], 1),
          new Heading([new PlainText('Goodbye, world!')], 2),
          new Blockquote([
            new Heading([new PlainText('Umm, I forgot my keys.')], 1)
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
        new Blockquote([
          new Heading([new PlainText('Hello, world!')], 1),
          new Heading([new PlainText('Goodbye, world!')], 2)
        ]),
        new Blockquote([
          new Heading([new PlainText('Umm, I forgot my keys.')], 1)
        ])
      ]))
  })
})
