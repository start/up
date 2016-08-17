import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'


describe('Consecutive bulleted lines', () => {
  it('produce an unordered list node containing unordered list items', () => {
    const markup = `
* Buy milk
* Buy bread
* Buy tendies`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Buy milk')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Buy bread')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Buy tendies')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Buy milk')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Buy bread')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Buy happiness')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1)
          ]),
          new UnorderedListNode.Item([
            new LineBlockNode([
              new LineBlockNode.Line([
                new PlainTextNode('Roses are red')
              ]),
              new LineBlockNode.Line([
                new PlainTextNode('Violets are blue')
              ])
            ])
          ])
        ])
      ]))
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1),
            new ParagraphNode([
              new PlainTextNode('It is really late, and I am really tired.')
            ]),
            new ParagraphNode([
              new PlainTextNode('Really.')
            ])
          ]),
          new UnorderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 1)
          ])
        ])
      ]))
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1),
            new ParagraphNode([
              new PlainTextNode('Upcoming features:')
            ]),
            new UnorderedListNode([
              new UnorderedListNode.Item([
                new ParagraphNode([
                  new PlainTextNode('Code blocks in list items')
                ])
              ]),
              new UnorderedListNode.Item([
                new ParagraphNode([
                  new PlainTextNode('Definition lists')
                ])
              ])
            ])
          ]),
          new UnorderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 1)
          ])
        ])
      ]))
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
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new LineBlockNode([
                new LineBlockNode.Line([
                  new PlainTextNode('Roses are red'),
                ]),
                new LineBlockNode.Line([
                  new PlainTextNode('Violets are blue')
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
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new LineBlockNode([
                new LineBlockNode.Line([
                  new PlainTextNode('Roses are red'),
                ]),
                new LineBlockNode.Line([
                  new PlainTextNode('Violets are blue')
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
          new UnorderedListNode([
            new UnorderedListNode.Item([
              new LineBlockNode([
                new LineBlockNode.Line([
                  new PlainTextNode('Roses are red'),
                ]),
                new LineBlockNode.Line([
                  new PlainTextNode('Violets are blue')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new LineBlockNode([
              new LineBlockNode.Line([
                new PlainTextNode('Roses are red')
              ]),
              new LineBlockNode.Line([
                new PlainTextNode('Violets are blue')
              ])
            ]),
            new ParagraphNode([
              new PlainTextNode('I really like that poem.')
            ]),
            new ParagraphNode([
              new PlainTextNode("I think it's my favorite.")
            ])
          ]),
          new UnorderedListNode.Item([
            new LineBlockNode([
              new LineBlockNode.Line([
                new PlainTextNode('1234 Spooky Street')
              ]),
              new LineBlockNode.Line([
                new PlainTextNode('Pepe, PA 17101')
              ])
            ]),
            new ParagraphNode([
              new PlainTextNode('I used to live there.')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new EmphasisNode([
                new PlainTextNode('Hello')
              ]),
              new PlainTextNode(', world!')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, World '),
              new EmphasisNode([
                new PlainTextNode('1-2')
              ]),
              new PlainTextNode('!')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, World '),
              new EmphasisNode([
                new PlainTextNode('1-2')
              ]),
              new PlainTextNode('!')
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
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, World 1-2!')
        ])
      ]))
  })
})
