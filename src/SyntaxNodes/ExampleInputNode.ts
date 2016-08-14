import { InlineSyntaxNode } from './InlineSyntaxNode'


// Its HTML equivalent is the `<kbd>` element.
export class ExampleInputNode implements InlineSyntaxNode {
  constructor(public input: string) { }

  inlineTextContent(): string {
    return this.input
  }

  protected INPUT_INSTRUCTION(): void { }
}
