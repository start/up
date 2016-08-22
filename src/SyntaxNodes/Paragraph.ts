import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { UpDocument } from './UpDocument'


export class Paragraph extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined
  
  constructor(children: InlineSyntaxNode[], options?: { sourceLineNumber: number }) {
    super(children)
     
     if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected PARAGRAPH(): void { }
}
