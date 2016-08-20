import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class CodeBlock implements OutlineSyntaxNode {
  constructor(
    public code: string,
    public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected CODE_BLOCK(): void { }
}
