import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'


describe('The snippet from a reference to a table of contents entry', () => {
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink soda–exclusively', sodaHeading),
            new PlainText('.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink soda—exclusively', sodaHeading),
            new PlainText('.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink 9 cans of soda ±2', sodaHeading),
            new PlainText('.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })
})


context('Typographical conventions are applied before matching references with their entries. That means a reference can match with an entry when', () => {
  specify('The reference uses the typographical convention but the entry uses the corresponding fancy character itself', () => {
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new ReferenceToTableOfContentsEntry('I drink soda—exclusively', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('The entry uses the typographical convention but the reference uses the corresponding fancy character itself', () => {
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new ReferenceToTableOfContentsEntry('I drink soda—exclusively', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
