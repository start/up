import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getTextAppearingInline } from './getTextAppearingInline'
import { Renderer } from '../Rendering/Renderer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  textAppearingInline(): string {
    return getTextAppearingInline(this.children)
  }

  abstract render(renderer: Renderer): string
}
