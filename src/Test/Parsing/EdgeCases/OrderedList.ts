import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'
import { OutlineSeparator } from '../../../SyntaxNodes/OutlineSeparator'


describe('An ordered list with a single item can be sandwched by identical outline separator streaks without producing a heading.', () => {
  context('This includes when the bullet is:', () => {
    specify('A number sign', () => {
      const markup = `
-----------
# Mittens
-----------`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new OutlineSeparator(),
          new OrderedList([
            new OrderedList.Item([
              new Paragraph([
                new PlainText('Mittens')
              ])
            ])
          ]),
          new OutlineSeparator()
        ]))
    })

    specify('A numeral followed by a closing parenthesis', () => {
      const markup = `
-----------
1) Mittens
-----------`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new OutlineSeparator(),
          new OrderedList([
            new OrderedList.Item([
              new Paragraph([
                new PlainText('Mittens')
              ])
            ], 1)
          ]),
          new OutlineSeparator()
        ]))
    })
  })


  context("If an ordered list has just one item, that item's bullet can't be a numeral followed by a period.", () => {
    specify('Therefore, such a line produces a heading when sandwiched by identical streaks.', () => {
      const markup = `
----------------------------------------
1783. Not a good year for Great Britain.
----------------------------------------`

      const heading =
        new Heading([new PlainText('1783. Not a good year for Great Britain.')], { level: 1 })

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument(
          [heading],
          new UpDocument.TableOfContents([heading])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
  it('produce an ordered list, an outline separator, and another ordered list', () => {
    const markup = `
# Iowa
# New Hampshire



# Clinton
# Sanders`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
        new OutlineSeparator(),
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ], 10),
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ], -20),
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ], 0),
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
    expect(Up.toDocument('1) 1783. Not a good year for Great Britain.')).to.be.eql(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('1783. Not a good year for Great Britain.')
            ])
          ], 1)
        ])
      ]))
  })

  specify('A number sign', () => {
    expect(Up.toDocument('# 1783. Not a good year for Great Britain.')).to.be.eql(
      new UpDocument([
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
    expect(Up.toDocument('#. 1783. Not a good year for Great Britain.')).to.be.eql(
      new UpDocument([
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
    expect(Up.toDocument('#) 1783. Not a good year for Great Britain.')).to.be.eql(
      new UpDocument([
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
      new Heading([new PlainText('I enjoy apples')], { level: 1 })

    const cheapHeading =
      new Heading([new PlainText("They're cheap")], { level: 2 })

    const deliciousHeading =
      new Heading([new PlainText("They're delicious")], { level: 2 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        enjoyHeading,
        new OrderedList([
          new OrderedList.Item([
            cheapHeading,
            new Paragraph([new PlainText("Very cheap.")])
          ], 1),
          new OrderedList.Item([
            deliciousHeading,
            new Paragraph([new PlainText("Very delicious.")])
          ], 2)
        ])
      ], new UpDocument.TableOfContents([enjoyHeading, cheapHeading, deliciousHeading])))
  })
})
