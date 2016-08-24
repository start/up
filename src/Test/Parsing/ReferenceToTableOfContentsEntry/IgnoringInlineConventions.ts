import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Bold } from'../../../SyntaxNodes/Bold'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { ExampleInput } from '../../../SyntaxNodes/ExampleInput'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { Image } from '../../../SyntaxNodes/Image'
import { InlineCode } from '../../../SyntaxNodes/InlineCode'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Italic } from '../../../SyntaxNodes/Italic'
import { Link } from '../../../SyntaxNodes/Link'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { RevisionDeletion } from'../../../SyntaxNodes/RevisionDeletion'
import { RevisionInsertion } from'../../../SyntaxNodes/RevisionInsertion'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'
import { Stress } from'../../../SyntaxNodes/Stress'
import { Video } from'../../../SyntaxNodes/Video'


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


  context('The snippet can match text within an entry that spans the "boundary" of an inline convention:', () => {
    specify('Audio', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Listen to the [audio: full transcript of my greatness] (example.com/transcript)
===========================================================================================

Well, maybe I'm not so great.`

      const sodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Heading([
          new PlainText("I am great. Listen to the "),
          new Audio('full transcript of my greatness', 'https://example.com/transcript')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new Paragraph([
            new PlainText("I'm a great guy. For more information, skip to "),
            new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the __full transcript of my greatness__
=========================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new Bold([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Example input', () => {
    const markup = `
I'm a helpful guy. For more information, see [section: mac menu]. 

I drink soda
============

Actually, I only drink milk.

Why you must explore the { About This Mac } menu item
=====================================================

Well, maybe I'm not so helpful.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText('Why you must explore the '),
        new ExampleInput('About This Mac'),
        new PlainText(' menu item')
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a helpful guy. For more information, see "),
          new ReferenceToTableOfContentsEntry('mac menu', greatnessHeading),
          new PlainText('.')
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        greatnessHeading,
        new Paragraph([
          new PlainText("Well, maybe I'm not so helpful.")
        ])
      ], new UpDocument.TableOfContents([sodaHeading, greatnessHeading])))
  })

  specify('Highlight', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the [highlight: full transcript of my greatness]
==================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new Highlight([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Images', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. See the [image: full transcript of my greatness] (example.com/transcript)
=====================================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. See the "),
        new Image('full transcript of my greatness', 'https://example.com/transcript')
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Example input', () => {
    const markup = `
I'm a helpful guy. For more information, see [section: SQL's delete]. 

I drink soda
============

Actually, I only drink milk.

Why you should love SQL's \`DELETE FROM\` statement
===================================================

Well, maybe I'm not so helpful.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("Why you should love SQL's "),
        new InlineCode("DELETE FROM"),
        new PlainText(' statement')
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a helpful guy. For more information, see "),
          new ReferenceToTableOfContentsEntry("SQL's delete", greatnessHeading),
          new PlainText('.')
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        greatnessHeading,
        new Paragraph([
          new PlainText("Well, maybe I'm not so helpful.")
        ])
      ], new UpDocument.TableOfContents([sodaHeading, greatnessHeading])))
  })

  specify('Footnotes', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: fantastic transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the full [^ exciting and amazing and wonderful and fantastic] transcript of my greatness
===========================================================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const footnote =
      new Footnote([
        new PlainText('exciting and amazing and wonderful and fantastic')
      ], { referenceNumber: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the full"),
        footnote,
        new PlainText(" transcript of my greatness")
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('fantastic transcript', greatnessHeading),
          new PlainText('.')
        ]),
        sodaHeading,
        new Paragraph([
          new PlainText('Actually, I only drink milk.')
        ]),
        greatnessHeading,
        new FootnoteBlock([footnote]),
        new Paragraph([
          new PlainText("Well, maybe I'm not so great.")
        ])
      ], new UpDocument.TableOfContents([sodaHeading, greatnessHeading])))
  })

  specify('Inline NSFL conventions', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the [NSFL: full transcript of my greatness]
============================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new InlineNsfl([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Inline NSFW conventions', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the [NSFW: full transcript of my greatness]
============================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new InlineNsfw([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Inline spoilers', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the [SPOILER: full transcript of my greatness]
===============================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new InlineSpoiler([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Italics', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the _full transcript of my greatness_
======================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new Italic([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Links', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the [full transcript of my greatness] (example.com/transcript)
===============================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new Link([
          new PlainText("full transcript of my greatness")
        ], 'https://example.com/transcript')
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Normal parentheticals', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: full (and exciting and amazing and]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the full (and exciting and amazing and wonderful and fantastic) transcript of my greatness
===========================================================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the full "),
        new NormalParenthetical([
          new PlainText("(and exciting and amazing and wonderful and fantastic)")
        ]),
        new PlainText(" transcript of my greatness")
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('full (and exciting and amazing and', greatnessHeading),
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

  specify('Revision deletion', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the ~~full transcript of my greatness~~
========================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new RevisionDeletion([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Revision insertion', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the ++full transcript of my greatness++
========================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new RevisionInsertion([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Square parentheticals', () => {
    const markup = `
I'm a great guy. For more information, skip to (section: full [and exciting and amazing and). 

I drink soda
============

Actually, I only drink milk.

I am great. Read the full [and exciting and amazing and wonderful and fantastic] transcript of my greatness
===========================================================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the full "),
        new SquareParenthetical([
          new PlainText("[and exciting and amazing and wonderful and fantastic]")
        ]),
        new PlainText(" transcript of my greatness")
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('full [and exciting and amazing and', greatnessHeading),
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

  specify('Stress', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the **full transcript of my greatness**
========================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Read the "),
        new Stress([new PlainText("full transcript of my greatness")])
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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

  specify('Video', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Watch the [video: full transcript of my greatness] (example.com/transcript)
=======================================================================================

Well, maybe I'm not so great.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const greatnessHeading =
      new Heading([
        new PlainText("I am great. Watch the "),
        new Video('full transcript of my greatness', 'https://example.com/transcript')
      ], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('the full transcript', greatnessHeading),
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
