import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export abstract class SyntaxNode {
  children: SyntaxNode[]
  
  constructor();
  constructor(public parentNode?: RichSyntaxNode) {
  }

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