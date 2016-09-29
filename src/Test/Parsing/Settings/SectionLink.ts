import { expect } from 'chai'
import * as Up from '../../../index'


describe('The "sectionLink" term', () => {
  const up = new Up.Transformer({
    parsing: {
      keywords: { sectionLink: 'heading' }
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
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff. For example, see '),
          new Up.SectionLink('exotic', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
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
      keywords: {
        sectionLink: ' \t heading \t '
      }
    })

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff. For example, see '),
          new Up.SectionLink('exotic', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
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
      keywords: {
        sectionLink: '*heading*'
      }
    })

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff. For example, see '),
          new Up.SectionLink('exotic', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
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
      keywords: {
        sectionLink: ['heading', 'ref']
      }
    })

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

    const interestingHeading =
      new Up.Heading([new Up.Text('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

    expect(document).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text("Actually, I only drink milk. But I'm still great, as "),
          new Up.SectionLink('interesting', interestingHeading),
          new Up.Text(' demonstrates.')
        ]),
        interestingHeading,
        new Up.Paragraph([
          new Up.Text('I love all sorts of fancy stuff. For example, see '),
          new Up.SectionLink('exotic', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
  })
})
