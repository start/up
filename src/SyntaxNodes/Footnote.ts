import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Footnote extends RichInlineSyntaxNode {
  public referenceNumber: number

  constructor(
    children: InlineSyntaxNode[],
    options?: { referenceNumber: number }
  ) {
    super(children)

    if (options) {
      this.referenceNumber = options.referenceNumber
    }
  }

  // Footnotes are written inline, but they aren't meant to appear inline in the final document.
  // That would defeat the purpose of footnotes! Instead, footnotes are extracted and placed in
  // footnote blocks.
  //
  // This process is fully explained in `finalizeDocument.ts`.
  //
  // Long story short: footnotes don't represent inline content, so this method just returns an
  // empty string.
  textAppearingInline(): string {
    return ''
  }

  render(renderer: Renderer): string {
    return renderer.referenceToFootnote(this)
  }
}
