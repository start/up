import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { OutlineSeparatorNode } from '../../../SyntaxNodes/OutlineSeparatorNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'


describe('An outline separator streak', () => {
  it('can directly precede a heading with different characters in its underline', () => {
    const markup = `
- - - - - - - - - - - 
Not me. Us!
@---------@`
    expect(Up.toDocument(markup)).to.eql(
      new UpDocument([
        new OutlineSeparatorNode(),
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
    expect(Up.toDocument(markup)).to.eql(
      new UpDocument([
        new OutlineSeparatorNode(),
        new HeadingNode([
          new PlainTextNode('Not me. Us!')
        ], 1)
      ]))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('produces a single outline separator node rather than a heavily nested list', () => {
    const markup = '* * * * * *'
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparatorNode()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('produces a single outline separator node rather than a heavily nested list', () => {
    const markup = '# # # # # #'
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparatorNode()
      ]))
  })
})


describe('A streak of asterisks with spaces between', () => {
  it('can directly follow an unordered list', () => {
    const markup = `
* Mittens
* Gloves
* * * * * *`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
        new OutlineSeparatorNode()
      ]))
  })
})


describe('A streak of number signs with spaces between', () => {
  it('can directly follow an ordered list', () => {
    const markup = `
# Mittens
# Gloves
# # # # # #`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
        new OutlineSeparatorNode()
      ]))
  })
})
