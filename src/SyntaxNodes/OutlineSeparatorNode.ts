import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class OutlineSeparatorNode implements OutlineSyntaxNode {
  constructor(public sourceLineNumber: number = undefined) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected OUTLINE_SEPARATOR_NODE(): void { }
}
