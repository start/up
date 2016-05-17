import { expect } from 'chai'
import Up from '../../index'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'

function listStart(text: string): number {
  const list = <OrderedListNode>Up.toAst(text).children[0]
  return list.start()
}


describe('An ordered list that does not start with a numeral bullet', () => {
  it('does not have an explicit starting ordinal', () => {
    const text =
      `
#. Hello, world!
# Goodbye, world!
#) Goodbye, world!`
    expect(listStart(text)).to.be.eql(null)
  })

  it('does not have an explicit starting ordinal even if the second list item has a numeral bullet', () => {
    const text =
      `
#. Hello, world!
5) Goodbye, world!
#) Goodbye, world!`
    expect(listStart(text)).to.be.eql(null)
  })
})


describe('An ordered list that starts with a numeral bullet', () => {
  it('has an explicit starting ordinal equal to the numeral value', () => {
    const text =
      `
10) Hello, world!
#. Goodbye, world!
#) Goodbye, world!`
    expect(listStart(text)).to.be.eql(10)
  })
})
