import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Bold } from'../../../SyntaxNodes/Bold'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { PlainText } from'../../../SyntaxNodes/PlainText'
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


  context('The snippet can match text within an entry that crosses the "boundary" of an inline convention:', () => {
    specify('Audio', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: this full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Listen to this [audio: full transcript of my greatness] (example.com/transcript)
============================================================================================

Well, maybe I'm not so great.`

      const sodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Heading([
          new PlainText("I am great. Listen to this "),
          new Audio('full transcript of my greatness', 'https://example.com/transcript')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Paragraph([
            new PlainText("I'm a great guy. For more information, skip to "),
            new ReferenceToTableOfContentsEntry('this full transcript', greatnessHeading),
            new PlainText('.')
          ]),
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Paragraph([
            new PlainText("Well, maybe I'm not so great.")
          ])
        ], new UpDocument.TableOfContents([sodaHeading, greatnessHeading])))
    })
  })

  specify('Bold', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: this full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read this __full transcript of my greatness__
=========================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read this "),
        new Bold([new PlainText("full transcript of my greatness")]),
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('this full transcript', greatnessHeading),
          new PlainText('.')
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        greatnessHeading,
        new Paragraph([
          new PlainText("Well, maybe I'm not so great.")
        ])
      ], new UpDocument.TableOfContents([sodaHeading, greatnessHeading])))
  })
})
