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
  expectEveryPermutation({
    contentToWrapInBrackets: args.contentToWrapInBrackets,
    urlSegments: [{
      prefixes: args.partsToPutInBetween,
      urlToWrapInBrackets: args.urlToWrapInBrackets
    }],
    toProduce: args.toProduce
  })
}


const BRACKETS = [
  { open: '(', close: ')' },
  { open: '[', close: ']' },
  { open: '{', close: '}' }
]

export function expectEveryPermutation(
  args: {
    contentToWrapInBrackets: string
    urlSegments: UrlSegment[]
    toProduce: DocumentNode
  }
): void {
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

    for (const permutation of everyPermutation(bracktedContent, permutationsByUrlSegment)) {
      expect(Up.toAst(permutation)).to.be.eql(toProduce)
    }
  }
}


function everyPermutation(prefix: string, permutationsBySegment: string[][]): string[] {
  return (
    permutationsBySegment.length === 1
      ? permutationsBySegment[0].map(permutation => prefix + permutation)
      : concat(
        permutationsBySegment[0].map(permutation =>
          everyPermutation(prefix + permutation, permutationsBySegment.slice(1))))
  )
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
