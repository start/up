import { SyntaxNode } from './SyntaxNode'


export interface InlineSyntaxNode extends SyntaxNode {
  // Represents the text of the syntax node as it should appear inline. Some inline conventions
  // don't have any e.g. (footnotes, images).
  //
  // This method is ultimately used to help determine whether table cells are numeric.
  textAppearingInline(): string

  // Represents the searchable text of the syntax node. In contrast to `textAppearingInline`,
  // footnotes and images do have searchable text (footnotes have content, and images have a
  // description).
  //
  // This method is used to help match section links to the most appropriate table of content
  // entry.
  searchableText(): string
}
