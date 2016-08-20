import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class OutlineSeparator implements OutlineSyntaxNode {
  constructor(public sourceLineNumber: number = undefined) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected OUTLINE_SEPARATOR(): void { }
}
