import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export interface SyntaxNodeType {
  new (): SyntaxNode
}

export abstract class SyntaxNode {
  children: SyntaxNode[]

  parent: SyntaxNode = null

  
  ancestors(): SyntaxNode[] {
    if (this.parent === null) {
      return [];
    }
    return [this.parent].concat(this.parent.ancestors())
  }


  abstract text(): string
  
  andAllAncestors(): SyntaxNode[] {
    return [<SyntaxNode>this].concat(this.ancestors())
  }

  
  andAnyAncestors(predicate: (node: SyntaxNode) => boolean) {
    return this.andAllAncestors().some(predicate)
  }
}

function top<T>(items: T[]): T {
  return items[items.length - 1]
}