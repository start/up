import { UpDocument } from './UpDocument'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getText } from './getText'
import { Writer } from '../Writing/Writer'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode, UpDocument.TableOfContents.Entry {
  public level: number
  public ordinalInTableOfContents: number = undefined
  public sourceLineNumber: number = undefined

  constructor(
    children: InlineSyntaxNode[],
    options: {
      level: number
      ordinalInTableOfContents?: number
      sourceLineNumber?: number
    }
  ) {
    super(children)

    this.level = options.level
    this.ordinalInTableOfContents = options.ordinalInTableOfContents
    this.sourceLineNumber = options.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  text(): string {
    return getText(this.children)
  }

  tableOfContentsRepresentation(): InlineSyntaxNode[] {
    return this.children
  }

  write(writer: Writer): string {
    return writer.heading(this)
  }
}
