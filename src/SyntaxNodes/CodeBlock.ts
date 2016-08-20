import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'


export class CodeBlock implements OutlineSyntaxNode {
  constructor(
    public code: string,
    public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected CODE_BLOCK(): void { }
}
