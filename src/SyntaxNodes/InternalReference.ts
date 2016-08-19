import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class InternalReference implements InlineSyntaxNode {
  constructor(
    public textSnippetFromReferencedItem: string,
    public referencedItem: OutlineSyntaxNode) { }

  // TODO
  text(): string {
    return ''
  }
}
