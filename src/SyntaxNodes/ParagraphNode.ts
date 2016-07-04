import { InlineSyntaxNode } from './InlineSyntaxNode'


export class ParagraphNode {
  OUTLINE_SYNTAX_NODE(): void { }
  private PARAGRAPH: any = null

  constructor(public children: InlineSyntaxNode[] = []) { }
}
