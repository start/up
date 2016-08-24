import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getTextAppearingInline } from './getTextAppearingInline'
import { getSearchableText } from './getSearchableText'
import { Writer } from '../Writing/Writer'


export abstract class RichInlineSyntaxNode extends InlineSyntaxNodeContainer implements InlineSyntaxNode {
  textAppearingInline(): string {
    return getTextAppearingInline(this.children)
  }

  searchableText(): string {
    return getSearchableText(this.children)
  }

  abstract write(writer: Writer): string
}
