import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { UpDocument } from './UpDocument'


export class Paragraph extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(
    children: InlineSyntaxNode[],
    public sourceLineNumber: number = undefined
  ) {
    super(children)
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected PARAGRAPH(): void { }
}
