import { expect } from 'chai'
import * as Up from '../../index'


describe('Consecutive lines each bulleted by a number sign', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const markup = `
# Hello, world!
# Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, world!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Lavender Town!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Lavender Town!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ], { ordinal: 1 }),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ], { ordinal: 1 }),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, Celadon City!')
            ])
          ], { ordinal: 2 })
        ])
      ]))
  })
})


describe('A single line bulleted by an integer followed by a period', () => {
  it('does not produce an ordered list', () => {
    expect(Up.parse('1783. Not a good year for Great Britain.')).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('1783. Not a good year for Great Britain.')
        ])
      ]))
  })
})


describe('A single line bulleted by a number sign', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.parse('# Hello, world!')).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ])
        ])
      ]))
  })
})


describe('A single line bulleted by a number sign followed by a period', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.parse('#. Hello, Lavender Town!')).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Lavender Town!')
            ])
          ])
        ])
      ]))
  })
})


describe('A single line bulleted by a number sign followed by a closing parenthesis', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.parse('#) Hello, Celadon City!')).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ])
        ])
      ]))
  })
})


describe('A single line bulleted by an integer followed by a closing parenthesis', () => {
  it('produces an ordered list node containing an ordered list item node with an explicit ordinal', () => {
    expect(Up.parse('1) Hello, Celadon City!')).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Celadon City!')
            ])
          ], { ordinal: 1 }),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Couriway Town!')
            ])
          ], { ordinal: 2 }),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Cinnabar Island!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Cherrygrove City!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, Camphrier Town!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, World '),
              new Up.Emphasis([
                new Up.Text('1-2')
              ]),
              new Up.Text('!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, World '),
              new Up.Emphasis([
                new Up.Text('1-2')
              ]),
              new Up.Text('!')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, world!')
            ])
          ])
        ]),
        new Up.Paragraph([
          new Up.Text('Hello, World 1-2!')
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
      new Up.Heading([new Up.Text('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            heading
          ]),
          new Up.OrderedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.Text('Roses are red')
              ]),
              new Up.LineBlock.Line([
                new Up.Text('Violets are blue')
              ])
            ])
          ])
        ])
      ], new Up.Document.TableOfContents([heading])))
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
      new Up.Heading([new Up.Text('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            helloHeading,
            new Up.Paragraph([
              new Up.Text('It is really late, and I am really tired.')
            ]),
            new Up.Paragraph([
              new Up.Text('Really.')
            ])
          ]),
          new Up.OrderedList.Item([
            goodbyeHeading
          ])
        ])
      ], new Up.Document.TableOfContents([helloHeading, goodbyeHeading])))
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
    expect(Up.parse(withSeparation)).to.deep.equal(Up.parse(withoutSeparation))
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
      new Up.Heading([new Up.Text('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            helloHeading,
            new Up.Paragraph([
              new Up.Text('Upcoming features:')
            ]),
            new Up.OrderedList([
              new Up.OrderedList.Item([
                new Up.Paragraph([
                  new Up.Text('Code blocks in list items')
                ])
              ]),
              new Up.OrderedList.Item([
                new Up.Paragraph([
                  new Up.Text('Definition lists')
                ])
              ])
            ])
          ]),
          new Up.OrderedList.Item([
            goodbyeHeading
          ])
        ])
      ], new Up.Document.TableOfContents([helloHeading, goodbyeHeading])))
  })
})


context('Subsequent lines in an ordered list item must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const markup = `
# Roses are red
  Violets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.OrderedList([
            new Up.OrderedList.Item([
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.Text('Roses are red'),
                ]),
                new Up.LineBlock.Line([
                  new Up.Text('Violets are blue')
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.OrderedList([
            new Up.OrderedList.Item([
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.Text('Roses are red'),
                ]),
                new Up.LineBlock.Line([
                  new Up.Text('Violets are blue')
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

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.OrderedList([
            new Up.OrderedList.Item([
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.Text('Roses are red'),
                ]),
                new Up.LineBlock.Line([
                  new Up.Text('Violets are blue')
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

    expect(Up.parse(withMixedIndentation)).to.deep.equal(
      new Up.Document([
        new Up.OrderedList([
          new Up.OrderedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.Text('Roses are red')
              ]),
              new Up.LineBlock.Line([
                new Up.Text('Violets are blue')
              ])
            ]),
            new Up.Paragraph([
              new Up.Text('I really like that poem.')
            ]),
            new Up.Paragraph([
              new Up.Text("I think it's my favorite.")
            ])
          ]),
          new Up.OrderedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.Text('1234 Spooky Street')
              ]),
              new Up.LineBlock.Line([
                new Up.Text('Pepe, PA 17101')
              ])
            ]),
            new Up.Paragraph([
              new Up.Text('I used to live there.')
            ])
          ])
        ])
      ]))
  })
})
