import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'


context('Bracketed text starting with "section:" produces a reference to a table of contents entry. Either type of brackets can be used:', () => {
  const markupUsingSquareBracketsAndSectionTerm = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: soda].`

  const documentUsingSquareBracketsAndSectionTerm =
    Up.toDocument(markupUsingSquareBracketsAndSectionTerm)


  specify('Square brackets', () => {
    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(documentUsingSquareBracketsAndSectionTerm).to.be.eql(
      new UpDocument([
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new ReferenceToTableOfContentsEntry('soda', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Parenthesis', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see (section: soda).`

    expect(Up.toDocument(markup)).to.be.eql(documentUsingSquareBracketsAndSectionTerm)
  })
})


context('A reference to a table of contents entry will try to match the first entry whose text exactly matches its own snippet.', () => {
  context('The exact match can come:', () => {
    specify('Before the reference', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda].`

      const sodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink soda', sodaHeading),
            new PlainText('.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('After the reference', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: I never lie]. 

I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.`

      const sodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Paragraph([
            new PlainText("I'm a great guy. For more information, skip to "),
            new ReferenceToTableOfContentsEntry('I never lie', neverLieHeading),
            new PlainText('.')
          ]),
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Before another exactly matching entry', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda].

Anyway...

I drink soda
============

That's what I tell 'em.`

      const firstSodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      const secondSodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 3 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          firstSodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink soda', firstSodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText('Anyway...')
          ]),
          secondSodaHeading,
          new Paragraph([
            new PlainText("That's what I tell 'em.")
          ])
        ], new UpDocument.TableOfContents([firstSodaHeading, neverLieHeading, secondSodaHeading])))
    })

    specify('Before an entry that merely contains the snippet', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda].

Anyway...

I lied when I said I drink soda
================================

Oops.`

      const firstSodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      const secondSodaHeading =
        new Heading([new PlainText('I lied when I said I drink soda')], { level: 1, ordinalInTableOfContents: 3 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          firstSodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink soda', firstSodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText('Anyway...')
          ]),
          secondSodaHeading,
          new Paragraph([
            new PlainText("Oops.")
          ])
        ], new UpDocument.TableOfContents([firstSodaHeading, neverLieHeading, secondSodaHeading])))
    })

    specify('After an entry that merely contains the snippet', () => {
      const markup = `
If I ever say I drink soda, I'm lying
=====================================

I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda].

Anyway...

I drink soda
============

That's what I tell 'em.`

      const firstSodaHeading =
        new Heading([new PlainText("If I ever say I drink soda, I'm lying")], { level: 1, ordinalInTableOfContents: 1 })

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

      const secondSodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 3 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          firstSodaHeading,
          new Paragraph([
            new PlainText('I only drink milk.')
          ]),
          neverLieHeading,
          new Paragraph([
            new PlainText('Not quite true. For example, see '),
            new ReferenceToTableOfContentsEntry('I drink soda', secondSodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText('Anyway...')
          ]),
          secondSodaHeading,
          new Paragraph([
            new PlainText("That's what I tell 'em.")
          ])
        ], new UpDocument.TableOfContents([firstSodaHeading, neverLieHeading, secondSodaHeading])))
    })
  })
})
