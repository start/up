import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class ParagraphNode extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(children: InlineSyntaxNode[], public sourceLineNumber: number = undefined) {
    super(children)
  }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected PARAGRAPH_NODE(): void { }
}
