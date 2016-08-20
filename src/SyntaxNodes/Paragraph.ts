import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { Heading } from './Heading'


export class Paragraph extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(
    children: InlineSyntaxNode[],
    public sourceLineNumber: number = undefined
  ) {
    super(children)
  }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected PARAGRAPH(): void { }
}
