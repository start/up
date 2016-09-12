import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Document } from './Document'
import { Renderer } from '../Rendering/Renderer'


export class ThematicBreak implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
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
