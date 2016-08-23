import { SyntaxNode } from './SyntaxNode'


export interface InlineSyntaxNode extends SyntaxNode {
  // Represents the text of the syntax node as it would appear inline. Some inline conventions
  // don't have any e.g. (footnotes, images).
  inlineText(): string

  // Represents the searchable text of the syntax node. In contrast to `inlineText`, footnotes
  // and images should have searchable text (footnotes have content, and images have descriptions).
  searchableText(): string
}
