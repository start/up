import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class CodeBlock implements OutlineSyntaxNode {
  constructor(
    public code: string,
    public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  protected CODE_BLOCK(): void { }
}
