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
      expect(Up.toAst(firstHalf + secondHalf)).to.be.eql(toProduce)
    }
  }
}


export function expectEveryCombinationOfBrackets(
  args: {
    brackets: Bracket[]
    firstPart: string,
    partsToPutInBetween?: string[],
    secondPart: string,
    toProduce: DocumentNode
  }) {
  const { brackets, firstPart, secondPart, toProduce } = args
  const partsToPutInBetween = args.partsToPutInBetween || ['']

  for (const bracketForFirstPart of brackets) {
    for (const bracketForSecondPart of brackets) {
      for (const partToPutInBetween of partsToPutInBetween) {
        const text =
          wrapInBracket(firstPart, bracketForFirstPart)
          + partToPutInBetween
          + wrapInBracket(secondPart, bracketForSecondPart)

        expect(Up.toAst(text)).to.be.eql(toProduce)
      }
    }
  }
}


function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}

interface Bracket {
  open: string
  close: string
}