import { Renderer } from '../Rendering/Renderer'
import { getTextAppearingInline } from './getTextAppearingInline'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  textAppearingInline(): string {
    return getTextAppearingInline(this.children)
  }

  abstract render(renderer: Renderer): string
}
