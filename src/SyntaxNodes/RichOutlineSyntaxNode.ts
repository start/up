import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export abstract class RichOutlineSyntaxNode extends OutlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(children: OutlineSyntaxNode[], public sourceLineNumber?: number) {
    super(children)
  }

  abstract shouldBeIncludedInTableOfContents(): boolean
}
