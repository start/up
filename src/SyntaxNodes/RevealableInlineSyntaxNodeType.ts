import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineRevealableContent } from './InlineRevealableContent'


export interface InlineRevealableContentType {
  new (children: InlineSyntaxNode[]): InlineRevealableContent
}
