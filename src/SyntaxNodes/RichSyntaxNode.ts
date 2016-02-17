import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export interface RichSyntaxNodeType {
  new(parentOrChildren?: RichSyntaxNode|SyntaxNode[]): RichSyntaxNode
}

export abstract class RichSyntaxNode extends SyntaxNode {
  children: SyntaxNode[] = [];
  
  constructor(parentNode?: RichSyntaxNode);
  constructor(children?: SyntaxNode[]);
  constructor(parentOrChildren?: RichSyntaxNode|SyntaxNode[]);
  constructor(parentOrChildren?: RichSyntaxNode|SyntaxNode[]) {
    super()
    
    if (parentOrChildren instanceof RichSyntaxNode) {
      this.parentNode = parentOrChildren
    } else if (parentOrChildren) {
      this.addChildren(<SyntaxNode[]>parentOrChildren)
    }
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