export interface SyntaxNodeType {
  new (): SyntaxNode
}

export abstract class SyntaxNode {
  constructor(initialChildren: SyntaxNode[] = []) {
    this.children = []
    
    if (initialChildren) {
      this.addChildren(initialChildren);
    }
  }
  
  public children: SyntaxNode[]

  parent: SyntaxNode = null
  
  ancestors(): SyntaxNode[] {
    if (this.parent === null) {
      return [];
    }
    return [this.parent].concat(this.parent.ancestors())
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
  
  andAllAncestors(): SyntaxNode[] {
    return [<SyntaxNode>this].concat(this.ancestors())
  }

  isEither(syntaxNodeTypes: SyntaxNodeType[]): boolean {
    return syntaxNodeTypes.some(SyntaxNodeType => this instanceof SyntaxNodeType)
  }
  
  andAnyAncestors(predicate: (node: SyntaxNode) => boolean) {
    return this.andAllAncestors().some(predicate)
  }
}