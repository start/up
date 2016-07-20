import { concat } from '../CollectionHelpers'
import { BlockquoteNode } from '../SyntaxNodes/BlockquoteNode'
import { DescriptionListItem } from '../SyntaxNodes/DescriptionListItem'
import { DescriptionListNode } from '../SyntaxNodes/DescriptionListNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { SpoilerBlockNode } from '../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../SyntaxNodes/NsflBlockNode'


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
//    TODO: Better handle footnotes within the inline spoilers, inline NSFW conventions, and inline NSFL
//    conventions.
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
export function handleFootnotes(documentNode: DocumentNode): void {
  new FootnoteHandler(documentNode)
}


class FootnoteHandler {
  private currentFootnoteReferenceNumber = 1

  constructor(documentNode: DocumentNode) {
    this.insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(documentNode)
  }

  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(outlineNodeContainer: OutlineNodeContainer): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const outlineNode of outlineNodeContainer.children) {
      outlineNodesWithFootnoteBlocks.push(outlineNode)

      const footnotesForNextFootnoteBlock =
        this.handleOutlineNodeAndGetBlocklessFootnotes(outlineNode)

      if (footnotesForNextFootnoteBlock.length) {
        outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotesForNextFootnoteBlock))
      }
    }

    outlineNodeContainer.children = outlineNodesWithFootnoteBlocks
  }

  handleOutlineNodeAndGetBlocklessFootnotes(node: OutlineSyntaxNode): FootnoteNode[] {
    if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
      return this.getTopLevelFootnotesAndAssignTheirReferenceNumbers(node.children)
    }

    if (node instanceof LineBlockNode) {
      return this.getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers(node.lines)
    }

    if ((node instanceof BlockquoteNode) || (node instanceof SpoilerBlockNode) || (node instanceof NsfwBlockNode) || (node instanceof NsflBlockNode)) {
      this.insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(node)

      // We've just handled all the footnotes within the outline convention. None of them are blockless!
      return []
    }

    if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
      return this.handleOutlineNodeContainersAndGetBlocklessFootnotes(node.listItems)
    }

    if (node instanceof DescriptionListNode) {
      return this.handleDescriptionListAndGetBlocklessFootnotes(node)
    }

    return []
  }

  getTopLevelFootnotesAndAssignTheirReferenceNumbers(nodes: InlineSyntaxNode[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const node of nodes) {
      if (node instanceof FootnoteNode) {
        node.referenceNumber = this.currentFootnoteReferenceNumber++
        footnotes.push(node)
      }
    }

    return footnotes
  }

  getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers(containers: InlineNodeContainer[]): FootnoteNode[] {
    return concat(
      containers.map(container => this.getTopLevelFootnotesAndAssignTheirReferenceNumbers(container.children)))
  }

  handleOutlineNodeContainersAndGetBlocklessFootnotes(containers: OutlineNodeContainer[]): FootnoteNode[] {
    return concat(
      containers.map(container => this.handleOutlineNodesAndGetBlocklessFootnotes(container.children)))
  }

  handleDescriptionListAndGetBlocklessFootnotes(list: DescriptionListNode): FootnoteNode[] {
    return concat(
      list.listItems.map(item => this.handleDescriptionListItemAndGetBlocklessFootnotes(item)))
  }

  handleDescriptionListItemAndGetBlocklessFootnotes(item: DescriptionListItem): FootnoteNode[] {
    const footnotesFromTerms =
      this.getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers(item.terms)

    const footnotesFromDescription =
      this.handleOutlineNodesAndGetBlocklessFootnotes(item.description.children)

    return footnotesFromTerms.concat(footnotesFromDescription)
  }

  handleOutlineNodesAndGetBlocklessFootnotes(nodes: OutlineSyntaxNode[]): FootnoteNode[] {
    return concat(
      nodes.map(node => this.handleOutlineNodeAndGetBlocklessFootnotes(node)))
  }

  getFootnoteBlock(footnotes: FootnoteNode[]): FootnoteBlockNode {
    const footnoteBlock = new FootnoteBlockNode(footnotes)

    for (let i = 0; i < footnoteBlock.footnotes.length; i++) {
      const footnote = footnoteBlock.footnotes[i]

      const nestedFootnotes =
        this.getTopLevelFootnotesAndAssignTheirReferenceNumbers(footnote.children)

      // Note: This appends items to the collection we're currently looping through.
      footnoteBlock.footnotes.push(...nestedFootnotes)
    }

    return footnoteBlock
  }
}


export interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}

export interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}