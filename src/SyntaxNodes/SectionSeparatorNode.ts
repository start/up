import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class SectionSeparatorNode implements OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected SECTION_SEPARATOR_NODE(): void { }
}
