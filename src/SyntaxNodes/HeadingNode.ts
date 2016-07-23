import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class HeadingNode implements OutlineSyntaxNode {
  constructor(public children?: InlineSyntaxNode[], public level?: number) { }

  OUTLINE_SYNTAX_NODE(): void { }
  protected HEADING_NODE(): void { }
}
