import { expect } from 'chai'
import * as Up from '../../../Main'


context('Section links can appear within any outline convention that contains inline conventions:', () => {
  specify('Blockquotes', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

> First of all, see [section: soda].
>
> Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        searchableMarkup: "I drink soda",
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
          new Up.Text('Not quite true.')
        ]),
        new Up.Blockquote([
          new Up.Paragraph([
            new Up.Text('First of all, see '),
            new Up.SectionLink('soda', sodaHeading),
            new Up.Text('.')
          ]),
          new Up.Paragraph([
            new Up.Text("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
          ])
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })


  context('Description lists. Specifically, their:', () => {
    specify('Subjects', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Main reason (see [section: soda])
  People sometimes misinterpret my truth as a lie.

Minor reason
  I've been alive for hundreds of years. I'm bound to have lied at some point.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Main reason '),
                new Up.NormalParenthetical([
                  new Up.Text('(see '),
                  new Up.SectionLink('soda', sodaHeading),
                  new Up.Text(')')
                ])
              ])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('People sometimes misinterpret my truth as a lie.'),
              ])
            ])),
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Minor reason')
              ])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text("I've been alive for hundreds of years. I'm bound to have lied at some point.")
              ])
            ]))
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Descriptions', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Main reason
  See [section: soda].

Minor reason
  I've been alive for hundreds of years. I'm bound to have lied at some point.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.DescriptionList([
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Main reason')
              ])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text('See '),
                new Up.SectionLink('soda', sodaHeading),
                new Up.Text('.')
              ])
            ])),
            new Up.DescriptionList.Item([
              new Up.DescriptionList.Item.Subject([
                new Up.Text('Minor reason')
              ])
            ], new Up.DescriptionList.Item.Description([
              new Up.Paragraph([
                new Up.Text("I've been alive for hundreds of years. I'm bound to have lied at some point.")
              ])
            ]))
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })


  specify('Line blocks', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Roses are red
Violets are blue
See [section: soda]
I've been alive for hundreds of years. I'm bound to have lied at some point`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        searchableMarkup: "I drink soda",
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
          new Up.Text('Not quite true.')
        ]),
        new Up.LineBlock([
          new Up.LineBlock.Line([
            new Up.Text('Roses are red'),
          ]),
          new Up.LineBlock.Line([
            new Up.Text('Violets are blue'),
          ]),
          new Up.LineBlock.Line([
            new Up.Text('See '),
            new Up.SectionLink('soda', sodaHeading)
          ]),
          new Up.LineBlock.Line([
            new Up.Text("I've been alive for hundreds of years. I'm bound to have lied at some point"),
          ])
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify("Ordered lists", () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

#) First of all, see [section: soda].
#) Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        searchableMarkup: "I drink soda",
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
          new Up.Text('Not quite true.')
        ]),
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('First of all, see '),
              new Up.SectionLink('soda', sodaHeading),
              new Up.Text('.')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
            ])
          ])
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Revealable blocks', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

SPOILER:
  First of all, see [section: soda].

  Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        searchableMarkup: "I drink soda",
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
          new Up.Text('Not quite true.')
        ]),
        new Up.RevealableBlock([
          new Up.Paragraph([
            new Up.Text('First of all, see '),
            new Up.SectionLink('soda', sodaHeading),
            new Up.Text('.')
          ]),
          new Up.Paragraph([
            new Up.Text("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
          ])
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })


  context('Tables. Specifically, their:', () => {
    specify('Captions', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Table: Reasons I lie (see [section: soda])

Reason;           Validity
I get hungry;     Very valid`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Reason')]),
              new Up.Table.Header.Cell([new Up.Text('Validity')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('I get hungry')]),
                new Up.Table.Row.Cell([new Up.Text('Very valid')])
              ])
            ], new Up.Table.Caption([
              new Up.Text('Reasons I lie '),
              new Up.NormalParenthetical([
                new Up.Text('(see '),
                new Up.SectionLink('soda', sodaHeading),
                new Up.Text(')')
              ])
            ]))
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Header cells', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Table: Reasons I lie

Reason (see [section: soda]);     Validity
I get hungry;                     Very valid`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([
                new Up.Text('Reason '),
                new Up.NormalParenthetical([
                  new Up.Text('(see '),
                  new Up.SectionLink('soda', sodaHeading),
                  new Up.Text(')')
                ])
              ]),
              new Up.Table.Header.Cell([new Up.Text('Validity')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('I get hungry')]),
                new Up.Table.Row.Cell([new Up.Text('Very valid')])
              ])
            ], new Up.Table.Caption([
              new Up.Text('Reasons I lie')
            ]))
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Row cells', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Table: Reasons I lie

Reason;                                 Validity
I get hungry (see [section: soda]);     Very valid`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([
                new Up.Text('Reason')
              ]),
              new Up.Table.Header.Cell([new Up.Text('Validity')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([
                  new Up.Text('I get hungry '),
                  new Up.NormalParenthetical([
                    new Up.Text('(see '),
                    new Up.SectionLink('soda', sodaHeading),
                    new Up.Text(')')
                  ])
                ]),
                new Up.Table.Row.Cell([new Up.Text('Very valid')])
              ])
            ], new Up.Table.Caption([
              new Up.Text('Reasons I lie')
            ]))
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Header column cells', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Table: Reasons I lie

                                          Validity

