import { Heading } from './Heading'


export interface OutlineSyntaxNode {
  sourceLineNumber: number
  descendantsToIncludeInTableOfContents(): Heading[]
}
