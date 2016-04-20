import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Footnote } from './Footnote'
import { getFootnotesAndMutateToAddReferences } from './PlaceholderFootnoteReferenceNode'
import { last } from '../Parsing/CollectionHelpers'

export class FootnoteBlockNode extends OutlineSyntaxNode {
  constructor(public children: Footnote[] = []) {
    super()

    // It's contrived, but footnotes can reference other footnotes.
    //
    // For example:
    //
    // Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.)) Really.
    //
    // The nesting can be arbitrarily deep.
    //
    // Any nested footnotes are added to end of the footnote block, after all of the original footnotes. Then, any (doubly)
    // nested footnotes inside of *those* footnotes are added to the end, and the process repeats until no more nested
    // footnotes are found.

    let nextFootnoteReferenceOrdinal = last(this.children).referenceNumber + 1

    for (let footnoteIndex = 0; footnoteIndex < this.children.length; footnoteIndex++) {
      const footnote = this.children[footnoteIndex]

      const nestedFootnotes =
        getFootnotesAndMutateToAddReferences(footnote.children, nextFootnoteReferenceOrdinal)

      this.children.push(...nestedFootnotes)
      nextFootnoteReferenceOrdinal += nestedFootnotes.length
    }
  }

  private FOOTNOTE_BLOCK: any = null
}
