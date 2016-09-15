import { expect } from 'chai'
import Up = require('../../index')


describe('Consecutive bulleted lines', () => {
  it('produce an unordered list node containing unordered list items', () => {
    const markup = `
* Buy milk
* Buy bread
* Buy tendies`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Buy milk')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Buy bread')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Buy tendies')
            ])
          ])
        ])
      ]))
  })
})


context('Unordered list bullets can be:', () => {
  specify('Asterisks', () => {
    const markup = `
* Hello, world!
* Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Hello, world!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('Hyphens', () => {
    const markup = `
- Hello, world!
- Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Hello, world!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('Actual bullet characters', () => {
    const markup = `
• Hello, world!
• Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Hello, world!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('A mix of any of the above', () => {
    const markup = `
* Buy milk
- Buy bread
• Buy happiness`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Buy milk')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Buy bread')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Buy happiness')
            ])
          ])
        ])
      ]))
  })
})



describe('List items in an unordered list', () => {
  it('can be separated by 1 blank line', () => {
    const withSeparation = `
* Hello, world!

* Goodbye, world!`

    const withoutSeparation = `
* Hello, world!
* Goodbye, world!`

    expect(Up.parse(withSeparation)).to.deep.equal(Up.parse(withoutSeparation))
  })
})


describe('A single bulleted line', () => {
  it('produces an unordered list node containing a single unordered list item', () => {
    expect(Up.parse('* Hello, world!')).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Hello, world!')
            ])
          ])
        ])
      ]))
  })
})


describe('An indented line immediately following an ordered list item line', () => {
  it('is part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const markup = `
* Hello, world!
  ============
* Roses are red
  Violets are blue`

    const heading =
      new Up.Heading([new Up.PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            heading
          ]),
          new Up.UnorderedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.PlainText('Roses are red')
              ]),
              new Up.LineBlock.Line([
                new Up.PlainText('Violets are blue')
              ])
            ])
          ])
        ])
      ], new Up.Document.TableOfContents([heading])))
  })
})


describe('Multiple indented or blank lines immediately following an unordered list item line', () => {
  it('are part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const markup = `
* Hello, world!
  ============

  It is really late, and I am really tired.

  Really.

* Goodbye, world!
  ===============`

    const hellodHeading =
      new Up.Heading([new Up.PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Up.Heading([new Up.PlainText('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            hellodHeading,
            new Up.Paragraph([
              new Up.PlainText('It is really late, and I am really tired.')
            ]),
            new Up.Paragraph([
              new Up.PlainText('Really.')
            ])
          ]),
          new Up.UnorderedList.Item([
            goodbyeHeading
          ])
        ])
      ], new Up.Document.TableOfContents([hellodHeading, goodbyeHeading])))
  })
})


describe('An unordered list item containing multiple indented lines', () => {
  it('does not need a blank line to separate it from the following list item', () => {
    const withoutSeparation = `
* Hello, world!
  =============

  It is really late, and I am really tired.
* Goodbye, world!
  ===============`

    const withSeparation = `
* Hello, world!
  =============

  It is really late, and I am really tired.

* Goodbye, world!
  ===============`
    expect(Up.parse(withSeparation)).to.deep.equal(Up.parse(withoutSeparation))
  })

  it('can contain a nested unordered list that uses the same type of bullet used by its containing list item', () => {
    const markup = `
* Hello, world!
  =============

  Upcoming features:
  
  * Code blocks in list items
  * Definition lists

* Goodbye, world!
  ===============`

    const hellodHeading =
      new Up.Heading([new Up.PlainText('Hello, world!')], { level: 1, ordinalInTableOfContents: 1 })

    const goodbyeHeading =
      new Up.Heading([new Up.PlainText('Goodbye, world!')], { level: 1, ordinalInTableOfContents: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            hellodHeading,
            new Up.Paragraph([
              new Up.PlainText('Upcoming features:')
            ]),
            new Up.UnorderedList([
              new Up.UnorderedList.Item([
                new Up.Paragraph([
                  new Up.PlainText('Code blocks in list items')
                ])
              ]),
              new Up.UnorderedList.Item([
                new Up.Paragraph([
                  new Up.PlainText('Definition lists')
                ])
              ])
            ])
          ]),
          new Up.UnorderedList.Item([
            goodbyeHeading
          ])
        ])
      ], new Up.Document.TableOfContents([hellodHeading, goodbyeHeading])))
  })
})


context('Subsequent lines in an unordered list item must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const markup = `
* Roses are red
  Violets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.PlainText('Roses are red'),
                ]),
                new Up.LineBlock.Line([
                  new Up.PlainText('Violets are blue')
                ])
              ])
            ])
          ])
        ]))
    })

    specify('One tab', () => {
      const markup = `
* Roses are red
\tViolets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.PlainText('Roses are red'),
                ]),
                new Up.LineBlock.Line([
                  new Up.PlainText('Violets are blue')
                ])
              ])
            ])
          ])
        ]))
    })

    specify('One space folled by one tab', () => {
      const markup = `
* Roses are red
 \tViolets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.UnorderedList([
            new Up.UnorderedList.Item([
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.PlainText('Roses are red'),
                ]),
                new Up.LineBlock.Line([
                  new Up.PlainText('Violets are blue')
                ])
              ])
            ])
          ])
        ]))
    })
  })

  specify('Different lines in an unordered list can use different indentation', () => {
    const withMixedIndentation = `
* Roses are red
  Violets are blue
 
\tI really like that poem.

 \tI think it's my favorite.

* 1234 Spooky Street
\tPepe, PA 17101

  I used to live there.`

    expect(Up.parse(withMixedIndentation)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.PlainText('Roses are red')
              ]),
              new Up.LineBlock.Line([
                new Up.PlainText('Violets are blue')
              ])
            ]),
            new Up.Paragraph([
              new Up.PlainText('I really like that poem.')
            ]),
            new Up.Paragraph([
              new Up.PlainText("I think it's my favorite.")
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.LineBlock([
              new Up.LineBlock.Line([
                new Up.PlainText('1234 Spooky Street')
              ]),
              new Up.LineBlock.Line([
                new Up.PlainText('Pepe, PA 17101')
              ])
            ]),
            new Up.Paragraph([
              new Up.PlainText('I used to live there.')
            ])
          ])
        ])
      ]))
  })
})


describe('An unordered list item with an asterisk bullet', () => {
  it('Can start with emphasized text', () => {
    expect(Up.parse('* *Hello*, world!')).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.Emphasis([
                new Up.PlainText('Hello')
              ]),
              new Up.PlainText(', world!')
            ])
          ])
        ])
      ]))
  })
})


describe('An unordered list', () => {
  it('is evaluated for inline conventions', () => {
    const markup = `
* Hello, World *1-2*!
* Goodbye, World *1-2*!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Hello, World '),
              new Up.Emphasis([
                new Up.PlainText('1-2')
              ]),
              new Up.PlainText('!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Goodbye, World '),
              new Up.Emphasis([
                new Up.PlainText('1-2')
              ]),
              new Up.PlainText('!')
            ])
          ])
        ]),
      ]))
  })

  it('can be directly followed by a paragraph', () => {
    const markup = `
* Hello, world!
* Goodbye, world!
Hello, World 1-2!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Hello, world!')
            ])
          ]),
          new Up.UnorderedList.Item([
            new Up.Paragraph([
              new Up.PlainText('Goodbye, world!')
            ])
          ])
        ]),
        new Up.Paragraph([
          new Up.PlainText('Hello, World 1-2!')
        ])
      ]))
  })
})
