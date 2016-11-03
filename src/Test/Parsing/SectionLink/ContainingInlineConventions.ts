import { expect } from 'chai'
import * as Up from '../../../Main'


context("The markup snippet of a section link isn't evaluated for writing conventions. It's simply matched against the original markup of each heading's content.", () => {
  describe('Naturally, typographical writing conventions are not evaluated:', () => {
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
            new Up.SectionLink('I drink soda--exclusively', sodaHeading),
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
            new Up.SectionLink('I drink soda---exclusively', sodaHeading),
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
            new Up.SectionLink('I drink 9 cans of soda +-2', sodaHeading),
            new Up.Text('.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Ellipses', () => {
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
            new Up.SectionLink('I drink 9 cans of soda... hourly', sodaHeading),
            new Up.Text('.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })


  context('When a heading contains an inline writing convention, the markup snippet can contain:', () => {
    specify('The entire writing convention', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: I *never* lie]. 

I drink soda
============

Actually, I only drink milk.

I *never* lie
===========

Not quite true.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([
          new Up.Text('I '),
          new Up.Emphasis([new Up.Text('never')]),
          new Up.Text(' lie'),
        ], {
            level: 1,
            searchableMarkup: "I *never* lie",
            ordinalInTableOfContents: 2
          })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('I *never* lie', neverLieHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('A fragment of the writing convention', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: *never]. 

I drink soda
============

Actually, I only drink milk.

I *never* lie
===========

Not quite true.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([
          new Up.Text('I '),
          new Up.Emphasis([new Up.Text('never')]),
          new Up.Text(' lie'),
        ], {
            level: 1,
            searchableMarkup: "I *never* lie",
            ordinalInTableOfContents: 2
          })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('*never', neverLieHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })
})


describe('A section link', () => {
  it('can match with a heading containing another section link', () => {
    const markup = `
I'm a great guy. For more information, skip to [section: full transcript]. 

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
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        searchableMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const transcriptHeading =
      new Up.Heading([new Up.Text('Full transcript of my greatness')], {
        level: 2,
        searchableMarkup: "Full transcript of my greatness",
        ordinalInTableOfContents: 3
      })

    const greatnessHeading =
      new Up.Heading([
        new Up.Text("I am great. Read the "),
        new Up.SectionLink("full transcript of my greatness", transcriptHeading)
      ], {
          level: 1,
          searchableMarkup: "I am great. Read the [topic: full transcript of my greatness]",
          ordinalInTableOfContents: 2
        })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a great guy. For more information, skip to "),
          new Up.SectionLink('full transcript', greatnessHeading),
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

})