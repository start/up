import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  public level: number
  public sourceLineNumber: number

  constructor(
    children: InlineSyntaxNode[],
    options: {
      level: number,
      sourceLineNumber?: number
    }
  ) {
    super(children)

    this.level = options.level
    this.sourceLineNumber = options.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }
}
