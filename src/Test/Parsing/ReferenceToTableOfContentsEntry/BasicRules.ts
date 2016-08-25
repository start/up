import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'


context('Bracketed text starting with "section:" or "topic:" produces a reference to a table of contents entry. The terms are interchangeable, as are the brackets:', () => {
  const markupUsingSectionTermAndSquareBrackets = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: soda].`

  const documentUsingSquareBracketsAndSectionTerm =
    Up.toDocument(markupUsingSectionTermAndSquareBrackets)

  specify('You can use "section:" with square brackets', () => {
    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    expect(documentUsingSquareBracketsAndSectionTerm).to.deep.equal(
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

  specify('You can use "section:" with parentheses', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see (section: soda).`

    expect(Up.toDocument(markup)).to.deep.equal(documentUsingSquareBracketsAndSectionTerm)
  })

  specify('You can use "topic:" with square brackets', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [topic: soda].`

    expect(Up.toDocument(markup)).to.deep.equal(documentUsingSquareBracketsAndSectionTerm)
  })

  specify('You can use "topic:" with parentheses', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see (topic: soda).`

    expect(Up.toDocument(markup)).to.deep.equal(documentUsingSquareBracketsAndSectionTerm)
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

      expect(Up.toDocument(markup)).to.deep.equal(
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

      expect(Up.toDocument(markup)).to.deep.equal(
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

      expect(Up.toDocument(markup)).to.deep.equal(
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

      expect(Up.toDocument(markup)).to.deep.equal(
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

      expect(Up.toDocument(markup)).to.deep.equal(
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


  context('If there are no perfectly matching entries, the reference will match with the first entry to contain its snippet. That entry can come:', () => {
    specify('Before the reference', () => {
      const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [section: exotic].`

      const sodaHeading =
        new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

      const interestingHeading =
        new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          interestingHeading,
          new Paragraph([
            new PlainText('I love all sorts of fancy stuff. For example, see '),
            new ReferenceToTableOfContentsEntry('exotic', sodaHeading),
            new PlainText('.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
    })

    specify('After the reference', () => {
      const markup = `
I have plenty of good traits. See [section: interesting].

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

      const sodaHeading =
        new Heading([new PlainText('I drink exotic soda')], { level: 1, ordinalInTableOfContents: 1 })

      const interestingHeading =
        new Heading([new PlainText('I am interesting')], { level: 1, ordinalInTableOfContents: 2 })

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new PlainText('I have plenty of good traits. See '),
            new ReferenceToTableOfContentsEntry('interesting', interestingHeading),
            new PlainText('.')
          ]),
          sodaHeading,
          new Paragraph([
            new PlainText('Actually, I only drink milk.')
          ]),
          interestingHeading,
          new Paragraph([
            new PlainText('I love all sorts of fancy stuff.')
          ])
        ], new UpDocument.TableOfContents([sodaHeading, interestingHeading])))
    })
  })
})


