import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Heading } from '../../SyntaxNodes/Heading'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { ReferenceToTableOfContentsEntry } from '../../SyntaxNodes/ReferenceToTableOfContentsEntry'

/*
import { Table } from '../../SyntaxNodes/Table'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { OutlineSeparator } from '../../SyntaxNodes/OutlineSeparator'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Audio } from '../../SyntaxNodes/Audio'
import { Image } from '../../SyntaxNodes/Image'
import { Video } from '../../SyntaxNodes/Video'
import { Link } from '../../SyntaxNodes/Link'

*/


describe('Bracketed text starting with "reference:".', () => {
  specify('produces a reference to a table of contents entry', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [reference: soda].`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], 1)

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], 1)

    expect(Up.toDocument(markup)).to.be.eql(
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
})


describe('The snippet from a reference to a table of contents entry', () => {
  context('is evaluated for typographical conventions:', () => {
    specify('En dashes', () => {
      const markup = `
I drink soda--exclusively
=========================

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [reference: I drink soda--exclusively].`

      const sodaHeading =
        new Heading([new PlainText('I drink soda–exclusively')], 1)

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], 1)

      expect(Up.toDocument(markup)).to.be.eql(
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

Not quite true. For example, see [reference: I drink soda---exclusively].`

      const sodaHeading =
        new Heading([new PlainText('I drink soda—exclusively')], 1)

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], 1)

      expect(Up.toDocument(markup)).to.be.eql(
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

Not quite true. For example, see [reference: I drink 9 cans of soda +-2].`

      const sodaHeading =
        new Heading([new PlainText('Daily, I drink 9 cans of soda ±2')], 1)

      const neverLieHeading =
        new Heading([new PlainText('I never lie')], 1)

      expect(Up.toDocument(markup)).to.be.eql(
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
