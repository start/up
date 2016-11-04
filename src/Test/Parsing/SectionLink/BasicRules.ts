import { expect } from 'chai'
import * as Up from '../../../Main'


context('Bracketed markup starting with "section:" or "topic:" produces a section link. The terms are interchangeable, as are the brackets:', () => {
  const markupUsingSectionTermAndSquareBrackets = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: soda].`

  const documentUsingSquareBracketsAndSectionTerm =
    Up.parse(markupUsingSectionTermAndSquareBrackets)

  specify('You can use "section:" with square brackets', () => {
    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    expect(documentUsingSquareBracketsAndSectionTerm).to.deep.equal(
      new Up.Document([
        sodaHeading,
        new Up.Paragraph([
          new Up.Text('Actually, I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('soda', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('You can use "section:" with parentheses', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see (section: soda).`

    expect(Up.parse(markup)).to.deep.equal(documentUsingSquareBracketsAndSectionTerm)
  })

  specify('You can use "topic:" with square brackets', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [topic: soda].`

    expect(Up.parse(markup)).to.deep.equal(documentUsingSquareBracketsAndSectionTerm)
  })

  specify('You can use "topic:" with parentheses', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see (topic: soda).`

    expect(Up.parse(markup)).to.deep.equal(documentUsingSquareBracketsAndSectionTerm)
  })
})


