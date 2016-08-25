import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'


describe('The "referenceToTableOfContentsEntry" config term', () => {
  const up = new Up({
    terms: {
      markup: { referenceToTableOfContentsEntry: 'heading' }
    }
  })

  it('is used to indicate references to table of contents entries', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new ReferenceToTableOfContentsEntry('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })

  it('is case-insensitive', () => {
    const lowercase = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`

    const mixedCase = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [HeAdInG: exotic].`

    expect(up.toDocument(lowercase)).to.deep.equal(up.toDocument(mixedCase))
  })

  it('is trimmed', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`

    const document = Up.toDocument(markup, {
      terms: {
        markup: {
          referenceToTableOfContentsEntry: ' \t heading \t '
        }
      }
    })

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new ReferenceToTableOfContentsEntry('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [*heading*: exotic].`

    const document = Up.toDocument(markup, {
      terms: {
        markup: {
          referenceToTableOfContentsEntry: '*heading*'
        }
      }
    })

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new ReferenceToTableOfContentsEntry('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })

  it('can have multiple variations', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk. But I'm still great, as [ref: interesting] demonstrates.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`

    const document = Up.toDocument(markup, {
      terms: {
        markup: {
          referenceToTableOfContentsEntry: ['heading', 'ref']
        }
      }
    })

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText("Actually, I only drink milk. But I'm still great, as "),
          new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
          new PlainText(' demonstrates.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new ReferenceToTableOfContentsEntry('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
  })
})
