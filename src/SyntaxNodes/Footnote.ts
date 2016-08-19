import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


export class Footnote extends RichInlineSyntaxNode {
  constructor(children: InlineSyntaxNode[], public referenceNumber?: number) {
    super(children)
  }

  // Footnotes are written inline, but they aren't meant to appear inline in the final document.
  // That would defeat the purpose of footnotes! Instead, footnotes are extracted and placed in
  // footnote blocks.
  //
  // This process is fully explained in `insertFootnoteBlocksAndAssignFootnoteReferenceNumbers.ts`.
  //
  // Long story short: footnotes don't represent inline content, so this method just returns an
  // empty string.
  text(): string {
    return ''
  }
}
