import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class Blockquote extends RichOutlineSyntaxNode {
  // As a rule, we don't want to include any blockquoted content in the table of contents.
  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected BLOCKQUOTE(): void { }
}
