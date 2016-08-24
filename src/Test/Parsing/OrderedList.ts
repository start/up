import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { OrderedList } from '../../SyntaxNodes/OrderedList'


describe('Consecutive lines each bulleted by a number sign', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const markup = `
# Hello, world!
# Goodbye, world!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })
})


describe('Consecutive lines each bulleted by a number sign followed by a period', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const markup = `
#. Hello, Lavender Town!
#. Goodbye, Lavender Town!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Lavender Town!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Lavender Town!')
            ])
          ])
        ])
      ]))
  })
})


describe('Consecutive lines each bulleted by a number sign followed by a closing parenthesis', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const markup = `
#) Hello, Celadon City!
#) Goodbye, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ])
        ])
      ]))
  })
})


describe('Consecutive lines each bulleted by an integer followed by a period', () => {
  it('produce an ordered list node containing ordered list item nodes with explicit ordinals', () => {
    const markup = `
1. Hello, Celadon City!
2. Goodbye, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ], { ordinal: 1 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ], { ordinal: 2 })
        ])
      ]))
  })
})


describe('Consecutive lines each bulleted by an integer followed by a closing parenthesis', () => {
  it('produce an ordered list node containing ordered list item nodes with explicit ordinals', () => {
    const markup = `
1) Hello, Celadon City!
2) Goodbye, Celadon City!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ], { ordinal: 1 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, Celadon City!')
            ])
          ], { ordinal: 2 })
        ])
      ]))
  })
})


describe('A single line bulleted by an integer followed by a period', () => {
  it('does not produce an ordered list', () => {
    expect(Up.toDocument('1783. Not a good year for Great Britain.')).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('1783. Not a good year for Great Britain.')
        ])
      ]))
  })
})


describe('A single line bulleted by a number sign', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.toDocument('# Hello, world!')).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ])
        ])
      ]))
  })
})


describe('A single line bulleted by a number sign followed by a period', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.toDocument('#. Hello, Lavender Town!')).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Lavender Town!')
            ])
          ])
        ])
      ]))
  })
})


describe('A single line bulleted by a number sign followed by a closing parenthesis', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.toDocument('#) Hello, Celadon City!')).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ])
        ])
      ]))
  })
})


describe('A single line bulleted by an integer followed by a closing parenthesis', () => {
  it('produces an ordered list node containing an ordered list item node with an explicit ordinal', () => {
    expect(Up.toDocument('1) Hello, Celadon City!')).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ], { ordinal: 1 })
        ])
      ]))
  })
})


describe('The 5 different bullet types', () => {
  it('can be combined in the same ordered list', () => {
    const markup = `
1. Hello, Celadon City!
2) Hello, Couriway Town!
#) Hello, Cinnabar Island!
#. Hello, Cherrygrove City!
# Hello, Camphrier Town!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Celadon City!')
            ])
          ], { ordinal: 1 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Couriway Town!')
            ])
          ], { ordinal: 2 }),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Cinnabar Island!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Cherrygrove City!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, Camphrier Town!')
            ])
          ])
        ])
      ]))
  })
})


