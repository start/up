import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'

export class InlineSandwich {
  constructor(
    public NodeType: RichSyntaxNodeType,
    public openingBun: string,
    public closingBun: string) { }
}