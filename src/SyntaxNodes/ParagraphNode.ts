import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class ParagraphNode extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected PARAGRAPH_NODE(): void { }
}
