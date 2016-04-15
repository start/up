import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class CodeBlockNode extends OutlineSyntaxNode {
  constructor(public text: string) {
    super()
  }
  
  private CODE_BLOCK: any = null
}
