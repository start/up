import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class ParagraphNode extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected PARAGRAPH_NODE(): void { }
}
