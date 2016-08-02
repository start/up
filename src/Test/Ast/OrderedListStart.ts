import { expect } from 'chai'
import Up from '../../index'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'


function listStart(textForOrderedList: string): number {
  const list = Up.toAst(textForOrderedList).children[0] as OrderedListNode
  return list.start()
}


describe('An ordered list that does not start with a numeral bullet', () => {
  it('does not have an explicit starting ordinal', () => {
    const text = `
#. Hello, world!
# Goodbye, world!
#) Goodbye, world!`

    expect(listStart(text)).to.be.undefined
  })

  it('does not have an explicit starting ordinal even if the second list item has a numeral bullet', () => {
    const text = `
#. Hello, world!
5) Goodbye, world!
#) Goodbye, world!`

    expect(listStart(text)).to.be.undefined
  })
})


describe('An ordered list that starts with a numeral bullet', () => {
  it('has an explicit starting ordinal equal to the numeral value', () => {
    const text = `
10) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(text)).to.be.eql(10)
  })
})


describe('An ordered list starting ordinal', () => {
  it('can be very high', () => {
    const text = `
9999) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(text)).to.be.eql(9999)
  })

  it('can be zero', () => {
    const text = `
0) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(text)).to.be.eql(0)
  })

  it('can be negative', () => {
    const text = `
-5) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(text)).to.be.eql(-5)
  })
})
