import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class HeadingNode extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[], public level: number) {
    super(children)
  }

  OUTLINE_SYNTAX_NODE(): void { }
}
