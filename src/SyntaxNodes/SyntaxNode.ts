import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export interface SyntaxNode {
  inlineDescendants(): InlineSyntaxNode[]
  write(writer: Writer): string
}
