import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class HeadingNodeWithUndeterminedLevel extends RichSyntaxNode {
  constructor(parentOrChildren?: RichSyntaxNode|SyntaxNode[], public underlineChars?: number) {
    super(parentOrChildren)
  }
  
  private HEADING_WITH_UNDETERMINED_LEVEL: any = null
}