context("A reference will match the first applicable entry based on its text content alone.", () => {
  specify("The entries' outline (heading) levels do not matter", () => {
    const markup = `
If I ever say I drink soda, I'm lying
=====================================

I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda].

Anyway...

I drink soda
------------

That's what I tell 'em.

In fact, sometimes, things bear repeating.

I drink soda
============

And you'll believe it.`

    const firstSodaHeading =
      new Heading([new PlainText("If I ever say I drink soda, I'm lying")], { level: 1, ordinalInTableOfContents: 1 })

    const neverLieHeading =
      new Heading([new PlainText('I never lie')], { level: 1, ordinalInTableOfContents: 2 })

    const secondSodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 2, ordinalInTableOfContents: 3 })

    const thirdSodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 4 })

    expect(Up.toDocument(markup)).to.deep.equal(
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
        ]),
        new Paragraph([
          new PlainText('In fact, sometimes, things bear repeating.')
        ]),
        thirdSodaHeading,
        new Paragraph([
          new PlainText("And you'll believe it.")
        ])
      ], new UpDocument.TableOfContents([
        firstSodaHeading,
        neverLieHeading,
        secondSodaHeading,
        thirdSodaHeading
      ])))
  })

  context("The entries' nesting levels do not matter.", () => {
    specify("A reference can match an entry at an outer nesting level", () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

1. First, see [section: soda].
2. Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

      const sodaHeading =
        new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

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
            new PlainText('Not quite true.')
          ]),
          new OrderedList([
            new OrderedList.Item([
              new Paragraph([
                new PlainText('First, see '),
                new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                new PlainText('.')
              ])
            ], { ordinal: 1 }),
            new OrderedList.Item([
              new Paragraph([
                new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
              ])
            ], { ordinal: 2 })
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })

  specify('A reference can match an entry at an inner nesting level', () => {
    const markup = `
There are plenty of important facts about me. For my favorite, skip to [section: honest].

1. I drink soda
   ============

   Actually, I only drink milk.

2. I am honest
   ===========

   Not quite true.`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

    const honestHeading =
      new Heading([new PlainText('I am honest')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('There are plenty of important facts about me. For my favorite, skip to '),
          new ReferenceToTableOfContentsEntry('honest', honestHeading),
          new PlainText('.')
        ]),
        new OrderedList([
          new OrderedList.Item([
            sodaHeading,
            new Paragraph([
              new PlainText('Actually, I only drink milk.')
            ])
          ], { ordinal: 1 }),
          new OrderedList.Item([
            honestHeading,
            new Paragraph([
              new PlainText('Not quite true.')
            ])
          ], { ordinal: 2 })
        ]),
      ], new UpDocument.TableOfContents([sodaHeading, honestHeading])))
  })
})


context("If there are no matching table of contents entries for a given reference", () => {
  specify("the reference simply won't be associated with an entry", () => {
    const markup = `
I'm a great guy. For more information, skip to [section: I became a world leader]. 

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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a great guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('I became a world leader'),
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
})


describe('The term used to create a reference to a table of contents entry ("section" by default)', () => {
  it('is case-insensitive', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [sEcTIoN: I drink soda].`

    const sodaHeading =
      new Heading([new PlainText('I drink soda')], { level: 1, ordinalInTableOfContents: 1 })

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
          new ReferenceToTableOfContentsEntry('I drink soda', sodaHeading),
          new PlainText('.')
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })
})


context('Whitespace within the snippet of a reference to a table of contents entry is significant.', () => {
  specify('If there is a space between words in the entry, there must be a space between those words in the snippet', () => {
    const markup = `
I'm a concerned kind of guy. For more information, skip to [section: prepare]. 

Those who prep are more likely to survive
=========================================

That's what the internet told me.

Please prepare
==============

The zombies could arrive at any moment.`

    const surviveHeading =
      new Heading([new PlainText('Those who prep are more likely to survive')], { level: 1, ordinalInTableOfContents: 1 })

    const prepareHeading =
      new Heading([new PlainText('Please prepare')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a concerned kind of guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('prepare', prepareHeading),
          new PlainText('.')
        ]),
        surviveHeading,
        new Paragraph([
          new PlainText("That's what the internet told me.")
        ]),
        prepareHeading,
        new Paragraph([
          new PlainText('The zombies could arrive at any moment.')
        ])
      ], new UpDocument.TableOfContents([surviveHeading, prepareHeading])))
  })

  specify('If there is a space between words in a snippet, there must be a space between those words in the entry itself', () => {
    const markup = `
I'm a helpful guy. For more information, skip to [section: prep are]. 

Please prepare
==============

The zombies could arrive at any moment.

Those who prep are more likely to survive
=========================================

That's what the internet told me.`

    const prepareHeading =
      new Heading([new PlainText('Please prepare')], { level: 1, ordinalInTableOfContents: 1 })

    const surviveHeading =
      new Heading([new PlainText('Those who prep are more likely to survive')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a helpful guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('prep are', surviveHeading),
          new PlainText('.')
        ]),
        prepareHeading,
        new Paragraph([
          new PlainText('The zombies could arrive at any moment.')
        ]),
        surviveHeading,
        new Paragraph([
          new PlainText("That's what the internet told me.")
        ])
      ], new UpDocument.TableOfContents([prepareHeading, surviveHeading])))
  })

  specify('However, any outer whitespace around the snippet is trimmed away and ignored.', () => {
    const markup = `
I'm a helpful guy. For more information, skip to [section: \t \t drama \t \t ]. 

Please prepare
==============

The zombies could arrive at any moment.

Those who prep are superdramaticallly more likely to survive
============================================================

That's what the internet told me.`

    const prepareHeading =
      new Heading([new PlainText('Please prepare')], { level: 1, ordinalInTableOfContents: 1 })

    const surviveHeading =
      new Heading([new PlainText('Those who prep are superdramaticallly more likely to survive')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I'm a helpful guy. For more information, skip to "),
          new ReferenceToTableOfContentsEntry('drama', surviveHeading),
          new PlainText('.')
        ]),
        prepareHeading,
        new Paragraph([
          new PlainText('The zombies could arrive at any moment.')
        ]),
        surviveHeading,
        new Paragraph([
          new PlainText("That's what the internet told me.")
        ])
      ], new UpDocument.TableOfContents([prepareHeading, surviveHeading])))
  })
})


