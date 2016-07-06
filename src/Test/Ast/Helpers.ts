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

  for (const bracketForContent of BRACKETS) {
    for (const partToPutInBetween of partsToPutInBetween) {
      for (const bracketForUrl of BRACKETS) {
        const text =
          wrapInBracket(contentToWrapInBrackets, bracketForContent)
          + partToPutInBetween
          + wrapInBracket(urlToWrapInBrackets, bracketForUrl)

        expect(Up.toAst(text)).to.be.eql(toProduce)
      }
    }
  }
}



export function expectEveryPermutationOfBrackets(
  args: {
    contentToWrapInBrackets: string
    urlParts: UrlPart[]
    toProduce: DocumentNode
  }
): void {
  const BRACKETS = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' }
  ]

  const { contentToWrapInBrackets, toProduce } = args
  
  const urlParts = args.urlParts.map(urlPart => <UrlPart>{
    separators: urlPart.separators || [''],
    urlToWrapInBrackets: urlPart.urlToWrapInBrackets
  })

   //     expect(Up.toAst(text)).to.be.eql(toProduce)


}


export interface UrlPart {
  separators: string[],
  urlToWrapInBrackets: string
}

export interface Bracket {
  open: string
  close: string
}

function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}