context('A section link will try to match the first entry whose searchable markup exactly matches its markup snippet.', () => {
  context('The exact match can come:', () => {
    specify('Before the section link', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [section: I drink soda].`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([new Up.Text('I never lie')], {
          level: 1,
          titleMarkup: "I never lie",
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
            new Up.SectionLink('I drink soda', sodaHeading),
            new Up.Text('.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('After the section link', () => {
      const markup = `
I'm a great guy. For more information, skip to [section: I never lie]. 

I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([new Up.Text('I never lie')], {
          level: 1,
          titleMarkup: "I never lie",
          ordinalInTableOfContents: 2
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm a great guy. For more information, skip to "),
            new Up.SectionLink('I never lie', neverLieHeading),
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
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([new Up.Text('I never lie')], {
          level: 1,
          titleMarkup: "I never lie",
          ordinalInTableOfContents: 2
        })

      const secondSodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 3
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          firstSodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true. For example, see '),
            new Up.SectionLink('I drink soda', firstSodaHeading),
            new Up.Text('.')
          ]),
          new Up.Paragraph([
            new Up.Text('Anyway…')
          ]),
          secondSodaHeading,
          new Up.Paragraph([
            new Up.Text("That's what I tell 'em.")
          ])
        ], new Up.Document.TableOfContents([firstSodaHeading, neverLieHeading, secondSodaHeading])))
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
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([new Up.Text('I never lie')], {
          level: 1,
          titleMarkup: "I never lie",
          ordinalInTableOfContents: 2
        })

      const secondSodaHeading =
        new Up.Heading([new Up.Text('I lied when I said I drink soda')], {
          level: 1,
          titleMarkup: "I lied when I said I drink soda",
          ordinalInTableOfContents: 3
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          firstSodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true. For example, see '),
            new Up.SectionLink('I drink soda', firstSodaHeading),
            new Up.Text('.')
          ]),
          new Up.Paragraph([
            new Up.Text('Anyway…')
          ]),
          secondSodaHeading,
          new Up.Paragraph([
            new Up.Text("Oops.")
          ])
        ], new Up.Document.TableOfContents([firstSodaHeading, neverLieHeading, secondSodaHeading])))
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
        new Up.Heading([new Up.Text("If I ever say I drink soda, I'm lying")], {
          level: 1,
          titleMarkup: "If I ever say I drink soda, I'm lying",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([new Up.Text('I never lie')], {
          level: 1,
          titleMarkup: "I never lie",
          ordinalInTableOfContents: 2
        })

      const secondSodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 3
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          firstSodaHeading,
          new Up.Paragraph([
            new Up.Text('I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true. For example, see '),
            new Up.SectionLink('I drink soda', secondSodaHeading),
            new Up.Text('.')
          ]),
          new Up.Paragraph([
            new Up.Text('Anyway…')
          ]),
          secondSodaHeading,
          new Up.Paragraph([
            new Up.Text("That's what I tell 'em.")
          ])
        ], new Up.Document.TableOfContents([firstSodaHeading, neverLieHeading, secondSodaHeading])))
    })
  })


  context('If there are no perfectly matching entries, the section link will match with the first entry to contain its snippet. That entry can come:', () => {
    specify('Before the section link', () => {
      const markup = `
I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff. For example, see [section: exotic].`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink exotic soda')], {
          level: 1,
          titleMarkup: "I drink exotic soda",
          ordinalInTableOfContents: 1
        })

      const interestingHeading =
        new Up.Heading([new Up.Text('I am interesting')], {
          level: 1,
          titleMarkup: "I am interesting",
          ordinalInTableOfContents: 2
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          interestingHeading,
          new Up.Paragraph([
            new Up.Text('I love all sorts of fancy stuff. For example, see '),
            new Up.SectionLink('exotic', sodaHeading),
            new Up.Text('.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
    })

    specify('After the section link', () => {
      const markup = `
I have plenty of good traits. See [section: interesting].

I drink exotic soda
=====================

Actually, I only drink milk.

I am interesting
================

I love all sorts of fancy stuff.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink exotic soda')], {
          level: 1,
          titleMarkup: "I drink exotic soda",
          ordinalInTableOfContents: 1
        })

      const interestingHeading =
        new Up.Heading([new Up.Text('I am interesting')], {
          level: 1,
          titleMarkup: "I am interesting",
          ordinalInTableOfContents: 2
        })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text('I have plenty of good traits. See '),
            new Up.SectionLink('interesting', interestingHeading),
            new Up.Text('.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          interestingHeading,
          new Up.Paragraph([
            new Up.Text('I love all sorts of fancy stuff.')
          ])
        ], new Up.Document.TableOfContents([sodaHeading, interestingHeading])))
    })
  })
})


context("A section link will match the first applicable entry based on its searchable markup alone.", () => {
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
      new Up.Heading([new Up.Text("If I ever say I drink soda, I'm lying")], {
        level: 1,
        titleMarkup: "If I ever say I drink soda, I'm lying",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    const secondSodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 2,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 3
      })

    const thirdSodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 4
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        firstSodaHeading,
        new Up.Paragraph([
          new Up.Text('I only drink milk.')
        ]),
        neverLieHeading,
        new Up.Paragraph([
          new Up.Text('Not quite true. For example, see '),
          new Up.SectionLink('I drink soda', secondSodaHeading),
          new Up.Text('.')
        ]),
        new Up.Paragraph([
          new Up.Text('Anyway…')
        ]),
        secondSodaHeading,
        new Up.Paragraph([
          new Up.Text("That's what I tell 'em.")
        ]),
        new Up.Paragraph([
          new Up.Text('In fact, sometimes, things bear repeating.')
        ]),
        thirdSodaHeading,
        new Up.Paragraph([
          new Up.Text("And you'll believe it.")
        ])
      ], new Up.Document.TableOfContents([
        firstSodaHeading,
        neverLieHeading,
        secondSodaHeading,
        thirdSodaHeading
      ])))
  })

  specify('The heading can have an overline', () => {
    const markup = `
============
I drink soda
============

Actually, I only drink milk.

===========
I never lie
===========

Not quite true. For example, see [section: I drink soda].`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
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
          new Up.SectionLink('I drink soda', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })


  context("The entries' nesting levels do not matter.", () => {
    specify("A section link can match an entry at an outer nesting level", () => {
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
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          titleMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([new Up.Text('I never lie')], {
          level: 1,
          titleMarkup: "I never lie",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.OrderedList([
            new Up.OrderedList.Item([
              new Up.Paragraph([
                new Up.Text('First, see '),
                new Up.SectionLink('soda', sodaHeading),
                new Up.Text('.')
              ])
            ], { ordinal: 1 }),
            new Up.OrderedList.Item([
              new Up.Paragraph([
                new Up.Text("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
              ])
            ], { ordinal: 2 })
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })

  specify('A section link can match an entry at an inner nesting level', () => {
    const markup = `
There are plenty of important facts about me. For my favorite, skip to [section: honest].

1. I drink soda
   ============

   Actually, I only drink milk.

2. I am honest
   ===========

   Not quite true.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const honestHeading =
      new Up.Heading([new Up.Text('I am honest')], {
        level: 1,
        titleMarkup: "I am honest",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('There are plenty of important facts about me. For my favorite, skip to '),
          new Up.SectionLink('honest', honestHeading),
          new Up.Text('.')
        ]),
        new Up.OrderedList([
          new Up.OrderedList.Item([
            sodaHeading,
            new Up.Paragraph([
              new Up.Text('Actually, I only drink milk.')
            ])
          ], { ordinal: 1 }),
          new Up.OrderedList.Item([
            honestHeading,
            new Up.Paragraph([
              new Up.Text('Not quite true.')
            ])
          ], { ordinal: 2 })
        ]),
      ], new Up.Document.TableOfContents([sodaHeading, honestHeading])))
  })
})


