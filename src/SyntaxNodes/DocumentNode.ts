import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Sequence } from '../Sequence'


export class DocumentNode extends OutlineSyntaxNodeContainer {
  static withFootnotesPlacedInBlocks(children: OutlineSyntaxNode[]): DocumentNode {
    const documentNode = new DocumentNode(children)

    // Footnotes are written inline, but they aren't meant to appear inline in the final document. That would
    // defeat the purpose of footnotes! Instead, footnotes are extracted and placed in footnote blocks.
    // 
    // Right now, Up only supports one output format: HTML. In the HTML output format, the original inline
    // footnote is replaced by its reference number, which links to the content of the footnote in the
    // appropriate footnote block. If you're ever seen a Wikipedia article, you're familiar with this setup.
    // Future output formats might handle footnotes slightly differently, but they should all use a similar
    // strategy.
    //
    // This function is responsible for assigning footnote reference numbers and producing footnote blocks.
    //
    // The specific rules are below:
    //
    //
    // 1. Any footnotes within a top-level outline convention are placed into a footnote block directly following
    //    that top-level outline convention. Even if a footnote is inside a paragraph inside an ordered list
    //    inside a description list, it's placed into a block after the description list, because the description
    //    list is the outermost, top-level outline convention.
    //
    // 2. Rule 1 applies to all outline conventions except:
    //
    //     * Blockquotes
    //     * Spoiler blocks
    //     * NSFW blocks
    //     * NSFL blocks
    //
    //    Blockquotes are considered mini-documents! Therefore, footnotes inside a blockquote are placed into a
    //    footnote block inside the blockquote, and rule 1 is applied to all top-level outline conventions within
    //    the blockquote. In other words, a footnote inside a paragraph inside an ordered list inside a blockquote
    //    is placed into a footnote block after the ordered list, but still inside the blockquote, because the
    //    ordered list is the outermost, top-level convention within the blockquote.
    //
    //    Spoiler blocks, NSFW blocks, and NSFL blocks shouldn't "leak" any of their content, so they have the
    //    same footnote block rules as blockquotes.
    //
    // 3. It's contrived, but footnotes can reference other footnotes. For example:
    //
    //    I'm normal. [^That said, I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.] Really.
    //
    //    The nesting can be arbitrarily deep.
    //
    //    Any nested footnotes are added to end of the footnote block containing the outer footnote, after any
    //    other non-nested footnotes. Then, any (doubly) nested footnotes inside the nested footnotes are added to
    //    the end of that same footnote block, and the process repeats until no more nested footnotes are found.
    //
    // 4. Footnotes are assigned reference numbers based on the order those footnotes are referenced in the final
    //    document.
    //
    //    Due to rule 3, a nested footnote (one that is referenced by another footnote) isn't actually referenced
    //    in the final document until its footnote block. As a result, that nested footnote is assigned a
    //    reference number after any non-nested footnotes appearing in the same top-level outline convention,
    //    because those footnotes are referenced inside the outline convention itself (and the footnote block
    //    comes after the outline convention).
    //
    //
    // Oh, one last thing! We'll use the term "blockless footnote" to describe a FootnoteNode that hasn't yet been
    // placed in a footnote block.
    documentNode.insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(new Sequence({ startingAt: 1 }))

    return documentNode
  }

  protected DOCUMENT_NODE(): void { }
}
