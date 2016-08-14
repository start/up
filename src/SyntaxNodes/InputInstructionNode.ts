import { InlineSyntaxNode } from './InlineSyntaxNode'


export class InputInstructionNode implements InlineSyntaxNode {
  constructor(public input: string) { }

  inlineTextContent(): string {
    return this.input
  }

  protected INPUT_INSTRUCTION(): void { }
}
