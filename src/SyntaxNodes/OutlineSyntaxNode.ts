import { Heading } from './Heading'


export interface OutlineSyntaxNode {
  sourceLineNumber: number
  shouldBeIncludedInTableOfContents(): boolean
  descendantsToIncludeInTableOfContents(): Heading[]
}
