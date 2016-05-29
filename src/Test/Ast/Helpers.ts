import { expect } from 'chai'
import Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'

export function insideDocumentAndParagraph(nodes: InlineSyntaxNode[]): DocumentNode {
  return new DocumentNode([
    new ParagraphNode(nodes)
  ])
}

export function expectEveryCombinationOf(
  args: {
    firstHalves: string[],
    secondHalves: string[],
    toProduce: DocumentNode
  }) {
    const { firstHalves, secondHalves, toProduce } = args
    
    for (const firstHalf of firstHalves) {
      for (const secondHalf of secondHalves) {
        expect(Up.toAst(firstHalf + secondHalf)).to.be.equal(toProduce)
      }
    }
  }