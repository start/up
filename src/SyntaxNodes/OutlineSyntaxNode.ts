export interface OutlineSyntaxNode {
  sourceLineNumber: number
  shouldBeIncludedInTableOfContents(): boolean
  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[]
}
