import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'


export class CodeBlock implements OutlineSyntaxNode {
  constructor(
    public code: string,
    public sourceLineNumber: number = undefined) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected CODE_BLOCK(): void { }
}