I don't want to get in trouble;           Moderately valid
I get hungry (see [section: soda]);       Very valid`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
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
            new Up.Text('Not quite true.')
          ]),
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Validity')])
            ]), [

              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Moderately valid')])
              ], new Up.Table.Header.Cell([
                new Up.Text("I don't want to get in trouble"),
              ])),

              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Very valid')])
              ], new Up.Table.Header.Cell([
                new Up.Text("I get hungry "),
                new Up.NormalParenthetical([
                  new Up.Text('(see '),
                  new Up.SectionLink('soda', sodaHeading),
                  new Up.Text(')')
                ])
              ]))

            ], new Up.Table.Caption([
              new Up.Text('Reasons I lie')
            ]))
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })
  })


  specify("Unordered lists", () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

* First of all, see [section: soda].
* Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

    const sodaHeading =
      new Up.Heading([new Up.Text('I drink soda')], {
        level: 1,
        searchableMarkup: "I drink soda",
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
          new Up.Text('Not quite true.')
        ]),
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text('First of all, see '),
              new Up.SectionLink('soda', sodaHeading),
              new Up.Text('.')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Text("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
            ])
          ])
        ])
      ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
  })


  context('Headings:', () => {
    specify('When a previous heading contains the snippet', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie. See [topic: soda]
==============================

Not quite true.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([
          new Up.Text('I never lie. See '),
          new Up.SectionLink('soda', sodaHeading),
        ], {
            level: 1,
            searchableMarkup: "I never lie. See [topic: soda]",
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
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('When a subsquent heading contains the snippet (and a previous one does not)', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie. See [topic: lies]
==============================

Not quite true.

My lies
=======

I never drink soda.`

      const drinkSodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const liesHeading =
        new Up.Heading([new Up.Text('My lies')], {
          level: 1,
          searchableMarkup: "My lies",
          ordinalInTableOfContents: 3
        })

      const neverLieHeading =
        new Up.Heading([
          new Up.Text('I never lie. See '),
          new Up.SectionLink('lies', liesHeading)
        ], {
            level: 1,
            searchableMarkup: "I never lie. See [topic: lies]",
            ordinalInTableOfContents: 2
          })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          drinkSodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true.')
          ]),
          liesHeading,
          new Up.Paragraph([
            new Up.Text('I never drink soda.')
          ])
        ], new Up.Document.TableOfContents([drinkSodaHeading, neverLieHeading, liesHeading])))
    })

    specify('When a subsquent heading perfectly matches the snippet', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie. See [topic: soda]
==============================

Not quite true.

Soda
====

My least favorite drink.`

      const drinkSodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })


      const sodaHeading =
        new Up.Heading([new Up.Text('Soda')], {
          level: 1,
          searchableMarkup: "I never lie. See [topic: soda]",
          ordinalInTableOfContents: 3
        })

      const neverLieHeading =
        new Up.Heading([
          new Up.Text('I never lie. See '),
          new Up.SectionLink('soda', sodaHeading)
        ], {
            level: 1,
            searchableMarkup: "",
            ordinalInTableOfContents: 2
          })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          drinkSodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          neverLieHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true.')
          ]),
          sodaHeading,
          new Up.Paragraph([
            new Up.Text('My least favorite drink.')
          ])
        ], new Up.Document.TableOfContents([drinkSodaHeading, neverLieHeading, sodaHeading])))
    })

    specify('When no other heading matches the snippet', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie. See [topic: lies]
==============================

Not quite true.`

      const sodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const neverLieHeading =
        new Up.Heading([
          new Up.Text('I never lie. See '),
          new Up.SectionLink('lies')
        ], {
            level: 1,
            searchableMarkup: "I never lie. See [topic: lies]",
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
          ])
        ], new Up.Document.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('When a subsquent heading perfectly matches the snippet, but the snippet is the only convention in its own heading', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

[topic: My lies]
==============================

Not quite true.

My lies
=======

I never drink soda.`

      const drinkSodaHeading =
        new Up.Heading([new Up.Text('I drink soda')], {
          level: 1,
          searchableMarkup: "I drink soda",
          ordinalInTableOfContents: 1
        })

      const headingContainingSectionLink =
        new Up.Heading([new Up.Text('My lies')], {
          level: 1,
          searchableMarkup: "My lies",
          ordinalInTableOfContents: 3
        })

      const myLiesHeading =
        new Up.Heading([
          new Up.SectionLink('My lies', headingContainingSectionLink)
        ], {
            level: 1,
            searchableMarkup: "[topic: My lies]",
            ordinalInTableOfContents: 2
          })

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          drinkSodaHeading,
          new Up.Paragraph([
            new Up.Text('Actually, I only drink milk.')
          ]),
          myLiesHeading,
          new Up.Paragraph([
            new Up.Text('Not quite true.')
          ]),
          headingContainingSectionLink,
          new Up.Paragraph([
            new Up.Text('I never drink soda.')
          ])
        ], new Up.Document.TableOfContents([drinkSodaHeading, myLiesHeading, headingContainingSectionLink])))
    })
  })
})
