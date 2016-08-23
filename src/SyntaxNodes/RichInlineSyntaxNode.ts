import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getInlineText } from './getInlineText'
import { Writer } from '../Writing/Writer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  inlineText(): string {
    return getInlineText(this.children)
  }

  abstract write(writer: Writer): string
}
