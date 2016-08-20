import { Heading } from './Heading'


export interface OutlineSyntaxNode {
  sourceLineNumber: number
  descendantHeadingsToIncludeInTableOfContents(): Heading[]
}
