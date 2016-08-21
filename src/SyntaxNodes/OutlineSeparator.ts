import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class OutlineSeparator implements OutlineSyntaxNode {
  constructor(public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  protected OUTLINE_SEPARATOR(): void { }
}
