export abstract class SyntaxNode {
  constructor(public children: SyntaxNode[] = []) {
    if (this.children) {
      for (let child of this.children) {
        child.parent = this;
      }
    }
  }

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
}