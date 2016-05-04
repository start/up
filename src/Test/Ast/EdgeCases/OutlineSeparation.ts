import { expect } from 'chai'
import * as Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../../SyntaxNodes/OrderedListItem'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'

  
describe('A section separator streak', () => {
  it('can be directly followed by a heading with a different underline', () => {
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
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode('Mittens')
            ])
          ]),
          new UnorderedListItem([
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
