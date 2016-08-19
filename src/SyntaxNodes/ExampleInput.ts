import { InlineSyntaxNode } from './InlineSyntaxNode'


// Its HTML equivalent is the `<kbd>` element.
export class ExampleInput implements InlineSyntaxNode {
  constructor(public input: string) { }

  inlineTextContent(): string {
    return this.input
  }
}
