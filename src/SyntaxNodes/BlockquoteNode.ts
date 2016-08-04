import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'


export class BlockquoteNode extends RichOutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  protected BLOCKQUOTE_NODE(): void { }
}
