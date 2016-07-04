import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'


export function insideDocumentAndParagraph(nodes: InlineSyntaxNode[]): DocumentNode {
  return new DocumentNode([
    new ParagraphNode(nodes)
  ])
}

export function expectEveryCombinationOfBrackets(
  args: {
    contentToWrapInBrackets: string
    partsToPutInBetween?: string[]
    urlToWrapInBrackets: string
    toProduce: DocumentNode
  }
) {
  const BRACKETS = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' }
  ]

  const { contentToWrapInBrackets, urlToWrapInBrackets, toProduce } = args
  const partsToPutInBetween = args.partsToPutInBetween || ['']

  for (const bracketForFirstPart of BRACKETS) {
    for (const bracketForSecondPart of BRACKETS) {
      for (const partToPutInBetween of partsToPutInBetween) {
        const text =
          wrapInBracket(contentToWrapInBrackets, bracketForFirstPart)
          + partToPutInBetween
          + wrapInBracket(urlToWrapInBrackets, bracketForSecondPart)

        expect(Up.toAst(text)).to.be.eql(toProduce)
      }
    }
  }
}

export interface Bracket {
  open: string
  close: string
}

function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}
