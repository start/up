import { expect } from 'chai'
import * as Up from '../../../Main'


describe('The markup snippet for a section link is not evaluated any conventions, including typographical conventions:', () => {
  specify('En dashes', () => {
    const markup = `
I drink soda--exclusively
=========================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda--exclusively].`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda–exclusively')], {
        level: 1,
        searchableMarkup: "I drink soda--exclusively",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        searchableMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('I drink soda–exclusively', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Em dashes', () => {
    const markup = `
I drink soda---exclusively
=========================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda---exclusively].`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda—exclusively')], {
        level: 1,
        searchableMarkup: "I drink soda---exclusively",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        searchableMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('I drink soda—exclusively', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Plus-minus signs', () => {
    const markup = `
Daily, I drink 9 cans of soda +-2
======================================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink 9 cans of soda +-2].`

    const sodaHeading =
      new Up.Heading([new Up.Text('Daily, I drink 9 cans of soda ±2')], {
        level: 1,
        searchableMarkup: "Daily, I drink 9 cans of soda +-2",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        searchableMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('I drink 9 cans of soda ±2', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Plus-minus signs', () => {
    const markup = `
Daily, I drink 9 cans of soda... hourly
=======================================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink 9 cans of soda... hourly].`

    const sodaHeading =
      new Up.Heading([new Up.Text('Daily, I drink 9 cans of soda… hourly')], {
        level: 1,
        searchableMarkup: "Daily, I drink 9 cans of soda... hourly",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        searchableMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('I drink 9 cans of soda… hourly', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