describe('An ordered list', () => {
  it('is evaluated for inline conventions', () => {
    const markup = `
# Hello, World *1-2*!
# Goodbye, World *1-2*!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, World '),
              new Emphasis([
                new PlainText('1-2')
              ]),
              new PlainText('!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, World '),
              new Emphasis([
                new PlainText('1-2')
              ]),
              new PlainText('!')
            ])
          ])
        ]),
      ]))
  })

  it('can be directly followed by a paragraph', () => {
    const markup = `
# Hello, world!
# Goodbye, world!
Hello, World 1-2!`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ]),
          new OrderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ]),
        new Paragraph([
          new PlainText('Hello, World 1-2!')
        ])
      ]))
  })
})


describe('An indented line immediately following an ordered list item line', () => {
  it('is part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const markup = `
# Hello, world!
  ============
# Roses are red
  Violets are blue`

    const heading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            heading
          ]),
          new OrderedList.Item([
            new LineBlock([
              new LineBlock.Line([
                new PlainText('Roses are red')
              ]),
              new LineBlock.Line([
                new PlainText('Violets are blue')
              ])
            ])
          ])
        ])
      ], new UpDocument.TableOfContents([heading])))
  })
})


describe('Multiple indented or blank lines immediately following an ordered list item line', () => {
  it('are part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const markup = `
# Hello, world!
  ============

  It is really late, and I am really tired.

  Really.

# Goodbye, world!
  ===============`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            helloHeading,
            new Paragraph([
              new PlainText('It is really late, and I am really tired.')
            ]),
            new Paragraph([
              new PlainText('Really.')
            ])
          ]),
          new OrderedList.Item([
            goodbyeHeading
          ])
        ])
      ], new UpDocument.TableOfContents([helloHeading, goodbyeHeading])))
  })
})


describe('An ordered list item containing multiple indented lines', () => {
  it('does not need a blank line to separate it from the following list item', () => {
    const withoutSeparation = `
# Hello, world!
  =============

  It is really late, and I am really tired.
# Goodbye, world!
  ===============`

    const withSeparation = `
# Hello, world!
  =============

  It is really late, and I am really tired.

# Goodbye, world!
  ===============`
    expect(Up.toDocument(withSeparation)).to.deep.equal(Up.toDocument(withoutSeparation))
  })

  it('can contain a nested ordered list that uses the same type of bullet used by its containing list item', () => {
    const markup = `
# Hello, world!
  =============

  Upcoming features:
  
  # Code blocks in list items
  # Definition lists

# Goodbye, world!
  ===============`

    const helloHeading =
      new Heading([new PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            helloHeading,
            new Paragraph([
              new PlainText('Upcoming features:')
            ]),
            new OrderedList([
              new OrderedList.Item([
                new Paragraph([
                  new PlainText('Code blocks in list items')
                ])
              ]),
              new OrderedList.Item([
                new Paragraph([
                  new PlainText('Definition lists')
                ])
              ])
            ])
          ]),
          new OrderedList.Item([
            goodbyeHeading
          ])
        ])
      ], new UpDocument.TableOfContents([helloHeading, goodbyeHeading])))
  })
})


context('Subsequent lines in an ordered list item must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const markup = `
# Roses are red
  Violets are blue`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new LineBlock([
                new LineBlock.Line([
                  new PlainText('Roses are red'),
                ]),
                new LineBlock.Line([
                  new PlainText('Violets are blue')
                ])
              ])
            ])
          ])
        ]))
    })

    specify('One tab', () => {
      const markup = `
# Roses are red
\tViolets are blue`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new LineBlock([
                new LineBlock.Line([
                  new PlainText('Roses are red'),
                ]),
                new LineBlock.Line([
                  new PlainText('Violets are blue')
                ])
              ])
            ])
          ])
        ]))
    })

    specify('One space folled by one tab', () => {
      const markup = `
# Roses are red
 \tViolets are blue`

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new OrderedList([
            new OrderedList.Item([
              new LineBlock([
                new LineBlock.Line([
                  new PlainText('Roses are red'),
                ]),
                new LineBlock.Line([
                  new PlainText('Violets are blue')
                ])
              ])
            ])
          ])
        ]))
    })
  })

  specify('Different lines in an ordered list can use different indentation', () => {
    const withMixedIndentation = `
# Roses are red
  Violets are blue
 
\tI really like that poem.

 \tI think it's my favorite.

# 1234 Spooky Street
\tPepe, PA 17101

  I used to live there.`

    expect(Up.toDocument(withMixedIndentation)).to.deep.equal(
      new UpDocument([
        new OrderedList([
          new OrderedList.Item([
            new LineBlock([
              new LineBlock.Line([
                new PlainText('Roses are red')
              ]),
              new LineBlock.Line([
                new PlainText('Violets are blue')
              ])
            ]),
            new Paragraph([
              new PlainText('I really like that poem.')
            ]),
            new Paragraph([
              new PlainText("I think it's my favorite.")
            ])
          ]),
          new OrderedList.Item([
            new LineBlock([
              new LineBlock.Line([
                new PlainText('1234 Spooky Street')
              ]),
              new LineBlock.Line([
                new PlainText('Pepe, PA 17101')
              ])
            ]),
            new Paragraph([
              new PlainText('I used to live there.')
            ])
          ])
        ])
      ]))
  })
})
