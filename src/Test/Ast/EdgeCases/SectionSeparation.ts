import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../../SyntaxNodes/OrderedListItem'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'


describe('A section separator streak', () => {
  it('can directly precede a heading with different characters in its underline', () => {
    const text = `
- - - - - - - - - - - 
Not me. Us!
@---------@`
    expect(Up.toAst(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new HeadingNode([
          new PlainTextNode('Not me. Us!')
        ], 1)
      ]))
  })

  it('can directly precede a heading with the same characters in its underline, as long as that heading has an overline', () => {
    const text = `
---------------------------------
-----------
Not me. Us!
-----------`
    expect(Up.toAst(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new HeadingNode([
          new PlainTextNode('Not me. Us!')
        ], 1)
      ]))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('produces a single section separator node rather than a heavily nested list', () => {
    const text = '* * * * * *'
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('produces a single section separator node rather than a heavily nested list', () => {
    const text = '# # # # # #'
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('can directly follow an unordered list', () => {
    const text = `
* Mittens
* Gloves
* * * * * *`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ]),
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Gloves')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('can directly follow an ordered list', () => {
    const text = `
# Mittens
# Gloves
# # # # # #`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ]),
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode('Gloves')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})
