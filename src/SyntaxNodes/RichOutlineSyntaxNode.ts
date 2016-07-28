import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export abstract class RichOutlineSyntaxNode extends OutlineSyntaxNodeContainer implements OutlineSyntaxNode {
  OUTLINE_SYNTAX_NODE(): void { }
}
