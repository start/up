import { expect } from 'chai'
import * as Up from '../../../index'


context("A section link's snippet ignores inline conventions. It only cares about matching literal text.", () => {
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
      new Up.Heading([new Up.Text('Stress and emphasis are commonly used in writing')], { level: 1, ordinalInTableOfContents: 1 })

    const emphasisSubHeading =
      new Up.Heading([
        new Up.Emphasis([new Up.Text('Emphasis')]),
      ], { level: 2, ordinalInTableOfContents: 2 })

    const stayOnTopicHeading =
      new Up.Heading([new Up.Text('I always stay on topic')], { level: 1, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        stressAndEmphasisHeading,
        new Up.Paragraph([
          new Up.Text('Luckily for us, Up supports that!')
        ]),
        emphasisSubHeading,
        new Up.Paragraph([
          new Up.Text('I love apples.')
        ]),
        stayOnTopicHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('emphasis', emphasisSubHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([stressAndEmphasisHeading, emphasisSubHeading, stayOnTopicHeading])))
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
      new Up.Heading([new Up.Text('Emphasis is commonly used in writing')], { level: 1, ordinalInTableOfContents: 1 })

    const emphasisSubHeading =
      new Up.Heading([
        new Up.InlineCode('*Emphasis*'),
        new Up.Text(' in Up explained')
      ], { level: 2, ordinalInTableOfContents: 2 })

    const stayOnTopicHeading =
      new Up.Heading([new Up.Text('I always stay on topic')], { level: 1, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        mainEmphasisHeading,
        new Up.Paragraph([
          new Up.Text('Luckily for us, Up supports that!')
        ]),
        emphasisSubHeading,
        new Up.Paragraph([
          new Up.Text('I love apples.')
        ]),
        stayOnTopicHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('*emphasis*', emphasisSubHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([mainEmphasisHeading, emphasisSubHeading, stayOnTopicHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Listen to the "),
          new Up.Audio('full transcript of my greatness', 'https://example.com/transcript')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.Bold([new Up.Text("full transcript of my greatness")])
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text('Why you must explore the '),
          new Up.ExampleInput('About This Mac'),
          new Up.Text(' menu item')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a helpful guy. For more information, see "),
            new Up.SectionLink('mac menu', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so helpful.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.Highlight([new Up.Text("full transcript of my greatness")])
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. See the "),
          new Up.Image('full transcript of my greatness', 'https://example.com/transcript')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("Why you should love SQL's "),
          new Up.InlineCode("DELETE FROM"),
          new Up.Text(' statement')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a helpful guy. For more information, see "),
            new Up.SectionLink("SQL's delete", greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so helpful.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const footnote =
        new Up.Footnote([
          new Up.Text('exciting and amazing and wonderful and fantastic')
        ], { referenceNumber: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the full"),
          footnote,
          new Up.Text(" transcript of my greatness")
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('fantastic transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.FootnoteBlock([footnote]),
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.InlineRevealable([new Up.Text("full transcript of my greatness")])
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.Italics([new Up.Text("full transcript of my greatness")])
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.Link([
            new Up.Text("full transcript of my greatness")
          ], 'https://example.com/transcript')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the full "),
          new Up.NormalParenthetical([
            new Up.Text("(and exciting and amazing and wonderful and fantastic)")
          ]),
          new Up.Text(" transcript of my greatness")
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('full (and exciting and amazing and', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
    })

    specify('Another reference to a table of contents entry', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: the full transcript]. 

I drink soda
============

Actually, I only drink milk.

I am great. Read the [topic: full transcript of my greatness]
=============================================================

Well, maybe I'm not so great.

Full transcript of my greatness
=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=

Uhhh...`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const transcriptHeading =
        new Up.Heading([new Up.Text('Full transcript of my greatness')], { level: 2, ordinalInTableOfContents: 3 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.SectionLink("full transcript of my greatness", transcriptHeading)
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ]),
          transcriptHeading,
          new Up.Paragraph([
            new Up.Text('Uhhh…')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading, transcriptHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the full "),
          new Up.SquareParenthetical([
            new Up.Text("[and exciting and amazing and wonderful and fantastic]")
          ]),
          new Up.Text(" transcript of my greatness")
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('full [and exciting and amazing and', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Read the "),
          new Up.Stress([new Up.Text("full transcript of my greatness")])
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

      const greatnessHeading =
        new Up.Heading([
          new Up.Text("I am great. Watch the "),
          new Up.Video('full transcript of my greatness', 'https://example.com/transcript')
        ], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('the full transcript', greatnessHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          greatnessHeading,
          new Up.Paragraph([
            new Up.Text("Well, maybe I'm not so great.")
          ])
        ], new Up.Document.TableOfContents([sodaHeading, greatnessHeading])))
    })
  })
})
