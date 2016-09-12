import { expect } from 'chai'
import { Up } from '../../Up'
import { Document } from '../../SyntaxNodes/Document'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { concat } from '../../CollectionHelpers'


export function insideDocumentAndParagraph(nodes: InlineSyntaxNode[]): Document {
  return new Document([
    new Paragraph(nodes)
  ])
}

export function expectEveryPermutationOfBracketsAroundContentAndUrl(
  args: {
    content: string
    partsBetweenContentAndUrl?: string[]
    url: string
    toProduce: Document
  }
): void {
  expectEveryPermutationOfBrackets({
    bracketedSegments: [
      {
        text: args.content
      },
      {
        prefixes: args.partsBetweenContentAndUrl,
        text: args.url
      }],
    toProduce: args.toProduce
  })
}

export function expectEveryPermutationOfBrackets(
  args: {
    precededBy?: string
    bracketedSegments: BracketedSegment[]
    toProduce: Document
  }
): void {
  const { toProduce } = args

  const precededBy = args.precededBy || ''

  const segments = args.bracketedSegments.map(segment => ({
    prefixes: segment.prefixes || [''],
    text: segment.text
  }) as BracketedSegment)

  const BRACKETS = [
    { open: '(', close: ')' },
    { open: '[', close: ']' }
  ]

  const permutationsBySegment =
    segments.map(segment =>
      concat(
        segment.prefixes.map(segmentPrefix =>
          BRACKETS.map(bracket =>
            precededBy + segmentPrefix + wrapInBracket(segment.text, bracket)))))

  for (const permutation of everyPermutation('', permutationsBySegment)) {
    expect(Up.parse(permutation)).to.deep.equal(toProduce)
  }
}


// Returns every permutation of the different values for each segment, each prefixed by `prefix`. 
//
// If `prefix` is '(image: puppy)', and if `valuesBySegment` is:
//
// [
//   ['(dog.gif)', '[dog.gif]'],
//   ['(pets.com/gallery)', '[pets.com/gallery]', ' \t (pets.com/gallery)', ' \t [pets.com/gallery]']
// ]
//
// Then the results are:
//
// [
//   '(image: puppy)(dog.gif)(pets.com/gallery)',
//   '(image: puppy)(dog.gif)[pets.com/gallery]',
//   '(image: puppy)(dog.gif) \t (pets.com/gallery)',
//   '(image: puppy)(dog.gif) \t [pets.com/gallery]',
//   '(image: puppy)[dog.gif](pets.com/gallery)',
//   '(image: puppy)[dog.gif][pets.com/gallery]',
//   '(image: puppy)[dog.gif] \t (pets.com/gallery)',
//   '(image: puppy)[dog.gif] \t [pets.com/gallery]',
// ]
function everyPermutation(prefix: string, valuesBySegment: string[][]): string[] {
  return (
    valuesBySegment.length === 1
      // There's just one segment. This is easy! Let's just add the `prefix` to all values in the segment and
      // return the result.
      ? valuesBySegment[0].map(permutation => prefix + permutation)
      // Well, there's more than one segment.
      //
      // Let's add the `prefix` to all values in the first segment, and then let's treat each of those prefixed
      // values as the `prefix` for another call to this function, passing only the values from the remaining
      // segments.
      //
      // This produces separate arrays of permutations, one for each value in the first segment. So let's combine
      // those arrays into one and return the result.
      : concat(
        valuesBySegment[0].map(permutation =>
          everyPermutation(prefix + permutation, valuesBySegment.slice(1)))))
}


export interface BracketedSegment {
  prefixes?: string[],
  text: string
}

export interface Bracket {
  open: string
  close: string
}

function wrapInBracket(text: string, bracket: Bracket): string {
  return bracket.open + text + bracket.close
}
