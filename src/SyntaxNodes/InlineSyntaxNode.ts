import { SyntaxNode } from './SyntaxNode'


export interface InlineSyntaxNode extends SyntaxNode {
  // Represents the text of the syntax node as it should appear inline. Some inline conventions
  // don't have any (e.g. footnotes and images).
  //
  // Ultimately, table cells use this method determine whether their content is numeric.
  textAppearingInline(): string
}
