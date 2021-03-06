import { expect } from 'chai'
import * as Up from '../../Main'


describe("The first heading with an underline comprised of different characters than the top-level heading's underline", () => {
  it('produces a level-2 heading node', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=`

    const headings = [
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      }),
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        headings,
        new Up.Document.TableOfContents(headings)
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      }),
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 1,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      }),
      new Up.Heading([new Up.Text('Goodbye again, world!')], {
        level: 2,
        titleMarkup: 'Goodbye again, world!',
        ordinalInTableOfContents: 3
      })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        headings,
        new Up.Document.TableOfContents(headings)
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      }),
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        headings,
        new Up.Document.TableOfContents(headings)
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      }),
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        headings,
        new Up.Document.TableOfContents(headings)
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
      new Up.Heading([new Up.Text('Interactive Software')], {
        level: 1,
        titleMarkup: 'Interactive Software',
        ordinalInTableOfContents: 1
      }),
      new Up.Heading([new Up.Text('Video Games')], {
        level: 2,
        titleMarkup: 'Video Games',
        ordinalInTableOfContents: 2
      }),
      new Up.Heading([new Up.Text('Handheld Video Games')], {
        level: 3,
        titleMarkup: 'Handheld Video Games',
        ordinalInTableOfContents: 3
      }),
      new Up.Heading([new Up.Text('Game Boy Games')], {
        level: 4,
        titleMarkup: 'Game Boy Games',
        ordinalInTableOfContents: 4
      }),
      new Up.Heading([new Up.Text('Real-Time Strategy Game Boy Games')], {
        level: 5,
        titleMarkup: 'Real-Time Strategy Game Boy Games',
        ordinalInTableOfContents: 5
      }),
      new Up.Heading([new Up.Text('Real-Time Strategy Game Boy Games Published By Nintendo')], {
        level: 6,
        titleMarkup: 'Real-Time Strategy Game Boy Games Published By Nintendo',
        ordinalInTableOfContents: 6
      }),
      new Up.Heading([new Up.Text('Warlocked')], {
        level: 7,
        titleMarkup: 'Warlocked',
        ordinalInTableOfContents: 7
      })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document(
        headings,
        new Up.Document.TableOfContents(headings)))
  })
})


describe('A level-2 heading underline defined outside of a bulleted list', () => {
  it('produces a level-2 heading node inside the bulleted list', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

* Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    const helloHeading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        helloHeading,
        goodbyeHeading,
        new Up.BulletedList([
          new Up.BulletedList.Item([
            keysHeading
          ])
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe('A level-2 heading underline defined outside of a numbered list', () => {
  it('produces a level-2 heading node inside the numbered list', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

#) Umm, I forgot my keys.
  =-=-=-=-=-=-=-=-=-=-=`

    const helloHeading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        helloHeading,
        goodbyeHeading,
        new Up.NumberedList([
          new Up.NumberedList.Item([
            keysHeading
          ])
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe('A level-2 heading underline defined outside of a description list', () => {
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        helloHeading,
        goodbyeHeading,
        new Up.DescriptionList([
          new Up.DescriptionList.Item(
            [new Up.DescriptionList.Item.Subject([new Up.Text('Awkward')])],
            new Up.DescriptionList.Item.Description([
              keysHeading
            ]))
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe('A level-2 heading underline defined outside of a blockquote', () => {
  it('produces a level-2 heading node inside the blockquote', () => {
    const markup = `
Hello, world!
=============

Goodbye, world!
=-=-=-=-=-=-=-=

> Umm, I forgot my keys.
> =-=-=-=-=-=-=-=-=-=-=`

    const helloHeading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        helloHeading,
        goodbyeHeading,
        new Up.Blockquote([
          keysHeading
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe('A level-2 heading underline defined inside a blockquote but outside a bulleted list in the same blockquote', () => {
  it('produces a level-2 heading node inside the numbered list', () => {
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          helloHeading,
          goodbyeHeading,
          new Up.BulletedList([
            new Up.BulletedList.Item([
              keysHeading
            ])
          ])
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe('A level-2 heading underline defined inside a blockquote', () => {
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          helloHeading,
          goodbyeHeading,
          new Up.Blockquote([
            keysHeading
          ])
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})


describe('A level-2 heading underline defined inside a blockquote', () => {
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
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 2,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    const keysHeading =
      new Up.Heading([new Up.Text('Umm, I forgot my keys.')], {
        level: 2,
        titleMarkup: 'Umm, I forgot my keys.',
        ordinalInTableOfContents: 3
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Blockquote([
          helloHeading,
          goodbyeHeading
        ]),
        new Up.Blockquote([
          keysHeading
        ])
      ], new Up.Document.TableOfContents([
        helloHeading,
        goodbyeHeading,
        keysHeading
      ])))
  })
})
