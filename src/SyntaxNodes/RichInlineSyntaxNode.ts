import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getTextAppearingInline } from './getTextAppearingInline'
import { getSearchableText } from './getSearchableText'
import { Renderer } from '../Rendering/Renderer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  textAppearingInline(): string {
    return getTextAppearingInline(this.children)
  }

  searchableText(): string {
    return getSearchableText(this.children)
  }

  abstract write(writer: Renderer): string
}
