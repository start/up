import { RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { Convention } from './Convention'

export class SandwichConvention {
  constructor (
    public start: string,
    public end: string,
    public NodeType: RichInlineSyntaxNodeType,
    public convention: Convention) { }
}
