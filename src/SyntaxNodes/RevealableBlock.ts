import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Document } from './Document'
import { Renderer } from '../Rendering/Renderer'


export class RevealableBlock extends RichOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.revealableBlock(this)
  }

  // As a rule, we don't want to include any revealable (i.e. initially hidden) headings in the
  // table of contents.
  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  protected REVEALABLE_BLOCK(): void { }
}
