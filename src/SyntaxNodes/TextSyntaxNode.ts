import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export abstract class TextSyntaxNode extends SyntaxNode {
  constructor(public text: string) {
    super()
  }
}