import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { concat } from '../../CollectionHelpers'


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
): void {
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



export function expectEveryPermutation(
  args: {
    contentToWrapInBrackets: string
    urlSegments: UrlSegment[]
    toProduce: DocumentNode
  }
): void {
  const BRACKETS = [
    { open: '(', close: ')' },
    { open: '[', close: ']' },
    { open: '{', close: '}' }
  ]

  const { contentToWrapInBrackets, toProduce } = args

  const urlSegments = args.urlSegments.map(urlSegment => <UrlSegment>{
    prefixes: urlSegment.prefixes || [''],
    urlToWrapInBrackets: urlSegment.urlToWrapInBrackets
  })

  for (const contentBracket of BRACKETS) {
    const bracktedContent = wrapInBracket(contentToWrapInBrackets, contentBracket)

    const permutationsByUrlSegment =
      urlSegments.map(urlSegment =>
        concat(
          urlSegment.prefixes.map(prefix =>
            BRACKETS.map(bracket =>
              prefix + wrapInBracket(urlSegment.urlToWrapInBrackets, bracket)))))

    for (const permutation of everyPermutation('', permutationsByUrlSegment)) {
      expect(Up.toAst(bracktedContent + permutation)).to.be.eql(toProduce)
    }
  }
}

function everyPermutation(prefix: string, permutationsBySegment: string[][]): string[] {
  if (permutationsBySegment.length === 1) {
    return permutationsBySegment[0].map(permutation => prefix + permutation)
  }

  return concat(
    permutationsBySegment[0].map(permutation =>
      everyPermutation(prefix + permutation, permutationsBySegment.slice(1))))
}


export interface UrlSegment {
  prefixes: string[],
  urlToWrapInBrackets: string
}

export interface Bracket {
  open: string
  close: string
}

function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}
