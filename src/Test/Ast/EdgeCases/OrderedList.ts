import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('An ordered list with a single item can be sandwched by identical outline separator streaks without producing a heading.', () => {
  context('This includes when the bullet is:', () => {
    specify('A number sign', () => {
      const markup = `
-----------
# Mittens
-----------`

      expect(Up.toAst(markup)).to.be.eql(
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

    specify('A numeral followed by a closing parenthesis', () => {
      const markup = `
-----------
1) Mittens
-----------`

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new SectionSeparatorNode(),
          new OrderedListNode([
            new OrderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode('Mittens')
              ])
            ], 1)
          ]),
          new SectionSeparatorNode()
        ]))
    })
  })


  context("If an ordered list has just one item, that item's bullet can't be a numeral followed by a period.", () => {
    specify('Therefore, such a line produces a heading when sandwiched by identical streaks.', () => {
      const markup = `
----------------------------------------
1783. Not a good year for Great Britain.
----------------------------------------`

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new HeadingNode([
            new PlainTextNode('1783. Not a good year for Great Britain.')
          ], 1)
        ]))
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

    expect(Up.toAst(markup)).to.be.eql(
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
  it('produce an ordered list, an outline separator, and another ordered list', () => {
    const markup = `
# Iowa
# New Hampshire



# Clinton
# Sanders`

    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
0010) Hello, world!
#. Goodbye, world!`

    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
-0020) Hello, world!
#) Goodbye, world!`

    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
000) Hello, world!
#) Goodbye, world!`

    expect(Up.toAst(markup)).to.be.eql(
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

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
        new OrderedListNode([
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're cheap")], 2),
            new ParagraphNode([new PlainTextNode("Very cheap.")])
          ], 1),
          new OrderedListNode.Item([
            new HeadingNode([new PlainTextNode("They're delicious")], 2),
            new ParagraphNode([new PlainTextNode("Very delicious.")])
          ], 2)
        ])
      ]))
  })
})
