import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { Writer } from '../Writing/Writer'


export class Blockquote extends RichOutlineSyntaxNode {
  // As a rule, we don't want to include any blockquoted content in the table of contents.
  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  write(writer: Writer): string {
    return writer.blockquote(this)
  }

  protected BLOCKQUOTE(): void { }
}
