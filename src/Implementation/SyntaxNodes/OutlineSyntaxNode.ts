import { Heading } from './Heading'
import { SyntaxNode } from './SyntaxNode'


export interface OutlineSyntaxNode extends SyntaxNode {
  // The first line of markup that produced this syntax node. Source line numbers
  // start at 1, not 0.
  sourceLineNumber?: number

  // Any descendants (children, grandchildren, etc.) to include in the table of
  // contents.
  descendantsToIncludeInTableOfContents(): Heading[]
}
