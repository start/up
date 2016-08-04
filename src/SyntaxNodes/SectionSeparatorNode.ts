import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class SectionSeparatorNode implements OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  protected SECTION_SEPARATOR_NODE(): void { }
}