describe('Capitalization', () => {
  it('is totally ignored when matching a table of contents entry to a reference', () => {
    const markup = `
Stress and emphasis are commonly used in writing
================================================

Luckily for us, Up supports that!


Emphasis
--------

I love apples.


I always stay on topic
======================

Not quite true. For example, see [section: emphasis].`

    const stressAndEmphasisHeading =
      new Heading([new PlainText('Stress and emphasis are commonly used in writing')], { level: 1, ordinalInTableOfContents: 1 })

    const emphasisSubHeading =
      new Heading([new PlainText('Emphasis')], { level: 2, ordinalInTableOfContents: 2 })

    const stayOnTopicHeading =
      new Heading([new PlainText('I always stay on topic')], { level: 1, ordinalInTableOfContents: 3 })

    expect(Up.toDocument(markup)).to.deep.equal(
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
})


context('The snippet belonging to a table of contents entry reference can contain the same type of brackets used to to enclose the reference itself.', () => {
  context('When the reference is enclosed by square brackets:', () => {
    specify('The snippet can contain matching square brackets', () => {
      expect(Up.toDocument('[section: I [really] love apples]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I [really] love apples')
          ])
        ]))
    })

    specify('The snippet can contain matching nested square brackets', () => {
      expect(Up.toDocument('[section: I [really [truly [honestly]]] love apples]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I [really [truly [honestly]]] love apples')
          ])
        ]))
    })

    specify('The snippet can contain an escaped unmatched closing square bracket', () => {
      expect(Up.toDocument('[section: I love :\\] apples]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I love :] apples')
          ])
        ]))
    })

    specify('The snippet can contain an escaped unmatched opening square bracket', () => {
      expect(Up.toDocument('[section: I miss :\\[ apples]')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I miss :[ apples')
          ])
        ]))
    })
  })


  context('When the reference is enclosed by parentheses:', () => {
    specify('The snippet can contain matching parentheses', () => {
      expect(Up.toDocument('(section: I (really) love apples)')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I (really) love apples')
          ])
        ]))
    })

    specify('The snippet can contain matching nested parentheses', () => {
      expect(Up.toDocument('(section: I (really (truly (honestly))) love apples)')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I (really (truly (honestly))) love apples')
          ])
        ]))
    })

    specify('The snippet can contain an escaped unmatched closing parenthesis', () => {
      expect(Up.toDocument('(section: I love :\\) apples)')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I love :) apples')
          ])
        ]))
    })

    specify('The snippet can contain an escaped unmatched opening parenthesis', () => {
      expect(Up.toDocument('(section: I miss :\\( apples)')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new ReferenceToTableOfContentsEntry('I miss :( apples')
          ])
        ]))
    })
  })
})
