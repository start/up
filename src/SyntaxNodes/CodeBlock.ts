import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { Renderer } from '../Rendering/Renderer'


export class CodeBlock implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(public code: string, options?: { sourceLineNumber: number }) {
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
    return renderer.codeBlock(this)
  }

  protected CODE_BLOCK(): void { }
}
