import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }
}
