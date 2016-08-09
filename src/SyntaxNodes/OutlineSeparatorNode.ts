import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class OutlineSeparatorNode implements OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected SECTION_SEPARATOR_NODE(): void { }
}
