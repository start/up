import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getText } from './getText'
import { Writer } from '../Writing/Writer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  text(): string {
    return getText(this.children)
  }

  abstract write(writer: Writer): string
}
