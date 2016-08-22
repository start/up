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

    const headings = [
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument(
        headings,
        new UpDocument.TableOfContents(headings)
      ))
  })

  it('produces a level-2 heading node when the underline characters only differ by spaces', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
= = = = = = = =`

    const headings = [
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument(
        headings,
        new UpDocument.TableOfContents(headings)
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

    const headings = [
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 }),
      new Heading([new PlainText('Goodbye again, world!')], { level: 2, ordinalInTableOfContents: 3 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument(
        headings,
        new UpDocument.TableOfContents(headings)
      ))
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

    const headings = [
      new Heading([new PlainText('Interactive Software')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Video Games')], { level: 2, ordinalInTableOfContents: 2 }),
      new Heading([new PlainText('Handheld Video Games')], { level: 3, ordinalInTableOfContents: 3 }),
      new Heading([new PlainText('Game Boy Games')], { level: 4, ordinalInTableOfContents: 4 }),
      new Heading([new PlainText('Real-Time Strategy Game Boy Games')], { level: 5, ordinalInTableOfContents: 5 }),
      new Heading([new PlainText('Real-Time Strategy Game Boy Games Published By Nintendo')], { level: 6, ordinalInTableOfContents: 6 }),
      new Heading([new PlainText('Warlocked')], { level: 7, ordinalInTableOfContents: 7 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument(
        headings,
        new UpDocument.TableOfContents(headings)))
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

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        helloHeading,
        goodbyeHeading,
        new UnorderedList([
          new UnorderedList.Item([
            keysHeading
          ])
        ])
      ], new UpDocument.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
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

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        helloHeading,
        goodbyeHeading,
        new OrderedList([
          new OrderedList.Item([
            keysHeading
          ])
        ])
      ], new UpDocument.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
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

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        helloHeading,
        goodbyeHeading,
        new DescriptionList([
          new DescriptionList.Item(
            [new DescriptionList.Item.Term([new PlainText('Awkward')])],
            new DescriptionList.Item.Description([
              keysHeading
            ]))
        ])
      ], new UpDocument.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
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

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        helloHeading,
        goodbyeHeading,
        new Blockquote([
          new Heading([new PlainText('Umm, I forgot my keys.')], { level: 1 })
        ])
      ], new UpDocument.TableOfContents([
        helloHeading,
        goodbyeHeading
      ])))
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
          new Heading([new PlainText('Hello, world!')], { level: 1 }),
          new Heading([new PlainText('Goodbye, world!')], { level: 2 }),
          new UnorderedList([
            new UnorderedList.Item([
              new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2 })
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
          new Heading([new PlainText('Hello, world!')], { level: 1 }),
          new Heading([new PlainText('Goodbye, world!')], { level: 2 }),
          new Blockquote([
            new Heading([new PlainText('Umm, I forgot my keys.')], { level: 1 })
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
          new Heading([new PlainText('Hello, world!')], { level: 1 }),
          new Heading([new PlainText('Goodbye, world!')], { level: 2 })
        ]),
        new Blockquote([
          new Heading([new PlainText('Umm, I forgot my keys.')], { level: 1 })
        ])
      ]))
  })
})
