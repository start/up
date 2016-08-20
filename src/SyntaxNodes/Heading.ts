import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getText } from './getText'

export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(
    children: InlineSyntaxNode[],
    public level: number,
    public sourceLineNumber: number = undefined
  ) {
    super(children)
  }

  text(): string {
    return getText(this.children)
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }
}
