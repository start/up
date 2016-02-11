import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface SyntaxNodeType {
  new (parentNode?: RichSyntaxNode): SyntaxNode
}

export abstract class SyntaxNode {
  children: SyntaxNode[]
  
  constructor();
  constructor(public parentNode?: RichSyntaxNode) {
  }
  
  abstract text(): string

  ancestors(): RichSyntaxNode[] {
    if (this.parentNode === null) {
      return [];
    }

    return [this.parentNode].concat(this.parentNode.ancestors())
  }

  plusAllAncestors(): SyntaxNode[] {
    return [<SyntaxNode>this].concat(<SyntaxNode[]>this.ancestors())
  }

  orAnyAncestor(predicate: (node: SyntaxNode) => boolean) {
    return this.plusAllAncestors().some(predicate)
  }
}


function top<T>(items: T[]): T {
  return items[items.length - 1]
}