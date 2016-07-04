import { InlineSyntaxNode } from './InlineSyntaxNode'


export class HeadingNode{
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public children?: InlineSyntaxNode[], public level?: number) { }

  private HEADING: any = null
}
