import { expect } from 'chai'
import * as Up from '../../../index'


context('Section links can be within any rich inline convention:', () => {
  specify('Bold', () => {
    const markup = `
I have plenty of good traits. __See [section: interesting].__

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.Bold([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Emphasis', () => {
    const markup = `
I have plenty of good traits. *See [section: interesting].*

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.Emphasis([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Footnotes', () => {
    const markup = `
I have plenty of good traits. [^ See [section: interesting].]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    const footnote = new Up.Footnote([
      new Up.PlainText('See '),
      new Up.SectionLink('interesting', interestingHeading),
      new Up.PlainText('.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits.'),
          footnote
        ]),
        new Up.FootnoteBlock([footnote]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Highlight', () => {
    const markup = `
I have plenty of good traits. [highlight: See [section: interesting].]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.Highlight([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Inline NSFL', () => {
    const markup = `
I have plenty of good traits. [NSFL: See [section: interesting].]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.InlineNsfl([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Inline NSFW', () => {
    const markup = `
I have plenty of good traits. [NSFW: See [section: interesting].]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.InlineNsfw([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Inline spoilers', () => {
    const markup = `
I have plenty of good traits. [SPOILER: See [section: interesting].]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.InlineSpoiler([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Italic', () => {
    const markup = `
I have plenty of good traits. _See [section: interesting]._

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.Italic([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Links', () => {
    const markup = `
I have plenty of good traits. [See [section: interesting]] (example.com).

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.Link([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading)
          ], 'https://example.com'),
          new Up.PlainText('.')
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Parnetheses', () => {
    const markup = `
I have plenty of good traits. (See [section: interesting].)

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.NormalParenthetical([
            new Up.PlainText('(See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.)')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Square brackets', () => {
    const markup = `
I have plenty of good traits. [See (section: interesting).]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.SquareParenthetical([
            new Up.PlainText('[See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.]')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Stress', () => {
    const markup = `
I have plenty of good traits. **See [section: interesting].**

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('I have plenty of good traits. '),
          new Up.Stress([
            new Up.PlainText('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.PlainText('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.PlainText('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })
})
