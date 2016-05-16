import { expect } from 'chai'
import { Up } from '../../index'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListOrder } from '../../SyntaxNodes/OrderedListOrder'

function listOrder(text: string): OrderedListOrder {
  const list = <OrderedListNode>Up.toAst(text).children[0]
  return list.order()
}

describe('An ordered list with non-numeral bullets', () => {
  it('is automatically in ascending order', () => {
    const text =
      `
# Hello, world!
#. Goodbye, world!
#) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Ascending)
  })
})

describe('An ordered list with non-numeral bullets and a single numeral bullet', () => {
  it('is automatically in ascending order', () => {
    const text =
      `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Ascending)
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
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Ascending)
  })
  
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const text =
      `
# Hello, world!
5. Goodbye, world!
#) Goodbye, world!
1) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Descrending)
  })
})

describe('An ordered list with 2 non-numeral bullets', () => {
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const text =
      `
2. Hello, world!
4) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Ascending)
  })
  
  it('is descending if the 2 numeral bullets are descending', () => {
    const text =
      `
5. Hello, world!
1) Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Descrending)
  })
})

describe('An ordered list with more than 2 numeral bullets', () => {
  it('is ascending if the first 2 numeral bullets are ascending', () => {
    const text =
      `
2. Hello, world!
4) Goodbye, world!
1. Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Ascending)
  })
  
  it('is descending if the first 2 numeral bullets are descending', () => {
    const text =
      `
5. Hello, world!
4) Goodbye, world!
10. Goodbye, world!`
    expect(listOrder(text)).to.be.eql(OrderedListOrder.Descrending)
  })
})
