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

export function expectEveryPermutationOfBracketsAroundContentAndUrl(
  args: {
    content: string
    partsBetweenContentAndUrl?: string[]
    url: string
    toProduce: DocumentNode
  }
): void {
  expectEveryPermutationOfBrackets({
    contentToWrapInBrackets: args.content,
    urlSegments: [{
      prefixes: args.partsBetweenContentAndUrl,
      urlToWrapInBrackets: args.url
    }],
    toProduce: args.toProduce
  })
}


const BRACKETS = [
  { open: '(', close: ')' },
  { open: '[', close: ']' },
  { open: '{', close: '}' }
]

export function expectEveryPermutationOfBrackets(
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


// Returns every permutation of the different values for each segment, each prefixed by `prefix`. 
//
// If `prefix` is '(image: puppy)', and if `permutationsBySegment` is:
//
// [
//   ['(dog.gif)', '{dog.gif}'],
//   ['(pets.com/gallery)', '{pets.com/gallery}', ' \t (pets.com/gallery)', ' \t {pets.com/gallery}']
// ]
//
// Then the results are:
//
// (image: puppy)(dog.gif)(pets.com/gallery)
// (image: puppy)(dog.gif){pets.com/gallery}
//
// (image: puppy)(dog.gif) \t (pets.com/gallery)
// (image: puppy)(dog.gif) \t {pets.com/gallery}
//
// (image: puppy){dog.gif}(pets.com/gallery)
// (image: puppy){dog.gif}{pets.com/gallery}
//
// (image: puppy){dog.gif} \t (pets.com/gallery)
// (image: puppy){dog.gif} \t {pets.com/gallery}
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
  prefixes?: string[],
  urlToWrapInBrackets: string
}

export interface Bracket {
  open: string
  close: string
}

function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}
