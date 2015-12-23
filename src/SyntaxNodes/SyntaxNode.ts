export abstract class SyntaxNode {
  constructor(public children: SyntaxNode[]) { }
  
  text(): string {
    return this.children.reduce((text, child) => text + child.text(), '')
  }
}