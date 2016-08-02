import { expect } from 'chai'
import Up from '../../index'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'


function listOrder(textForOrderedList: string): OrderedListNode.Order {
  const list = Up.toAst(textForOrderedList).children[0] as OrderedListNode
  return list.order()
}


describe('An ordered list with non-numeral bullets', () => {
  it('is automatically in ascending order', () => {
    const text = `
# Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
  })
})


describe('An ordered list with non-numeral bullets and a single numeral bullet', () => {
  it('is automatically in ascending order', () => {
    const text = `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
  })
})


describe('An ordered list with non-bullets bullets between the 2 numeral bullets', () => {
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const text = `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!
#) Goodbye, world!
4) Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
  })

  it('is descending if the 2 numeral bullets are descending', () => {
    const text = `
# Hello, world!
5. Goodbye, world!
#) Goodbye, world!
#) Goodbye, world!
1) Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Descrending)
  })
})


context('An ordered list with 2 non-numeral bullets', () => {
  context('is ascending when', () => {
    specify('the 2 numeral bullets are positive and ascending', () => {
      const text = `
2. Hello, world!
4) Goodbye, world!`

      expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
    })

    specify('the 2 numeral bullets are negative and ascending', () => {
      const text = `
-2. Hello, world!
-1) Goodbye, world!`

      expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
    })

    specify('the first numeral bullet is negative and the second is positive, even if the absolute value of the second numeral is less', () => {
      const text = `
-2. Hello, world!
1) Goodbye, world!`

      expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
    })
  })

  context('is descending when', () => {
    specify('the 2 numeral bullets are positive descending', () => {
      const text = `
5. Hello, world!
1) Goodbye, world!`

      expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Descrending)
    })

    specify('the 2 numeral bullets are negative and descending', () => {
      const text = `
-2. Hello, world!
-3) Goodbye, world!`

      expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Descrending)
    })

    specify('the first numeral bullet is positive and the second is negative, even if the absolute value of the first numeral is less', () => {
      const text = `
1. Hello, world!
-2) Goodbye, world!`

      expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Descrending)
    })
  })
})


describe('An ordered list with more than 2 numeral bullets', () => {
  it('is ascending if the first 2 numeral bullets are ascending', () => {
    const text = `
2. Hello, world!
4) Goodbye, world!
1. Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
  })

  it('is descending if the first 2 numeral bullets are descending', () => {
    const text = `
5. Hello, world!
4) Goodbye, world!
10. Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Descrending)
  })
})


context('When the starting ordinal is negative', () => {
  specify('the list is still ascending by default', () => {
    const text = `
-5) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listOrder(text)).to.be.eql(OrderedListNode.Order.Ascending)
  })
})
