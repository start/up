import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class BlockquoteNode extends RichOutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }
  
  // As a rule, we don't want to include any blockquoted content in the table of contents.
  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected BLOCKQUOTE_NODE(): void { }
}
