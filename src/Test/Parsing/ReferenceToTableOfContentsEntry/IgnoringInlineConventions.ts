import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'


context("A a table of contents entry reference's snippet ignores inline conventions. It only cares about matching literal text.", () => {
  specify("The snippet ignores inline conventions within the entry", () => {
    const markup = `
Stress and emphasis are commonly used in writing
================================================

Luckily for us, Up supports that!


*Emphasis*
----------

I love apples.


I always stay on topic
======================

Not quite true. For example, see [section: emphasis].`

    const stressAndEmphasisHeading =
      new Heading([new PlainText('Stress and emphasis are commonly used in writing')], { level: 1, ordinalInTableOfContents: 1 })

    const emphasisSubHeading =
      new Heading([
        new Emphasis([new PlainText('Emphasis')]),
      ], { level: 2, ordinalInTableOfContents: 2 })

    const stayOnTopicHeading =
      new Heading([new PlainText('I always stay on topic')], { level: 1, ordinalInTableOfContents: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        stressAndEmphasisHeading,
        new Paragraph([
          new PlainText('Luckily for us, Up supports that!')
        ]),
        emphasisSubHeading,
        new Paragraph([
          new PlainText('I love apples.')
        ]),
        stayOnTopicHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new ReferenceToTableOfContentsEntry('emphasis', emphasisSubHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([stressAndEmphasisHeading, emphasisSubHeading, stayOnTopicHeading])))
  })

  specify("Inline conventions are not evaluated within the snippet", () => {
    const markup = `
Emphasis is commonly used in writing
====================================

Luckily for us, Up supports that!


\`*Emphasis*\` in Up explained
------------------------------

I love apples.


I always stay on topic
======================

Not quite true. For example, see [section: *emphasis*].`

    const mainEmphasisHeading =
      new Heading([new PlainText('Emphasis is commonly used in writing')], { level: 1, ordinalInTableOfContents: 1 })

    const emphasisSubHeading =
      new Heading([
        new InlineCode('*Emphasis*'),
        new PlainText(' in Up explained')
      ], { level: 2, ordinalInTableOfContents: 2 })

    const stayOnTopicHeading =
      new Heading([new PlainText('I always stay on topic')], { level: 1, ordinalInTableOfContents: 3 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        mainEmphasisHeading,
        new Paragraph([
          new PlainText('Luckily for us, Up supports that!')
        ]),
        emphasisSubHeading,
        new Paragraph([
          new PlainText('I love apples.')
        ]),
        stayOnTopicHeading,
        new Paragraph([
          new PlainText('Not quite true. For example, see '),
          new ReferenceToTableOfContentsEntry('*emphasis*', emphasisSubHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([mainEmphasisHeading, emphasisSubHeading, stayOnTopicHeading])))
  })
})