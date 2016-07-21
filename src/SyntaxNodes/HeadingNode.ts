import { InlineSyntaxNode } from './InlineSyntaxNode'


export class HeadingNode{
  OUTLINE_SYNTAX_NODE(): void { }
  protected HEADING: any = null
  
  constructor(public children?: InlineSyntaxNode[], public level?: number) { }
}
