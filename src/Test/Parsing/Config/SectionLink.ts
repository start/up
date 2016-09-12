import { expect } from 'chai'
import { Up } from '../../../Up'
import { Document } from '../../../SyntaxNodes/Document'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { SectionLink } from '../../../SyntaxNodes/SectionLink'


describe('The "sectionLink" term', () => {
  const up = new Up({
    parsing: {
      terms: { sectionLink: 'heading' }
    }
  })

  it('is used to indicate section links', () => {
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

    expect(up.parse(markup)).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new SectionLink('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, interestingHeading])))
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

    expect(up.parse(lowercase)).to.deep.equal(up.parse(mixedCase))
  })

  it('is trimmed', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`

    const document = Up.parse(markup, {
      terms: {
        sectionLink: ' \t heading \t '
      }
    })

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new SectionLink('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [*heading*: exotic].`

    const document = Up.parse(markup, {
      terms: {
        sectionLink: '*heading*'
      }
    })

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new SectionLink('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, interestingHeading])))
  })

  it('can have multiple variations', () => {
    const markup = `
I drink exotic soda
=====================

Actually, I only drink milk. But I'm still great, as [ref: interesting] demonstrates.

I am interesting
================

I love all sorts of fancy stuff. For example, see [heading: exotic].`

    const document = Up.parse(markup, {
      terms: {
        sectionLink: ['heading', 'ref']
      }
    })

    const sodaHeading =
      new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText("Actually, I only drink milk. But I'm still great, as "),
          new SectionLink('interesting', interestingHeading),
          new PlainText(' demonstrates.')
        ]),
        interestingHeading,
        new Paragraph([
          new PlainText('I love all sorts of fancy stuff. For example, see '),
          new SectionLink('exotic', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, interestingHeading])))
  })
})
