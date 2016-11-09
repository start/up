import { expect } from 'chai'
import * as Up from '../../../Main'


describe('Consecutive bulleted lines', () => {
  it('produce a bulleted list node containing bulleted list items', () => {
    const markup = `
* Buy milk
* Buy bread
* Buy tendies`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy milk')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy bread')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy tendies')
            ])
          ])
        ])
      ]))
  })
})


context('Bulleted list bullets can be:', () => {
  specify('Asterisks', () => {
    const markup = `
* Hello, world!
* Goodbye, world!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, world!')
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, world!')
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Goodbye, world!')
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy milk')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy bread')
            ])
          ]),
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Buy happiness')
            ])
          ])
        ])
      ]))
  })
})



describe('List items in a bulleted list', () => {
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
  it('produces a bulleted list node containing a single bulleted list item', () => {
    expect(Up.parse('* Hello, world!')).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ])
        ])
      ]))
  })
})


describe('An indented line immediately following a numbered list item line', () => {
  it('is part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const markup = `
* Hello, world!
  ============
* Roses are red
  Violets are blue`

    const heading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            heading
          ]),
          new Up.BulletedList.Item([
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


describe('Multiple indented or blank lines immediately following a bulleted list item line', () => {
  it('are part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const markup = `
* Hello, world!
  ============

  It is really late, and I am really tired.

  Really.

* Goodbye, world!
  ===============`

    const hellodHeading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 1,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            hellodHeading,
            new Up.Paragraph([
              new Up.Text('It is really late, and I am really tired.')
            ]),
            new Up.Paragraph([
              new Up.Text('Really.')
            ])
          ]),
          new Up.BulletedList.Item([
            goodbyeHeading
          ])
        ])
      ], new Up.Document.TableOfContents([hellodHeading, goodbyeHeading])))
  })
})


describe('A bulleted list item containing multiple indented lines', () => {
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

  it('can contain a nested bulleted list that uses the same type of bullet used by its containing list item', () => {
    const markup = `
* Hello, world!
  =============

  Upcoming features:
  
  * Code blocks in list items
  * Definition lists

* Goodbye, world!
  ===============`

    const hellodHeading =
      new Up.Heading([new Up.Text('Hello, world!')], {
        level: 1,
        titleMarkup: 'Hello, world!',
        ordinalInTableOfContents: 1
      })

    const goodbyeHeading =
      new Up.Heading([new Up.Text('Goodbye, world!')], {
        level: 1,
        titleMarkup: 'Goodbye, world!',
        ordinalInTableOfContents: 2
      })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            hellodHeading,
            new Up.Paragraph([
              new Up.Text('Upcoming features:')
            ]),
            new Up.BulletedList([
              new Up.BulletedList.Item([
                new Up.Paragraph([
                  new Up.Text('Code blocks in list items')
                ])
              ]),
              new Up.BulletedList.Item([
                new Up.Paragraph([
                  new Up.Text('Definition lists')
                ])
              ])
            ])
          ]),
          new Up.BulletedList.Item([
            goodbyeHeading
          ])
        ])
      ], new Up.Document.TableOfContents([hellodHeading, goodbyeHeading])))
  })
})


context('Subsequent lines in a bulleted list item must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const markup = `
* Roses are red
  Violets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.BulletedList([
            new Up.BulletedList.Item([
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
* Roses are red
\tViolets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.BulletedList([
            new Up.BulletedList.Item([
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
* Roses are red
 \tViolets are blue`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.BulletedList([
            new Up.BulletedList.Item([
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

  specify('Different lines in a bulleted list can use different indentation', () => {
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
        new Up.BulletedList([
          new Up.BulletedList.Item([
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
          new Up.BulletedList.Item([
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


describe('A bulleted list item with an asterisk bullet', () => {
  it('Can start with emphasized text', () => {
    expect(Up.parse('* *Hello*, world!')).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Emphasis([
                new Up.Text('Hello')
              ]),
              new Up.Text(', world!')
            ])
          ])
        ])
      ]))
  })
})


describe('A bulleted list', () => {
  it('is evaluated for inline conventions', () => {
    const markup = `
* Hello, World *1-2*!
* Goodbye, World *1-2*!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, World '),
              new Up.Emphasis([
                new Up.Text('1-2')
              ]),
              new Up.Text('!')
            ])
          ]),
          new Up.BulletedList.Item([
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
* Hello, world!
* Goodbye, world!
Hello, World 1-2!`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.Paragraph([
              new Up.Text('Hello, world!')
            ])
          ]),
          new Up.BulletedList.Item([
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
