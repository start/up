import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class OutlineSeparatorNode implements OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected OUTLINE_SEPARATOR_NODE(): void { }
}
