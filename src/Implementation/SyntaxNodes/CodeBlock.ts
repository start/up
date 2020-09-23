import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class CodeBlock implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(public code: string, options?: { sourceLineNumber: number }) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.codeBlock(this)
  }
}