context("If there are no matching table of contents entries for a given section link", () => {
  specify("the section link simply won't be associated with an entry", () => {
    const markup = `
I'm a great guy. For more information, skip to [section: I became a world leader]. 

I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a great guy. For more information, skip to "),
          new Up.SectionLink('I became a world leader'),
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


describe('The keyword used to create a section link ("section" by default)', () => {
  it('is case-insensitive', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [sEcTIoN: I drink soda].`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
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
          new Up.SectionLink('I drink soda', sodaHeading),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})


context('Whitespace within the snippet of a section link is significant.', () => {
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
      new Up.Heading([new Up.Text('Those who prep are more likely to survive')], {
        level: 1,
        titleMarkup: "Those who prep are more likely to survive",
        ordinalInTableOfContents: 1
      })

    const prepareHeading =
      new Up.Heading([new Up.Text('Please prepare')], {
        level: 1,
        titleMarkup: "Please prepare",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a concerned kind of guy. For more information, skip to "),
          new Up.SectionLink('prepare', prepareHeading),
          new Up.Text('.')
        ]),
        surviveHeading,
        new Up.Paragraph([
          new Up.Text("That's what the internet told me.")
        ]),
        prepareHeading,
        new Up.Paragraph([
          new Up.Text('The zombies could arrive at any moment.')
        ])
      ], new Up.Document.TableOfContents([surviveHeading, prepareHeading])))
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
      new Up.Heading([new Up.Text('Please prepare')], {
        level: 1,
        titleMarkup: "Please prepare",
        ordinalInTableOfContents: 1
      })

    const surviveHeading =
      new Up.Heading([new Up.Text('Those who prep are more likely to survive')], {
        level: 1,
        titleMarkup: "Those who prep are more likely to survive",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a helpful guy. For more information, skip to "),
          new Up.SectionLink('prep are', surviveHeading),
          new Up.Text('.')
        ]),
        prepareHeading,
        new Up.Paragraph([
          new Up.Text('The zombies could arrive at any moment.')
        ]),
        surviveHeading,
        new Up.Paragraph([
          new Up.Text("That's what the internet told me.")
        ])
      ], new Up.Document.TableOfContents([prepareHeading, surviveHeading])))
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
      new Up.Heading([new Up.Text('Please prepare')], {
        level: 1,
        titleMarkup: "Please prepare",
        ordinalInTableOfContents: 1
      })

    const surviveHeading =
      new Up.Heading([new Up.Text('Those who prep are superdramaticallly more likely to survive')], {
        level: 1,
        titleMarkup: "Those who prep are superdramaticallly more likely to survive",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a helpful guy. For more information, skip to "),
          new Up.SectionLink('drama', surviveHeading),
          new Up.Text('.')
        ]),
        prepareHeading,
        new Up.Paragraph([
          new Up.Text('The zombies could arrive at any moment.')
        ]),
        surviveHeading,
        new Up.Paragraph([
          new Up.Text("That's what the internet told me.")
        ])
      ], new Up.Document.TableOfContents([prepareHeading, surviveHeading])))
  })

  specify("However, any outer whitespace around the heading's content itself is trimmed away and ignored.", () => {
    const markup = `
I'm a helpful guy. For more information, skip to [section: drama]. 

Please prepare
==============

The zombies could arrive at any moment.

 Those who prep are superdramaticallly more likely to survive\t \t \t \t  
============================================================

That's what the internet told me.`

    const prepareHeading =
      new Up.Heading([new Up.Text('Please prepare')], {
        level: 1,
        titleMarkup: "Please prepare",
        ordinalInTableOfContents: 1
      })

    const surviveHeading =
      new Up.Heading([new Up.Text('Those who prep are superdramaticallly more likely to survive')], {
        level: 1,
        titleMarkup: "Those who prep are superdramaticallly more likely to survive",
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I'm a helpful guy. For more information, skip to "),
          new Up.SectionLink('drama', surviveHeading),
          new Up.Text('.')
        ]),
        prepareHeading,
        new Up.Paragraph([
          new Up.Text('The zombies could arrive at any moment.')
        ]),
        surviveHeading,
        new Up.Paragraph([
          new Up.Text("That's what the internet told me.")
        ])
      ], new Up.Document.TableOfContents([prepareHeading, surviveHeading])))
  })
})


