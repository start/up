import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export interface SyntaxNodeType {
  new (): SyntaxNode
}

export abstract class SyntaxNode {
  children: SyntaxNode[]
  parentNode: SyntaxNode = null


  ancestors(): SyntaxNode[] {
    if (this.parentNode === null) {
      return [];
    }

    return [this.parentNode].concat(this.parentNode.ancestors())
  }


  abstract text(): string


  plusAllAncestors(): SyntaxNode[] {
    return [<SyntaxNode>this].concat(this.ancestors())
  }


  orAnyAncestor(predicate: (node: SyntaxNode) => boolean) {
    return this.plusAllAncestors().some(predicate)
  }
}

function top<T>(items: T[]): T {
  return items[items.length - 1]
}