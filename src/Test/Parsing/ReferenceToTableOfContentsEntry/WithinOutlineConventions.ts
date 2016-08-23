import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'
import { DescriptionList } from '../../../SyntaxNodes/DescriptionList'
import { Heading } from '../../../SyntaxNodes/Heading'
import { LineBlock } from '../../../SyntaxNodes/LineBlock'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { NsflBlock } from '../../../SyntaxNodes/NsflBlock'
import { NsfwBlock } from '../../../SyntaxNodes/NsfwBlock'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { SpoilerBlock } from '../../../SyntaxNodes/SpoilerBlock'
import { Table } from '../../../SyntaxNodes/Table'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'


context('References to table of contents entries can appear within any outline convention that contains inline conventions:', () => {
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
          new PlainText('Not quite true.')
        ]),
        new Blockquote([
          new Paragraph([
            new PlainText('First of all, see '),
            new ReferenceToTableOfContentsEntry('soda', sodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
            new PlainText('Not quite true.')
          ]),
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Main reason '),
                new NormalParenthetical([
                  new PlainText('(see '),
                  new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                  new PlainText(')')
                ])
              ])
            ], new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('People sometimes misinterpret my truth as a lie.'),
              ])
            ])),
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Minor reason')
              ])
            ], new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText("I've been alive for hundreds of years. I'm bound to have lied at some point.")
              ])
            ]))
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
            new PlainText('Not quite true.')
          ]),
          new DescriptionList([
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Main reason')
              ])
            ], new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText('See '),
                new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                new PlainText('.')
              ])
            ])),
            new DescriptionList.Item([
              new DescriptionList.Item.Subject([
                new PlainText('Minor reason')
              ])
            ], new DescriptionList.Item.Description([
              new Paragraph([
                new PlainText("I've been alive for hundreds of years. I'm bound to have lied at some point.")
              ])
            ]))
          ])
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
          new PlainText('Not quite true.')
        ]),
        new LineBlock([
          new LineBlock.Line([
            new PlainText('Roses are red'),
          ]),
          new LineBlock.Line([
            new PlainText('Violets are blue'),
          ]),
          new LineBlock.Line([
            new PlainText('See '),
            new ReferenceToTableOfContentsEntry('soda', sodaHeading)
          ]),
          new LineBlock.Line([
            new PlainText("I've been alive for hundreds of years. I'm bound to have lied at some point"),
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('NSFL blocks', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

NSFL:
  First of all, see [section: soda].

  Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

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
          new PlainText('Not quite true.')
        ]),
        new NsflBlock([
          new Paragraph([
            new PlainText('First of all, see '),
            new ReferenceToTableOfContentsEntry('soda', sodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('NSFW blocks', () => {
    const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

NSFW:
  First of all, see [section: soda].

  Second, I've been alive for hundreds of years. I'm bound to have lied at some point.`

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
          new PlainText('Not quite true.')
        ]),
        new NsfwBlock([
          new Paragraph([
            new PlainText('First of all, see '),
            new ReferenceToTableOfContentsEntry('soda', sodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
          new PlainText('Not quite true.')
        ]),
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('First of all, see '),
              new ReferenceToTableOfContentsEntry('soda', sodaHeading),
              new PlainText('.')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
            ])
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })

  specify('Spoiler blocks', () => {
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
          new PlainText('Not quite true.')
        ]),
        new SpoilerBlock([
          new Paragraph([
            new PlainText('First of all, see '),
            new ReferenceToTableOfContentsEntry('soda', sodaHeading),
            new PlainText('.')
          ]),
          new Paragraph([
            new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })


  context('Table/charts. Specifically, their:', () => {
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
            new PlainText('Not quite true.')
          ]),
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Reason')]),
              new Table.Header.Cell([new PlainText('Validity')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('I get hungry')]),
                new Table.Row.Cell([new PlainText('Very valid')])
              ])
            ], new Table.Caption([
              new PlainText('Reasons I lie '),
              new NormalParenthetical([
                new PlainText('(see '),
                new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                new PlainText(')')
              ])
            ]))
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
            new PlainText('Not quite true.')
          ]),
          new Table(
            new Table.Header([
              new Table.Header.Cell([
                new PlainText('Reason '),
                new NormalParenthetical([
                  new PlainText('(see '),
                  new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                  new PlainText(')')
                ])
              ]),
              new Table.Header.Cell([new PlainText('Validity')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('I get hungry')]),
                new Table.Row.Cell([new PlainText('Very valid')])
              ])
            ], new Table.Caption([
              new PlainText('Reasons I lie')
            ]))
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
            new PlainText('Not quite true.')
          ]),
          new Table(
            new Table.Header([
              new Table.Header.Cell([
                new PlainText('Reason')
              ]),
              new Table.Header.Cell([new PlainText('Validity')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([
                  new PlainText('I get hungry '),
                  new NormalParenthetical([
                    new PlainText('(see '),
                    new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                    new PlainText(')')
                  ])
                ]),
                new Table.Row.Cell([new PlainText('Very valid')])
              ])
            ], new Table.Caption([
              new PlainText('Reasons I lie')
            ]))
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
    })

    specify('Row header cells', () => {
      const markup = `
I drink soda
============

Actually, I only drink milk.

I never lie
===========

Not quite true.

Chart: Reasons I lie

                                          Validity

I don't want to get in trouble;           Moderately valid
I get hungry (see [section: soda]);       Very valid`

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
            new PlainText('Not quite true.')
          ]),
          new Table(
            new Table.Header([
              new Table.Header.Cell([]),
              new Table.Header.Cell([new PlainText('Validity')])
            ]), [

              new Table.Row([
                new Table.Row.Cell([new PlainText('Moderately valid')])
              ], new Table.Header.Cell([
                new PlainText("I don't want to get in trouble"),
              ])),

              new Table.Row([
                new Table.Row.Cell([new PlainText('Very valid')])
              ], new Table.Header.Cell([
                new PlainText("I get hungry "),
                new NormalParenthetical([
                  new PlainText('(see '),
                  new ReferenceToTableOfContentsEntry('soda', sodaHeading),
                  new PlainText(')')
                ])
              ]))

            ], new Table.Caption([
              new PlainText('Reasons I lie')
            ]))
        ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
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
          new PlainText('Not quite true.')
        ]),
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('First of all, see '),
              new ReferenceToTableOfContentsEntry('soda', sodaHeading),
              new PlainText('.')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText("Second, I've been alive for hundreds of years. I'm bound to have lied at some point.")
            ])
          ])
        ])
      ], new UpDocument.TableOfContents([sodaHeading, neverLieHeading])))
  })
})
