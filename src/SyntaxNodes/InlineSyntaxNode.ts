import { SyntaxNode } from './SyntaxNode'


export interface InlineSyntaxNode extends SyntaxNode {
  // Represents the text of the syntax node as it should appear inline. Some inline conventions
  // don't have any e.g. (footnotes, images).
  //
  // This method is used help to determine whether table/chart cells are numeric.
  textAppearingInline(): string

  // Represents the searchable text of the syntax node. In contrast to `textAppearingInline`,
  // footnotes and images should have searchable text (footnotes have content, and images have
  // a description).
  //
  // This method is used to help section links match the most appropriate table of content entry.
  searchableText(): string
}
