export interface OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean
  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[]
}
