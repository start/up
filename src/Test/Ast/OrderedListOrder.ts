/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { LineNode } from '../../SyntaxNodes/LineNode'
import { ListOrder, OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItemNode } from '../../SyntaxNodes/OrderedListItemNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'

function listOrder(text: string): number {
  const list = <OrderedListNode>Up.ast(text).children[0]
  return list.order()
}

describe('An ordered list with non-numeral bullets', () => {
  it('is automatically in ascending order', () => {
    const text =
      `
# Hello, world!
#. Goodbye, world!
#) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Ascending)
  })
})

describe('An ordered list with non-numeral bullets and a single numeral bullet', () => {
  it('is automatically in ascending order', () => {
    const text =
      `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Ascending)
  })
})

describe('An ordered list with non-numeral bullets and two single numeral bullet', () => {
  it('is ascending if the two numeral bullets are ascending', () => {
    const text =
      `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!
4) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Ascending)
  })
})

describe('An ordered list with non-numeral bullets and two single numeral bullet', () => {
  it('is ascending if the two numeral bullets are ascending', () => {
    const text =
      `
# Hello, world!
5. Goodbye, world!
#) Goodbye, world!
1) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Descrending)
  })
})