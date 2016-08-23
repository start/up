import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { Writer } from '../Writing/Writer'


export class ThematicBreak implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  write(writer: Writer): string {
    return writer.outlineSeparator(this)
  }

  protected OUTLINE_SEPARATOR(): void { }
}
