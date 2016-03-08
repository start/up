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
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'

function listOrder(text: string): ListOrder {
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

describe('An ordered list with non-numeral bullets and 2 single numeral bullet', () => {
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const text =
      `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!
4) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Ascending)
  })
  
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const text =
      `
# Hello, world!
5. Goodbye, world!
#) Goodbye, world!
1) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Descrending)
  })
})

describe('An ordered list with 2 non-numeral bullets', () => {
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const text =
      `
2. Hello, world!
4) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Ascending)
  })
  
  it('is descending if the 2 numeral bullets are descending', () => {
    const text =
      `
5. Hello, world!
1) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Descrending)
  })
})

describe('An ordered list with more than 2 numeral bullets', () => {
  it('is ascending if the first 2 numeral bullets are ascending', () => {
    const text =
      `
2. Hello, world!
4) Goodbye, world!
1. Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Ascending)
  })
  
  it('is descending if the first 2 numeral bullets are descending', () => {
    const text =
      `
5. Hello, world!
4) Goodbye, world!
10. Goodbye, world!`
    expect(listOrder(text)).to.be.eql(ListOrder.Descrending)
  })
})