import { expect } from 'chai'
import Up = require('../../../index')
import { Document } from '../../../SyntaxNodes/Document'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'
import { ThematicBreak } from '../../../SyntaxNodes/ThematicBreak'


describe('An ordered list with a single item can be sandwched by identical thematic break streaks without producing a heading.', () => {
  context('This includes when the bullet is:', () => {
    specify('A number sign', () => {
      const markup = `
-----------
# Mittens
-----------`

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new ThematicBreak(),
          new OrderedList([
            new OrderedList.Item([
              new Paragraph([
                new PlainText('Mittens')
              ])
            ])
          ]),
          new ThematicBreak()
        ]))
    })

    specify('A numeral followed by a closing parenthesis', () => {
      const markup = `
-----------
1) Mittens
-----------`

      expect(Up.parse(markup)).to.deep.equal(
        new Document([
          new ThematicBreak(),
          new OrderedList([
            new OrderedList.Item([
              new Paragraph([
                new PlainText('Mittens')
              ])
            ], { ordinal: 1 })
          ]),
          new ThematicBreak()
        ]))
    })
  })


  context("If an ordered list has just one item, that item's bullet can't be a numeral followed by a period.", () => {
    specify('Therefore, such a line produces a heading when sandwiched by identical streaks', () => {
      const markup = `
----------------------------------------
1783. Not a good year for Great Britain.
----------------------------------------`

      const heading =
        new Heading([new PlainText('1783. Not a good year for Great Britain.')], { level: 1, ordinalInTableOfContents: 1 })

      expect(Up.parse(markup)).to.deep.equal(
        new Document(
          [heading],
          new Document.TableOfContents([heading])
        ))
    })
  })
})


describe('An ordered list followed by 2 blank lines followed by another ordered list', () => {
  it('produce two separate ordered lists', () => {
    const markup = `
# Iowa
# New Hampshire


# Clinton
# Sanders`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Iowa')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('New Hampshire')
            ])
          ])
        ]),
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Clinton')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Sanders')
            ])
          ])
        ]),
      ]))
  })
})


describe('An ordered list followed by 3 blank lines followed by another ordered list', () => {
  it('produce an ordered list, a thematic break, and another ordered list', () => {
    const markup = `
# Iowa
# New Hampshire



# Clinton
# Sanders`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Iowa')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('New Hampshire')
            ])
          ])
        ]),
        new ThematicBreak(),
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Clinton')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Sanders')
            ])
          ])
        ]),
      ]))
  })
})


context('An ordered list item ordinal can have leading 0 digits without affecting the ordinal itself', () => {
  specify('when positive', () => {
    const markup = `
0010) Hello, world!
#. Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ], { ordinal: 10 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('when negative', () => {
    const markup = `
-0020) Hello, world!
#) Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ], { ordinal: -20 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('when zero', () => {
    const markup = `
000) Hello, world!
#) Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ], { ordinal: 0 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })
})


context("When an ordered list has just one item, that item can start with an integer followed by a period. The single item can be bulleted by:", () => {
  specify('An integer followed by a closing parenthesis', () => {
    expect(Up.parse('1) 1783. Not a good year for Great Britain.')).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('1783. Not a good year for Great Britain.')
            ])
          ], { ordinal: 1 })
        ])
      ]))
  })

  specify('A number sign', () => {
    expect(Up.parse('# 1783. Not a good year for Great Britain.')).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('1783. Not a good year for Great Britain.')
            ])
          ])
        ])
      ]))
  })

  specify('A number sign followed by a period', () => {
    expect(Up.parse('#. 1783. Not a good year for Great Britain.')).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('1783. Not a good year for Great Britain.')
            ])
          ])
        ])
      ]))
  })

  specify('A number sign followed by a closing parenthesis', () => {
    expect(Up.parse('#) 1783. Not a good year for Great Britain.')).to.deep.equal(
      new Document([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('1783. Not a good year for Great Britain.')
            ])
          ])
        ])
      ]))
  })
})


describe('An ordered list item with a numeral followed by a bullet', () => {
  it('can start with a heading', () => {
    const markup = `
I enjoy apples
==============

1. They're cheap
   -------------

   Very cheap.

2. They're delicious
   -----------------
   
   Very delicious.`

    const enjoyHeading =
      new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const cheapHeading =
      new Heading([new PlainText("They're cheap")], { level: 2, ordinalInTableOfContents: 2 })

    const deliciousHeading =
      new Heading([new PlainText("They're delicious")], { level: 2, ordinalInTableOfContents: 3 })

    expect(Up.parse(markup)).to.deep.equal(
      new Document([
        enjoyHeading,
        new OrderedList([
          new OrderedList.Item([
            cheapHeading,
            new Paragraph([new PlainText("Very cheap.")])
          ], { ordinal: 1 }),
          new OrderedList.Item([
            deliciousHeading,
            new Paragraph([new PlainText("Very delicious.")])
          ], { ordinal: 2 })
        ])
      ], new Document.TableOfContents([enjoyHeading, cheapHeading, deliciousHeading])))
  })
})
