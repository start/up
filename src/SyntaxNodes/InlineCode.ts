import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineCode implements InlineSyntaxNode {
  constructor(public code: string) { }

  textAppearingInline(): string {
    return this.code
  }

  searchableText(): string {
    return this.code
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  write(writer: Renderer): string {
    return writer.inlineCode(this)
  }
}
