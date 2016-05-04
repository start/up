import { expect } from 'chai'
import * as Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'


describe('Consecutive lines each bulleted by a number sign', () => {
  it('produce an ordered list node containing ordered list item nodes', () => {
    const text =
      `
# Hello, world!
# Goodbye, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new OrderedListItem([
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
    const text =
      `
#. Hello, Lavender Town!
#. Goodbye, Lavender Town!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Lavender Town!')
            ])
          ]),
          new OrderedListItem([
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
    const text =
      `
#) Hello, Celadon City!
#) Goodbye, Celadon City!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ]),
          new OrderedListItem([
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
    const text =
      `
1. Hello, Celadon City!
2. Goodbye, Celadon City!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListItem([
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
    const text =
      `
1) Hello, Celadon City!
2) Goodbye, Celadon City!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),
          new OrderedListItem([
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
    const text =
      `
# Hello, world!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
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
    const text =
      `
#. Hello, Lavender Town!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
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
    const text =
      `
#) Hello, Celadon City!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
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
    const text =
      `
1783. Not a good year for Great Britain.`
    expect(Up.toAst(text)).to.be.eql(
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
    const text =
      `
1) Hello, Celadon City!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
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
    const text =
      `
1. Hello, Celadon City!
2) Hello, Couriway Town!
#) Hello, Cinnabar Island!
#. Hello, Cherrygrove City!
# Hello, Camphrier Town!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Celadon City!')
            ])
          ], 1),    
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Couriway Town!')
            ])
          ], 2),
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Cinnabar Island!')
            ])
          ]),
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, Cherrygrove City!')
            ])
          ]),
          new OrderedListItem([
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
    const text =
      `
# Hello, World *1-2*!
# Goodbye, World *1-2*!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, World '),
              new EmphasisNode([
                new PlainTextNode('1-2')
              ]),
              new PlainTextNode('!')
            ])
          ]),
          new OrderedListItem([
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
    const text =
      `
# Hello, world!
# Goodbye, world!
Hello, World 1-2!`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ]),
          new OrderedListItem([
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
