import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'


describe('A section separator streak', () => {
  it('can directly precede a heading with different characters in its underline', () => {
    const markup = `
- - - - - - - - - - - 
Not me. Us!
@---------@`
    expect(Up.toAst(markup)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new HeadingNode([
          new PlainTextNode('Not me. Us!')
        ], 1)
      ]))
  })

  it('can directly precede a heading with the same characters in its underline, as long as that heading has an overline', () => {
    const markup = `
---------------------------------
-----------
Not me. Us!
-----------`
    expect(Up.toAst(markup)).to.eql(
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
    const markup = '* * * * * *'
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('produces a single section separator node rather than a heavily nested list', () => {
    const markup = '# # # # # #'
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('can directly follow an unordered list', () => {
    const markup = `
* Mittens
* Gloves
* * * * * *`
    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
# Mittens
# Gloves
# # # # # #`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ]),
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode('Gloves')
            ])
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})
