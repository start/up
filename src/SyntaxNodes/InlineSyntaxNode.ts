import { SyntaxNode } from './SyntaxNode'


export interface InlineSyntaxNode extends SyntaxNode {
  // Represents the text of the syntax node as it should appear inline. Some inline conventions
  // don't have any e.g. (footnotes, images).
  textAppearingInline(): string

  // Represents the searchable text of the syntax node. In contrast to `textAppearingInline`,
  // footnotes and images should have searchable text (footnotes have content, and images have
  // descriptions).
  searchableText(): string
}
