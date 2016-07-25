import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('An ordered list with a single item', () => {
  it('can be sandwched by identical section separator streaks without producing a heading', () => {
    const text = `
-----------
# Mittens
-----------`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})


describe('An ordered list followed by 2 blank lines followed by another ordered list', () => {
  it('produce two separate ordered lists', () => {
    const text = `
# Iowa
# New Hampshire


# Clinton
# Sanders`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Iowa')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('New Hampshire')
            ])
          ])
        ]),
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Clinton')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Sanders')
            ])
          ])
        ]),
      ]))
  })
})


describe('An ordered list followed by 3 blank lines followed by another ordered list', () => {
  it('produce an ordered list, a section separator, and another ordered list', () => {
    const text = `
# Iowa
# New Hampshire



# Clinton
# Sanders`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Iowa')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('New Hampshire')
            ])
          ])
        ]),
        new SectionSeparatorNode(),
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Clinton')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Sanders')
            ])
          ])
        ]),
      ]))
  })
})


context('An ordered list item ordinal can have leading 0 digits without affecting the ordinal itself', () => {
  specify('when positive', () => {
    const text = `
0010) Hello, world!
#. Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ], 10),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('when negative', () => {
    const text = `
-0020) Hello, world!
#) Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ], -20),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })

  specify('when zero', () => {
    const text = `
000) Hello, world!
#) Goodbye, world!`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Hello, world!')
            ])
          ], 0),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Goodbye, world!')
            ])
          ])
        ])
      ]))
  })
})


context("When an ordered list has just one item, that item can start with an integer followed by a period. The single item can be bulleted by:", () => {
  specify('An integer followed by a closing parenthesis', () => {
    expect(Up.toAst('1) 1783. Not a good year for Great Britain.')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('1783. Not a good year for Great Britain.')
            ])
          ], 1)
        ])
      ]))
  })

  specify('A number sign', () => {
    expect(Up.toAst('# 1783. Not a good year for Great Britain.')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('1783. Not a good year for Great Britain.')
            ])
          ])
        ])
      ]))
  })

  specify('A number sign followed by a period', () => {
    expect(Up.toAst('#. 1783. Not a good year for Great Britain.')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('1783. Not a good year for Great Britain.')
            ])
          ])
        ])
      ]))
  })

  specify('A number sign followed by a closing parenthesis', () => {
    expect(Up.toAst('#) 1783. Not a good year for Great Britain.')).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('1783. Not a good year for Great Britain.')
            ])
          ])
        ])
      ]))
  })
})
