import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Represents any parenthetical text.
export abstract class ParentheticalSyntaxNode extends RichInlineSyntaxNode {
  protected PARENTHETICAL(): void { }
}
