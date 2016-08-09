export interface OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean
  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[]
  sourceLineNumber: number
}