describe('Capitalization', () => {
  it('is totally ignored', () => {
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
      new Up.Heading([new Up.Text('Stress and emphasis are commonly used in writing')], {
        level: 1,
        titleMarkup: "Stress and emphasis are commonly used in writing",
        ordinalInTableOfContents: 1
      })

    const emphasisSubHeading =
      new Up.Heading([new Up.Text('Emphasis')], {
        level: 2,
        titleMarkup: "Emphasis",
        ordinalInTableOfContents: 2
      })

    const stayOnTopicHeading =
      new Up.Heading([new Up.Text('I always stay on topic')], {
        level: 1,
        titleMarkup: "I always stay on topic",
        ordinalInTableOfContents: 3
      })

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
})


context('The snippet belonging to a section link can contain the same type of brackets used to to enclose the section link itself.', () => {
  context('When the section link is enclosed by square brackets, its markup snippet can contain:', () => {
    specify('Matching square brackets', () => {
      expect(Up.parse('[section: I [really] love apples]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I [really] love apples')
          ])
        ]))
    })

    specify('Matching nested square brackets', () => {
      expect(Up.parse('[section: I [really [truly [honestly]]] love apples]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I [really [truly [honestly]]] love apples')
          ])
        ]))
    })

    specify('An escaped unmatched closing square bracket', () => {
      expect(Up.parse('[section: I love :\\] apples]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I love :] apples')
          ])
        ]))
    })

    specify('An escaped unmatched opening square bracket', () => {
      expect(Up.parse('[section: I miss :\\[ apples]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I miss :[ apples')
          ])
        ]))
    })
  })


  context('When the section link is enclosed by parentheses, its markup snippet can contain:', () => {
    specify('Matching parentheses', () => {
      expect(Up.parse('(section: I (really) love apples)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I (really) love apples')
          ])
        ]))
    })

    specify('Matching nested parentheses', () => {
      expect(Up.parse('(section: I (really (truly (honestly))) love apples)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I (really (truly (honestly))) love apples')
          ])
        ]))
    })

    specify('An escaped unmatched closing parenthesis', () => {
      expect(Up.parse('(section: I love :\\) apples)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I love :) apples')
          ])
        ]))
    })

    specify('An escaped unmatched opening parenthesis', () => {
      expect(Up.parse('(section: I miss :\\( apples)')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.SectionLink('I miss :( apples')
          ])
        ]))
    })
  })
})


context('An empty or blank section link will not be matched with a table of contents entry', () => {
  specify('Empty', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [topic:  \t  \t  ].`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
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
          new Up.SectionLink(''),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Blank', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true. For example, see [topic:].`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        titleMarkup: "I drink soda",
        ordinalInTableOfContents: 1
      })

    const neverLieHeading =
      new Up.Heading([new Up.Text('I never lie')], {
        level: 1,
        titleMarkup: "I never lie",
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
          new Up.SectionLink(''),
          new Up.Text('.')
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
