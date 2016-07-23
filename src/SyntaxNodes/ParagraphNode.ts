import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class ParagraphNode implements OutlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
  protected PARAGRAPH_NODE(): void { }
}
