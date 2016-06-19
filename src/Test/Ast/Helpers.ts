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
    bracketsForFirstPart?: Bracket[],
    bracketsForSecondPart?: Bracket[]
    firstPartToWrapInBrackets: string
    partsToPutInBetween?: string[]
    secondPartToWrapInBrackets: string
    toProduce: DocumentNode
  }) {
  const { firstPartToWrapInBrackets, secondPartToWrapInBrackets, toProduce } = args
  const partsToPutInBetween = args.partsToPutInBetween || ['']
  const bracketsForFirstPart = args.bracketsForFirstPart || NORMAL_BRACKETS
  const bracketsForSecondPart = args.bracketsForSecondPart || NORMAL_BRACKETS

  for (const bracketForFirstPart of bracketsForFirstPart) {
    for (const bracketForSecondPart of bracketsForSecondPart) {
      for (const partToPutInBetween of partsToPutInBetween) {
        const text =
          wrapInBracket(firstPartToWrapInBrackets, bracketForFirstPart)
          + partToPutInBetween
          + wrapInBracket(secondPartToWrapInBrackets, bracketForSecondPart)

        expect(Up.toAst(text)).to.be.eql(toProduce)
      }
    }
  }
}


const NORMAL_BRACKETS = [
  { open: '(', close: ')' },
  { open: '[', close: ']' },
  { open: '{', close: '}' }
]


function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}

export interface Bracket {
  open: string
  close: string
}