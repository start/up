import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class CodeBlockNode implements OutlineSyntaxNode {
  constructor(public code: string, public sourceLineNumber: number = undefined) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected CODE_BLOCK_NODE(): void { }
}
