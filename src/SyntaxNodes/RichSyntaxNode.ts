import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export interface RichSyntaxNodeType {
  new (parentOrChildren?: RichSyntaxNode | SyntaxNode[]): RichSyntaxNode
}

export abstract class RichSyntaxNode extends SyntaxNode {
  children: SyntaxNode[] = [];

  constructor(children: SyntaxNode[] = []) {
    super()
    this.addChildren(children)
  }

  ancestors(): RichSyntaxNode[] {
    if (!this.parentNode) {
      return [];
    }

    return [this.parentNode].concat(this.parentNode.ancestors())
  }

  addChildren(nodes: SyntaxNode[]) {
    for (var node of nodes) {
      this.addChild(node)
    }
  }

  addChild(syntaxNode: SyntaxNode) {
    syntaxNode.parentNode = this
    this.children.push(syntaxNode)
  }
}