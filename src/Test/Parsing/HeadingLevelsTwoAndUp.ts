import { expect } from 'chai'
import { Up } from '../../Up'
import { Document } from '../../SyntaxNodes/Document'
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document(
        headings,
        new Document.TableOfContents(headings)
      ))
  })
})


describe('The first level-2 heading', () => {
  it('does not need to be second heading in a document', () => {
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document(
        headings,
        new Document.TableOfContents(headings)
      ))
  })
})


context('A heading with an overline is considered distinct from a heading without an overline, so the two will never share the same level, regardless of which appears first:', () => {
  specify('When the overlined version appears first', () => {
    const markup = `
=============
Hello, world!
=============

Goodbye, world!
===============`

    const headings = [
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Document(
        headings,
        new Document.TableOfContents(headings)
      ))
  })

  specify('When the non-overlined version appears first', () => {
    const markup = `
Hello, world!
#~#~#~#~#~#~#

#~~~~~~~~~~~#
Goodbye, world!
#~~~~~~~~~~~#`

    const headings = [
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Document(
        headings,
        new Document.TableOfContents(headings)
      ))
  })
})


describe('7 headings with different signatures', () => {
  it('produce 7 heading nodes, with levels in ascending order', () => {
    const markup = `
####################
Interactive Software
####################


#~#~#~#~#~#
Video Games
#~#~#~#~#~#


Handheld Video Games
####################


Game Boy Games
#~#~#~#~#~#~#~#


Real-Time Strategy Game Boy Games
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=


-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
Real-Time Strategy Game Boy Games Published By Nintendo
-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-


Warlocked
---------`

    const headings = [
      new Heading([new PlainText('Interactive Software')], { level: 1, ordinalInTableOfContents: 1 }),
      new Heading([new PlainText('Video Games')], { level: 2, ordinalInTableOfContents: 2 }),
      new Heading([new PlainText('Handheld Video Games')], { level: 3, ordinalInTableOfContents: 3 }),
      new Heading([new PlainText('Game Boy Games')], { level: 4, ordinalInTableOfContents: 4 }),
      new Heading([new PlainText('Real-Time Strategy Game Boy Games')], { level: 5, ordinalInTableOfContents: 5 }),
      new Heading([new PlainText('Real-Time Strategy Game Boy Games Published By Nintendo')], { level: 6, ordinalInTableOfContents: 6 }),
      new Heading([new PlainText('Warlocked')], { level: 7, ordinalInTableOfContents: 7 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Document(
        headings,
        new Document.TableOfContents(headings)))
  })
})


describe("A level-2 heading underline defined outside of an unordered list", () => {
  it('produces a level-2 heading node inside the unordered list', () => {
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        helloHeading,
        goodbyeHeading,
        new UnorderedList([
          new UnorderedList.Item([
            keysHeading
          ])
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe("A level-2 heading underline defined outside of an ordered list", () => {
  it('produces a level-2 heading node inside the ordered list', () => {
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        helloHeading,
        goodbyeHeading,
        new OrderedList([
          new OrderedList.Item([
            keysHeading
          ])
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe("A level-2 heading underline defined outside of a description list", () => {
  it('produces a level-2 heading node inside the description list', () => {
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

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        helloHeading,
        goodbyeHeading,
        new DescriptionList([
          new DescriptionList.Item(
            [new DescriptionList.Item.Subject([new PlainText('Awkward')])],
            new DescriptionList.Item.Description([
              keysHeading
            ]))
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe("A level-2 heading underline defined outside of a blockquote", () => {
  it('produces a level-2 heading node inside the blockquote', () => {
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

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        helloHeading,
        goodbyeHeading,
        new Blockquote([
          keysHeading
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe("A level-2 heading underline defined inside a blockquote but outside an unordered list in the same blockquote", () => {
  it('produces a level-2 heading node inside the ordered list', () => {
    const markup = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=
>
> * Umm, I forgot my keys.
>   =-=-=-=-=-=-=-=-=-=-=`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          helloHeading,
          goodbyeHeading,
          new UnorderedList([
            new UnorderedList.Item([
              keysHeading
            ])
          ])
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe("A level-2 heading underline defined inside a blockquote", () => {
  it('produces a level-2 heading node inside nested blockquote', () => {
    const markup = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=
>
> > Umm, I forgot my keys.
> > =-=-=-=-=-=-=-=-=-=-=`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          helloHeading,
          goodbyeHeading,
          new Blockquote([
            keysHeading
          ])
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe("A level-2 heading underline defined inside a blockquote", () => {
  it('produces a level-2 heading node inside a different blockquote', () => {
    const markup = `
> Hello, world!
> =============
>
> Goodbye, world!
> =-=-=-=-=-=-=-=


> Umm, I forgot my keys.
> =-=-=-=-=-=-=-=-=-=-=`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 2, ordinalInTableOfContents: 2 })

    const keysHeading =
      new Heading([new PlainText('Umm, I forgot my keys.')], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new Blockquote([
          helloHeading,
          goodbyeHeading,
        ]),
        new Blockquote([
          keysHeading
        ])
      ], new Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})
