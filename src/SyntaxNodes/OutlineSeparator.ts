import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class OutlineSeparator implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(options: { sourceLineNumber?: number } = {}) {
    this.sourceLineNumber = options.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  protected OUTLINE_SEPARATOR(): void { }
}
