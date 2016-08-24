import { expect } from 'chai'
import Up from '../../index'
import { OrderedList } from '../../SyntaxNodes/OrderedList'


function listOrder(textForOrderedList: string): OrderedList.Order {
  const list = Up.toDocument(textForOrderedList).children[0] as OrderedList
  return list.order()
}


describe('An ordered list with non-numeral bullets', () => {
  it('is automatically in ascending order', () => {
    const markup = `
# Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
  })
})


describe('An ordered list with non-numeral bullets and a single numeral bullet', () => {
  it('is automatically in ascending order', () => {
    const markup = `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
  })
})


describe('An ordered list with non-bullets bullets between the 2 numeral bullets', () => {
  it('is ascending if the 2 numeral bullets are ascending', () => {
    const markup = `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!
#) Goodbye, world!
4) Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
  })

  it('is descending if the 2 numeral bullets are descending', () => {
    const markup = `
# Hello, world!
5. Goodbye, world!
#) Goodbye, world!
#) Goodbye, world!
1) Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Descrending)
  })
})


context('An ordered list with 2 non-numeral bullets', () => {
  context('is ascending when', () => {
    specify('the 2 numeral bullets are positive and ascending', () => {
      const markup = `
2. Hello, world!
4) Goodbye, world!`

      expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
    })

    specify('the 2 numeral bullets are negative and ascending', () => {
      const markup = `
-2. Hello, world!
-1) Goodbye, world!`

      expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
    })

    specify('the first numeral bullet is negative and the second is positive, even if the absolute value of the second numeral is less', () => {
      const markup = `
-2. Hello, world!
1) Goodbye, world!`

      expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
    })
  })

  context('is descending when', () => {
    specify('the 2 numeral bullets are positive descending', () => {
      const markup = `
5. Hello, world!
1) Goodbye, world!`

      expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Descrending)
    })

    specify('the 2 numeral bullets are negative and descending', () => {
      const markup = `
-2. Hello, world!
-3) Goodbye, world!`

      expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Descrending)
    })

    specify('the first numeral bullet is positive and the second is negative, even if the absolute value of the first numeral is less', () => {
      const markup = `
1. Hello, world!
-2) Goodbye, world!`

      expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Descrending)
    })
  })
})


describe('An ordered list with more than 2 numeral bullets', () => {
  it('is ascending if the first 2 numeral bullets are ascending', () => {
    const markup = `
2. Hello, world!
4) Goodbye, world!
1. Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
  })

  it('is descending if the first 2 numeral bullets are descending', () => {
    const markup = `
5. Hello, world!
4) Goodbye, world!
10. Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Descrending)
  })
})


context('When the starting ordinal is negative', () => {
  specify('the list is still ascending by default', () => {
    const markup = `
-5) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listOrder(markup)).to.deep.equal(OrderedList.Order.Ascending)
  })
})
