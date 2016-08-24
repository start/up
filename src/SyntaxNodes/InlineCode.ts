import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Writer } from '../Writing/Writer'


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

  write(writer: Writer): string {
    return writer.inlineCode(this)
  }
}
