import { InlineSyntaxNode } from './InlineSyntaxNode'


export class ParagraphNode {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public children: InlineSyntaxNode[] = []) { }

  private PARAGRAPH: any = null
}
