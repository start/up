import { Renderer } from '../Rendering/Renderer'
import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class CodeBlock implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(public code: string, options?: { sourceLineNumber: number }) {
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
    return renderer.codeBlock(this)
  }
}
