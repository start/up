import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export interface RichSyntaxNodeType {
  new (chilren?: SyntaxNode[]): RichSyntaxNode
}

export abstract class RichSyntaxNode extends SyntaxNode {
  children: SyntaxNode[] = [];
  
  constructor(parentNode?: RichSyntaxNode);
  constructor(children?: SyntaxNode[]);
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

  text(): string {
    return this.children.reduce((text, child) => text + child.text(), '')
  }

  addChildren(nodes: SyntaxNode[]) {
    for (var node of nodes) {
      this.addChild(node)
    }
  }
  
  addChild(syntaxNode: SyntaxNode) {
    const topChild = this.children[this.children.length - 1]
    
    // It's much easier to debug and test when consecutive PlainTextNodes are consensed into one.
    if ((syntaxNode instanceof PlainTextNode) && (topChild instanceof PlainTextNode)) {
      topChild.absorb(syntaxNode)
      return 
    }
    
    syntaxNode.parentNode = this
    this.children.push(syntaxNode)
  }
}