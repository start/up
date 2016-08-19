import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class InternalReference implements InlineSyntaxNode {
  constructor(
    public textSnippetFromReferencedItem: string,
    public referencedItem: OutlineSyntaxNode = undefined) { }

  // TODO
  text(): string {
    return ''
  }
}
