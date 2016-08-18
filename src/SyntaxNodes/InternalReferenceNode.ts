import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class InternalReferenceNode implements InlineSyntaxNode {
  constructor(
    public textBelongingToReferencedItem: string,
    public referencedItem: OutlineSyntaxNode) { }

  // TODO
  inlineTextContent(): string {
    return ''
  }
}
