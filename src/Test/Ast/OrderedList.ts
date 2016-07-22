import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'


describe('Consecutive lines each bulleted by a number sign', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text = `
# Hello, world!
# Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('Consecutive lines each bulleted by a number sign followed by a period', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text = `
#. Hello, Lavender Town!
#. Goodbye, Lavender Town!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Lavender Town!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Lavender Town!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('Consecutive lines each bulleted by a number sign followed by a right paren', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text = `
#) Hello, Celadon City!
#) Goodbye, Celadon City!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Celadon City!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('Consecutive lines each bulleted by an integer followed by a period', () => {
  it('produce an ordered list node containing ordered list item nodes with explicit ordinals', () => {
    const text = `
1. Hello, Celadon City!
2. Goodbye, Celadon City!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Celadon City!')
            ])
          ], 2)
        ])
      ])
    )
  })
})


describe('Consecutive lines each bulleted by an integer followed by a right paren', () => {
  it('produce an ordered list node containing ordered list item nodes with explicit ordinals', () => {
    const text = `
1) Hello, Celadon City!
2) Goodbye, Celadon City!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, Celadon City!')
            ])
          ], 2)
        ])
      ])
    )
  })
})


describe('A single line bulleted by a number sign', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.toAst('# Hello, world!')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('A single line bulleted by a number sign followed by a period', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.toAst('#. Hello, Lavender Town!')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Lavender Town!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('A single line bulleted by a number sign followed by a right paren', () => {
  it('produces an ordered list node containing ordered list item nodes', () => {
    expect(Up.toAst('#) Hello, Celadon City!')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('A single line bulleted by an integer followed by a period', () => {
  it('produces a paragraph, not an ordered list', () => {
    expect(Up.toAst('1783. Not a good year for Great Britain.')).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('1783. Not a good year for Great Britain.')
        ])
      ])
    )
  })
})


describe('A single line bulleted by an integer followed by a right paren', () => {
  it('produces an ordered list node containing an ordered list item node with an explicit ordinal', () => {
    expect(Up.toAst('1) Hello, Celadon City!')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1)
        ])
      ])
    )
  })
})


describe('The 5 different bullet types', () => {
  it('can be combined in the same ordered list', () => {
    const text = `
1. Hello, Celadon City!
2) Hello, Couriway Town!
#) Hello, Cinnabar Island!
#. Hello, Cherrygrove City!
# Hello, Camphrier Town!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Couriway Town!')
            ])
          ], 2),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Cinnabar Island!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Cherrygrove City!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, Camphrier Town!')
            ])
          ])
        ])
      ])
    )
  })
})


describe('An ordered list', () => {
  it('is evaluated for inline conventions', () => {
    const text = `
# Hello, World *1-2*!
# Goodbye, World *1-2*!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, World '),
              new EmphasisNode([
                new PlainTextNode('1-2')
              ]),
              new PlainTextNode('!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, World '),
              new EmphasisNode([
                new PlainTextNode('1-2')
              ]),
              new PlainTextNode('!')
            ])
          ])
        ]),
      ])
    )
  })

  it('can be directly followed by a paragraph', () => {
    const text = `
# Hello, world!
# Goodbye, world!
Hello, World 1-2!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ]),
        new ParagraphNode([
          new PlainTextNode('Hello, World 1-2!')
        ])
      ])
    )
  })
})


describe('An indented line immediately following an ordered list item line', () => {
  it('is part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const text = `
# Hello, world!
  ============
# Roses are red
  Violets are blue`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1)
          ]),
          new OrderedListNode.Item([
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
      ])
    )
  })
})


describe('Multiple indented or blank lines immediately following an ordered list item line', () => {
  it('are part of the that list item, and the list item as a whole is evaluated for outline conventions', () => {
    const text = `
# Hello, world!
  ============

  It is really late, and I am really tired.

  Really.

# Goodbye, world!
  ===============`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
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
          new OrderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 1)
          ])
        ])
      ])
    )
  })
})


describe('An ordered list item containing multiple indented lines', () => {
  it('does not need a blank line to separate it from the following list item', () => {
    const itemsWithSeparator = `
# Hello, world!
  =============

  It is really late, and I am really tired.
# Goodbye, world!
  ===============`
  
    const itemsWithoutSeparator = `
# Hello, world!
  =============

  It is really late, and I am really tired.

# Goodbye, world!
  ===============`
    expect(Up.toAst(itemsWithoutSeparator)).to.be.eql(Up.toAst(itemsWithSeparator))
  })

  it('can contain a nested ordered list that uses the same type of bullet used by its containing list item', () => {
    const text = `
# Hello, world!
  =============

  Upcoming features:
  
  # Code blocks in list items
  # Definition lists

# Goodbye, world!
  ===============`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Hello, world!')
            ], 1),
            new ParagraphNode([
              new PlainTextNode('Upcoming features:')
            ]),
            new OrderedListNode([
              new OrderedListNode.Item([
                new ParagraphNode([
                  new PlainTextNode('Code blocks in list items')
                ])
              ]),
              new OrderedListNode.Item([
                new ParagraphNode([
                  new PlainTextNode('Definition lists')
                ])
              ])
            ])
          ]),
          new OrderedListNode.Item([
            new HeadingNode([
              new PlainTextNode('Goodbye, world!')
            ], 1)
          ])
        ])
      ])
    )
  })
})


context('Subsequent lines in an ordered list item must be indented.', () => {
  context('The indentation must be at least:', () => {
    specify('Two spaces', () => {
      const text = `
# Roses are red
  Violets are blue`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
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
        ])
      )
    })

    specify('One tab', () => {
      const text = `
# Roses are red
\tViolets are blue`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
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
        ])
      )
    })

    specify('One space folled by one tab', () => {
      const text = `
# Roses are red
 \tViolets are blue`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new OrderedListNode([
            new OrderedListNode.Item([
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
        ])
      )
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

    expect(Up.toAst(withMixedIndentation)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
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
          new OrderedListNode.Item([
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
      ])
    )
  })
})