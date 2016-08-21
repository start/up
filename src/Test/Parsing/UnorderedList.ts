import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Heading } from '../../SyntaxNodes/Heading'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'


describe('Consecutive bulleted lines', () => {
  it('produce an unordered list node containing unordered list items', () => {
    const markup = `
* Buy milk
* Buy bread
* Buy tendies`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy milk')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy bread')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy tendies')
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('Hyphens', () => {
    const markup = `
- Hello, world!
- Goodbye, world!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('Actual bullet characters', () => {
    const markup = `
• Hello, world!
• Goodbye, world!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Goodbye, world!')
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy milk')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy bread')
            ])
          ]),
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Buy happiness')
            ])
          ])
        ])
      ]))
  })
})



describe('List items in an unordered list', () => {
  it('can be separated by 1 blank line', () => {
    const textWithSeparator = `
* Hello, world!

* Goodbye, world!`

    const textWithoutSeparator = `
* Hello, world!
* Goodbye, world!`

    expect(Up.toDocument(textWithSeparator)).to.be.eql(Up.toDocument(textWithoutSeparator))
  })
})


describe('A single bulleted line', () => {
  it('produces an unordered list node containing a single unordered list item', () => {
    expect(Up.toDocument('* Hello, world!')).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
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
      new Heading([new PlainText('Hello, world!')], { level: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            heading
          ]),
          new UnorderedList.Item([
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
      new Heading([new PlainText('Hello, world!')], { level: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Heading([
              new PlainText('Hello, world!')
            ], { level: 1 }),
            new Paragraph([
              new PlainText('It is really late, and I am really tired.')
            ]),
            new Paragraph([
              new PlainText('Really.')
            ])
          ]),
          new UnorderedList.Item([
            new Heading([
              new PlainText('Goodbye, world!')
            ], { level: 1 })
          ])
        ])
      ], new UpDocument.TableOfContents([hellodHeading, goodbyeHeading])))
  })
})


describe('An unordered list item containing multiple indented lines', () => {
  it('does not need a blank line to separate it from the following list item', () => {
    const itemsWithSeparator = `
* Hello, world!
  =============

  It is really late, and I am really tired.
* Goodbye, world!
  ===============`

    const itemsWithoutSeparator = `
* Hello, world!
  =============

  It is really late, and I am really tired.

* Goodbye, world!
  ===============`
    expect(Up.toDocument(itemsWithoutSeparator)).to.be.eql(Up.toDocument(itemsWithSeparator))
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
      new Heading([new PlainText('Hello, world!')], { level: 1 })

    const goodbyeHeading =
      new Heading([new PlainText('Goodbye, world!')], { level: 1 })

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Heading([
              new PlainText('Hello, world!')
            ], { level: 1 }),
            new Paragraph([
              new PlainText('Upcoming features:')
            ]),
            new UnorderedList([
              new UnorderedList.Item([
                new Paragraph([
                  new PlainText('Code blocks in list items')
                ])
              ]),
              new UnorderedList.Item([
                new Paragraph([
                  new PlainText('Definition lists')
                ])
              ])
            ])
          ]),
          new UnorderedList.Item([
            new Heading([
              new PlainText('Goodbye, world!')
            ], { level: 1 })
          ])
        ])
      ], new UpDocument.TableOfContents([hellodHeading, goodbyeHeading])))
  })
})


context('Subsequent lines in an unordered list item must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const markup = `
* Roses are red
  Violets are blue`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
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
* Roses are red
\tViolets are blue`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
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
* Roses are red
 \tViolets are blue`

      expect(Up.toDocument(markup)).to.be.eql(
        new UpDocument([
          new UnorderedList([
            new UnorderedList.Item([
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

  specify('Different lines in an unordered list can use different indentation', () => {
    const withMixedIndentation = `
* Roses are red
  Violets are blue
 
\tI really like that poem.

 \tI think it's my favorite.

* 1234 Spooky Street
\tPepe, PA 17101

  I used to live there.`

    expect(Up.toDocument(withMixedIndentation)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
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
          new UnorderedList.Item([
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


describe('An unordered list item with an asterisk bullet', () => {
  it('Can start with emphasized text', () => {
    expect(Up.toDocument('* *Hello*, world!')).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new Emphasis([
                new PlainText('Hello')
              ]),
              new PlainText(', world!')
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, World '),
              new Emphasis([
                new PlainText('1-2')
              ]),
              new PlainText('!')
            ])
          ]),
          new UnorderedList.Item([
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
* Hello, world!
* Goodbye, world!
Hello, World 1-2!`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Paragraph([
              new PlainText('Hello, world!')
            ])
          ]),
          new UnorderedList.Item([
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
