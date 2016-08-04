export interface OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean
  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[]
}
