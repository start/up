import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(
    children: InlineSyntaxNode[],
    public level: number,
    public sourceLineNumber: number = undefined
  ) {
    super(children)
  }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return []
  }
}
