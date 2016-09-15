import { expect } from 'chai'
import * as Up from '../../../index'


describe('The snippet from a section link', () => {
  context('is evaluated for typographical conventions:', () => {
    specify('En dashes', () => {
      const markup = `
I drink soda--exclusively
=========================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda--exclusively].`

      const sodaHeading =
        new Up.Heading([new Up.PlainText('I drink soda–exclusively')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          sodaHeading,
          new Up.Paragraph([
            new Up.PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.PlainText('Not quite true. For example, see '),
            new Up.SectionLink('I drink soda–exclusively', sodaHeading),
            new Up.PlainText('.')
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
        new Up.Heading([new Up.PlainText('I drink soda—exclusively')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          sodaHeading,
          new Up.Paragraph([
            new Up.PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.PlainText('Not quite true. For example, see '),
            new Up.SectionLink('I drink soda—exclusively', sodaHeading),
            new Up.PlainText('.')
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
        new Up.Heading([new Up.PlainText('Daily, I drink 9 cans of soda ±2')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          sodaHeading,
          new Up.Paragraph([
            new Up.PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.PlainText('Not quite true. For example, see '),
            new Up.SectionLink('I drink 9 cans of soda ±2', sodaHeading),
            new Up.PlainText('.')
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
        new Up.Heading([new Up.PlainText('Daily, I drink 9 cans of soda… hourly')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          sodaHeading,
          new Up.Paragraph([
            new Up.PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.PlainText('Not quite true. For example, see '),
            new Up.SectionLink('I drink 9 cans of soda… hourly', sodaHeading),
            new Up.PlainText('.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })
})


context('Typographical conventions are applied before matching section links with their entries. That means a section link can match with an entry when', () => {
  specify('The section link uses the typographical convention but the entry uses the corresponding fancy character itself', () => {
    const markup = `
I drink soda—exclusively
=========================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda---exclusively].`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink soda—exclusively')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.PlainText('Not quite true. For example, see '),
          new Up.SectionLink('I drink soda—exclusively', sodaHeading),
          new Up.PlainText('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('The entry uses the typographical convention but the section link uses the corresponding fancy character itself', () => {
    const markup = `
I drink soda---exclusively
=========================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda—exclusively].`

    const sodaHeading =
      new Up.Heading([new Up.PlainText('I drink soda—exclusively')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Up.Heading([new Up.PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.PlainText('Not quite true. For example, see '),
          new Up.SectionLink('I drink soda—exclusively', sodaHeading),
          new Up.PlainText('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
