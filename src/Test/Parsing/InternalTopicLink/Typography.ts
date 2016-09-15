import { expect } from 'chai'
import Up = require('../../../index')
import { Document } from '../../../SyntaxNodes/Document'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { SectionLink } from '../../../SyntaxNodes/SectionLink'


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
        new Heading([new PlainText('I drink soda–exclusively')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new SectionLink('I drink soda–exclusively', sodaHeading),
            new PlainText('.')
          ])
        ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
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
        new Heading([new PlainText('I drink soda—exclusively')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new SectionLink('I drink soda—exclusively', sodaHeading),
            new PlainText('.')
          ])
        ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
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
        new Heading([new PlainText('Daily, I drink 9 cans of soda ±2')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new SectionLink('I drink 9 cans of soda ±2', sodaHeading),
            new PlainText('.')
          ])
        ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
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
        new Heading([new PlainText('Daily, I drink 9 cans of soda… hourly')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new SectionLink('I drink 9 cans of soda… hourly', sodaHeading),
            new PlainText('.')
          ])
        ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
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
      new Heading([new PlainText('I drink soda—exclusively')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new SectionLink('I drink soda—exclusively', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
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
      new Heading([new PlainText('I drink soda—exclusively')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new SectionLink('I drink soda—exclusively', sodaHeading),
          new PlainText('.')
        ])
      ], new Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
