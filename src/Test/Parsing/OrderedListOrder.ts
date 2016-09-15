import { expect } from 'chai'
import * as Up from '../../index'


describe('An ordered list with non-numeral bullets', () => {
  it('is automatically in ascending order', () => {
    const markup = `
# Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
  })
})


describe('An ordered list with non-numeral bullets and a single numeral bullet', () => {
  it('is automatically in ascending order', () => {
    const markup = `
# Hello, world!
2. Goodbye, world!
#) Goodbye, world!`

    expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
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

    expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
  })

  it('is descending if the 2 numeral bullets are descending', () => {
    const markup = `
# Hello, world!
5. Goodbye, world!
#) Goodbye, world!
#) Goodbye, world!
1) Goodbye, world!`

    expectListOrderToBe(Up.OrderedList.Order.Descrending, markup)
  })
})


context('An ordered list with 2 non-numeral bullets', () => {
  context('is ascending when', () => {
    specify('the 2 numeral bullets are positive and ascending', () => {
      const markup = `
2. Hello, world!
4) Goodbye, world!`

      expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
    })

    specify('the 2 numeral bullets are negative and ascending', () => {
      const markup = `
-2. Hello, world!
-1) Goodbye, world!`

      expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
    })

    specify('the first numeral bullet is negative and the second is positive, even if the absolute value of the second numeral is less', () => {
      const markup = `
-2. Hello, world!
1) Goodbye, world!`

      expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
    })
  })

  context('is descending when', () => {
    specify('the 2 numeral bullets are positive descending', () => {
      const markup = `
5. Hello, world!
1) Goodbye, world!`

      expectListOrderToBe(Up.OrderedList.Order.Descrending, markup)
    })

    specify('the 2 numeral bullets are negative and descending', () => {
      const markup = `
-2. Hello, world!
-3) Goodbye, world!`

      expectListOrderToBe(Up.OrderedList.Order.Descrending, markup)
    })

    specify('the first numeral bullet is positive and the second is negative, even if the absolute value of the first numeral is less', () => {
      const markup = `
1. Hello, world!
-2) Goodbye, world!`

      expectListOrderToBe(Up.OrderedList.Order.Descrending, markup)
    })
  })
})


describe('An ordered list with more than 2 numeral bullets', () => {
  it('is ascending if the first 2 numeral bullets are ascending', () => {
    const markup = `
2. Hello, world!
4) Goodbye, world!
1. Goodbye, world!`

    expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
  })

  it('is descending if the first 2 numeral bullets are descending', () => {
    const markup = `
5. Hello, world!
4) Goodbye, world!
10. Goodbye, world!`

    expectListOrderToBe(Up.OrderedList.Order.Descrending, markup)
  })
})


context('When the starting ordinal is negative', () => {
  specify('the list is still ascending by default', () => {
    const markup = `
-5) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expectListOrderToBe(Up.OrderedList.Order.Ascending, markup)
  })
})


function expectListOrderToBe(order: Up.OrderedList.Order, orderedListMarkup: string): void {
  expect(listOrder(orderedListMarkup)).to.equal(order)
}


function listOrder(orderedListMarkup: string): Up.OrderedList.Order {
  const list =
    Up.parse(orderedListMarkup).children[0] as Up.OrderedList

  return list.order()
}
