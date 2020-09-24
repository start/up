import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'


export class RevealableBlock extends RichOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.revealableBlock(this)
  }

  // As a rule, we don't want to include any revealable (i.e. initially hidden) headings in the
  // table of contents.
  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected readonly REVEALABLE_BLOCK = undefined
}
