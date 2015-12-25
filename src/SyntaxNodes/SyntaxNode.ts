export abstract class SyntaxNode {
  constructor(initialChildren: SyntaxNode[] = []) {
    this.children = []
    
    if (initialChildren) {
      this.addChildren(initialChildren);
    }
  }
  
  public children: SyntaxNode[]

  parent: SyntaxNode = null
  
  parents(): SyntaxNode[] {
    if (this.parent === null) {
      return [];
    }
    return [this.parent].concat(this.parent.parents())
  }

  text(): string {
    return this.children.reduce((text, child) => text + child.text(), '')
  }

  addChild(syntaxNode: SyntaxNode) {
    syntaxNode.parent = this
    this.children.push(syntaxNode)
  }

  addChildren(nodes: SyntaxNode[]) {
    for (var node of nodes) {
      node.parent = this;
      this.children.push(node)
    }
  }
}