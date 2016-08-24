import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { Renderer } from '../Rendering/Renderer'


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

  write(writer: Renderer): string {
    return writer.thematicBreak(this)
  }

  protected THEMATIC_BREAK(): void { }
}
