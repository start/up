import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  text(): string {
    return this.children
      .map(child => child.text())
      .join('')
  }

  INLINE_SYNTAX_NODE(): void { }
}
