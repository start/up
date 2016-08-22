import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class PlainText implements InlineSyntaxNode {
  constructor(public content: string) { }

  text(): string {
    return this.content
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  write(writer: Writer): string {
    return writer.plainText(this)
  }

  protected PLAIN_TEXT(): void { }
}
