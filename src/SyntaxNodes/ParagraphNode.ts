import { InlineSyntaxNode } from './InlineSyntaxNode'


export class ParagraphNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public children: InlineSyntaxNode[]) { }

  protected PARAGRAPH_NODE(): void { }
}
