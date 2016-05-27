import { expect } from 'chai'
import Up from '../../index'

import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

export function expectEveryCombinationOf(
  args: {
    firstHalves: string[],
    secondHalves: string[],
    toProduce: SyntaxNode
  }) {
    const { firstHalves, secondHalves, toProduce } = args
    
    for (const firstHalf of firstHalves) {
      for (const secondHalf of secondHalves) {
        expect(firstHalf + secondHalf).to.be.equal(toProduce)
      }
    }
  }