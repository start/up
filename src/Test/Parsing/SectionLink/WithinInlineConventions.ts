import { expect } from 'chai'
import * as Up from '../../../Main'


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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.Bold([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.Emphasis([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    const footnote = new Up.Footnote([
      new Up.Text('See '),
      new Up.SectionLink('interesting', interestingHeading),
      new Up.Text('.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits.'),
          footnote
        ]),
        new Up.FootnoteBlock([footnote]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Highlights', () => {
    const markup = `
I have plenty of good traits. ==See [section: interesting].==

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.Highlight([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Inline revealables', () => {
    const markup = `
I have plenty of good traits. [SPOILER: See [section: interesting].]

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.InlineRevealable([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Italics', () => {
    const markup = `
I have plenty of good traits. _See [section: interesting]._

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.Italic([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.Link([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading)
          ], 'https://example.com'),
          new Up.Text('.')
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.NormalParenthetical([
            new Up.Text('(See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.)')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.SquareParenthetical([
            new Up.Text('[See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.]')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('I have plenty of good traits. '),
          new Up.Stress([
            new Up.Text('See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ])
        ]),
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })
})
