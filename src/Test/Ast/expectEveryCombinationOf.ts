import { expect } from 'chai'
import Up from '../../index'

import { DocumentNode } from '../../SyntaxNodes/DocumentNode'

export function expectEveryCombinationOf(
  args: {
    firstHalves: string[],
    secondHalves: string[],
    toBe: DocumentNode
  }) {
    const { firstHalves, secondHalves, toBe } = args
    
    for (const firstHalf of firstHalves) {
      for (const secondHalf of secondHalves) {
        expect(firstHalf + secondHalf).to.be.equal(toBe)
      }
    }
  }