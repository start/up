import { expect } from 'chai'
import Up from '../../index'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'


function listStart(textForOrderedList: string): number {
  const list = Up.toAst(textForOrderedList).children[0] as OrderedListNode
  return list.start()
}


describe('An ordered list that does not start with a numeral bullet', () => {
  it('does not have an explicit starting ordinal', () => {
    const markup = `
#. Hello, world!
# Goodbye, world!
#) Goodbye, world!`

    expect(listStart(markup)).to.be.undefined
  })

  it('does not have an explicit starting ordinal even if the second list item has a numeral bullet', () => {
    const markup = `
#. Hello, world!
5) Goodbye, world!
#) Goodbye, world!`

    expect(listStart(markup)).to.be.undefined
  })
})


describe('An ordered list that starts with a numeral bullet', () => {
  it('has an explicit starting ordinal equal to the numeral value', () => {
    const markup = `
10) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(markup)).to.be.eql(10)
  })
})


describe('An ordered list starting ordinal', () => {
  it('can be very high', () => {
    const markup = `
9999) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(markup)).to.be.eql(9999)
  })

  it('can be zero', () => {
    const markup = `
0) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(markup)).to.be.eql(0)
  })

  it('can be negative', () => {
    const markup = `
-5) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`

    expect(listStart(markup)).to.be.eql(-5)
  })
})
