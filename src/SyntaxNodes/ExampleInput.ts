import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Writer } from '../Writing/Writer'


// Its HTML equivalent is the `<kbd>` element.
export class ExampleInput implements InlineSyntaxNode {
  constructor(public input: string) { }

  inlineText(): string {
    return this.input
  }

  searchableText(): string {
    return this.input
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  write(writer: Writer): string {
    return writer.exampleInput(this)
  }
}
