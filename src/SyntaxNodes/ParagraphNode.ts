import { InlineSyntaxNode } from './InlineSyntaxNode'


export class ParagraphNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected PARAGRAPH: any = null

  constructor(public children: InlineSyntaxNode[]) { }
}
