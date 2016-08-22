import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Bold } from'../../../SyntaxNodes/Bold'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Italic } from '../../../SyntaxNodes/Italic'
import { Link } from '../../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { RevisionInsertion } from'../../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from'../../../SyntaxNodes/RevisionDeletion'
import { Stress } from'../../../SyntaxNodes/Stress'


context('References to table of contents can be within any rich inline convention:', () => {
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new Bold([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new Emphasis([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    const footnote = new Footnote([
      new PlainText('See '),
      new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
      new PlainText('.')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits.'),
          footnote
        ]),
        new FootnoteBlock([footnote]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new Highlight([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new InlineNsfl([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new InlineNsfw([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new InlineSpoiler([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new Italic([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new Link([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading)
          ], 'https://example.com'),
          new PlainText('.')
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new NormalParenthetical([
            new PlainText('(See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.)')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new SquareParenthetical([
            new PlainText('[See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.]')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Revision deletion', () => {
    const markup = `
I have plenty of good traits. ~~See [section: interesting].~~

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new RevisionDeletion([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })

  specify('Revision insertion', () => {
    const markup = `
I have plenty of good traits. ++See [section: interesting].++

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new RevisionInsertion([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
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
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText('I have plenty of good traits. '),
          new Stress([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ])
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })
})
