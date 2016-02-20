import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class HeadingNodeWithUndeterminedLevel extends RichSyntaxNode {
  constructor(parentOrChildren?: RichSyntaxNode|SyntaxNode[], public underlineChars?: number) {
    super(parentOrChildren)
  }
  
  private HEADING: any = null
}