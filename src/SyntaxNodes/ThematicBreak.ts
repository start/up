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

  render(renderer: Renderer): string {
    return renderer.thematicBreak(this)
  }

  protected THEMATIC_BREAK(): void { }
}
