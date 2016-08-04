import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class CodeBlockNode implements OutlineSyntaxNode {
  constructor(public code: string) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected CODE_BLOCK_NODE(): void { }
}
